/* Diervangspel — hoofd-game engine. Puur vanilla JS, geen build-stap, alles lokaal. */
(function () {
  "use strict";

  const { SPECIES, RARITY_LABEL, renderAnimalSVG, renderPlayerSVG } = window.DierenData;
  const { WORLD_W, WORLD_H, START, pathPoints, sidePaths, waterPools, deco, butterflySpots, discoverySpots, nearWater } = window.DierenWereld;
  const Audio = window.DierenAudio;

  const STORAGE_KEY = "dierenspel_state_v1";
  const RARITY_WEIGHT = { gewoon: 60, bijzonder: 30, zeldzaam: 12 };
  const RARITY_XP = { gewoon: 10, bijzonder: 18, zeldzaam: 28 };
  const RARITY_CONFETTI = {
    gewoon: { count: 24, colors: ["#ff6b8a", "#ffcf4d", "#33b06b", "#3aa0e0", "#a06bff", "#ff9a4d"] },
    bijzonder: { count: 42, colors: ["#ffcf4d", "#ffcc4d", "#ff9a4d", "#33b06b", "#3aa0e0", "#fff2a8"] },
    zeldzaam: { count: 64, colors: ["#ff6b5e", "#ffcc4d", "#ff9a4d", "#ffe07a", "#fff6c9", "#ff6b8a"] },
  };
  const MAX_ACTIVE_CRITTERS = 4;
  const PLAYER_ACCENTS = [
    { licht: "#6fd6f2", donker: "#2f9fce" },
    { licht: "#ff9f6b", donker: "#e2703a" },
    { licht: "#b6ef7a", donker: "#5fae2e" },
    { licht: "#ffb3e6", donker: "#d259b0" },
  ];
  // Dieptecue (backlog 1.1): objecten hoger op de kaart (kleinere world-Y) liggen
  // verder weg en worden kleiner/wazig getekend — puur visueel, geen invloed op x/y.
  const DEPTH_FAR_Y = 100;
  const DEPTH_NEAR_Y = WORLD_H - 60;
  function depthFor(y) {
    const t = Math.max(0, Math.min(1, (y - DEPTH_FAR_Y) / (DEPTH_NEAR_Y - DEPTH_FAR_Y)));
    return { scale: 0.72 + 0.28 * t, blur: (1 - t) * 1.6 };
  }

  // ---------------------------------------------------------------- state
  function defaultState() {
    return { caught: {}, xp: 0, level: 1, muted: false, seenWelcome: false, playerAccent: 0, unseenNewCatch: false };
  }
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      return defaultState();
    }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* opslag vol/geblokkeerd */ }
  }

  function xpForLevel(level) { return 50 + (level - 1) * 25; }

  function addXP(amount) {
    state.xp += amount;
    let leveled = false;
    while (state.xp >= xpForLevel(state.level)) {
      state.xp -= xpForLevel(state.level);
      state.level += 1;
      leveled = true;
    }
    updateHud();
    saveState();
    if (leveled) {
      Audio.SFX.levelup();
      Audio.vibrate([30, 40, 30]);
      queueCelebration((done) => showLevelUpCelebration(state.level, done));
    }
  }

  function addCaught(speciesId) {
    const sp = window.DierenData.bySpeciesId(speciesId);
    const entry = state.caught[speciesId] || { count: 0, evolved: false };
    entry.count += 1;
    let evolvedNow = false;
    if (!entry.evolved && entry.count >= sp.evolveBij) {
      entry.evolved = true;
      evolvedNow = true;
    }
    const isFirst = entry.count === 1;
    state.caught[speciesId] = entry;
    saveState();
    addXP(RARITY_XP[sp.rarity] + (isFirst ? 15 : 0));
    return { entry, isFirst, evolvedNow };
  }

  // ---------------------------------------------------------------- HUD
  const hudLevel = document.getElementById("hud-level");
  const hudXpFill = document.getElementById("hud-xp-fill");
  const hudCaught = document.getElementById("hud-caught");
  const spawnBanner = document.getElementById("spawn-banner");
  let bannerTimer = null;

  function updateHud() {
    hudLevel.textContent = `Niveau ${state.level}`;
    const pct = Math.min(100, (state.xp / xpForLevel(state.level)) * 100);
    hudXpFill.style.width = pct + "%";
    hudCaught.textContent = `Gevangen: ${Object.keys(state.caught).length}/${SPECIES.length}`;
    updateNewBadge();
  }

  function updateNewBadge() {
    document.querySelectorAll(".nav-dot").forEach((d) => d.classList.toggle("show", !!state.unseenNewCatch));
  }

  function showBanner(text, ms) {
    spawnBanner.textContent = text;
    spawnBanner.classList.add("show");
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => spawnBanner.classList.remove("show"), ms || 2000);
  }

  // ---------------------------------------------------------------- schermnavigatie
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.screen === id));
    if (id === "screen-collection") {
      renderCollection();
      if (state.unseenNewCatch) { state.unseenNewCatch = false; saveState(); }
      updateNewBadge();
    }
    if (id === "screen-battle") renderBattlePicker();
  }
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => { Audio.SFX.klik(); showScreen(btn.dataset.screen); });
  });

  // ---------------------------------------------------------------- dag/nacht
  function isEveningNow() {
    const h = new Date().getHours();
    return h >= 19 || h < 6;
  }
  function applyDayNight() {
    document.documentElement.classList.toggle("evening", isEveningNow());
  }
  applyDayNight();
  setInterval(applyDayNight, 5 * 60000);

  // ---------------------------------------------------------------- mute
  const btnMute = document.getElementById("btn-mute");
  const iconSound = document.getElementById("icon-sound");
  const ICON_ON = "M4 9v6h4l5 5V4L8 9H4z";
  const ICON_OFF = "M4 9v6h4l5 5V4L8 9H4zm11.5 3l2.5 2.5-1 1L14.5 13l-2.5 2.5-1-1L13.5 12 11 9.5l1-1L14.5 11 17 8.5l1 1z";
  function refreshMuteIcon() { iconSound.setAttribute("d", state.muted ? ICON_OFF : ICON_ON); }
  Audio.setMuted(state.muted);
  refreshMuteIcon();
  btnMute.addEventListener("click", () => {
    state.muted = !state.muted;
    Audio.setMuted(state.muted);
    refreshMuteIcon();
    saveState();
    if (!state.muted) Audio.SFX.klik();
  });

  // ---------------------------------------------------------------- wereld opbouwen
  const worldEl = document.getElementById("world");
  const worldDeco = document.getElementById("world-deco");
  const worldCritters = document.getElementById("world-critters");
  const viewportEl = document.getElementById("world-viewport");
  const playerEl = document.getElementById("player");
  const tapRing = document.getElementById("tap-ring");

  worldEl.style.width = WORLD_W + "px";
  worldEl.style.height = WORLD_H + "px";

  function buildPathSVG() {
    let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      const p0 = pathPoints[i - 1], p1 = pathPoints[i];
      const mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
      d += ` Q ${p0.x} ${p0.y} ${mx} ${my}`;
    }
    d += ` T ${pathPoints[pathPoints.length - 1].x} ${pathPoints[pathPoints.length - 1].y}`;
    let sideD = "";
    (sidePaths || []).forEach((pts) => {
      let sd = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) sd += ` L ${pts[i].x} ${pts[i].y}`;
      sideD += " " + sd;
    });
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", WORLD_W);
    svg.setAttribute("height", WORLD_H);
    svg.style.position = "absolute";
    svg.style.left = "0"; svg.style.top = "0";
    svg.style.zIndex = "0";
    svg.innerHTML = `
      <path d="${d}" fill="none" stroke="#d9b374" stroke-width="46" stroke-linecap="round" opacity="0.9"/>
      <path d="${d}" fill="none" stroke="#f3d9a4" stroke-width="36" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#eccb8f" stroke-width="4" stroke-dasharray="2 16" stroke-linecap="round" opacity="0.7"/>
      ${sideD ? `<path d="${sideD}" fill="none" stroke="#e0c48f" stroke-width="16" stroke-linecap="round" class="side-path"/>` : ""}
    `;
    worldDeco.appendChild(svg);
  }

  const discoverySpotEls = [];
  const DISCOVERY_COOLDOWN = 90000;
  function renderDiscoverySpots() {
    (discoverySpots || []).forEach((spot, i) => {
      const el = document.createElement("div");
      el.className = "discovery-spot";
      el.style.left = spot.x + "px";
      el.style.top = spot.y + "px";
      el.style.zIndex = String(Math.round(spot.y) + 1);
      el.dataset.spotIndex = String(i);
      worldDeco.appendChild(el);
      discoverySpotEls.push({ el, lastUsed: -Infinity });
    });
  }
  function updateDiscoverySpots(now) {
    discoverySpotEls.forEach((d) => {
      d.el.classList.toggle("used", now - d.lastUsed < DISCOVERY_COOLDOWN);
    });
  }

  function renderDeco() {
    buildPathSVG();
    waterPools.forEach((w) => {
      const el = document.createElement("div");
      el.className = "water-pool";
      el.style.left = (w.x - w.rx) + "px";
      el.style.top = (w.y - w.ry) + "px";
      el.style.width = w.rx * 2 + "px";
      el.style.height = w.ry * 2 + "px";
      el.style.zIndex = "0";
      worldDeco.appendChild(el);
    });
    deco.forEach((item) => {
      const el = document.createElement("div");
      el.className = `deco ${item.type} ${item.layer === "back" ? "layer-back" : ""}`;
      el.style.left = item.x + "px";
      el.style.top = item.y + "px";
      el.style.zIndex = String(Math.round(item.y));
      const depth = depthFor(item.y);
      el.style.setProperty("--depth-scale", depth.scale.toFixed(3));
      el.style.setProperty("--depth-blur", depth.blur.toFixed(2) + "px");
      if (item.type === "tree") {
        el.style.width = item.size + "px";
        el.style.height = item.size * 1.5 + "px";
        el.innerHTML = `<div class="deco-shadow"></div><div class="trunk"></div><div class="foliage"></div>`;
      } else if (item.type === "flower") {
        el.style.width = item.size + "px";
        el.style.height = item.size + "px";
        el.style.color = item.color;
      } else {
        el.style.width = item.size + "px";
        el.style.height = item.size * 0.8 + "px";
        el.innerHTML = `<div class="deco-shadow"></div>`;
      }
      worldDeco.appendChild(el);
    });
    butterflySpots.forEach((b, i) => {
      const el = document.createElement("div");
      el.className = "butterfly";
      el.style.left = b.x + "px";
      el.style.top = b.y + "px";
      el.style.zIndex = "3000";
      el.style.animationDelay = (-i * 1.3) + "s, " + (-i * 0.2) + "s";
      worldDeco.appendChild(el);
    });
    renderDiscoverySpots();
  }
  renderDeco();

  // ---------------------------------------------------------------- camera + speler
  let camX = 0, camY = 0, vw = 0, vh = 0;
  const player = { x: START.x, y: START.y, target: null, speed: 260, walking: false, facing: 1 };

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function updateViewportSize() {
    const r = viewportEl.getBoundingClientRect();
    vw = r.width; vh = r.height;
  }
  window.addEventListener("resize", updateViewportSize);
  updateViewportSize();

  function updateCamera() {
    camX = clamp(player.x - vw / 2, 0, Math.max(0, WORLD_W - vw));
    camY = clamp(player.y - vh / 2, 0, Math.max(0, WORLD_H - vh));
    worldEl.style.transform = `translate3d(${-camX}px, ${-camY}px, 0)`;
  }

  function placePlayerEl() {
    playerEl.style.left = player.x + "px";
    playerEl.style.top = player.y + "px";
    playerEl.style.zIndex = String(Math.round(player.y));
    const depth = depthFor(player.y);
    const flip = player.facing < 0 ? -1 : 1;
    playerEl.style.transform = `scaleX(${flip}) scale(${depth.scale.toFixed(3)})`;
  }

  const playerSvgEl = document.getElementById("player-svg");
  function renderPlayerAppearance() {
    playerSvgEl.innerHTML = renderPlayerSVG(PLAYER_ACCENTS[state.playerAccent] || PLAYER_ACCENTS[0], 64);
  }
  renderPlayerAppearance();

  const accentPicker = document.getElementById("accent-picker");
  function renderAccentPicker() {
    accentPicker.innerHTML = "";
    PLAYER_ACCENTS.forEach((acc, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "accent-swatch" + (i === state.playerAccent ? " selected" : "");
      btn.style.background = `radial-gradient(circle at 35% 30%, ${acc.licht}, ${acc.donker} 75%)`;
      btn.setAttribute("aria-label", "Kies kleur " + (i + 1));
      btn.addEventListener("click", () => {
        state.playerAccent = i;
        saveState();
        Audio.SFX.klik();
        renderAccentPicker();
        renderPlayerAppearance();
      });
      accentPicker.appendChild(btn);
    });
  }
  renderAccentPicker();

  function screenToWorld(clientX, clientY) {
    const r = viewportEl.getBoundingClientRect();
    return { x: clamp(camX + (clientX - r.left), 0, WORLD_W), y: clamp(camY + (clientY - r.top), 0, WORLD_H) };
  }

  viewportEl.addEventListener("click", (ev) => {
    Audio.unlock();
    const spotHit = ev.target.closest(".discovery-spot");
    if (spotHit) {
      const rec = discoverySpotEls[Number(spotHit.dataset.spotIndex)];
      const now = performance.now();
      if (rec && now - rec.lastUsed >= DISCOVERY_COOLDOWN) {
        rec.lastUsed = now;
        spotHit.classList.add("used");
        makeSparkles(spotHit);
        Audio.SFX.vondst();
        Audio.vibrate([20, 20, 20]);
        addXP(5);
        showBanner("Leuke vondst! +5 XP ✨", 1800);
      }
      return;
    }
    const critterHit = ev.target.closest(".critter");
    if (critterHit) {
      const inst = activeCritters[critterHit.dataset.instanceId];
      if (inst) openCatch(inst);
      return;
    }
    const world = screenToWorld(ev.clientX, ev.clientY);
    player.target = world;
    const r = viewportEl.getBoundingClientRect();
    tapRing.style.left = (ev.clientX - r.left) + "px";
    tapRing.style.top = (ev.clientY - r.top) + "px";
    tapRing.classList.remove("show");
    void tapRing.offsetWidth;
    tapRing.classList.add("show");
  });

  // ---------------------------------------------------------------- dieren op de kaart
  const activeCritters = {};
  let critterUid = 0;

  function nightWeightFor(s) {
    const evening = isEveningNow();
    const base = RARITY_WEIGHT[s.rarity];
    if (evening && s.nachtdier) return base * 3;
    if (evening && !s.nachtdier) return base * 0.7;
    return base;
  }

  function weightedRandomSpecies() {
    const total = SPECIES.reduce((sum, s) => sum + nightWeightFor(s), 0);
    let r = Math.random() * total;
    for (const s of SPECIES) {
      r -= nightWeightFor(s);
      if (r <= 0) return s;
    }
    return SPECIES[0];
  }

  function makeSparkles(el) {
    for (let i = 0; i < 8; i++) {
      const sp = document.createElement("div");
      sp.className = "sparkle-particle";
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 30 + Math.random() * 16;
      sp.style.setProperty("--sp-end", `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 10}px)`);
      sp.style.left = "50%"; sp.style.top = "40%";
      sp.style.animationDelay = (Math.random() * 0.15) + "s";
      el.appendChild(sp);
      sp.addEventListener("animationend", () => sp.remove());
    }
  }

  function spawnDustPoof(el) {
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("div");
      p.className = "dust-particle";
      const angle = (Math.PI * 2 * i) / 6;
      const dist = 24 + Math.random() * 14;
      p.style.setProperty("--sp-end", `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 6}px)`);
      p.style.left = "50%"; p.style.top = "50%";
      el.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  }

  // Wandelgedrag per archetype (zelfde idee als ARCHETYPES in animals.js) — elk
  // dier voelt anders aan op de kaart i.p.v. dat alles hetzelfde rondloopt.
  const WANDER_BEHAVIOR = {
    hupper: { mode: "hop", speed: 130, pauseMin: 900, pauseMax: 2200, radius: [40, 90] },
    vliegend: { mode: "float", speed: 26, pauseMin: 1800, pauseMax: 3200, radius: [20, 50], ampX: 26, ampY: 14, period: 2600 },
    zwem: { mode: "water", speed: 30, pauseMin: 1500, pauseMax: 3000, radius: [20, 60] },
    schelp: { mode: "default", speed: 18, pauseMin: 2500, pauseMax: 5000, radius: [30, 100] },
    rond: { mode: "default", speed: 30, pauseMin: 1500, pauseMax: 4000, radius: [30, 100] },
    langnek: { mode: "default", speed: 26, pauseMin: 1500, pauseMax: 4000, radius: [30, 100] },
    stekelig: { mode: "default", speed: 34, pauseMin: 1500, pauseMax: 4000, radius: [30, 100] },
  };
  function behaviorFor(species) { return WANDER_BEHAVIOR[species.archetype] || WANDER_BEHAVIOR.rond; }

  function nearestWaterPool(x, y) {
    let best = null, bestDist = Infinity;
    waterPools.forEach((w) => {
      const d = Math.hypot(w.x - x, w.y - y);
      if (d < bestDist) { bestDist = d; best = w; }
    });
    return best;
  }

  function spawnCritterAt(species, x, y, opts) {
    opts = opts || {};
    const id = "c" + (++critterUid);
    const el = document.createElement("div");
    el.className = "critter entering";
    el.dataset.instanceId = id;
    const evolved = false;
    el.innerHTML = `<div class="critter-shadow"></div><div class="critter-sprite">${renderAnimalSVG(species, { size: 64, evolved })}</div><div class="rarity-badge rarity-${species.rarity}"></div>`;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.zIndex = String(Math.round(y));
    worldCritters.appendChild(el);

    if (opts.announce) {
      const bubble = document.createElement("div");
      bubble.className = "critter-bubble";
      bubble.textContent = "?";
      el.appendChild(bubble);
      setTimeout(() => bubble.remove(), 1400);
      makeSparkles(el);
      Audio.SFX.spawn();
      Audio.vibrate([25, 30, 25]);
      showBanner("Er is een dier verschenen! 🐾", 2200);
    }

    const now = performance.now();
    const inst = {
      id, species, x, y, anchorX: x, anchorY: y,
      target: opts.inwardTarget || null,
      speed: opts.inwardTarget ? 90 : 34,
      nextWanderAt: now + 800,
      expiresAt: now + 55000 + Math.random() * 25000,
      behavior: behaviorFor(species),
      phase: Math.random() * Math.PI * 2,
      el, entering: !!opts.inwardTarget,
    };
    activeCritters[id] = inst;
    setTimeout(() => el.classList.remove("entering"), 550);
    return inst;
  }

  function pickEdgeSpawn() {
    const edge = ["top", "bottom", "left", "right"][Math.floor(Math.random() * 4)];
    const margin = 50;
    let x, y;
    if (edge === "left") { x = camX - margin; y = camY + Math.random() * vh; }
    else if (edge === "right") { x = camX + vw + margin; y = camY + Math.random() * vh; }
    else if (edge === "top") { x = camX + Math.random() * vw; y = camY - margin; }
    else { x = camX + Math.random() * vw; y = camY + vh + margin; }
    x = clamp(x, -80, WORLD_W + 80);
    y = clamp(y, -80, WORLD_H + 80);
    const targetX = clamp(camX + vw * (0.3 + Math.random() * 0.4), 40, WORLD_W - 40);
    const targetY = clamp(camY + vh * (0.3 + Math.random() * 0.4), 40, WORLD_H - 40);
    return { x, y, inwardTarget: { x: targetX, y: targetY }, edge };
  }

  const nearbyHintEl = document.getElementById("nearby-hint");
  function showNearbyHint(species) {
    nearbyHintEl.innerHTML = `<div class="thumb">${renderAnimalSVG(species, { size: 30 })}<div class="rarity-badge rarity-${species.rarity}"></div></div><span class="label">Dichtbij...</span>`;
    nearbyHintEl.classList.add("show");
  }
  function hideNearbyHint() { nearbyHintEl.classList.remove("show"); }

  function showEdgeCue(edge) {
    const el = document.getElementById("edge-cue-" + edge);
    if (!el) return;
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 900);
  }

  function scheduleNextSpawn() {
    const delay = 10000 + Math.random() * 10000;
    if (Object.keys(activeCritters).length >= MAX_ACTIVE_CRITTERS) {
      setTimeout(scheduleNextSpawn, delay);
      return;
    }
    const species = weightedRandomSpecies();
    const spot = pickEdgeSpawn();
    const hintDelay = Math.max(500, delay - 2200);
    setTimeout(() => showNearbyHint(species), hintDelay);
    setTimeout(() => {
      hideNearbyHint();
      showEdgeCue(spot.edge);
      spawnCritterAt(species, spot.x, spot.y, { announce: true, inwardTarget: spot.inwardTarget });
      scheduleNextSpawn();
    }, delay);
  }
  setTimeout(scheduleNextSpawn, 3000);

  function removeCritter(id, immediate) {
    const inst = activeCritters[id];
    if (!inst) return;
    delete activeCritters[id];
    if (immediate) { inst.el.remove(); return; }
    inst.el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    inst.el.style.opacity = "0";
    inst.el.style.transform += " scale(0.7)";
    setTimeout(() => inst.el.remove(), 520);
  }

  function pickWanderTarget(c) {
    const b = c.behavior;
    const [minR, maxR] = b.radius || [30, 100];
    const dist = minR + Math.random() * (maxR - minR);
    const angle = Math.random() * Math.PI * 2;
    let cx = c.anchorX, cy = c.anchorY;
    if (b.mode === "water") {
      const pool = nearestWaterPool(c.anchorX, c.anchorY);
      if (pool) { cx = pool.x; cy = pool.y; }
    }
    return {
      x: clamp(cx + Math.cos(angle) * dist, 20, WORLD_W - 20),
      y: clamp(cy + Math.sin(angle) * dist, 20, WORLD_H - 20),
    };
  }

  function updateCritters(dt, now) {
    for (const id in activeCritters) {
      const c = activeCritters[id];
      const b = c.behavior;
      if (now > c.expiresAt && !c.entering) { removeCritter(id, false); continue; }
      if (c.target) {
        const dx = c.target.x - c.x, dy = c.target.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 4) {
          c.target = null;
          if (c.entering) {
            c.entering = false;
            c.speed = b.speed;
            c.anchorX = c.x; c.anchorY = c.y;
          }
          c.nextWanderAt = now + b.pauseMin + Math.random() * (b.pauseMax - b.pauseMin);
        } else {
          const step = Math.min(dist, c.speed * dt);
          c.x += (dx / dist) * step;
          c.y += (dy / dist) * step;
        }
      } else if (now >= c.nextWanderAt) {
        c.target = pickWanderTarget(c);
      }
      // "vliegend" zweeft met een sinusgolf bovenop de trage, logische ankerpositie —
      // die golf beïnvloedt nooit c.x/c.y zelf, anders raakt het pad-zoeken in de war.
      let renderX = c.x, renderY = c.y;
      if (b.mode === "float") {
        const t = (now / b.period) * Math.PI * 2 + c.phase;
        renderX += Math.sin(t) * b.ampX;
        renderY += Math.cos(t) * b.ampY;
      }
      c.el.style.left = renderX + "px";
      c.el.style.top = renderY + "px";
      c.el.style.zIndex = String(Math.round(renderY));
      c.el.style.setProperty("--depth-scale", depthFor(renderY).scale.toFixed(3));
    }
  }

  // ---------------------------------------------------------------- spelloop
  let lastTs = performance.now();
  function gameLoop(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    if (player.target) {
      const dx = player.target.x - player.x, dy = player.target.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (Math.abs(dx) > 6) player.facing = dx < 0 ? -1 : 1;
      if (dist < 4) { player.target = null; player.walking = false; }
      else {
        const step = Math.min(dist, player.speed * dt);
        player.x += (dx / dist) * step;
        player.y += (dy / dist) * step;
        player.walking = true;
      }
    } else {
      player.walking = false;
    }
    playerEl.classList.toggle("walking", player.walking);
    placePlayerEl();
    updateCamera();
    updateCritters(dt, ts);
    updateDiscoverySpots(ts);

    requestAnimationFrame(gameLoop);
  }
  placePlayerEl();
  updateCamera();
  requestAnimationFrame(gameLoop);

  // ---------------------------------------------------------------- vang-minispel
  const catchOverlay = document.getElementById("catch-overlay");
  const catchField = document.getElementById("catch-field");
  const catchTargetRing = document.getElementById("catch-target-ring");
  const catchImpactFlash = document.getElementById("catch-impact-flash");
  const catchCritterEl = document.getElementById("catch-critter");
  const catchBallGhost = document.getElementById("catch-ball-ghost");
  const catchBallEl = document.getElementById("catch-ball");
  const catchBallVisual = document.getElementById("catch-ball-visual");
  const catchHint = document.getElementById("catch-hint");
  const catchResult = document.getElementById("catch-result");
  const catchResultEmoji = document.getElementById("catch-result-emoji");
  const catchResultTitle = document.getElementById("catch-result-title");
  const catchResultSub = document.getElementById("catch-result-sub");
  const catchContinueBtn = document.getElementById("catch-continue");

  let catchState = null;
  let ballDrag = null;
  const THROW_MIN_DISTANCE = 45; // echte vingerbeweging nodig, los van de optische lift hieronder
  const FINGER_LIFT = 64; // bal wordt dit aantal px boven de vinger getekend, zodat een duim 'm niet verbergt
  const CURVE_MIN_DISTANCE = 40; // zijwaartse beweging tijdens de sleep die telt als "curveball"
  const RING_CYCLE_MS = 1500; // moet gelijk zijn aan de duur van de ringpulse-animatie in style.css
  const GREAT_THROW_WINDOW = 0.12; // fractie van de cyclus rond het kleinste punt die telt als "geweldige worp"
  const BONUS_XP = 8;

  function getCenter(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function resetBallToRest() {
    catchBallEl.classList.remove("dragging", "flying", "drop-fail");
    catchBallEl.style.removeProperty("--dropx");
    catchBallEl.style.removeProperty("--dropy");
    catchBallEl.style.transition = "none";
    catchBallEl.style.transform = "translate(0px, 0px)";
    catchBallVisual.classList.remove("wobble-anim");
    catchBallVisual.classList.add("idle-bob");
    void catchBallEl.offsetWidth;
  }

  function spawnTrailDot(clientX, clientY) {
    const fieldRect = catchField.getBoundingClientRect();
    const dot = document.createElement("div");
    dot.className = "ball-trail-dot";
    dot.style.left = (clientX - fieldRect.left) + "px";
    dot.style.top = (clientY - fieldRect.top) + "px";
    catchField.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  }

  function openCatch(inst) {
    catchState = { inst, tapsDone: 0, tapsNeeded: inst.species.vangKeer, fails: 0, busy: false, ringStartTs: performance.now() };
    catchCritterEl.className = "catch-critter";
    catchCritterEl.innerHTML = renderAnimalSVG(inst.species, { size: 128 });
    catchTargetRing.className = "catch-target-ring rarity-" + inst.species.rarity;
    catchImpactFlash.classList.remove("show");
    resetBallToRest();
    catchBallVisual.classList.remove("ball-bijzonder", "ball-zeldzaam");
    if (inst.species.rarity === "bijzonder") catchBallVisual.classList.add("ball-bijzonder");
    else if (inst.species.rarity === "zeldzaam") catchBallVisual.classList.add("ball-zeldzaam");
    catchBallGhost.classList.remove("hidden");
    catchHint.textContent = "👉 Pak de bal en gooi hem in de cirkel!";
    catchResult.classList.add("hidden");
    [catchResultEmoji, catchResultTitle, catchResultSub, catchContinueBtn].forEach((el) => el.classList.remove("reveal", "pop"));
    catchOverlay.classList.remove("hidden");
  }

  function closeCatchOverlay() {
    catchOverlay.classList.add("hidden");
  }

  function updateBallDragRender(ev) {
    const followX = ev.clientX;
    const followY = ev.clientY - FINGER_LIFT;
    ballDrag.curX = followX - ballDrag.restCenter.x;
    ballDrag.curY = followY - ballDrag.restCenter.y;
    ballDrag.rawDX = ev.clientX - ballDrag.rawStartX;
    ballDrag.rawDY = ev.clientY - ballDrag.rawStartY;
    ballDrag.maxAbsDX = Math.max(ballDrag.maxAbsDX, Math.abs(ballDrag.rawDX));
    catchBallEl.style.transform = `translate(${ballDrag.curX}px, ${ballDrag.curY}px)`;
  }

  catchBallEl.addEventListener("pointerdown", (ev) => {
    if (!catchState || catchState.busy) return;
    Audio.unlock();
    catchBallGhost.classList.add("hidden");
    catchBallEl.setPointerCapture(ev.pointerId);
    catchBallEl.classList.add("dragging");
    catchBallVisual.classList.remove("idle-bob");
    ballDrag = {
      restCenter: getCenter(catchBallEl),
      rawStartX: ev.clientX, rawStartY: ev.clientY,
      curX: 0, curY: 0, rawDX: 0, rawDY: 0, maxAbsDX: 0,
    };
    updateBallDragRender(ev);
  });

  catchBallEl.addEventListener("pointermove", (ev) => {
    if (!ballDrag) return;
    updateBallDragRender(ev);
  });

  function endBallDrag() {
    if (!ballDrag || !catchState || catchState.busy) { ballDrag = null; return; }
    const drag = ballDrag;
    ballDrag = null;
    catchBallEl.classList.remove("dragging");

    const validThrow = -drag.rawDY > THROW_MIN_DISTANCE;
    if (!validThrow) {
      dropBallFail(drag);
      return;
    }
    const isCurve = drag.maxAbsDX > CURVE_MIN_DISTANCE;
    const elapsed = (performance.now() - catchState.ringStartTs) % RING_CYCLE_MS;
    const phase = elapsed / RING_CYCLE_MS;
    const distFromSmallest = Math.min(phase, 1 - phase); // 0 = precies op het kleinste punt van de pulserende ring
    const isGreatThrow = distFromSmallest < GREAT_THROW_WINDOW;
    throwBallAlongArc(drag, { isCurve, isGreatThrow });
  }
  catchBallEl.addEventListener("pointerup", endBallDrag);
  catchBallEl.addEventListener("pointercancel", endBallDrag);

  // Telt zowel ongeldige worpen (bal niet echt opgetild) als voltooide-maar-niet-
  // afrondende rake worpen mee als "fails" — losstaand van tapsDone, want anders
  // haalt tapsDone de drempel altijd al in voordat de versoepeling ooit iets kan
  // doen (bij een rake worp lopen fails en tapsDone namelijk exact gelijk op).
  function maybeEaseCatch() {
    if (catchState.fails >= 2 && catchState.tapsNeeded > catchState.tapsDone + 1) {
      catchState.tapsNeeded -= 1;
      catchTargetRing.classList.add("ring-large");
    }
  }

  function dropBallFail(drag) {
    Audio.SFX.mis();
    Audio.vibrate(15);
    if (catchState) {
      catchState.fails += 1;
      maybeEaseCatch();
    }
    catchHint.textContent = "Til de bal echt op en gooi hem naar de cirkel! 💪";
    catchTargetRing.classList.remove("fail-flash"); void catchTargetRing.offsetWidth; catchTargetRing.classList.add("fail-flash");
    catchBallEl.style.setProperty("--dropx", drag.curX + "px");
    catchBallEl.style.setProperty("--dropy", drag.curY + "px");
    catchBallEl.classList.add("drop-fail");
    catchBallEl.addEventListener("animationend", function onEnd() {
      catchBallEl.removeEventListener("animationend", onEnd);
      catchBallEl.classList.remove("drop-fail");
      catchBallEl.style.transform = "translate(0px, 0px)";
      catchBallVisual.classList.add("idle-bob");
    }, { once: true });
  }

  function throwBallAlongArc(drag, opts) {
    opts = opts || {};
    catchState.busy = true;
    catchBallEl.classList.add("flying");
    Audio.SFX.worp();
    Audio.vibrate(10);

    const start = { x: drag.curX, y: drag.curY };
    const critterCenter = getCenter(catchCritterEl);
    const end = {
      x: critterCenter.x - drag.restCenter.x,
      y: critterCenter.y - drag.restCenter.y,
    };
    const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 90 };
    if (opts.isCurve) control.x += drag.rawDX * 0.4;

    const duration = 360;
    const t0 = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - t0) / duration);
      const u = 1 - t;
      const x = u * u * start.x + 2 * u * t * control.x + t * t * end.x;
      const y = u * u * start.y + 2 * u * t * control.y + t * t * end.y;
      catchBallEl.style.transform = `translate(${x}px, ${y}px) scale(${1 - 0.25 * t}) rotate(${t * 300}deg)`;
      if (Math.random() < 0.6) spawnTrailDot(drag.restCenter.x + x, drag.restCenter.y + y);
      if (t < 1) requestAnimationFrame(frame);
      else onBallImpact(opts);
    }
    requestAnimationFrame(frame);
  }

  function onBallImpact(opts) {
    opts = opts || {};
    const thisCatch = catchState;
    catchField.classList.remove("shake"); void catchField.offsetWidth; catchField.classList.add("shake");
    catchImpactFlash.classList.remove("show"); void catchImpactFlash.offsetWidth; catchImpactFlash.classList.add("show");
    catchTargetRing.classList.add("burst");
    catchCritterEl.classList.add("impact");
    Audio.SFX.raak();
    Audio.vibrate(15);

    const bonusLabels = [];
    let bonusXp = 0;
    if (opts.isCurve) { bonusLabels.push("Curveball"); bonusXp += BONUS_XP; }
    if (opts.isGreatThrow) { bonusLabels.push("Geweldige worp"); bonusXp += BONUS_XP; }
    if (bonusXp > 0) {
      addXP(bonusXp);
      catchHint.textContent = `${bonusLabels.join(" + ")}! 🌟 +${bonusXp} XP`;
    }

    setTimeout(() => {
      if (catchState !== thisCatch) return;
      catchState.tapsDone += 1;
      catchBallVisual.classList.add("wobble-anim");
      Audio.SFX.wobble();
      Audio.vibrate(20);

      setTimeout(() => {
        if (catchState !== thisCatch) return;
        catchBallVisual.classList.remove("wobble-anim");
        if (catchState.tapsDone >= catchState.tapsNeeded) {
          setTimeout(() => { if (catchState === thisCatch) finishCatch(true); }, 200);
        } else {
          // Dier ontsnapt (nog) niet helemaal, maar breekt wel los uit de bal —
          // zelfde eenmaal-actieve-klasse discipline als .impact/.caught hierboven.
          catchState.fails += 1;
          maybeEaseCatch();
          catchCritterEl.classList.remove("impact");
          catchCritterEl.classList.add("escaping");
          catchCritterEl.addEventListener("animationend", function onEscapeEnd() {
            catchCritterEl.removeEventListener("animationend", onEscapeEnd);
            if (catchState !== thisCatch) return;
            catchCritterEl.className = "catch-critter";
            spawnDustPoof(catchCritterEl);
            resetBallToRest();
            catchTargetRing.classList.remove("burst"); void catchTargetRing.offsetWidth;
            catchTargetRing.classList.remove("rarity-bijzonder", "rarity-zeldzaam");
            catchTargetRing.classList.add("rarity-" + catchState.inst.species.rarity);
            catchState.ringStartTs = performance.now();
            if (bonusXp === 0) catchHint.textContent = "Het diertje breekt bijna los! Probeer opnieuw! 💪";
            catchState.busy = false;
          }, { once: true });
        }
      }, 650);
    }, 260);
  }

  function burstConfetti(container, count, colors) {
    colors = colors || ["#ff6b8a", "#ffcf4d", "#33b06b", "#3aa0e0", "#a06bff", "#ff9a4d"];
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (1.4 + Math.random() * 1.2) + "s";
      p.style.animationDelay = (Math.random() * 0.3) + "s";
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      container.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  }

  function finishCatch(success) {
    if (!success) return;
    const inst = catchState.inst;
    const thisCatch = catchState;
    Audio.SFX.gevangen();
    Audio.vibrate([30, 50, 30, 50, 60]);
    const conf = RARITY_CONFETTI[inst.species.rarity] || RARITY_CONFETTI.gewoon;
    const res = addCaught(inst.species.id);
    if (res.isFirst) { state.unseenNewCatch = true; saveState(); updateNewBadge(); }
    catchState.pendingEvolution = res.evolvedNow ? inst.species : null;
    removeCritter(inst.id, true);

    catchResultEmoji.textContent = inst.species.rarity === "zeldzaam" ? "🌟" : inst.species.rarity === "bijzonder" ? "✨" : "🎉";
    catchResultTitle.textContent = "Gevangen!";
    catchResultSub.textContent = `${inst.species.naam} — ${res.isFirst ? "Nieuw in je verzameling!" : `Je hebt er nu ${res.entry.count}!`}`;
    [catchResultEmoji, catchResultTitle, catchResultSub, catchContinueBtn].forEach((el) => el.classList.remove("reveal", "pop"));
    catchResult.classList.remove("hidden");

    setTimeout(() => {
      if (catchState !== thisCatch) return;
      catchResultEmoji.classList.add("pop");
      burstConfetti(catchOverlay, conf.count, conf.colors);
    }, 80);
    setTimeout(() => {
      if (catchState !== thisCatch) return;
      catchResultTitle.classList.add("reveal");
    }, 380);
    setTimeout(() => {
      if (catchState !== thisCatch) return;
      catchResultSub.classList.add("reveal");
      catchContinueBtn.classList.add("reveal");
    }, 680);
  }

  catchContinueBtn.addEventListener("click", () => {
    const pendingEvolution = catchState && catchState.pendingEvolution;
    closeCatchOverlay();
    catchState = null;
    if (pendingEvolution) {
      queueCelebration((done) => showEvolutionCelebration(pendingEvolution, done));
    }
    // Vangst-overlay is nu dicht: speel eventuele opgestapelde vieringen
    // (niveau omhoog en/of evolutie) alsnog af, in de volgorde waarin ze ontstonden.
    if (!celebrationBusy) runNextCelebration();
  });

  // ---------------------------------------------------------------- viering (level-up + evolutie)
  const celebrateOverlay = document.getElementById("celebrate-overlay");
  const celebrateStage = document.getElementById("celebrate-stage");
  const celebrateSpriteBefore = document.getElementById("celebrate-sprite-before");
  const celebrateSpriteAfter = document.getElementById("celebrate-sprite-after");
  const celebrateFlash = document.getElementById("celebrate-flash");
  const celebrateTitle = document.getElementById("celebrate-title");
  const celebrateSub = document.getElementById("celebrate-sub");
  const celebrateContinueBtn = document.getElementById("celebrate-continue");

  let celebrationQueue = [];
  let celebrationBusy = false;

  function queueCelebration(fn) {
    celebrationQueue.push(fn);
    // Niet meteen starten als de vangst-overlay nog open is — anders staan er twee
    // overlays over elkaar. In dat geval wordt de wachtrij pas afgespeeld nadat
    // catchContinueBtn is ingedrukt (zie hieronder).
    if (!celebrationBusy && catchOverlay.classList.contains("hidden")) runNextCelebration();
  }

  function runNextCelebration() {
    const next = celebrationQueue.shift();
    if (!next) { celebrationBusy = false; return; }
    celebrationBusy = true;
    next(runNextCelebration);
  }

  function showLevelUpCelebration(level, done) {
    celebrateStage.classList.add("hidden");
    celebrateContinueBtn.classList.add("hidden");
    celebrateTitle.textContent = `Niveau ${level}! 🎉`;
    celebrateSub.textContent = "Je wordt steeds beter in dieren vangen!";
    celebrateOverlay.classList.remove("hidden");
    burstConfetti(celebrateOverlay, RARITY_CONFETTI.bijzonder.count, RARITY_CONFETTI.bijzonder.colors);
    setTimeout(() => {
      celebrateOverlay.classList.add("hidden");
      done();
    }, 2000);
  }

  function showEvolutionCelebration(species, done) {
    celebrateStage.classList.remove("hidden");
    celebrateFlash.classList.remove("show");
    celebrateSpriteBefore.className = "celebrate-sprite celebrate-breathe";
    celebrateSpriteBefore.innerHTML = renderAnimalSVG(species, { size: 160, evolved: false });
    celebrateSpriteAfter.className = "celebrate-sprite hidden";
    celebrateSpriteAfter.innerHTML = renderAnimalSVG(species, { size: 160, evolved: true });
    celebrateTitle.textContent = "Evolutie! ✨";
    celebrateSub.textContent = `${species.naam} verandert...`;
    celebrateContinueBtn.classList.add("hidden");
    celebrateOverlay.classList.remove("hidden");
    Audio.SFX.gevangen();

    setTimeout(() => {
      celebrateFlash.classList.remove("show"); void celebrateFlash.offsetWidth; celebrateFlash.classList.add("show");
      celebrateSpriteBefore.classList.add("hidden");
      celebrateSpriteAfter.className = "celebrate-sprite celebrate-popin";
      celebrateTitle.textContent = `${species.evoNaam}! ✨`;
      celebrateSub.textContent = "Wat een prachtige nieuwe vorm!";
      burstConfetti(celebrateOverlay, RARITY_CONFETTI.zeldzaam.count, RARITY_CONFETTI.zeldzaam.colors);
      Audio.SFX.levelup();
      Audio.vibrate([30, 40, 30, 40, 60]);
    }, 900);

    setTimeout(() => {
      celebrateContinueBtn.classList.remove("hidden");
    }, 1400);

    celebrateContinueBtn.addEventListener("click", function onDone() {
      celebrateContinueBtn.removeEventListener("click", onDone);
      celebrateOverlay.classList.add("hidden");
      done();
    });
  }

  // ---------------------------------------------------------------- prestatiemedailles
  const ACHIEVEMENTS = [
    { icon: "🎯", label: "Eerste vangst", check: (st) => Object.keys(st.caught).length >= 1 },
    { icon: "🌿", label: "5 soorten", check: (st) => Object.keys(st.caught).length >= 5 },
    { icon: "🏆", label: "Alles gevonden", check: (st) => Object.keys(st.caught).length >= SPECIES.length },
    { icon: "✨", label: "Eerste evolutie", check: (st) => Object.values(st.caught).some((e) => e.evolved) },
    { icon: "💎", label: "Zeldzaam dier", check: (st) => Object.keys(st.caught).some((id) => { const sp = window.DierenData.bySpeciesId(id); return sp && sp.rarity === "zeldzaam"; }) },
  ];
  const medalStrip = document.getElementById("medal-strip");
  function renderMedals() {
    medalStrip.innerHTML = "";
    ACHIEVEMENTS.forEach((a) => {
      const unlocked = a.check(state);
      const el = document.createElement("div");
      el.className = "medal" + (unlocked ? "" : " locked");
      el.innerHTML = `<div class="medal-icon">${a.icon}</div><div class="medal-label">${a.label}</div>`;
      medalStrip.appendChild(el);
    });
  }

  // ---------------------------------------------------------------- verzamelscherm
  const collectionGrid = document.getElementById("collection-grid");
  const collectionProgress = document.getElementById("collection-progress");

  function renderCollection() {
    collectionGrid.innerHTML = "";
    let found = 0;
    SPECIES.forEach((sp) => {
      const owned = state.caught[sp.id];
      const card = document.createElement("div");
      card.className = "collection-card" + (owned ? "" : " locked");
      if (owned) {
        found++;
        card.innerHTML = `
          <div class="thumb">${renderAnimalSVG(sp, { size: 56, evolved: owned.evolved })}<div class="rarity-badge rarity-${sp.rarity}"></div></div>
          <div class="name">${owned.evolved ? sp.evoNaam : sp.naam}</div>
          <div class="count-badge">x${owned.count}</div>
        `;
      } else {
        card.innerHTML = `<div class="thumb"><div class="qmark">?</div></div><div class="name">???</div>`;
      }
      card.addEventListener("click", () => openDetail(sp));
      collectionGrid.appendChild(card);
    });
    collectionProgress.textContent = `${found} van ${SPECIES.length} gevonden`;
    renderMedals();
  }

  // ---------------------------------------------------------------- detail-modal
  const detailModal = document.getElementById("detail-modal");
  const detailSprite = document.getElementById("detail-sprite");
  const detailName = document.getElementById("detail-name");
  const detailMeta = document.getElementById("detail-meta");
  const detailBlurb = document.getElementById("detail-blurb");
  document.getElementById("detail-close").addEventListener("click", () => detailModal.classList.add("hidden"));

  let detailIndex = 0;
  function renderDetail(i) {
    detailIndex = ((i % SPECIES.length) + SPECIES.length) % SPECIES.length;
    const sp = SPECIES[detailIndex];
    const owned = state.caught[sp.id];
    if (owned) {
      detailSprite.innerHTML = renderAnimalSVG(sp, { size: 130, evolved: owned.evolved });
      detailName.textContent = owned.evolved ? `${sp.evoNaam} (${sp.naam})` : sp.naam;
      detailMeta.textContent = `${sp.habitat} • ${RARITY_LABEL[sp.rarity]} • ${owned.count}x gevangen`;
      detailBlurb.textContent = sp.blurb;
    } else {
      detailSprite.innerHTML = `<div class="qmark" style="font-size:64px;">?</div>`;
      detailName.textContent = "Nog niet gevonden";
      detailMeta.textContent = "Onbekend dier";
      detailBlurb.textContent = "Zoek dit dier op de kaart en tik erop om het te vangen!";
    }
    detailModal.classList.remove("hidden");
  }

  function openDetail(sp) {
    Audio.SFX.klik();
    renderDetail(SPECIES.indexOf(sp));
  }

  document.getElementById("detail-prev").addEventListener("click", (ev) => { ev.stopPropagation(); Audio.SFX.klik(); renderDetail(detailIndex - 1); });
  document.getElementById("detail-next").addEventListener("click", (ev) => { ev.stopPropagation(); Audio.SFX.klik(); renderDetail(detailIndex + 1); });

  let detailSwipeStartX = null;
  detailSprite.addEventListener("pointerdown", (ev) => { detailSwipeStartX = ev.clientX; });
  detailSprite.addEventListener("pointerup", (ev) => {
    if (detailSwipeStartX === null) return;
    const dx = ev.clientX - detailSwipeStartX;
    detailSwipeStartX = null;
    if (Math.abs(dx) > 40) { Audio.SFX.klik(); renderDetail(detailIndex + (dx < 0 ? 1 : -1)); }
  });

  // ---------------------------------------------------------------- gevecht
  const BATTLE_ATTACK_ANIM = {
    rond: "atk-roll", hupper: "atk-hop", langnek: "atk-peck", stekelig: "atk-spike",
    vliegend: "atk-dive", schelp: "atk-snap", zwem: "atk-splash",
  };
  function attackAnimFor(species) { return BATTLE_ATTACK_ANIM[species.archetype] || "attack"; }
  function attackSfxFor(species) { return Audio.ARCHETYPE_ATTACK_SFX[species.archetype] || Audio.SFX.aanval; }

  const battlePicker = document.getElementById("battle-picker");
  const battleArena = document.getElementById("battle-arena");
  const enemyNameEl = document.getElementById("enemy-name");
  const playerNameEl = document.getElementById("player-name");
  const enemyHpEl = document.getElementById("enemy-hp");
  const playerHpEl = document.getElementById("player-hp");
  const enemySpriteEl = document.getElementById("enemy-sprite");
  const playerSpriteEl = document.getElementById("player-sprite");
  const battleLog = document.getElementById("battle-log");
  const btnAttack = document.getElementById("btn-attack");
  const btnBattleExit = document.getElementById("btn-battle-exit");

  let battle = null;

  function renderBattlePicker() {
    battleArena.classList.add("hidden");
    battlePicker.classList.remove("hidden");
    battlePicker.innerHTML = "";
    const owned = SPECIES.filter((sp) => state.caught[sp.id]);
    if (owned.length === 0) {
      battlePicker.innerHTML = `<p class="panel-sub" style="grid-column:1/-1;text-align:center;padding-top:20px;">Vang eerst een dier op de kaart om te kunnen vechten!</p>`;
      return;
    }
    owned.forEach((sp) => {
      const owned2 = state.caught[sp.id];
      const card = document.createElement("div");
      card.className = "collection-card";
      card.innerHTML = `<div class="thumb">${renderAnimalSVG(sp, { size: 56, evolved: owned2.evolved })}</div><div class="name">${owned2.evolved ? sp.evoNaam : sp.naam}</div>`;
      card.addEventListener("click", () => startBattle(sp, owned2));
      battlePicker.appendChild(card);
    });
  }

  function startBattle(sp, owned) {
    Audio.SFX.klik();
    const enemySp = weightedRandomSpecies();
    const evolved = owned.evolved;
    const playerMaxHp = sp.hp + (evolved ? 10 : 0) + state.level * 2;
    const playerAtk = sp.atk + (evolved ? 3 : 0) + Math.floor(state.level / 2);
    const enemyMaxHp = enemySp.hp + Math.floor(state.level * 1.4);
    const enemyAtk = enemySp.atk + Math.floor(state.level / 2);

    battle = {
      sp, enemySp, playerHp: playerMaxHp, playerMaxHp, playerAtk,
      enemyHp: enemyMaxHp, enemyMaxHp, enemyAtk, over: false, evolved,
      playerAttackClass: attackAnimFor(sp), enemyAttackClass: attackAnimFor(enemySp),
    };

    // Reset (defensief): een battle die halverwege een animatie werd verlaten mag
    // geen oude atk-*-klasse achterlaten op een sprite die voor de volgende battle
    // hergebruikt wordt.
    playerSpriteEl.className = "battle-sprite";
    enemySpriteEl.className = "battle-sprite";
    playerSpriteEl.innerHTML = renderAnimalSVG(sp, { size: 84, evolved });
    enemySpriteEl.innerHTML = renderAnimalSVG(enemySp, { size: 84 });
    playerNameEl.textContent = evolved ? sp.evoNaam : sp.naam;
    enemyNameEl.textContent = "Wild " + enemySp.naam;
    updateBattleBars();
    battleLog.textContent = `Een wild(e) ${enemySp.naam} daagt je uit! Tik op "Aanval!"`;
    btnAttack.disabled = false;
    battlePicker.classList.add("hidden");
    battleArena.classList.remove("hidden");
  }

  function updateBattleBars() {
    const pPct = Math.max(0, (battle.playerHp / battle.playerMaxHp) * 100);
    const ePct = Math.max(0, (battle.enemyHp / battle.enemyMaxHp) * 100);
    playerHpEl.style.width = pPct + "%";
    enemyHpEl.style.width = ePct + "%";
    playerHpEl.classList.toggle("low", pPct < 30);
    enemyHpEl.classList.toggle("low", ePct < 30);
  }

  btnAttack.addEventListener("click", () => {
    if (!battle || battle.over) return;
    const thisBattle = battle; // vangt eventuele nog-lopende setTimeouts op als deze battle intussen verlaten wordt
    btnAttack.disabled = true;
    const dmg = Math.max(3, battle.playerAtk + Math.floor(Math.random() * 5) - 2);
    battle.enemyHp = Math.max(0, battle.enemyHp - dmg);
    attackSfxFor(battle.sp)();
    playerSpriteEl.classList.remove(battle.playerAttackClass); void playerSpriteEl.offsetWidth; playerSpriteEl.classList.add(battle.playerAttackClass);
    setTimeout(() => {
      if (battle !== thisBattle) return;
      enemySpriteEl.classList.remove("hit"); void enemySpriteEl.offsetWidth; enemySpriteEl.classList.add("hit"); Audio.SFX.raak();
    }, 200);
    updateBattleBars();
    battleLog.textContent = `${playerNameEl.textContent} valt aan! -${dmg} HP`;

    if (battle.enemyHp <= 0) {
      endBattle(true);
      return;
    }

    setTimeout(() => {
      if (battle !== thisBattle) return;
      const edmg = Math.max(2, battle.enemyAtk + Math.floor(Math.random() * 4) - 1);
      battle.playerHp = Math.max(0, battle.playerHp - edmg);
      attackSfxFor(battle.enemySp)();
      enemySpriteEl.classList.remove(battle.enemyAttackClass); void enemySpriteEl.offsetWidth; enemySpriteEl.classList.add(battle.enemyAttackClass);
      setTimeout(() => {
        if (battle !== thisBattle) return;
        playerSpriteEl.classList.remove("hit"); void playerSpriteEl.offsetWidth; playerSpriteEl.classList.add("hit");
      }, 200);
      updateBattleBars();
      battleLog.textContent = `${enemyNameEl.textContent} valt terug aan! -${edmg} HP`;

      if (battle.playerHp <= 0) {
        endBattle(false);
      } else {
        btnAttack.disabled = false;
      }
    }, 900);
  });

  function endBattle(won) {
    battle.over = true;
    btnAttack.disabled = true;
    if (won) {
      const reward = 15 + Math.floor(Math.random() * 10);
      battleLog.textContent = `Gewonnen! 🏆 Je krijgt ${reward} XP!`;
      Audio.SFX.overwinning();
      Audio.vibrate([30, 40, 30, 40, 60]);
      addXP(reward);
    } else {
      battleLog.textContent = `Bijna! ${playerNameEl.textContent} is heel moe. Probeer het nog eens! 💪`;
    }
  }

  btnBattleExit.addEventListener("click", () => {
    Audio.SFX.klik();
    battle = null;
    renderBattlePicker();
  });

  // ---------------------------------------------------------------- splash
  const splashOverlay = document.getElementById("splash-overlay");
  setTimeout(() => splashOverlay.classList.add("hidden"), 1300);

  // ---------------------------------------------------------------- welkomstscherm
  const welcomeOverlay = document.getElementById("welcome-overlay");
  const welcomeStart = document.getElementById("welcome-start");
  if (state.seenWelcome) welcomeOverlay.classList.add("hidden");
  welcomeStart.addEventListener("click", () => {
    Audio.unlock();
    state.seenWelcome = true;
    saveState();
    welcomeOverlay.classList.add("hidden");
  });

  // ---------------------------------------------------------------- init
  updateHud();

  // ---------------------------------------------------------------- service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/dierenspel/sw.js", { scope: "/dierenspel/" })
        .catch(() => { /* offline-registratie mislukt, negeer */ });
    });
  }
})();
