/* Diervangspel — hoofd-game engine. Puur vanilla JS, geen build-stap, alles lokaal. */
(function () {
  "use strict";

  const { SPECIES, RARITY_LABEL, renderAnimalSVG } = window.DierenData;
  const { WORLD_W, WORLD_H, START, pathPoints, waterPools, deco, butterflySpots } = window.DierenWereld;
  const Audio = window.DierenAudio;

  const STORAGE_KEY = "dierenspel_state_v1";
  const RARITY_WEIGHT = { gewoon: 60, bijzonder: 30, zeldzaam: 12 };
  const RARITY_XP = { gewoon: 10, bijzonder: 18, zeldzaam: 28 };
  const MAX_ACTIVE_CRITTERS = 4;

  // ---------------------------------------------------------------- state
  function defaultState() {
    return { caught: {}, xp: 0, level: 1, muted: false, seenWelcome: false };
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
      showBanner(`Niveau omhoog! Niveau ${state.level} 🎉`, 2400);
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
  const spawnBanner = document.getElementById("spawn-banner");
  let bannerTimer = null;

  function updateHud() {
    hudLevel.textContent = `Niveau ${state.level}`;
    const pct = Math.min(100, (state.xp / xpForLevel(state.level)) * 100);
    hudXpFill.style.width = pct + "%";
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
    if (id === "screen-collection") renderCollection();
    if (id === "screen-battle") renderBattlePicker();
  }
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => { Audio.SFX.klik(); showScreen(btn.dataset.screen); });
  });

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
    `;
    worldDeco.appendChild(svg);
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
  }
  renderDeco();

  // ---------------------------------------------------------------- camera + speler
  let camX = 0, camY = 0, vw = 0, vh = 0;
  const player = { x: START.x, y: START.y, target: null, speed: 260, walking: false };

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
  }

  function screenToWorld(clientX, clientY) {
    const r = viewportEl.getBoundingClientRect();
    return { x: clamp(camX + (clientX - r.left), 0, WORLD_W), y: clamp(camY + (clientY - r.top), 0, WORLD_H) };
  }

  viewportEl.addEventListener("click", (ev) => {
    Audio.unlock();
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

  function weightedRandomSpecies() {
    const total = SPECIES.reduce((sum, s) => sum + RARITY_WEIGHT[s.rarity], 0);
    let r = Math.random() * total;
    for (const s of SPECIES) {
      r -= RARITY_WEIGHT[s.rarity];
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

  function spawnCritterAt(species, x, y, opts) {
    opts = opts || {};
    const id = "c" + (++critterUid);
    const el = document.createElement("div");
    el.className = "critter entering";
    el.dataset.instanceId = id;
    const evolved = false;
    el.innerHTML = `<div class="critter-shadow"></div><div class="critter-sprite">${renderAnimalSVG(species, { size: 64, evolved })}</div>`;
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
    return { x, y, inwardTarget: { x: targetX, y: targetY } };
  }

  function spawnLoop() {
    if (Object.keys(activeCritters).length < MAX_ACTIVE_CRITTERS) {
      const species = weightedRandomSpecies();
      const spot = pickEdgeSpawn();
      spawnCritterAt(species, spot.x, spot.y, { announce: true, inwardTarget: spot.inwardTarget });
    }
    setTimeout(spawnLoop, 10000 + Math.random() * 10000);
  }
  setTimeout(spawnLoop, 3000);

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

  function updateCritters(dt, now) {
    for (const id in activeCritters) {
      const c = activeCritters[id];
      if (now > c.expiresAt && !c.entering) { removeCritter(id, false); continue; }
      if (c.target) {
        const dx = c.target.x - c.x, dy = c.target.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 4) {
          c.target = null;
          c.entering = false;
          c.speed = 34;
          c.anchorX = c.x; c.anchorY = c.y;
          c.nextWanderAt = now + 1500 + Math.random() * 2500;
        } else {
          const step = Math.min(dist, c.speed * dt);
          c.x += (dx / dist) * step;
          c.y += (dy / dist) * step;
        }
      } else if (now >= c.nextWanderAt) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 70;
        c.target = {
          x: clamp(c.anchorX + Math.cos(angle) * dist, 20, WORLD_W - 20),
          y: clamp(c.anchorY + Math.sin(angle) * dist, 20, WORLD_H - 20),
        };
      }
      c.el.style.left = c.x + "px";
      c.el.style.top = c.y + "px";
      c.el.style.zIndex = String(Math.round(c.y));
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
  const catchBallEl = document.getElementById("catch-ball");
  const catchHint = document.getElementById("catch-hint");
  const catchResult = document.getElementById("catch-result");
  const catchResultTitle = document.getElementById("catch-result-title");
  const catchResultSub = document.getElementById("catch-result-sub");
  const catchContinueBtn = document.getElementById("catch-continue");

  let catchState = null;
  let ballDrag = null;
  const THROW_MIN_DISTANCE = 55;

  function getCenter(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function resetBallToRest() {
    catchBallEl.classList.remove("dragging", "flying", "wobble-anim");
    catchBallEl.style.transition = "none";
    catchBallEl.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
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
    catchState = { inst, tapsDone: 0, tapsNeeded: inst.species.vangKeer, busy: false };
    catchCritterEl.className = "catch-critter";
    catchCritterEl.innerHTML = renderAnimalSVG(inst.species, { size: 128 });
    catchTargetRing.className = "catch-target-ring rarity-" + inst.species.rarity;
    catchImpactFlash.classList.remove("show");
    resetBallToRest();
    catchHint.textContent = "Sleep de bal naar de cirkel om te gooien!";
    catchResult.classList.add("hidden");
    catchOverlay.classList.remove("hidden");
  }

  function closeCatchOverlay() {
    catchOverlay.classList.add("hidden");
  }

  catchBallEl.addEventListener("pointerdown", (ev) => {
    if (!catchState || catchState.busy) return;
    Audio.unlock();
    catchBallEl.setPointerCapture(ev.pointerId);
    catchBallEl.classList.add("dragging");
    ballDrag = {
      grabX: ev.clientX - getCenter(catchBallEl).x,
      grabY: ev.clientY - getCenter(catchBallEl).y,
      restCenter: getCenter(catchBallEl),
      curX: 0, curY: 0,
    };
  });

  catchBallEl.addEventListener("pointermove", (ev) => {
    if (!ballDrag) return;
    const targetCenterX = ev.clientX - ballDrag.grabX;
    const targetCenterY = ev.clientY - ballDrag.grabY;
    ballDrag.curX = targetCenterX - ballDrag.restCenter.x;
    ballDrag.curY = targetCenterY - ballDrag.restCenter.y;
    catchBallEl.style.transform = `translate(${ballDrag.curX}px, ${ballDrag.curY}px)`;
  });

  function endBallDrag() {
    if (!ballDrag || !catchState || catchState.busy) { ballDrag = null; return; }
    const drag = ballDrag;
    ballDrag = null;
    catchBallEl.classList.remove("dragging");

    const validThrow = -drag.curY > THROW_MIN_DISTANCE;
    if (!validThrow) {
      catchHint.textContent = "Til de bal op en gooi hem in de cirkel! 💪";
      catchBallEl.style.transition = "transform 0.4s cubic-bezier(.3,-0.3,.6,1.4)";
      catchBallEl.style.transform = "translate(0px, 0px)";
      setTimeout(() => { if (!ballDrag) catchBallEl.style.transition = "none"; }, 420);
      return;
    }
    throwBallAlongArc(drag);
  }
  catchBallEl.addEventListener("pointerup", endBallDrag);
  catchBallEl.addEventListener("pointercancel", endBallDrag);

  function throwBallAlongArc(drag) {
    catchState.busy = true;
    catchBallEl.classList.add("flying");
    Audio.SFX.worp();

    const start = { x: drag.curX, y: drag.curY };
    const critterCenter = getCenter(catchCritterEl);
    const end = {
      x: critterCenter.x - drag.restCenter.x,
      y: critterCenter.y - drag.restCenter.y,
    };
    const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 90 };

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
      else onBallImpact();
    }
    requestAnimationFrame(frame);
  }

  function onBallImpact() {
    catchImpactFlash.classList.remove("show"); void catchImpactFlash.offsetWidth; catchImpactFlash.classList.add("show");
    catchTargetRing.classList.add("burst");
    catchCritterEl.classList.add("impact");
    Audio.SFX.raak();
    Audio.vibrate(15);

    setTimeout(() => {
      catchState.tapsDone += 1;
      catchBallEl.classList.add("wobble-anim");
      Audio.SFX.wobble();
      Audio.vibrate(20);

      setTimeout(() => {
        if (catchState.tapsDone >= catchState.tapsNeeded) {
          setTimeout(() => finishCatch(true), 200);
        } else {
          resetBallToRest();
          catchTargetRing.classList.remove("burst"); void catchTargetRing.offsetWidth;
          catchTargetRing.classList.remove("rarity-bijzonder", "rarity-zeldzaam");
          catchTargetRing.classList.add("rarity-" + catchState.inst.species.rarity);
          catchCritterEl.classList.remove("impact");
          catchHint.textContent = "Bijna! Gooi nog een keer! 💪";
          catchState.busy = false;
        }
      }, 650);
    }, 260);
  }

  function burstConfetti(container, count) {
    const colors = ["#ff6b8a", "#ffcf4d", "#33b06b", "#3aa0e0", "#a06bff", "#ff9a4d"];
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
    const inst = catchState.inst;
    if (success) {
      Audio.SFX.gevangen();
      Audio.vibrate([30, 50, 30, 50, 60]);
      burstConfetti(catchOverlay, 30);
      const res = addCaught(inst.species.id);
      catchResultTitle.textContent = "Gevangen! 🎉";
      let sub = `${inst.species.naam} — ${res.isFirst ? "Nieuw in je verzameling!" : `Je hebt er nu ${res.entry.count}!`}`;
      if (res.evolvedNow) sub += ` ✨ Ge-evolueerd naar ${inst.species.evoNaam}!`;
      catchResultSub.textContent = sub;
      catchResult.classList.remove("hidden");
      removeCritter(inst.id, true);
    }
  }

  catchContinueBtn.addEventListener("click", () => {
    closeCatchOverlay();
    catchState = null;
  });

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
          <div class="thumb">${renderAnimalSVG(sp, { size: 56, evolved: owned.evolved })}</div>
          <div class="name">${owned.evolved ? sp.evoNaam : sp.naam}</div>
          <div class="count-badge">x${owned.count}</div>
        `;
      } else {
        card.innerHTML = `<div class="thumb"><div class="qmark">?</div></div><div class="name">???</div>`;
      }
      card.addEventListener("click", () => openDetail(sp, owned));
      collectionGrid.appendChild(card);
    });
    collectionProgress.textContent = `${found} van ${SPECIES.length} gevonden`;
  }

  // ---------------------------------------------------------------- detail-modal
  const detailModal = document.getElementById("detail-modal");
  const detailSprite = document.getElementById("detail-sprite");
  const detailName = document.getElementById("detail-name");
  const detailMeta = document.getElementById("detail-meta");
  const detailBlurb = document.getElementById("detail-blurb");
  document.getElementById("detail-close").addEventListener("click", () => detailModal.classList.add("hidden"));

  function openDetail(sp, owned) {
    Audio.SFX.klik();
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

  // ---------------------------------------------------------------- gevecht
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
    };

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
    btnAttack.disabled = true;
    const dmg = Math.max(3, battle.playerAtk + Math.floor(Math.random() * 5) - 2);
    battle.enemyHp = Math.max(0, battle.enemyHp - dmg);
    Audio.SFX.aanval();
    playerSpriteEl.classList.remove("attack"); void playerSpriteEl.offsetWidth; playerSpriteEl.classList.add("attack");
    setTimeout(() => { enemySpriteEl.classList.remove("hit"); void enemySpriteEl.offsetWidth; enemySpriteEl.classList.add("hit"); Audio.SFX.raak(); }, 200);
    updateBattleBars();
    battleLog.textContent = `${playerNameEl.textContent} valt aan! -${dmg} HP`;

    if (battle.enemyHp <= 0) {
      endBattle(true);
      return;
    }

    setTimeout(() => {
      const edmg = Math.max(2, battle.enemyAtk + Math.floor(Math.random() * 4) - 1);
      battle.playerHp = Math.max(0, battle.playerHp - edmg);
      enemySpriteEl.classList.remove("attack"); void enemySpriteEl.offsetWidth; enemySpriteEl.classList.add("attack");
      setTimeout(() => { playerSpriteEl.classList.remove("hit"); void playerSpriteEl.offsetWidth; playerSpriteEl.classList.add("hit"); }, 200);
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
