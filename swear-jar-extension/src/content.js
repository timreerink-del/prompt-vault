// Swear Jar content script — scans page text for swear words.
//
// This is intentionally a *classic* (non-module) script — MV3 content
// scripts can't use static `import`. The actual word list / regex logic
// lives in src/wordmatch.js (window.SwearJarMatch), loaded first by the
// manifest's content_scripts entry so it shares this file's isolated-world
// global scope. (background.js / popup / options are ES modules and pull
// the same default word list from src/wordlist.js instead.)
(() => {
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "IFRAME"]);
  const processedNodes = new WeakSet();

  let matcher = null;
  let settings = null;
  let toastRoot = null;
  let scanQueued = false;
  let pendingRoots = new Set();

  function isMuted() {
    return (settings.mutedSites || []).includes(location.hostname);
  }

  function shouldScan() {
    return settings && settings.enabled && !isMuted() && matcher;
  }

  function scanRoot(root) {
    if (!shouldScan()) return [];
    const catches = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (processedNodes.has(node)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || node.nodeValue.trim().length === 0) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node;
    while ((node = walker.nextNode())) {
      processedNodes.add(node);
      catches.push(...window.SwearJarMatch.findCatches(matcher, node.nodeValue));
    }
    return catches;
  }

  function flushScan() {
    scanQueued = false;
    if (!shouldScan()) {
      pendingRoots.clear();
      return;
    }
    const roots = pendingRoots.size ? [...pendingRoots] : [document.body];
    pendingRoots.clear();
    if (!document.body) return;

    const catches = [];
    for (const root of roots) {
      if (root && root.isConnected !== false) catches.push(...scanRoot(root));
    }
    if (catches.length === 0) return;

    if (settings.toastEnabled) showToast(catches);

    const tagged = catches.map((c) => ({ ...c, source: "text" }));
    chrome.runtime.sendMessage({ type: "SWEAR_JAR_CATCHES", catches: tagged }, () => {
      // swallow "no receiver" errors, e.g. during extension reload
      void chrome.runtime.lastError;
    });
  }

  function queueScan(root) {
    if (root) pendingRoots.add(root);
    if (scanQueued) return;
    scanQueued = true;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    idle(flushScan, { timeout: 1000 });
  }

  function showToast(catches) {
    if (!toastRoot) {
      toastRoot = document.createElement("div");
      toastRoot.id = "swear-jar-toast-root";
      Object.assign(toastRoot.style, {
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        pointerEvents: "none",
        fontFamily: "system-ui, sans-serif",
      });
      document.documentElement.appendChild(toastRoot);
    }
    const coin = { 1: "🪙", 2: "🪙🪙", 3: "💰" }[catches[catches.length - 1].severity] || "🪙";
    const label = catches.length === 1
      ? `${coin} "${catches[0].word}" caught`
      : `${coin} +${catches.length} words caught`;

    const el = document.createElement("div");
    el.textContent = label;
    Object.assign(el.style, {
      background: "rgba(30, 24, 15, 0.92)",
      color: "#fbe4a8",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "13px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
      opacity: "0",
      transform: "translateY(8px)",
      transition: "opacity 200ms ease, transform 200ms ease",
    });
    toastRoot.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-8px)";
      setTimeout(() => el.remove(), 250);
    }, 1800);
  }

  const INLINE_DEFAULTS = { enabled: true, toastEnabled: false, mutedSites: [], customWords: [], disabledWords: [] };

  function init(newSettings) {
    // Falls back to sane inline defaults if the settings object (normally
    // seeded by background.js on install) hasn't landed in storage yet.
    settings = { ...INLINE_DEFAULTS, ...newSettings };
    matcher = window.SwearJarMatch.build(settings);
    if (shouldScan()) queueScan(document.body);
  }

  chrome.storage.local.get("settings").then(({ settings: s }) => {
    init(s || {});
    startObserving();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.settings) {
      init(changes.settings.newValue || {});
    }
  });

  function startObserving() {
    const observer = new MutationObserver((mutations) => {
      if (!shouldScan()) return;
      for (const m of mutations) {
        for (const added of m.addedNodes) {
          if (added.nodeType === Node.ELEMENT_NODE || added.nodeType === Node.TEXT_NODE) {
            queueScan(added.nodeType === Node.TEXT_NODE ? added.parentElement : added);
          }
        }
        if (m.type === "characterData" && m.target) {
          processedNodes.delete(m.target);
          queueScan(m.target.parentElement);
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
})();
