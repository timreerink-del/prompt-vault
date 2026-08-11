// Default word list for the Swear Jar extension.
//
// `severity` drives both the "price" added to the jar and which coin
// animation plays in the popup:
//   1 = mild   (penny)   2 = medium (nickel/dime)   3 = strong (gold coin)
//
// Users can add their own words or disable any of these from the Options
// page — see src/storage.js for how customWords/disabledWords are merged
// with this list at runtime.
export const DEFAULT_WORDS = [
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

// Points awarded per severity level (used for the jar "fill" total, which
// is separate from the raw swear count so heavier words visibly matter more).
export const SEVERITY_POINTS = { 1: 1, 2: 2, 3: 4 };

/**
 * Builds the effective word list from defaults + user customization.
 * @param {{customWords?: {word:string,severity:number}[], disabledWords?: string[]}} settings
 */
export function buildWordList(settings = {}) {
  const disabled = new Set((settings.disabledWords || []).map((w) => w.toLowerCase()));
  const custom = (settings.customWords || []).map((w) => ({
    word: String(w.word || "").toLowerCase().trim(),
    severity: [1, 2, 3].includes(w.severity) ? w.severity : 2,
  })).filter((w) => w.word.length > 0);

  const merged = new Map();
  for (const entry of DEFAULT_WORDS) {
    if (!disabled.has(entry.word)) merged.set(entry.word, entry);
  }
  for (const entry of custom) {
    if (!disabled.has(entry.word)) merged.set(entry.word, entry);
  }
  return [...merged.values()];
}

/**
 * Compiles a single regex that matches any word in the list as a whole
 * word (word-boundary delimited), case-insensitively. Multi-word entries
 * are not supported by design — this is a swear *word* jar.
 */
export function compileWordRegex(words) {
  if (words.length === 0) return null;
  const escaped = words
    .map((w) => w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length); // longest-first avoids partial shadowing
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
}
