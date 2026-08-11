// Shared chrome.storage.local schema + helpers, used by background, popup,
// and options. Keeping this in one module avoids the settings/stats shape
// drifting between the three surfaces.
import { SEVERITY_POINTS } from "./wordlist.js";

export const DEFAULT_SETTINGS = {
  enabled: true,
  toastEnabled: false, // show a small on-page "+1" toast when a word is caught
  jarCapPoints: 150, // points at which the jar reads as "full" (100%)
  customWords: [], // [{word, severity}]
  disabledWords: [], // words from DEFAULT_WORDS (or custom) to ignore
  mutedSites: [], // hostnames the extension should not scan
};

export const DEFAULT_STATS = {
  total: 0, // raw swear-word count, all time
  points: 0, // severity-weighted points (drives jar fill %)
  byWord: {}, // { word: count }
  bySite: {}, // { hostname: count }
  history: [], // [{ word, severity, site, ts }] most recent last, capped
  lastAdded: null, // timestamp of the most recent catch, used by the popup
  // to know which history entries are "new" since it was last opened.
};

const HISTORY_CAP = 200;

export async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

export async function setSettings(patch) {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await chrome.storage.local.set({ settings: next });
  return next;
}

export async function getStats() {
  const { stats } = await chrome.storage.local.get("stats");
  return { ...DEFAULT_STATS, ...(stats || {}) };
}

export async function resetStats() {
  await chrome.storage.local.set({ stats: { ...DEFAULT_STATS } });
  return { ...DEFAULT_STATS };
}

/**
 * Records a batch of catches: [{word, severity}], all from the same page.
 * Returns the updated stats object.
 */
export async function recordCatches(catches, site) {
  if (!catches || catches.length === 0) return getStats();
  const stats = await getStats();
  const now = Date.now();

  for (const { word, severity } of catches) {
    stats.total += 1;
    stats.points += SEVERITY_POINTS[severity] ?? SEVERITY_POINTS[2];
    stats.byWord[word] = (stats.byWord[word] || 0) + 1;
    if (site) stats.bySite[site] = (stats.bySite[site] || 0) + 1;
    stats.history.push({ word, severity, site: site || null, ts: now });
  }
  if (stats.history.length > HISTORY_CAP) {
    stats.history = stats.history.slice(stats.history.length - HISTORY_CAP);
  }
  stats.lastAdded = now;

  await chrome.storage.local.set({ stats });
  return stats;
}
