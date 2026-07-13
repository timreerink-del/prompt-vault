# Diervangspel — UI/design-audit: van "leuk CSS-spelletje" naar topgame-gevoel

Doel: een kritische analyse van *waarom* het spel nu plat aanvoelt (niet "wat mist er
functioneel" — dat stond al in `dierenspel-backlog.md` en is inmiddels grotendeels
gebouwd), plus een concreet, haalbaar stappenplan binnen de bestaande technische
grenzen (vanilla HTML/CSS/JS/SVG, geen build-stap, offline-first, geen gebundelde
zware assets).

Legenda prioriteit: 🔴 P0 (grootste visuele "wow"-gat) · 🟠 P1 · 🟡 P2 (fijnproeverij)

---

## 0. Het technische plafond — eerst kaderstellen

Voor je iets van dit document aanpakt: dit spel is en blijft **CSS + inline SVG**,
getekend met platte `<radialGradient>`-vullingen (`animals.js` → `grad()`,
`ARCHETYPES`). Dat is een bewuste keuze geweest (geen build-stap, alles offline,
1 HTML-bestand + een paar losse JS/CSS-bestanden die de service worker kan cachen).

Binnen die grenzen kunnen we **een heel eind** komen — SVG-filters
(`feTurbulence`, `feDropShadow`), CSS `backdrop-filter`, gelaagde `box-shadow`,
zelf-gehoste webfonts, en betere keyframe-choreografie zijn allemaal "gratis" (geen
externe dependency, blijft offline). Maar een aantal dingen die een *echte* topgame
(Monument Valley, Alto's Odyssey, Pokémon GO zelf) doet — dynamische belichting die
met de camera meebeweegt, echte 3D-diepte, deeltjes-physics met duizenden particles
— vereist **Canvas/WebGL-rendering**, en dat is geen polish-pass meer maar een
architectuurwissel (een canvas-renderer naast/i.p.v. de huidige DOM-gebaseerde
aanpak). Dat is een bewuste beslissing die je apart moet nemen, niet iets wat "erbij"
gebeurt — zie §7 voor een eerlijke inschatting van wat dat zou kosten.

**Advies: eerst het CSS/SVG-plafond volledig benutten (§1–6 hieronder) voordat je
aan een Canvas-rewrite begint.** Het verschil tussen "flat" en "premium" zit voor
misschien 80% in texture/licht/motion-taal, niet in de rendering-technologie zelf.

---

## 1. Textuur & materiaal — de grootste boosdoener

| # | Titel | Nu | Topgame-referentie | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 1.1 | Elke vulling is een schone 2-stop radiale gradient | `grad()` (`animals.js:177`) bouwt letterlijk `<stop 0%><stop 100%>` — perfect glad, geen enkele onregelmatigheid | Handgeschilderd/genoiset oppervlak: lichte korrel, kleurvariatie binnen één vlak | Voeg een subtiele noise-laag toe via SVG `<feTurbulence>` + `<feColorMatrix>` (gratis, geen asset, werkt offline) als een extra `<filter>` die je over `bodyGradientBlob()` legt — dit is de goedkoopste manier om van "plastic speelgoed" naar "geschilderd oppervlak" te gaan | 🔴 P0 | M |
| 1.2 | Geen rand-licht (rim light) | Sprites hebben alleen een losse witte "highlight"-ellips (`<ellipse ... fill="#fff" opacity="0.35">`) los van de vorm | Een dunne, felle lichtstreep exact langs de silhouetrand aan de lichtzijde | Voeg per archetype een dunne `<path>`-outline toe (stroke i.p.v. fill) met lage opacity, alleen aan de boven-linkerkant van elke vorm — consistent met de lichtrichting uit §2 | 🟠 P1 | M |
| 1.3 | UI-panelen zijn vlakke kleur/gradient | `.detail-card`, `.panel-header`, `.battle-picker` — gladde `linear-gradient` zonder oppervlaktegevoel | Zachte materiaal-look (papier/vilt/klei) zoals Duolingo, Monument Valley UI | Eén herbruikbare `--paper-noise` SVG-data-URI (klein, base64 inline, geen los bestand nodig) als subtiele `background-image` bovenop bestaande panel-gradients | 🟠 P1 | S |
| 1.4 | Grond/pad is een platte kleur-gradient | `#world`-achtergrond en `.ground-scene-bg` (`style.css`) zijn lineaire gradients, geen grondtextuur | Zichtbare grasspriet-/kiezel-textuur die met de camera meebeweegt | Herhalend SVG-patroon (`<pattern>`) met kleine grasspriet-vormpjes, getild op `#world`'s achtergrond — bestaat al deels als los idee uit de vorige polish-ronde ("map texturen"), nu verder doortrekken naar een écht herhaalbaar patroon i.p.v. een paar losse decoratie-elementen | 🟠 P1 | M |

---

## 2. Licht & schaduw-consistentie

| # | Titel | Nu | Topgame-referentie | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 2.1 | Geen vaste lichtrichting | Elke `shadowEllipse()` (`animals.js:200`) staat recht onder het object; elke `drop-shadow()` in CSS heeft een eigen los gekozen offset (`0 6px 6px`, `0 8px 6px`, `0 4px 4px`, ...) | Eén lichtbron (bv. rechtsboven), alle schaduwen consistent dezelfde richting/lengte | Eén `--light-x`/`--light-y`-paar (bv. CSS custom properties) definiëren en **alle** bestaande `drop-shadow`/`box-shadow`-offsets ernaar herschrijven — puur een discipline-wijziging, geen nieuwe techniek, maar met groot cumulatief effect | 🔴 P0 | M |
| 2.2 | Schaduwen zijn vlakke ellipsen | `shadowEllipse()` = één ellips, vaste opacity, geen falloff | Zachte contactschaduw met falloff (donkerder dichtbij het contactpunt, uitvloeiend naar de randen) | Radiale gradient i.p.v. platte fill in `shadowEllipse()` — kleine wijziging in één gedeelde helper-functie, werkt meteen door op alle 12 dieren + speler + buddy | 🟠 P1 | S |
| 2.3 | Geen "occlusie" waar objecten elkaar raken | Boom en gras naast elkaar hebben geen donkerder randje waar ze overlappen | Ambient occlusion: subtiele donkere rand waar twee vormen samenkomen | Voor de meeste losse decoratie te veel moeite (S/M-ratio slecht) — **selectief**: alleen op momenten waar het zichtbaar is (speler die door hoog gras loopt, dier tegen een boom) een simpele donkere gradient-overlay toevoegen | 🟡 P2 | M |

---

## 3. Motion & animatie-taal

| # | Titel | Nu | Topgame-referentie | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 3.1 | Alle sprites "ademen" identiek | `.critter-sprite { animation: breathe 1.8s ease-in-out infinite }` (`style.css:253`) — één keyframe voor alle 12 soorten + speler + buddy | Elk personage heeft een eigen ritme/uitslag die bij zijn karakter past | Per archetype (die tabel bestaat al: `WANDER_BEHAVIOR`/`ARCHETYPES` in `app.js`/`animals.js`) een eigen `animation-duration` + subtiele `scaleX`/`scaleY`-asymmetrie i.p.v. exact dezelfde curve — hupper stuitert sneller/hoger, schelp ademt trager en platter | 🟠 P1 | S |
| 3.2 | Geen squash & stretch | Elke schaal-animatie (`breathe`, `popin`, `wobble-anim`) schaalt X en Y gelijk | Bij impact/landing/sprong: breder-en-platter (squash) dan weer smaller-en-hoger (stretch) — de basis van alle Disney/Pixar-achtige motion | `catchidle`/`.impact`/`wobble-anim`-keyframes herschrijven met asymmetrische `scaleX(1.15) scaleY(0.85)` op het impactmoment i.p.v. uniforme `scale()` — grootste "gratis" motion-upgrade die er is | 🔴 P0 | S |
| 3.3 | Geen secundaire beweging | Elk dier is één samengestelde SVG-`<g>`; een oor/staart/vleugel beweegt nooit los van het lijf | Bij Pixar/Nintendo-kwaliteit-animatie loopt een oor/staart met vertraging na de hoofdbeweging (physics-achtig naijlen) | Grote ingreep: vereist de `ARCHETYPES`-bouwfuncties op te splitsen in aparte `<g>`-groepen (lijf vs. oor/vleugel/staart) met een eigen, licht vertraagde keyframe-animatie per groep — **duurste item in dit document qua bouwtijd, maar ook het item met het grootste "premium"-effect** | 🔴 P0 (impact) / hoog (moeite) | L |
| 3.4 | Overgangen zijn lineair "aan/uit" | Sommige class-toggles (bv. `.ring-large`, `.used` op ontdekplekjes) hebben geen eigen transitie, springen instant | Zachte easing overal, zelfs op kleine state-changes | Waar een CSS-property al `transition`-vatbaar is (opacity/transform/filter) een korte (150–250ms) easing toevoegen — lage moeite, veel plekken tegelijk | 🟡 P2 | S |

---

## 4. Typografie & iconografie

| # | Titel | Nu | Topgame-referentie | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 4.1 | Systeemfont | `font-family: "Trebuchet MS", "Segoe UI", Verdana, sans-serif` (`style.css:48`) — leest als "standaard webpagina", niet als merk | Een herkenbaar, rond/vriendelijk custom lettertype (denk Fredoka, Baloo 2, Nunito — precies de stijl die kids-games gebruiken) | Eén open-license (SIL OFL) rond lettertype **zelf hosten** als `.woff2`-bestand in `public/dierenspel/fonts/`, toevoegen aan `sw.js`'s precache-lijst — blijft dus 100% offline, geen Google Fonts-CDN-afhankelijkheid (die zou juist de offline-eis breken) | 🔴 P0 | S |
| 4.2 | Nav-iconen zijn emoji | 🗺️ 📘 ⚔️ in de bottom-nav (`index.html`) — rendert per toestel/OS anders, oogt als placeholder, niet als ontworpen | Custom, consistent gestileerde SVG-iconen die bij het spel-palet passen | 3 kleine hand-getekende SVG-iconen (zelfde lijndikte/rondingen als de dieren-silhouetten) i.p.v. emoji — klein werk, grote consistentie-winst, en emoji-rendering-verschillen tussen iOS/Android vallen meteen weg | 🟠 P1 | S |
| 4.3 | Geen letter-gewicht-hiërarchie | Titels/labels gebruiken vooral `font-weight: bold` als enige onderscheid | Duidelijke schaal (display/title/body/caption) met bewust verschillende gewichten, niet alleen groottes | Volgt automatisch zodra 4.1 een variabel/multi-weight font oplevert — geen aparte losse actie nodig, wel iets om bewust te doen bij het uitrollen van het nieuwe font | 🟡 P2 | S |

---

## 5. UI-chrome diepte (knoppen, panelen, HUD)

| # | Titel | Nu | Topgame-referentie | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 5.1 | Knoppen hebben één platte schaduwlaag | `.round-btn { box-shadow: var(--shadow-soft) }` — één schaduw, geen gelaagdheid | Meerdere gestapelde schaduwen (dichtbij + ver, licht + donker) die een knop echt laten "zweven" | `box-shadow` accepteert meerdere kommagescheiden waarden — 2-3 lagen i.p.v. 1 op alle `.round-btn`/`.collection-card`/`.detail-card` (die net in de vorige pass al van 1-op-1-vlak naar gradient zijn gegaan; dit is de volgende laag erbovenop) | 🟠 P1 | S |
| 5.2 | Geen "pressed"-materiaal-gevoel | `.round-btn:active { transform: scale(0.9) }` — alleen krimpen, geen echte inkeping | Bij indrukken: schaduw wordt kleiner/dichter, oppervlak lijkt echt "in te drukken" | `:active` ook `box-shadow` laten verkleinen/verdonkeren (niet alleen transform), zodat het samenspel van schaal + schaduw een echt drukgevoel geeft | 🟡 P2 | S |
| 5.3 | Panelen zijn scherp rechthoekig met vaste border-radius | Consistente maar vlakke `border-radius` overal | Organische, iets onregelmatige randen voor een "handgemaakt" i.p.v. "Bootstrap"-gevoel | Heel licht asymmetrische `border-radius`-waarden (bv. `18px 22px 20px 16px` i.p.v. overal exact `20px`) op kaarten — subtiel maar herkenbaar in premium kids-UI (Duolingo doet dit bewust) | 🟡 P2 | S |

---

## 6. Camera, wereld & parallax

| # | Titel | Nu | Topgame-referentie | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 6.1 | Eén platte achtergrondlaag | `.sky`/`#world` is één vlak; de dieptecue uit de vorige pass schaalt alleen losse objecten, er is geen gelaagde achtergrond zelf | Meerdere achtergrondlagen die met verschillende snelheid meebewegen (parallax) — sterk diepte-gevoel zonder 3D | 2-3 extra, deels-transparante achtergrondlagen (verre heuvels/wolken) die trager meebewegen dan `#world` zelf (eigen `translate3d` op basis van een fractie van `camX/camY`) — puur CSS/JS, geen nieuwe renderer nodig | 🟠 P1 | M |
| 6.2 | Camera volgt speler 1-op-1, geen "lag"/easing | `updateCamera()` (`app.js`) zet de camera-transform direct gelijk aan de spelerpositie, elk frame exact | Camera die met lichte vertraging/easing volgt, en subtiel "ademt"/drift bij stilstand | Camera-positie zelf lerpen naar de spelerpositie i.p.v. hem 1-op-1 te volgen (zelfde soort trail/lerp-logica als de buddy nu al gebruikt) — goedkope maar voelbare polish | 🟡 P2 | S |

---

## 7. Wanneer wél naar Canvas/WebGL?

Alleen overwegen als je bereid bent tot een echte herbouw van de renderlaag — niet
als losse toevoeging aan de huidige DOM-aanpak. Realistische inschatting:

- **Wat je ervoor terugkrijgt**: honderden losse deeltjes zonder DOM-overhead, echte
  dynamische belichting (een lichtbron die met de zon/dag-nacht meedraait over alle
  objecten tegelijk), postprocessing (bloom, kleurgrading) — het soort dingen dat
  echte "AAA mobile"-games doet.
- **Wat het kost**: elke SVG-tekenfunctie in `animals.js` zou herbouwd moeten worden
  als canvas-sprites of een lichte WebGL-renderer (bv. PixiJS, nog steeds
  bundle-vrij te krijgen via een self-hosted script), en de hele tap-to-move/
  hit-testing-laag (`screenToWorld()`, critter-klik-detectie) moet opnieuw tegen
  canvas-coördinaten in plaats van DOM-elementen.
- **Advies**: dit is een aparte, bewuste beslissing — niet iets om "even mee te
  nemen" in een polish-pass. Doe eerst §1–6 (allemaal binnen de huidige
  architectuur) en beoordeel dán of het gat met "topgame" nog groot genoeg voelt om
  deze stap te rechtvaardigen.

---

## Samenvatting: shortlist op impact/moeite

1. 🔴 **3.2** — Squash & stretch op impact-momenten (S, grootste "gratis" motion-win)
2. 🔴 **2.1** — Eén consistente lichtrichting voor alle schaduwen (M, bindt de hele visuele wereld samen)
3. 🔴 **4.1** — Zelf-gehost rond lettertype i.p.v. systeemfont (S, direct "merk"-gevoel)
4. 🔴 **1.1** — Noise/grain-laag op sprite-vullingen via SVG-filters (M, lost "plastic"-gevoel op)
5. 🟠 **5.1** — Gelaagde `box-shadow` op knoppen/kaarten (S)
6. 🟠 **4.2** — Custom SVG-nav-iconen i.p.v. emoji (S)
7. 🟠 **3.1** — Archetype-eigen adem-ritme (S)
8. 🟠 **6.1** — Parallax-achtergrondlagen (M)
9. 🟠 **2.2** — Schaduwen met falloff i.p.v. platte ellips (S)
10. 🔴 **3.3** — Secundaire beweging (oor/staart naijlen) — **grootste impact, maar ook duidelijk het duurste item (L)**; goede kandidaat om apart te plannen i.p.v. in dezelfde avond als de rest.

Alles in de tabellen dat niet in deze top-10 staat is prima materiaal voor een
volgende ronde.

---

## Deel 2 — Lokaal testen op een iPhone, zonder Apple Developer-account

Belangrijk om te weten: ik draai zelf in een geïsoleerde cloud-omgeving, niet op
jouw eigen computer — ik kan dus niet zelf iets "op je thuisnetwerk" hosten. Wat
volgt zijn stappen die **jij** op je eigen Mac uitvoert; ik kan je code, instructies
en debugging blijven leveren zoals nu.

Geen van onderstaande opties vereist een Apple Developer Program-account (dat
€99/jaar-abonnement is alleen nodig voor TestFlight/App Store — niet voor wat
hieronder staat). Dit is een PWA, geen native app, dus dat hele traject is sowieso
niet nodig.

### Optie A — Meteen bruikbaar: installeer de huidige preview als "app" (geen setup)

Het spel is al een volwaardige PWA (`manifest.webmanifest` heeft `"display":
"standalone"`, en `sw.js` cachet alles voor offline-gebruik). Dus:

1. Open de preview-link op je iPhone in **Safari** (moet Safari zijn, geen Chrome —
   alleen Safari op iOS mag PWA's installeren).
2. Tik op het deel-icoon → **"Zet op beginscherm"**.
3. Open het vanaf het beginscherm: geen Safari-adresbalk meer, volledig scherm,
   en na de eerste keer laden werkt het ook zonder wifi/data — precies het
   auto-rit-scenario waar dit spel voor gebouwd is.

Dit is niet "lokaal draaien" in de zin van live-reload tijdens het bouwen, maar wél
de meest realistische manier om te ervaren hoe het spel écht aanvoelt op een
toestel — en dat is precies wat je nodig hebt om te beoordelen of de audit hierboven
klopt.

### Optie B — Snel itereren: dev-server op je Mac, iPhone erbij op hetzelfde wifi

Voor als we samen aan het bouwen zijn en je sneller wilt zien dan via een git-push +
Vercel-preview-cyclus:

1. Op je Mac: clone deze repo (of `git pull` als je 'm al hebt), `npm install`,
   dan `npm run dev` — start de Next.js dev-server (die de `/dierenspel`-rewrite
   al bevat, dus dit werkt zonder verdere config).
2. Zoek het lokale IP-adres van je Mac: Systeeminstellingen → Wi-Fi → Details, of
   `ipconfig getifaddr en0` in Terminal.
3. Zorg dat iPhone en Mac op **hetzelfde wifi-netwerk** zitten.
4. Open op de iPhone in Safari: `http://<mac-ip>:3000/dierenspel/`.
5. macOS kan bij de eerste keer vragen om inkomende verbindingen toe te staan voor
   Node — dat mag je toestaan (het blijft binnen je eigen wifi-netwerk).
6. Na een codewijziging: ververs gewoon de pagina op de iPhone (voor de statische
   `public/dierenspel`-bestanden is er geen automatische hot-reload, maar dit is
   nog altijd veel sneller dan wachten op een Vercel-build).

Geen account, geen Xcode, geen kabel nodig — puur HTTP over je eigen wifi.

### Optie C — Écht debuggen op het toestel: Safari Web Inspector

Waardevol zodra we de texture/licht-effecten uit dit document gaan bouwen: WebKit
(Safari's renderer) gedraagt zich op punten anders dan de Chromium-browser die ik
gebruik om te testen — met name `backdrop-filter`, gestapelde `filter`-waarden en
SVG `feTurbulence` kunnen op een echt iPhone-toestel trager of net iets anders
renderen. Dit vang je alleen op een echt toestel op:

1. Op de iPhone: **Instellingen → Safari → Geavanceerd → Web Inspector** aanzetten.
2. Verbind de iPhone met je Mac via een kabel (of, als je bij Optie A al
   "Automatisch verbinden via wifi" hebt aangezet in diezelfde instellingen, kan het
   ook draadloos).
3. Op de Mac: als het Safari-menu **Ontwikkelaar** nog niet zichtbaar is, zet je dat
   aan via Safari → Instellingen → Geavanceerd.
4. Open het spel in Safari op de iPhone, ga op de Mac naar **Ontwikkelaar → [je
   iPhone-naam] → Diervangspel**, en je krijgt volledige DevTools (Elements,
   Console, Network, Performance/Timelines) maar dan draaiend op het echte toestel.

Ook dit is standaard gratis Safari/macOS-functionaliteit — geen Apple ID- of
developer-account-vereiste van welke aard dan ook.

### Aanbevolen volgorde

Doe **Optie A** nu meteen (2 minuten, geeft je meteen het echte gevoel van het spel
zoals het nu is — dat is ook de beste basis om deze audit op te beoordelen). Zet
**Optie B** in als we een avond samen aan het itereren zijn op iets groots. Gebruik
**Optie C** specifiek zodra we de texture/filter-effecten uit §1 bouwen, om te
checken dat ze op een echt toestel niet haperen.
