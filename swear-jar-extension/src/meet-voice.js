// Swear Jar voice-capture content script — only injected on Google Meet and
// Zoom's web client (see manifest.json). Off by default: requires
// settings.voiceEnabled, set from the Options page, because unlike the
// text scanner this uses the browser's built-in speech recognition, which
// sends your microphone audio to Google's servers to be transcribed. It is
// NOT on-device and NOT covered by the "100% local" claim for the rest of
// the extension — see README.md.
//
// Classic (non-module) script, same reasoning as content.js. Shares
// src/wordmatch.js (window.SwearJarMatch) via the manifest's js order.
(() => {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    return; // unsupported browser/build — nothing we can do
  }
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;

  const INLINE_DEFAULTS = {
    enabled: true,
    voiceEnabled: false,
    voiceLang: "en-US",
    mutedSites: [],
    customWords: [],
    disabledWords: [],
  };

  let settings = null;
  let matcher = null;
  let recognition = null;
  let shouldListen = false; // the *intent* to listen (settings say yes, tab visible)
  let isListening = false; // whether recognition.start() has actually fired
  let restartTimer = null;
  let indicatorEl = null;
  let micBlocked = false;

  function isMuted() {
    return (settings.mutedSites || []).includes(location.hostname);
  }

  function wantsToListen() {
    return (
      settings &&
      settings.enabled &&
      settings.voiceEnabled &&
      !isMuted() &&
      matcher &&
      document.visibilityState === "visible" &&
      !micBlocked
    );
  }

  function setIndicator(state) {
    // state: 'listening' | 'blocked' | 'off'
    if (state === "off") {
      indicatorEl?.remove();
      indicatorEl = null;
      return;
    }
    if (!indicatorEl) {
      indicatorEl = document.createElement("div");
      indicatorEl.id = "swear-jar-voice-indicator";
      Object.assign(indicatorEl.style, {
        position: "fixed",
        top: "12px",
        right: "12px",
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 11px",
        borderRadius: "999px",
        fontSize: "12px",
        fontFamily: "system-ui, sans-serif",
        color: "#fbe4a8",
        background: "rgba(30, 24, 15, 0.88)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
        pointerEvents: "none",
      });
      document.documentElement.appendChild(indicatorEl);
    }
    if (state === "listening") {
      indicatorEl.textContent = "🎙️ Swear Jar listening";
      indicatorEl.style.color = "#fbe4a8";
    } else if (state === "blocked") {
      indicatorEl.textContent = "🎙️ Swear Jar: mic access blocked";
      indicatorEl.style.color = "#f0958c";
    }
  }

  function startRecognition() {
    if (isListening || !wantsToListen()) return;
    recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = settings.voiceLang || "en-US";

    recognition.onresult = (event) => {
      const catches = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result.isFinal) continue;
        const transcript = result[0]?.transcript || "";
        catches.push(...window.SwearJarMatch.findCatches(matcher, transcript));
      }
      if (catches.length === 0) return;
      const tagged = catches.map((c) => ({ ...c, source: "voice" }));
      chrome.runtime.sendMessage({ type: "SWEAR_JAR_CATCHES", catches: tagged }, () => {
        void chrome.runtime.lastError;
      });
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        micBlocked = true;
        setIndicator("blocked");
        isListening = false;
        return;
      }
      // 'no-speech', 'network', 'aborted', etc. — let onend's restart logic handle it
    };

    recognition.onend = () => {
      isListening = false;
      if (wantsToListen()) {
        // Chrome silently stops recognition periodically even mid-speech;
        // restart with a short delay to avoid a tight error loop.
        clearTimeout(restartTimer);
        restartTimer = setTimeout(startRecognition, 300);
      } else {
        setIndicator("off");
      }
    };

    try {
      recognition.start();
      isListening = true;
      setIndicator("listening");
    } catch {
      // e.g. InvalidStateError if a stray previous instance is still live
      isListening = false;
    }
  }

  function stopRecognition() {
    clearTimeout(restartTimer);
    if (recognition) {
      recognition.onend = null; // don't let the intentional stop trigger a restart
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
      recognition = null;
    }
    isListening = false;
    setIndicator("off");
  }

  function sync() {
    shouldListen = wantsToListen();
    if (shouldListen && !isListening) startRecognition();
    if (!shouldListen && isListening) stopRecognition();
  }

  function init(newSettings) {
    settings = { ...INLINE_DEFAULTS, ...newSettings };
    matcher = window.SwearJarMatch.build(settings);
    micBlocked = false;
    sync();
  }

  chrome.storage.local.get("settings").then(({ settings: s }) => init(s || {}));

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.settings) init(changes.settings.newValue || {});
  });

  document.addEventListener("visibilitychange", sync);

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "SWEAR_JAR_VOICE_STATUS") {
      sendResponse({
        supported: true,
        voiceEnabled: !!settings?.voiceEnabled,
        listening: isListening,
        blocked: micBlocked,
      });
    }
  });

  window.addEventListener("pagehide", stopRecognition);
})();
