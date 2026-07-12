/* Procedurele geluidseffecten via WebAudio — geen externe bestanden, werkt altijd offline. */
(function (global) {
  "use strict";

  let ctx = null;
  let muted = false;

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, duration, type, gainPeak, glideTo) {
    const c = ensureCtx();
    if (!c || muted) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, c.currentTime + start);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, c.currentTime + start + duration);
    gain.gain.setValueAtTime(0, c.currentTime + start);
    gain.gain.linearRampToValueAtTime(gainPeak || 0.2, c.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime + start);
    osc.stop(c.currentTime + start + duration + 0.05);
  }

  const SFX = {
    tik() { tone(520, 0, 0.08, "sine", 0.12); },
    spawn() {
      tone(660, 0, 0.12, "triangle", 0.18, 880);
      tone(880, 0.1, 0.14, "triangle", 0.16, 1100);
    },
    worp() { tone(300, 0, 0.15, "square", 0.15, 500); },
    mis() { tone(260, 0, 0.16, "sine", 0.12, 130); },
    wobble() { tone(220, 0, 0.1, "sine", 0.12, 260); },
    gevangen() {
      tone(523, 0, 0.12, "triangle", 0.2);
      tone(659, 0.1, 0.12, "triangle", 0.2);
      tone(784, 0.2, 0.12, "triangle", 0.2);
      tone(1046, 0.32, 0.22, "triangle", 0.22);
    },
    levelup() {
      tone(392, 0, 0.1, "square", 0.15);
      tone(523, 0.09, 0.1, "square", 0.15);
      tone(659, 0.18, 0.1, "square", 0.15);
      tone(784, 0.27, 0.24, "square", 0.18);
    },
    aanval() { tone(180, 0, 0.12, "sawtooth", 0.18, 90); },
    raak() { tone(140, 0, 0.15, "square", 0.2, 60); },
    overwinning() {
      [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.09, 0.16, "triangle", 0.2));
    },
    klik() { tone(700, 0, 0.05, "sine", 0.1); },
  };

  // Aanvalsgeluid per archetype — geeft elk dier een eigen "stem" in gevecht.
  // De inslag/hit-reactie (SFX.raak) blijft voor iedereen gelijk.
  const ARCHETYPE_ATTACK_SFX = {
    rond() { tone(200, 0, 0.14, "square", 0.18, 320); },
    hupper() { tone(500, 0, 0.08, "triangle", 0.18, 700); tone(700, 0.07, 0.1, "triangle", 0.16, 500); },
    langnek() { tone(340, 0, 0.16, "sawtooth", 0.16, 220); },
    stekelig() { tone(600, 0, 0.06, "square", 0.2, 900); tone(900, 0.05, 0.08, "square", 0.16, 400); },
    vliegend() { tone(880, 0, 0.14, "sine", 0.16, 260); },
    schelp() { tone(240, 0, 0.07, "square", 0.2, 180); },
    zwem() { tone(420, 0, 0.16, "sine", 0.16, 180); },
  };

  function setMuted(v) {
    muted = v;
  }

  function isMuted() {
    return muted;
  }

  function vibrate(pattern) {
    if (muted) return;
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) { /* niet ondersteund */ }
    }
  }

  global.DierenAudio = { SFX, ARCHETYPE_ATTACK_SFX, setMuted, isMuted, vibrate, unlock: ensureCtx };
})(window);
