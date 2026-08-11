import { DEFAULT_SETTINGS, DEFAULT_STATS, getSettings, getStats, recordCatches, resetStats } from "./storage.js";

const BADGE_COLOR = "#c7860f";

async function refreshBadge() {
  const stats = await getStats();
  const settings = await getSettings();
  if (!settings.enabled || stats.total === 0) {
    chrome.action.setBadgeText({ text: "" });
    return;
  }
  const text = stats.total > 999 ? "999+" : String(stats.total);
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR });
}

chrome.runtime.onInstalled.addListener(async () => {
  // Seed storage with concrete defaults on first install (content.js is a
  // classic script and reads chrome.storage.local directly, without the
  // getSettings()/getStats() default-merging that background/popup/options
  // get for free — so `settings` must actually exist, not just be implied).
  const existing = await chrome.storage.local.get(["settings", "stats"]);
  const toSet = {};
  if (!existing.settings) toSet.settings = { ...DEFAULT_SETTINGS };
  if (!existing.stats) toSet.stats = { ...DEFAULT_STATS };
  if (Object.keys(toSet).length > 0) await chrome.storage.local.set(toSet);
  refreshBadge();
});
chrome.runtime.onStartup.addListener(() => {
  refreshBadge();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse);
  return true; // keep the message channel open for the async response
});

async function handleMessage(message, sender) {
  switch (message?.type) {
    case "SWEAR_JAR_CATCHES": {
      const settings = await getSettings();
      if (!settings.enabled) return { ok: false, reason: "disabled" };
      const site = sender?.tab?.url ? safeHostname(sender.tab.url) : null;
      if (site && settings.mutedSites?.includes(site)) {
        return { ok: false, reason: "muted" };
      }
      const stats = await recordCatches(message.catches, site);
      await refreshBadge();
      return { ok: true, stats };
    }
    case "SWEAR_JAR_GET_SETTINGS":
      return { ok: true, settings: await getSettings() };
    case "SWEAR_JAR_GET_STATS":
      return { ok: true, stats: await getStats() };
    case "SWEAR_JAR_RESET":
      await resetStats();
      await refreshBadge();
      return { ok: true };
    default:
      return { ok: false, reason: "unknown_message" };
  }
}

function safeHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Keep the badge in sync if settings/stats change from another surface
// (e.g. the options page resetting the jar).
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.stats || changes.settings)) {
    refreshBadge();
  }
});
