// Swear Jar content script.
//
// This is intentionally a *classic* (non-module) script — MV3 content
// scripts can't use static `import`, so the small slice of the word list
// logic it needs is inlined here rather than shared with src/wordlist.js.
// (background.js / popup / options are ES modules and use the real thing.)
(() => {
  const DEFAULT_WORDS = [
    { word: "damn", severity: 1 },
    { word: "hell", severity: 1 },
    { word: "crap", severity: 1 },
    { word: "piss", severity: 1 },
    { word: "goddamn", severity: 1 },
    { word: "arse", severity: 1 },
    { word: "bloody", severity: 1 },
    { word: "bugger", severity: 1 },
    { word: "ass", severity: 2 },
    { word: "asshole", severity: 2 },
    { word: "bastard", severity: 2 },
    { word: "bitch", severity: 2 },
    { word: "dick", severity: 2 },
    { word: "douchebag", severity: 2 },
    { word: "pissed", severity: 2 },
    { word: "prick", severity: 2 },
    { word: "shit", severity: 2 },
    { word: "bullshit", severity: 2 },
    { word: "bollocks", severity: 2 },
    { word: "wanker", severity: 2 },
    { word: "fuck", severity: 3 },
    { word: "fucking", severity: 3 },
    { word: "fucked", severity: 3 },
    { word: "motherfucker", severity: 3 },
    { word: "fucker", severity: 3 },
  ];

  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "IFRAME"]);
  const processedNodes = new WeakSet();

  let regex = null;
  let settings = null;
  let toastRoot = null;
  let scanQueued = false;
  let pendingRoots = new Set();

  function buildRegex(s) {
    const disabled = new Set((s.disabledWords || []).map((w) => w.toLowerCase()));
    const custom = (s.customWords || [])
      .map((w) => ({ word: String(w.word || "").toLowerCase().trim(), severity: [1, 2, 3].includes(w.severity) ? w.severity : 2 }))
      .filter((w) => w.word.length > 0);

    const merged = new Map();
    for (const entry of DEFAULT_WORDS) if (!disabled.has(entry.word)) merged.set(entry.word, entry);
    for (const entry of custom) if (!disabled.has(entry.word)) merged.set(entry.word, entry);

    const words = [...merged.values()];
    if (words.length === 0) return null;
    const escaped = words
      .map((w) => w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);
    const wordMap = new Map(words.map((w) => [w.word, w.severity]));
    return { re: new RegExp(`\\b(${escaped.join("|")})\\b`, "gi"), severityOf: (w) => wordMap.get(w.toLowerCase()) || 2 };
  }

  function isMuted() {
    return (settings.mutedSites || []).includes(location.hostname);
  }

  function shouldScan() {
    return settings && settings.enabled && !isMuted() && regex;
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
      const text = node.nodeValue;
      regex.re.lastIndex = 0;
      let match;
      while ((match = regex.re.exec(text))) {
        const word = match[1].toLowerCase();
        catches.push({ word, severity: regex.severityOf(word) });
      }
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

    chrome.runtime.sendMessage({ type: "SWEAR_JAR_CATCHES", catches }, () => {
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
    regex = buildRegex(settings);
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
