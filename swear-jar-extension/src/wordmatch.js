// Shared word-matching helpers for content scripts.
//
// Classic (non-module) script by design — MV3 content scripts can't use
// static `import`. Any content_scripts manifest entry that needs matching
// logic lists this file *before* its own script, and both files share one
// global scope within that entry (each content_scripts entry gets its own
// isolated world, so this doesn't leak into the page or into other entries).
// It attaches itself to `window.SwearJarMatch` rather than polluting the
// global scope with bare function/const names.
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

  /**
   * Builds a { re, severityOf } matcher from settings (defaults merged with
   * settings.customWords, minus settings.disabledWords). Returns null if the
   * effective word list is empty.
   */
  function build(settings) {
    const s = settings || {};
    const disabled = new Set((s.disabledWords || []).map((w) => String(w).toLowerCase()));
    const custom = (s.customWords || [])
      .map((w) => ({
        word: String(w.word || "").toLowerCase().trim(),
        severity: [1, 2, 3].includes(w.severity) ? w.severity : 2,
      }))
      .filter((w) => w.word.length > 0);

    const merged = new Map();
    for (const entry of DEFAULT_WORDS) if (!disabled.has(entry.word)) merged.set(entry.word, entry);
    for (const entry of custom) if (!disabled.has(entry.word)) merged.set(entry.word, entry);

    const words = [...merged.values()];
    if (words.length === 0) return null;

    const escaped = words
      .map((w) => w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length); // longest-first avoids partial shadowing
    const wordMap = new Map(words.map((w) => [w.word, w.severity]));

    return {
      re: new RegExp(`\\b(${escaped.join("|")})\\b`, "gi"),
      severityOf: (w) => wordMap.get(String(w).toLowerCase()) || 2,
    };
  }

  /** Runs a matcher against a chunk of plain text, returning [{word, severity}]. */
  function findCatches(matcher, text) {
    if (!matcher || !text) return [];
    const catches = [];
    matcher.re.lastIndex = 0;
    let match;
    while ((match = matcher.re.exec(text))) {
      const word = match[1].toLowerCase();
      catches.push({ word, severity: matcher.severityOf(word) });
    }
    return catches;
  }

  window.SwearJarMatch = { DEFAULT_WORDS, build, findCatches };
})();
