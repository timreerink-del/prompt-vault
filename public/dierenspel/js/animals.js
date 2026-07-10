/* Dierendata + SVG-tekenaar. 12 originele, zelfbedachte diertjes. Geen externe assets nodig. */
(function (global) {
  "use strict";

  // Archetypes bepalen de lichaamsvorm; kleuren/accessoires maken elke soort uniek.
  const SPECIES = [
    {
      id: "blaadjopper",
      naam: "Blaadjopper",
      evoNaam: "Bladpluisser",
      archetype: "hupper",
      kleur: { licht: "#b6ef7a", donker: "#5fae2e", accent: "#e8fcb0", buik: "#f3ffe0" },
      habitat: "Grasveld",
      rarity: "gewoon",
      hp: 22, atk: 5,
      vangKeer: 1,
      evolveBij: 3,
      blurb: "Springt graag door hoog gras en ritselt met blaadjes op zijn rug.",
    },
    {
      id: "poelslakkie",
      naam: "Poelslakkie",
      evoNaam: "Poelslakking",
      archetype: "schelp",
      kleur: { licht: "#8fd7ff", donker: "#2f8fd0", accent: "#ffd97a", buik: "#eaf9ff" },
      habitat: "Bij het water",
      rarity: "gewoon",
      hp: 20, atk: 4,
      vangKeer: 1,
      evolveBij: 3,
      blurb: "Draagt een spiraalhuisje en laat kleine belletjes los als hij lacht.",
    },
    {
      id: "takkeltje",
      naam: "Takkeltje",
      evoNaam: "Takkelaar",
      archetype: "langnek",
      kleur: { licht: "#ffcf8a", donker: "#e08a2e", accent: "#8a5a2e", buik: "#fff3dd" },
      habitat: "Bos",
      rarity: "bijzonder",
      hp: 26, atk: 7,
      vangKeer: 2,
      evolveBij: 3,
      blurb: "Heeft een lange nek om de lekkerste blaadjes helemaal bovenin te pakken.",
    },
    {
      id: "steenrolfje",
      naam: "Steenrolfje",
      evoNaam: "Steenrolfer",
      archetype: "rond",
      kleur: { licht: "#cbb6a3", donker: "#8a6a53", accent: "#efe3d4", buik: "#f6ede2" },
      habitat: "Rotsen",
      rarity: "gewoon",
      hp: 28, atk: 6,
      vangKeer: 1,
      evolveBij: 3,
      blurb: "Rolt zich op tot een balletje en rolt heuvels af voor de lol.",
    },
    {
      id: "wolkfladder",
      naam: "Wolkfladder",
      evoNaam: "Wolkfladderaar",
      archetype: "vliegend",
      kleur: { licht: "#ffb3e6", donker: "#d259b0", accent: "#fff2fb", buik: "#fff0fa" },
      habitat: "Lucht",
      rarity: "bijzonder",
      hp: 18, atk: 6,
      vangKeer: 2,
      evolveBij: 3,
      blurb: "Fladdert zachtjes tussen de wolken en laat een sprankelspoor achter.",
    },
    {
      id: "vuurstip",
      naam: "Vuurstip",
      evoNaam: "Vuurstippel",
      archetype: "stekelig",
      kleur: { licht: "#ff9a5a", donker: "#e2531c", accent: "#ffe3b0", buik: "#fff0dd" },
      habitat: "Zandpad",
      rarity: "bijzonder",
      hp: 24, atk: 8,
      vangKeer: 2,
      evolveBij: 3,
      blurb: "Zijn stekeltjes gloeien zachtjes op als hij blij is.",
    },
    {
      id: "ijswaggel",
      naam: "IJswaggel",
      evoNaam: "IJswaggelaar",
      archetype: "hupper",
      kleur: { licht: "#c9f0ff", donker: "#5cb6dd", accent: "#ffffff", buik: "#f2fcff" },
      habitat: "Koele plekjes",
      rarity: "zeldzaam",
      hp: 30, atk: 7,
      vangKeer: 3,
      evolveBij: 3,
      blurb: "Waggelt grappig heen en weer en houdt van koude ijsjes.",
    },
    {
      id: "mosselmops",
      naam: "Mosselmops",
      evoNaam: "Mosselmopper",
      archetype: "schelp",
      kleur: { licht: "#b7a6ff", donker: "#6a4fd6", accent: "#ffd6f0", buik: "#f1ecff" },
      habitat: "Oever",
      rarity: "gewoon",
      hp: 21, atk: 5,
      vangKeer: 1,
      evolveBij: 3,
      blurb: "Heeft een rimpelig snuitje en houdt zijn schelp altijd blinkend schoon.",
    },
    {
      id: "fluisterhert",
      naam: "Fluisterhert",
      evoNaam: "Fluisterhertog",
      archetype: "langnek",
      kleur: { licht: "#e8c9a8", donker: "#a9744a", accent: "#fff6ea", buik: "#fbf0e2" },
      habitat: "Diep bos",
      rarity: "zeldzaam",
      hp: 27, atk: 9,
      vangKeer: 3,
      evolveBij: 3,
      blurb: "Heeft een klein gewei en fluistert zachtjes als hij dichtbij komt.",
    },
    {
      id: "zandhupper",
      naam: "Zandhupper",
      evoNaam: "Zandhopser",
      archetype: "hupper",
      kleur: { licht: "#ffe07a", donker: "#e0a020", accent: "#fff6d0", buik: "#fff8e2" },
      habitat: "Zandpad",
      rarity: "gewoon",
      hp: 20, atk: 5,
      vangKeer: 1,
      evolveBij: 3,
      blurb: "Hupt met grote sprongen en laat kleine stofwolkjes achter.",
    },
    {
      id: "glimvis",
      naam: "Glimvis",
      evoNaam: "Glimvisser",
      archetype: "zwem",
      kleur: { licht: "#7af0e0", donker: "#1f9e94", accent: "#e3fffb", buik: "#eafffb" },
      habitat: "Water",
      rarity: "bijzonder",
      hp: 23, atk: 6,
      vangKeer: 2,
      evolveBij: 3,
      blurb: "Zijn schubben glinsteren als kleine spiegeltjes in de zon.",
    },
    {
      id: "dromedrol",
      naam: "Dromedrol",
      evoNaam: "Dromedrolletje",
      archetype: "vliegend",
      kleur: { licht: "#d8c9ff", donker: "#8a6ae0", accent: "#fff8ff", buik: "#f4efff" },
      habitat: "Boven de wei",
      rarity: "zeldzaam",
      hp: 25, atk: 8,
      vangKeer: 3,
      evolveBij: 3,
      blurb: "Zweeft rustig rond en strooit slaperige sterrenstofjes uit.",
    },
  ];

  const RARITY_LABEL = { gewoon: "Gewoon", bijzonder: "Bijzonder", zeldzaam: "Zeldzaam" };

  let uidCounter = 0;
  function uid(prefix) {
    uidCounter += 1;
    return prefix + uidCounter;
  }

  function svgOpen(size) {
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
  }

  function grad(id, c1, c2, cx, cy, r) {
    return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </radialGradient>`;
  }

  function face(cx, cy, spread, opts) {
    opts = opts || {};
    const eyeR = opts.eyeR || 3.4;
    const happy = opts.happy !== false;
    return `
      <ellipse cx="${cx - spread}" cy="${cy + spread * 0.55}" rx="3.4" ry="2.6" fill="#ffb3ad" opacity="0.75"/>
      <ellipse cx="${cx + spread}" cy="${cy + spread * 0.55}" rx="3.4" ry="2.6" fill="#ffb3ad" opacity="0.75"/>
      <circle cx="${cx - spread}" cy="${cy}" r="${eyeR}" fill="#3a2b25"/>
      <circle cx="${cx + spread}" cy="${cy}" r="${eyeR}" fill="#3a2b25"/>
      <circle cx="${cx - spread + 1.1}" cy="${cy - 1.1}" r="1.1" fill="#fff"/>
      <circle cx="${cx + spread + 1.1}" cy="${cy - 1.1}" r="1.1" fill="#fff"/>
      <path d="M ${cx - 2.6} ${cy + spread * 0.9} Q ${cx} ${cy + spread * 0.9 + (happy ? 3 : 0.5)} ${cx + 2.6} ${cy + spread * 0.9}"
            stroke="#3a2b25" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    `;
  }

  function shadowEllipse(cx, cy, rx, ry) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#14351f" opacity="0.22"/>`;
  }

  function sparkleAccessory(cx, cy) {
    return `<g opacity="0.9">
      <path d="M ${cx} ${cy - 4} L ${cx + 1.1} ${cy - 1.1} L ${cx + 4} ${cy} L ${cx + 1.1} ${cy + 1.1} L ${cx} ${cy + 4} L ${cx - 1.1} ${cy + 1.1} L ${cx - 4} ${cy} L ${cx - 1.1} ${cy - 1.1} Z"
            fill="#fff6c9"/>
    </g>`;
  }

  function bodyGradientBlob(gid, cx, cy, rx, ry) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${gid})"/>`;
  }

  // Elk archetype tekent zijn eigen silhouet + accessoires; kleuren komen uit species.kleur.
  const ARCHETYPES = {
    rond(sp, evolved) {
      const gid = uid("g");
      const s = evolved ? 1.08 : 1;
      const defs = grad(gid, sp.kleur.licht, sp.kleur.donker, 0.38, 0.32, 0.75);
      return `${defs}
        ${shadowEllipse(50, 82, 26 * s, 6)}
        <ellipse cx="50" cy="52" rx="${30 * s}" ry="6" fill="${sp.kleur.donker}" opacity="0.18"/>
        <ellipse cx="47" cy="41" rx="${8 * s}" ry="${6 * s}" fill="${sp.kleur.donker}"/>
        <ellipse cx="53" cy="41" rx="${8 * s}" ry="${6 * s}" fill="${sp.kleur.donker}"/>
        <ellipse cx="47" cy="42" rx="${5 * s}" ry="${3.6 * s}" fill="${sp.kleur.buik}"/>
        <ellipse cx="53" cy="42" rx="${5 * s}" ry="${3.6 * s}" fill="${sp.kleur.buik}"/>
        ${bodyGradientBlob(gid, 50, 55, 28 * s, 25 * s)}
        <ellipse cx="50" cy="66" rx="${16 * s}" ry="${10 * s}" fill="${sp.kleur.buik}"/>
        <ellipse cx="38" cy="46" rx="8" ry="5" fill="#fff" opacity="0.35"/>
        ${face(50, 55, 8)}
        ${evolved ? sparkleAccessory(74, 34) : ""}
      `;
    },
    hupper(sp, evolved) {
      const gid = uid("g");
      const s = evolved ? 1.1 : 1;
      const defs = grad(gid, sp.kleur.licht, sp.kleur.donker, 0.38, 0.32, 0.75);
      return `${defs}
        ${shadowEllipse(50, 84, 24 * s, 5.5)}
        <ellipse cx="34" cy="72" rx="${8 * s}" ry="${13 * s}" fill="${sp.kleur.donker}"/>
        <ellipse cx="66" cy="72" rx="${8 * s}" ry="${13 * s}" fill="${sp.kleur.donker}"/>
        <ellipse cx="41" cy="36" rx="${5.5 * s}" ry="${11 * s}" fill="${sp.kleur.licht}" transform="rotate(-12 41 36)"/>
        <ellipse cx="59" cy="36" rx="${5.5 * s}" ry="${11 * s}" fill="${sp.kleur.licht}" transform="rotate(12 59 36)"/>
        <ellipse cx="41" cy="38" rx="3" ry="7" fill="${sp.kleur.buik}" transform="rotate(-12 41 38)"/>
        <ellipse cx="59" cy="38" rx="3" ry="7" fill="${sp.kleur.buik}" transform="rotate(12 59 38)"/>
        ${bodyGradientBlob(gid, 50, 58, 24 * s, 22 * s)}
        <ellipse cx="50" cy="68" rx="${13 * s}" ry="${9 * s}" fill="${sp.kleur.buik}"/>
        <ellipse cx="40" cy="50" rx="6" ry="4" fill="#fff" opacity="0.35"/>
        ${face(50, 58, 7)}
        ${evolved ? sparkleAccessory(72, 46) : ""}
      `;
    },
    langnek(sp, evolved) {
      const gid = uid("g");
      const s = evolved ? 1.08 : 1;
      const defs = grad(gid, sp.kleur.licht, sp.kleur.donker, 0.4, 0.3, 0.7);
      return `${defs}
        ${shadowEllipse(50, 86, 20, 5)}
        <ellipse cx="50" cy="72" rx="${17 * s}" ry="${13 * s}" fill="url(#${gid})"/>
        <ellipse cx="50" cy="78" rx="${9 * s}" ry="${5 * s}" fill="${sp.kleur.buik}"/>
        <path d="M 46 62 Q 40 42 45 26" stroke="${sp.kleur.donker}" stroke-width="${9 * s}" fill="none" stroke-linecap="round"/>
        <path d="M 46 62 Q 40 42 45 26" stroke="url(#${gid})" stroke-width="${7 * s}" fill="none" stroke-linecap="round"/>
        <ellipse cx="45" cy="22" rx="${9 * s}" ry="${8 * s}" fill="url(#${gid})"/>
        ${evolved ? `<path d="M 40 16 L 38 8" stroke="${sp.kleur.donker}" stroke-width="2" stroke-linecap="round"/>
                     <path d="M 50 16 L 52 8" stroke="${sp.kleur.donker}" stroke-width="2" stroke-linecap="round"/>` : `
                     <path d="M 41 15 L 40 10" stroke="${sp.kleur.donker}" stroke-width="1.6" stroke-linecap="round"/>
                     <path d="M 49 15 L 50 10" stroke="${sp.kleur.donker}" stroke-width="1.6" stroke-linecap="round"/>`}
        ${face(45, 22, 4.4, { eyeR: 2.6 })}
        ${sp.kleur.accent ? `<circle cx="55" cy="70" r="3" fill="${sp.kleur.accent}" opacity="0.6"/><circle cx="44" cy="76" r="2.2" fill="${sp.kleur.accent}" opacity="0.6"/>` : ""}
        ${evolved ? sparkleAccessory(64, 24) : ""}
      `;
    },
    stekelig(sp, evolved) {
      const gid = uid("g");
      const s = evolved ? 1.08 : 1;
      const defs = grad(gid, sp.kleur.licht, sp.kleur.donker, 0.4, 0.32, 0.7);
      let spikes = "";
      const n = evolved ? 11 : 8;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI / (n - 1)) * i - Math.PI / 2 - Math.PI / 2.4;
        const x1 = 50 + Math.cos(a) * 20 * s;
        const y1 = 46 + Math.sin(a) * 20 * s;
        const x2 = 50 + Math.cos(a) * 30 * s;
        const y2 = 46 + Math.sin(a) * 30 * s;
        spikes += `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${sp.kleur.donker}" stroke-width="4" stroke-linecap="round"/>`;
      }
      return `${defs}
        ${shadowEllipse(50, 82, 24 * s, 5.5)}
        ${spikes}
        ${bodyGradientBlob(gid, 50, 55, 24 * s, 22 * s)}
        <ellipse cx="50" cy="66" rx="${14 * s}" ry="${9 * s}" fill="${sp.kleur.buik}"/>
        <ellipse cx="40" cy="48" rx="6" ry="4" fill="#fff" opacity="0.35"/>
        ${face(50, 55, 7)}
        ${evolved ? sparkleAccessory(74, 30) : ""}
      `;
    },
    vliegend(sp, evolved) {
      const gid = uid("g");
      const s = evolved ? 1.1 : 1;
      const defs = grad(gid, sp.kleur.licht, sp.kleur.donker, 0.4, 0.3, 0.7);
      const wgid = uid("g");
      const wdefs = grad(wgid, sp.kleur.accent, sp.kleur.licht, 0.5, 0.3, 0.8);
      return `${defs}${wdefs}
        ${shadowEllipse(50, 84, 20 * s, 5)}
        <ellipse cx="27" cy="52" rx="${15 * s}" ry="${10 * s}" fill="url(#${wgid})" opacity="0.92" transform="rotate(-18 27 52)"/>
        <ellipse cx="73" cy="52" rx="${15 * s}" ry="${10 * s}" fill="url(#${wgid})" opacity="0.92" transform="rotate(18 73 52)"/>
        ${bodyGradientBlob(gid, 50, 55, 19 * s, 20 * s)}
        <ellipse cx="50" cy="64" rx="${11 * s}" ry="${8 * s}" fill="${sp.kleur.buik}"/>
        <ellipse cx="43" cy="47" rx="5" ry="3.5" fill="#fff" opacity="0.4"/>
        ${face(50, 54, 6)}
        ${evolved ? sparkleAccessory(50, 24) : ""}
      `;
    },
    schelp(sp, evolved) {
      const gid = uid("g");
      const s = evolved ? 1.08 : 1;
      const defs = grad(gid, sp.kleur.accent, sp.kleur.donker, 0.4, 0.28, 0.75);
      return `${defs}
        ${shadowEllipse(50, 83, 24 * s, 5.5)}
        <ellipse cx="50" cy="70" rx="${18 * s}" ry="${13 * s}" fill="${sp.kleur.licht}"/>
        <path d="M 50 42 C 32 46 28 66 34 78 C 40 70 44 68 50 68 C 56 68 60 70 66 78 C 72 66 68 46 50 42 Z" fill="url(#${gid})"/>
        <path d="M 50 46 L 50 68 M 40 50 L 44 68 M 60 50 L 56 68" stroke="${sp.kleur.donker}" stroke-width="1.4" opacity="0.5" fill="none"/>
        <ellipse cx="50" cy="76" rx="${10 * s}" ry="${6 * s}" fill="${sp.kleur.buik}"/>
        ${face(50, 76, 6.5)}
        ${evolved ? sparkleAccessory(70, 44) : ""}
      `;
    },
    zwem(sp, evolved) {
      const gid = uid("g");
      const s = evolved ? 1.08 : 1;
      const defs = grad(gid, sp.kleur.licht, sp.kleur.donker, 0.4, 0.3, 0.7);
      return `${defs}
        ${shadowEllipse(50, 80, 24 * s, 5)}
        <path d="M 74 50 L 88 38 L 88 62 Z" fill="${sp.kleur.donker}"/>
        <ellipse cx="50" cy="50" rx="${9 * s}" ry="${18 * s}" fill="${sp.kleur.donker}" transform="rotate(90 50 50)"/>
        ${bodyGradientBlob(gid, 46, 50, 26 * s, 17 * s)}
        <path d="M 46 40 Q 30 34 22 40 Q 30 46 46 50 Z" fill="${sp.kleur.accent}" opacity="0.85"/>
        <ellipse cx="50" cy="55" rx="${13 * s}" ry="${8 * s}" fill="${sp.kleur.buik}"/>
        <ellipse cx="34" cy="42" rx="5" ry="3.5" fill="#fff" opacity="0.4"/>
        ${face(32, 48, 4.6, { eyeR: 2.6 })}
        ${evolved ? sparkleAccessory(60, 26) : ""}
      `;
    },
  };

  function renderAnimalSVG(species, options) {
    options = options || {};
    const size = options.size || 96;
    const evolved = !!options.evolved;
    const builder = ARCHETYPES[species.archetype] || ARCHETYPES.rond;
    return svgOpen(size) + `<g>${builder(species, evolved)}</g></svg>`;
  }

  function bySpeciesId(id) {
    return SPECIES.find((s) => s.id === id);
  }

  global.DierenData = { SPECIES, RARITY_LABEL, renderAnimalSVG, bySpeciesId };
})(window);
