/* Vaste (niet-GPS) wereldkaart: afmetingen, decor en een wandelpad. Seeded, dus altijd gelijk. */
(function (global) {
  "use strict";

  const WORLD_W = 2200;
  const WORLD_H = 2600;
  const START = { x: WORLD_W / 2, y: WORLD_H - 220 };

  function mulberry32(seed) {
    let a = seed;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(20260710);

  // Slingerend pad van onder naar boven (Catmull-Rom achtige controlepunten).
  const pathPoints = [
    { x: WORLD_W * 0.5, y: WORLD_H - 60 },
    { x: WORLD_W * 0.42, y: WORLD_H - 420 },
    { x: WORLD_W * 0.62, y: WORLD_H - 760 },
    { x: WORLD_W * 0.38, y: WORLD_H - 1120 },
    { x: WORLD_W * 0.55, y: WORLD_H - 1480 },
    { x: WORLD_W * 0.30, y: WORLD_H - 1820 },
    { x: WORLD_W * 0.5, y: WORLD_H - 2150 },
    { x: WORLD_W * 0.5, y: 120 },
  ];

  const waterPools = [
    { x: WORLD_W * 0.78, y: WORLD_H - 700, rx: 190, ry: 130 },
    { x: WORLD_W * 0.18, y: WORLD_H - 1650, rx: 150, ry: 100 },
  ];

  // Korte zijpaadjes, puur decoratief — tikken-om-te-lopen werkt overal al, dus dit
  // voegt geen eigen looplogica toe, alleen een extra streep op de kaart.
  const sidePaths = [
    [{ x: WORLD_W * 0.42, y: WORLD_H - 420 }, { x: WORLD_W * 0.24, y: WORLD_H - 480 }, { x: WORLD_W * 0.14, y: WORLD_H - 580 }],
    [{ x: WORLD_W * 0.55, y: WORLD_H - 1480 }, { x: WORLD_W * 0.74, y: WORLD_H - 1540 }, { x: WORLD_W * 0.84, y: WORLD_H - 1640 }],
  ];

  function nearPath(x, y, minDist) {
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const a = pathPoints[i], b = pathPoints[i + 1];
      const steps = 12;
      for (let s = 0; s <= steps; s++) {
        const px = a.x + (b.x - a.x) * (s / steps);
        const py = a.y + (b.y - a.y) * (s / steps);
        if (Math.hypot(px - x, py - y) < minDist) return true;
      }
    }
    return false;
  }

  function nearWater(x, y, pad) {
    return waterPools.some((w) => {
      const dx = (x - w.x) / (w.rx + pad);
      const dy = (y - w.y) / (w.ry + pad);
      return dx * dx + dy * dy < 1;
    });
  }

  function scatter(count, kind, sizeRange, opts) {
    opts = opts || {};
    const out = [];
    let guard = 0;
    while (out.length < count && guard < count * 20) {
      guard++;
      const x = 60 + rand() * (WORLD_W - 120);
      const y = 60 + rand() * (WORLD_H - 120);
      if (nearPath(x, y, opts.pathClear || 70)) continue;
      if (nearWater(x, y, opts.waterClear || 40)) continue;
      const size = sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0]);
      out.push({ type: kind, x, y, size, layer: y < WORLD_H * 0.55 ? "back" : "front" });
    }
    return out;
  }

  const flowerColors = ["#ff6b8a", "#ffcf4d", "#a06bff", "#ff9a4d", "#5ecbff"];

  const deco = [
    ...scatter(46, "tree", [70, 130]),
    ...scatter(22, "rock", [26, 46], { pathClear: 55 }),
    ...scatter(30, "bush", [30, 54], { pathClear: 55 }),
    ...scatter(70, "flower", [10, 16], { pathClear: 40 }).map((f) => ({
      ...f,
      color: flowerColors[Math.floor(rand() * flowerColors.length)],
    })),
  ];

  const butterflySpots = scatter(7, "butterfly", [1, 1], { pathClear: 30 });
  const discoverySpots = scatter(3, "discovery", [1, 1], { pathClear: 60, waterClear: 60 });

  global.DierenWereld = {
    WORLD_W, WORLD_H, START, pathPoints, sidePaths, waterPools, deco, butterflySpots, discoverySpots, nearWater,
  };
})(window);
