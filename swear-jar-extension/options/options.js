import { getSettings, setSettings, resetStats } from "../src/storage.js";
import { DEFAULT_WORDS } from "../src/wordlist.js";

const els = {
  enabled: document.getElementById("enabled"),
  toastEnabled: document.getElementById("toastEnabled"),
  jarCapPoints: document.getElementById("jarCapPoints"),
  muteInput: document.getElementById("muteInput"),
  muteAdd: document.getElementById("muteAdd"),
  muteList: document.getElementById("muteList"),
  wordInput: document.getElementById("wordInput"),
  severityInput: document.getElementById("severityInput"),
  wordAdd: document.getElementById("wordAdd"),
  wordList: document.getElementById("wordList"),
  defaultWordGrid: document.getElementById("defaultWordGrid"),
  resetStatsBtn: document.getElementById("resetStatsBtn"),
  saveToast: document.getElementById("saveToast"),
};

let settings = null;
let saveToastTimer = null;

function flashSaved() {
  els.saveToast.classList.add("visible");
  clearTimeout(saveToastTimer);
  saveToastTimer = setTimeout(() => els.saveToast.classList.remove("visible"), 1200);
}

async function persist(patch) {
  settings = await setSettings(patch);
  flashSaved();
}

function renderMuteList() {
  els.muteList.innerHTML = "";
  for (const host of settings.mutedSites || []) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${escapeHtml(host)}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.title = `Unmute ${host}`;
    btn.addEventListener("click", async () => {
      await persist({ mutedSites: (settings.mutedSites || []).filter((h) => h !== host) });
      renderMuteList();
    });
    li.appendChild(btn);
    els.muteList.appendChild(li);
  }
}

function renderWordList() {
  els.wordList.innerHTML = "";
  for (const entry of settings.customWords || []) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${escapeHtml(entry.word)} <span style="opacity:.6">· sev ${entry.severity}</span></span>`;
    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.title = `Remove ${entry.word}`;
    btn.addEventListener("click", async () => {
      await persist({ customWords: (settings.customWords || []).filter((w) => w.word !== entry.word) });
      renderWordList();
    });
    li.appendChild(btn);
    els.wordList.appendChild(li);
  }
}

function renderDefaultWordGrid() {
  els.defaultWordGrid.innerHTML = "";
  const disabled = new Set(settings.disabledWords || []);
  for (const { word } of DEFAULT_WORDS) {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !disabled.has(word);
    cb.addEventListener("change", async () => {
      const next = new Set(settings.disabledWords || []);
      if (cb.checked) next.delete(word);
      else next.add(word);
      await persist({ disabledWords: [...next] });
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(word));
    els.defaultWordGrid.appendChild(label);
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function init() {
  settings = await getSettings();

  els.enabled.checked = settings.enabled;
  els.toastEnabled.checked = settings.toastEnabled;
  els.jarCapPoints.value = settings.jarCapPoints;

  renderMuteList();
  renderWordList();
  renderDefaultWordGrid();

  els.enabled.addEventListener("change", () => persist({ enabled: els.enabled.checked }));
  els.toastEnabled.addEventListener("change", () => persist({ toastEnabled: els.toastEnabled.checked }));
  els.jarCapPoints.addEventListener("change", () => {
    const val = Math.max(10, Number(els.jarCapPoints.value) || 150);
    els.jarCapPoints.value = val;
    persist({ jarCapPoints: val });
  });

  els.muteAdd.addEventListener("click", async () => {
    const raw = els.muteInput.value.trim().toLowerCase();
    if (!raw) return;
    const host = raw.replace(/^https?:\/\//, "").split("/")[0];
    const set = new Set(settings.mutedSites || []);
    set.add(host);
    await persist({ mutedSites: [...set] });
    els.muteInput.value = "";
    renderMuteList();
  });
  els.muteInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") els.muteAdd.click();
  });

  els.wordAdd.addEventListener("click", async () => {
    const word = els.wordInput.value.trim().toLowerCase();
    if (!word) return;
    const severity = Number(els.severityInput.value) || 2;
    const list = (settings.customWords || []).filter((w) => w.word !== word);
    list.push({ word, severity });
    await persist({ customWords: list });
    els.wordInput.value = "";
    renderWordList();
  });
  els.wordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") els.wordAdd.click();
  });

  els.resetStatsBtn.addEventListener("click", async () => {
    if (!confirm("Empty the swear jar? This clears all counts and history.")) return;
    await resetStats();
    flashSaved();
  });
}

init();
