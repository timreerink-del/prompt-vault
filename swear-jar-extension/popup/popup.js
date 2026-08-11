import { getSettings, getStats, resetStats, setSettings } from "../src/storage.js";

const JAR_TOP_Y = 60;
const JAR_BOTTOM_Y = 190;
const JAR_HEIGHT = JAR_BOTTOM_Y - JAR_TOP_Y;
const LAST_SEEN_KEY = "popupLastSeenTs";

const els = {
  jarSvg: document.getElementById("jarSvg"),
  fillRect: document.getElementById("fillRect"),
  coinGroup: document.getElementById("coinGroup"),
  totalCount: document.getElementById("totalCount"),
  fillPercent: document.getElementById("fillPercent"),
  topWords: document.getElementById("topWords"),
  sourceSplit: document.getElementById("sourceSplit"),
  voiceStatus: document.getElementById("voiceStatus"),
  siteToggle: document.getElementById("siteToggle"),
  siteHost: document.getElementById("siteHost"),
  resetBtn: document.getElementById("resetBtn"),
  optionsBtn: document.getElementById("optionsBtn"),
};

const VOICE_CAPABLE_HOST = /(^|\.)meet\.google\.com$|(^|\.)zoom\.us$/;

let currentSettings = null;
let currentHost = null;
let currentTab = null;

function setFill(percent, animate = true) {
  const clamped = Math.max(0, Math.min(1, percent));
  const height = JAR_HEIGHT * clamped;
  const y = JAR_BOTTOM_Y - height;
  if (!animate) els.fillRect.style.transition = "none";
  els.fillRect.setAttribute("height", String(height));
  els.fillRect.setAttribute("y", String(y));
  if (!animate) {
    // force reflow so the transition re-applies for the next update
    void els.fillRect.getBoundingClientRect();
    els.fillRect.style.transition = "";
  }
  els.fillPercent.textContent = Math.round(clamped * 100);
}

function coinEmojiFor(severity) {
  return severity >= 3 ? "💰" : severity === 2 ? "🪙" : "🟤";
}

function spawnCoin(severity, delayMs, xJitter) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  el.textContent = coinEmojiFor(severity);
  el.setAttribute("x", String(100 + xJitter));
  el.setAttribute("y", "70");
  el.setAttribute("font-size", "18");
  el.setAttribute("text-anchor", "middle");
  el.classList.add("coin");
  els.coinGroup.appendChild(el);
  setTimeout(() => {
    el.classList.add("coin-anim");
  }, delayMs);
  setTimeout(() => {
    el.remove();
  }, delayMs + 900);
}

function shakeJar() {
  els.jarSvg.classList.remove("shake");
  void els.jarSvg.getBoundingClientRect();
  els.jarSvg.classList.add("shake");
}

function renderTotals(stats) {
  els.totalCount.textContent = stats.total;
}

function renderTopWords(stats) {
  const entries = Object.entries(stats.byWord).sort((a, b) => b[1] - a[1]).slice(0, 6);
  els.topWords.innerHTML = "";
  if (entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No catches yet — browse and see what the jar picks up.";
    els.topWords.appendChild(empty);
    return;
  }
  for (const [word, count] of entries) {
    const chip = document.createElement("span");
    chip.className = "word-chip";
    chip.innerHTML = `${word} <span class="count">×${count}</span>`;
    els.topWords.appendChild(chip);
  }
}

async function renderSiteToggle() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab || null;
    if (tab?.url && /^https?:/.test(tab.url)) {
      currentHost = new URL(tab.url).hostname;
    } else {
      currentHost = null;
    }
  } catch {
    currentTab = null;
    currentHost = null;
  }
  if (!currentHost) {
    document.querySelector(".site-row").style.display = "none";
    return;
  }
  els.siteHost.textContent = currentHost;
  els.siteToggle.checked = (currentSettings.mutedSites || []).includes(currentHost);
}

function renderSourceSplit(stats) {
  const { text = 0, voice = 0 } = stats.bySource || {};
  els.sourceSplit.innerHTML = "";
  if (text === 0 && voice === 0) return;
  els.sourceSplit.innerHTML = `
    <span>📄 <span class="src-count">${text}</span> from pages</span>
    <span>🎙️ <span class="src-count">${voice}</span> from calls</span>
  `;
}

async function renderVoiceStatus() {
  const el = els.voiceStatus;
  if (!currentHost || !VOICE_CAPABLE_HOST.test(currentHost)) {
    el.hidden = true;
    return;
  }
  el.hidden = false;

  if (!currentSettings.voiceEnabled) {
    el.className = "voice-status off";
    el.textContent = "🎙️ Voice capture is off — enable it in Settings";
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(currentTab.id, { type: "SWEAR_JAR_VOICE_STATUS" });
    if (response?.blocked) {
      el.className = "voice-status blocked";
      el.textContent = "🎙️ Mic access blocked for this site";
    } else if (response?.listening) {
      el.className = "voice-status listening";
      el.textContent = "🎙️ Listening for swearing on this call";
    } else {
      el.className = "voice-status off";
      el.textContent = "🎙️ Voice capture starting…";
    }
  } catch {
    el.className = "voice-status off";
    el.textContent = "🎙️ Voice capture not active on this tab yet";
  }
}

async function loadAndRender({ animateFill = true, animateNewCoins = true } = {}) {
  currentSettings = await getSettings();
  const stats = await getStats();

  const capPoints = currentSettings.jarCapPoints || 150;
  const percent = capPoints > 0 ? stats.points / capPoints : 0;

  renderTotals(stats);
  renderTopWords(stats);
  renderSourceSplit(stats);
  await renderSiteToggle();
  await renderVoiceStatus();

  const { [LAST_SEEN_KEY]: lastSeenTs } = await chrome.storage.local.get(LAST_SEEN_KEY);
  const newCatches = animateNewCoins
    ? stats.history.filter((h) => h.ts > (lastSeenTs || 0)).slice(-6)
    : [];

  if (animateFill) {
    setFill(0, false);
    requestAnimationFrame(() => setFill(percent, true));
  } else {
    setFill(percent, false);
  }

  newCatches.forEach((c, i) => {
    spawnCoin(c.severity, 500 + i * 140, (i % 2 === 0 ? -1 : 1) * (10 + i * 4));
  });
  if (newCatches.length > 0) setTimeout(shakeJar, 550 + newCatches.length * 140);

  await chrome.storage.local.set({ [LAST_SEEN_KEY]: stats.lastAdded || Date.now() });
}

els.resetBtn.addEventListener("click", async () => {
  if (!confirm("Empty the swear jar? This clears all counts and history.")) return;
  await resetStats();
  await chrome.storage.local.set({ [LAST_SEEN_KEY]: Date.now() });
  await loadAndRender({ animateFill: true, animateNewCoins: false });
});

els.optionsBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

els.siteToggle.addEventListener("change", async () => {
  if (!currentHost) return;
  const muted = new Set(currentSettings.mutedSites || []);
  if (els.siteToggle.checked) muted.add(currentHost);
  else muted.delete(currentHost);
  currentSettings = await setSettings({ mutedSites: [...muted] });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.stats) {
    loadAndRender({ animateFill: false, animateNewCoins: true });
  }
});

loadAndRender({ animateFill: true, animateNewCoins: true });
