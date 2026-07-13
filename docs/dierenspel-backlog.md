# Diervangspel — Pokémon GO fidelity backlog

Doel: dit document is een kritische, item-per-item vergelijking tussen de huidige
staat van `public/dierenspel/` en de echte Pokémon GO — UI, interactie en
detaildiepte — met een geprioriteerde backlog om vanavond uit te werken.

Elk item heeft: **Nu** (wat er is), **PoGo** (referentiegedrag), **Fix**, **Prioriteit**
(P0 = voelt kapot/onaf zonder dit, P1 = sluit een echte fidelity-gap, P2 = polish),
**Aanpak** (S/M/L).

Legenda prioriteit: 🔴 P0 · 🟠 P1 · 🟡 P2

---

## 0. Waar we intentioneel NIET naar Pokémon GO gaan

Voor de context van de rest van dit document — deze dingen blijven bewust anders,
niet omdat we ze zijn vergeten:

- **Geen echte GPS/wereldkaart.** De opdracht was expliciet "geen echte GPS", een
  zelfgemaakte vaste kaart. PoGo's kern (lopen in de echte wereld) valt hier dus
  altijd buiten scope.
- **Geen accounts, servers, PvP, raids, gyms, ruilen, community days.** Alles wat
  een backend/netwerk vereist blijft uitgesloten (privacy, "geen accounts", offline-first).
- **Geen microtransacties/energie-systemen.** Expliciet verboden door de opdracht.

Alles hieronder gaat over dingen die **wél** binnen de huidige architectuur (vanilla
HTML/CSS/JS, geen backend, offline) dichter bij PoGo's *gevoel* gebracht kunnen worden.

---

## 1. Camera, wereld & omgeving

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 1.1 | Vlakke top-down camera | `#world` is recht van bovenaf, geen tilt. Alleen een horizon-strook (sky band) bovenaan geeft diepte-suggestie. | Licht gekantelde 3D-camera, je kijkt "de wereld in" | Volledige 3D-perspectief is riskant (tap-coördinaten, performance) — **niet 1:1 overnemen**, maar wél: per-object schaal/blur op basis van world-Y (dingen "verder weg" kleiner/waziger tekenen) om diepte te versterken zonder coördinaten-wiskunde te breken | 🟠 P1 | M |
| 1.2 | Statisch weer | Altijd dezelfde blauwe lucht + 3 wolken | Weer verandert (regen, mist, sneeuw), dag/nacht-cyclus verandert sfeer + welke dieren verschijnen | Simpele dag/nacht-cyclus op basis van kloktijd van het toestel (`new Date().getHours()`) die sky-gradient kleurt en 's avonds "nachtdieren" met net iets andere kans laat verschijnen | 🟡 P2 | M |
| 1.3 | Geen minimap/kompas | — | Rechtsonder een minikaart met noord-indicator | Niet essentieel voor een vaste kleine kaart met kids-doelgroep — **skip**, lage waarde/moeite-ratio | 🟡 P2 (laag) | — |
| 1.4 | Wereld voelt leeg buiten dieren | Bomen/rotsen/bloemen/vlinders zijn statische decoratie, geen interactie | PoGo's PokéStops: ronddraaiende foto-schijven die je aantikt voor items | Voeg 2-3 "vondst-plekjes" toe op de vaste kaart (bv. een glinsterende boomstronk) die je kan aantikken voor een kleine XP-bonus of gratis vangbal-flair — geeft de wereld een reden om rond te lopen tussen dieren door | 🟠 P1 | M |
| 1.5 | Pad-textuur is generiek | Eén vaste slingerpad-vorm, geen zijpaadjes | PoGo's straten variëren, voelen als een echte omgeving | Kleine zijpaadjes/lusjes toevoegen zodat de kaart minder "een lijn" voelt en meer "een gebied" | 🟡 P2 | S |

---

## 2. Personage / avatar

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 2.1 | Geen personage-aanpassing | Vast figuurtje (huidskleur, blauw rugzakje, geen opties) | Volledige avatar-customizer (kleding, huidskleur, haar) | Te veel scope voor kids-game, maar een **kleine** keuze (3-4 rugzak-/shirtkleuren) bij eerste start geeft eigenaarschap zonder complexiteit | 🟡 P2 | S |
| 2.2 | Personage draait niet mee met looprichting | Sprite blijft altijd "front-facing", ongeacht tikrichting | Avatar draait/kijkt in loop­richting | Simpele links/rechts-flip (`scaleX(-1)`) op basis van bewegingsrichting; volstaat voor de "premium" indruk zonder een spritesheet met 8 richtingen te bouwen | 🟠 P1 | S |
| 2.3 | Geen "buddy"-dier naast je | — | Een gekozen Pokémon loopt zichtbaar naast je op de kaart | Leuke, herkenbare PoGo-feature: laat het laatst gevangen (of favoriete) diertje meelopen naast het personage op de kaart | 🟡 P2 | M |

---

## 3. Dieren-ontmoetingen (spawns, zichtbaarheid, radar)

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 3.1 | Geen "in de buurt"-paneel | Dieren verschijnen alleen fysiek op de kaart | "Nearby"-paneel met silhouetten van dieren die dichtbij zijn, ook buiten beeld | Niet cruciaal (onze kaart is klein/vast, alles is al "dichtbij"), maar een klein hoekje met een silhouet + "?" van het eerstvolgende dier dat gaat spawnen zou de spanning verhogen | 🟡 P2 | M |
| 3.2 | Max. 4 dieren tegelijk, elke 10-20s een nieuwe | `MAX_ACTIVE_CRITTERS = 4`, `spawnLoop` elke 10-20s (`app.js:12,329`) | Dicht opeenvolgende spawns, vooral bij "incense"/lures | Prima voor een rustige kids-sessie — **behouden**, evt. iets verhogen naar 5 voor een drukker gevoel als het niet druk aanvoelt op een klein scherm | 🟡 P2 | S |
| 3.3 | Zeldzaamheids-gewicht is onzichtbaar voor het kind | `RARITY_WEIGHT` bepaalt spawnkans, maar dat is nergens zichtbaar totdat je een dier ziet | PoGo laat via sterren/kleur in het vangscherm + Pokédex zien hoe zeldzaam iets is | We hebben al kleur op de mikcirkel (groen/geel/rood) sinds de vorige iteratie — **uitbreiden**: dezelfde kleurcode ook tonen op de kaart zelf (bv. een klein gekleurd sterretje boven het dier) zodat een kind al ziet "oh dit is bijzonder" vóór het tikt | 🟠 P1 | S |
| 3.4 | Geen vlucht-kans / dier kan niet wegrennen | Een dier op de kaart wacht altijd rustig af totdat je tikt (of despawnt na 55-80s) | Sommige Pokémon rennen weg of "merken je op" | Bewust simpel houden voor 6-7-jarigen (geen frustratie) — **skip**, dit is een goed doordacht verschil, geen bug | — | — |
| 3.5 | Spawn-aankondiging is alleen een banner + geluid | `showBanner("Er is een dier verschenen!")`, geen richting-aanwijzing | — | Kleine pijl/glow aan de schermrand waar het dier vandaan komt, zodat een kind actief "op zoek" gaat i.p.v. passief wacht tot het in beeld loopt | 🟡 P2 | S |

---

## 4. Vangmechanisme (grootste losse werkgebied)

Dit is al twee keer herzien (swipe → sleep-en-gooi-fysica → duim-zichtbaarheid-fix).
De kern werkt nu goed; dit zijn de resterende fidelity-gaps t.o.v. PoGo specifiek:

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 4.1 | Geen curveball / gebogen worp | Bal vliegt altijd in dezelfde symmetrische boog (`app.js` quadratic bezier, vaste control point) | Curveballs (zijwaartse draai) geven bonus-XP en zijn een kern-vaardigheid | Voor 6-7-jarigen bewust **niet** toevoegen als vereiste (te moeilijk), maar wél als *bonus*: als het kind tijdens het optillen ook zijwaarts beweegt, geef een kleine visuele swirl + XP-bonus — puur positieve verrassing, geen extra faalkans | 🟠 P1 | M |
| 4.2 | Mikcirkel is decoratief, geen echte precisie-timing | Cirkel pulseert continu, maar "hoe goed je mikt" beïnvloedt niets — alleen *of* je een geldige worp doet telt | PoGo: kleinere cirkel op het moment van gooien = meer XP + hogere vangkans | Simpele versie: als de worp *tijdens* het kleinste punt van de pulserende cirkel wordt losgelaten, geef een "Geweldige worp!"-tekst + bonus-XP (puur cosmetisch/beloning, nooit een fail toevoegen) | 🟠 P1 | M |
| 4.3 | Geen ontsnappings-animatie met stof-wolkje | Bij mislukte vangpoging (`onBallImpact`, tapsDone < tapsNeeded): dier verschijnt gewoon weer, bal reset | PoGo: bal breekt open met een felle flits + het dier "springt" terug met een schud-animatie | Voeg een korte "poef"-deeltjes-animatie + iets grotere schud-reactie toe wanneer het dier ontsnapt uit de bal, i.p.v. het huidige vrij stille herstel | 🟡 P2 | S |
| 4.4 | Geen berry/item-systeem | — | Berries verhogen vangkans of kalmeren een dier | Bewust simpel houden — een item-inventaris is te veel systeem voor de doelgroep. **Alternatief lichtgewicht idee**: na 2 mislukte pogingen op hetzelfde dier, automatisch de mikcirkel groter maken (stille moeilijkheids-verlaging, geen system dat het kind moet begrijpen) | 🟠 P1 | S |
| 4.5 | Vangst-viering is één confetti-burst | `burstConfetti(catchOverlay, 30)` + tekst | PoGo: XP-uitsplitsing (Curveball +10, Nice throw +10, Catch +100 etc.) die één voor één oppoppen | Voor kids leesbaarheid: een simpele opeenvolging van 1-2 grote emoji/sterren i.p.v. een tekstlijst met cijfers (cijfers zeggen een 6-jarige weinig) — **niet** PoGo's XP-lijst kopiëren, wel het gevoel van "gelaagde beloning" | 🟡 P2 | S |
| 4.6 | Eén balsoort | Altijd dezelfde rood/witte bal | PoGo: Poké/Great/Ultra Ball met verschillende vangkansen | Out of scope qua systeem-complexiteit (inventaris/keuze) — **skip**, maar de bal zou per zeldzaamheid een subtiel ander kleuraccent kunnen krijgen puur cosmetisch (geen keuze, geen inventaris) | 🟡 P2 | S |

---

## 5. Verzamelscherm ("Pokédex"-equivalent)

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 5.1 | Grid toont alleen naam + aantal | `renderCollection()` (`app.js`): thumb, naam, `x{count}` badge | Pokédex: nummer, type-iconen, grootte/gewicht, CP-range, sorteren/filteren | Voeg per kaart een klein rariteits-sterretje toe (kleurcode hergebruiken uit §3.3) — sorteren/filteren is te veel UI-chrome voor 12 diertjes, **skip** dat deel bewust | 🟠 P1 | S |
| 5.2 | Detailscherm is een enkele statische modal | `openDetail()`: sprite, naam, "habitat • rarity • Nx gevangen", blurb — geen animatie | PoGo detailscherm: dier "ademt"/beweegt, swipe tussen dieren, CP-balk, snoepjes-teller | Onze SVG-dieren hebben al idle-animaties elders (`.breathe` op de kaart) — hergebruik die animatie ook in de detail-modal (nu staat het dier daar stil); voeg swipe/pijltjes toe om door de collectie te bladeren zonder terug te hoeven naar het grid | 🟠 P1 | S |
| 5.3 | Evolutie is een stille flag, geen viering op zich | `addCaught()` zet `entry.evolved = true` en toont een regel tekst in het vangresultaat | PoGo: aparte, feestelijke evolutie-animatie met muziek-sting en gedaanteverandering in beeld | Een korte aparte "evolutie-scène" (oude vorm → flits/deeltjes → nieuwe vorm) i.p.v. alleen een tekstregel — dit is een van de meest bevredigende PoGo-momenten en wij laten het nu liggen | 🔴 P0 | M |
| 5.4 | Geen "Nieuw ontdekt"-badge op het navigatie-icoon | Kind moet zelf naar "Mijn Dieren" navigeren om te zien dat er iets nieuws is | Rode badge-stip op app-icoon-equivalent | Kleine rode stip op de "Mijn Dieren"-knop in de bottom-nav zolang er een niet-bekeken nieuwe aanwinst is | 🟡 P2 | S |

---

## 6. Gevechtssysteem

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 6.1 | Eén simplistisch beurt-gevecht | `startBattle()`: kies dier → automatisch een willekeurige tegenstander, alleen "Aanval" knop, geen keuzes | PoGo (raids/gyms): type-voordelen, snelle vs. geladen aanvallen, energie-balk, meerdere Pokémon per gevecht | Bewust simpel gehouden voor de doelgroep (opdracht zegt letterlijk "geen ingewikkelde strategie") — **behouden**, maar wel: | — | — |
| 6.2 | → Geen enkel gevoel van dier-identiteit in gevecht | Alle dieren vallen hetzelfde aan (zelfde geluid, zelfde lunge-animatie), alleen cijfers verschillen | Elke Pokémon heeft een eigen aanval-animatie/geluid per move | Per archetype (rond/hupper/langnek/stekelig/vliegend/schelp/zwem — al gedefinieerd in `animals.js`) een klein eigen aanval-detail toevoegen (stekelig schiet stekels uit, vliegend duikt, etc.) i.p.v. dezelfde generieke lunge voor iedereen | 🟠 P1 | M |
| 6.3 | Geen "buddy affectie" die gevechten beïnvloedt | Elk gevecht is statistisch identiek ongeacht hoe vaak je een dier al gebruikt hebt | PoGo: buddy-bonussen | Te veel systeem voor de scope — **skip** |  — | — |

---

## 7. Progressie & meta

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 7.1 | Level-up is alleen een banner | `addXP()`: banner "Niveau omhoog!" + geluid, geen visuele beloning | PoGo: level-up scherm met vuurwerk + itembeloning-overzicht | Vervang de banner bij level-up door een korte fullscreen-viering (vuurwerk/sterren + "Niveau {n}!" groot in beeld) — dit is een belangrijk "ik ben trots"-moment dat nu wegflitst in een klein tekstbalkje | 🟠 P1 | S |
| 7.2 | Geen dagelijkse/sessie-doelen | — | Dagelijkse taken, streaks | Bewust vermijden: opdracht verbiedt expliciet systemen die "aanzetten tot" iets — een streak-systeem kan bij kids ongewenste druk geven. **Skip met opzet.** | — | — |
| 7.3 | XP-curve is lineair-simpel | `xpForLevel = 50 + (level-1)*25` | PoGo's curve is veel steiler naarmate je hoger komt | Voor korte autorit-sessies is een vlakke curve juist goed (snel zichtbare progressie) — **behouden** | — | — |
| 7.4 | Geen "medailles"/achievements | — | Uitgebreid medaille-systeem (X keer gevangen van type Y, etc.) | Een kleine set van 3-5 simpele medailles (bv. "Eerste vangst", "5 verschillende diertjes", "Een dier laten evolueren") als apart tabblad of sectie in het verzamelscherm — geeft langere-termijn doelen zonder druk | 🟡 P2 | M |

---

## 8. UI chrome & navigatie

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 8.1 | Schermovergangen zijn hard (display toggle) | `showScreen()` (`app.js`) wisselt `.active`-klasse zonder transitie | PoGo: soepele fade/slide tussen schermen | Simpele CSS fade/slide-transitie toevoegen bij het wisselen van scherm — relatief goedkope, hoog-zichtbare polish-win | 🔴 P0 | S |
| 8.2 | Bottom-nav mist actieve-status-animatie | Actieve knop krijgt direct een groene achtergrond, geen overgang | Zachte overgang + icoon "pop" bij selecteren | Kleine scale/kleur-transitie op `.nav-btn.active` | 🟡 P2 | S |
| 8.3 | HUD toont geen coin/valuta-equivalent | Er is geen enkele "verzamel-teller" zichtbaar behalve XP-balk | PoGo: sterrenstof + munten altijd zichtbaar bovenin | We hebben bewust geen currency (geen IAP-risico) — maar een simpele **"Gevangen: X/12"**-teller naast de niveau-pil zou de voortgang net zo motiverend maken zonder een economie te introduceren | 🟠 P1 | S |
| 8.4 | Mute-knop is de enige instelling | Geen instellingenscherm, geen manier om bv. trillingen apart uit te zetten | PoGo: uitgebreid instellingenmenu | Voor deze doelgroep prima minimaal — **skip** uitbreiden, tenzij ouders expliciet vragen om een "volledig stil"-stand die haptics ook uitzet (die zit nu impliciet al vast aan mute, dus feitelijk al gedekt) | — | — |
| 8.5 | Loading/eerste-load heeft geen splash | App verschijnt meteen met het welkomstscherm eroverheen, geen merk-moment | PoGo-opstartscherm met logo-animatie | Een korte (1-1.5s) gestileerde laad/logo-animatie vóór het welkomstscherm zou de "premium app"-indruk vanaf seconde 1 versterken | 🟡 P2 | S |

---

## 9. Audio & haptics

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 9.1 | Geen achtergrondmuziek | Alleen korte SFX via WebAudio-oscillators (`audio.js`) | Herkenbare, vrolijke achtergrondmuziek-loop | Bewust weggelaten (bestandsgrootte/offline-eis) — een zeer lichte, procedureel gegenereerde ambient loop (paar zachte tonen die random doorlopen) zou kunnen zonder een audiobestand te bundelen, maar risico op irritatie bij herhaald autorit-gebruik. **Voorstel: optioneel, standaard uit.** | 🟡 P2 | M |
| 9.2 | Alle SFX zijn korte pieptonen | Losse oscillator-tonen (`tone()`-functie), geen "warmte"/timbre-variatie | PoGo heeft herkenbare, karaktervolle jingles | Binnen de bestaande WebAudio-aanpak (geen bundled audio) kunnen we rijkere klanken maken door meerdere oscillators te stapelen (akkoorden i.p.v. losse tonen) voor de belangrijkste momenten (vangst, evolutie, level-up) | 🟠 P1 | S |
| 9.3 | Haptics zijn basaal aan/uit-patroontjes | `Audio.vibrate([...])` met vaste patronen per actie | — | Prima voor scope, dit is al goed gedekt — **geen actie nodig** | — | — |

---

## 10. Motion, "juice" & detail-diepte

| # | Titel | Nu | PoGo | Fix | Prio | Aanpak |
|---|---|---|---|---|---|---|
| 10.1 | Confetti is de enige deeltjes-viering | Herbruikt voor élke vangst, ongeacht zeldzaamheid | PoGo schaalt viering-intensiteit met zeldzaamheid | Confetti-hoeveelheid/kleurenpalet laten meeschalen met `rarity` (meer, fellere confetti bij zeldzaam) — klein codewijzigingetje met groot gevoelsverschil | 🟠 P1 | S |
| 10.2 | Camera schudt/reageert nergens op impact | Vangst-inslag heeft alleen een flits, geen screen-shake | PoGo: lichte trilling/zoom bij belangrijke momenten | Kleine CSS-schudanimatie op `#catch-field` bij `onBallImpact()` — goedkoop, voelbaar effect | 🟡 P2 | S |
| 10.3 | Dieren op de kaart hebben geen individuele "persoonlijkheid" in beweging | Alle dieren wandelen met dezelfde snelheid/timing-logica (`updateCritters`) | Sommige Pokémon fladderen, sommige springen, sommige zweven — zichtbaar anders per soort | We hebben al archetypes (`hupper`, `vliegend`, `zwem`, ...) — hun *bewegingspatroon* op de kaart gebruikt nu geen archetype-specifiek gedrag. Voeg per archetype een licht andere wander-curve toe (vliegend = zwevend pad met sinus, hupper = met sprongetjes/pauzes, zwem = alleen dicht bij water) | 🟠 P1 | M |
| 10.4 | Geen dag-tijd-gevoel in de sprites zelf | — | — | Volgt op 1.2 (dag/nacht) — laag prioriteit zolang 1.2 niet gedaan is | 🟡 P2 | — |

---

## Samenvatting: shortlist voor vanavond

Onderstaande selectie is bewust gekozen op **impact/moeite-ratio** — dit zijn de items
die het meest naar "premium PoGo-gevoel" bewegen voor de minste bouwtijd, in
volgorde van aanpak:

1. 🔴 **8.1** — Zachte overgangen tussen schermen (S, hoog zichtbaar overal)
2. 🔴 **5.3** — Echte evolutie-viering i.p.v. tekstregel (M, grootste "wow"-gat)
3. 🟠 **7.1** — Level-up als fullscreen-viering i.p.v. banner (S)
4. 🟠 **10.1** — Confetti schaalt mee met zeldzaamheid (S)
5. 🟠 **3.3 + 5.1** — Zeldzaamheids-sterretje op kaart én in verzamelscherm, zelfde kleurcode overal (S, consistentie-win)
6. 🟠 **8.3** — "Gevangen: X/12"-teller in de HUD (S)
7. 🟠 **10.3** — Archetype-specifieke wander-bewegingen (M, maakt de kaart merkbaar levendiger)
8. 🟠 **2.2** — Personage kijkt/draait in looprichting (S)
9. 🟠 **4.1 + 4.2** — Curveball-bonus + "geweldige worp"-timing-bonus op het vangmechanisme (M, puur positieve laag bovenop wat er al staat)
10. 🟠 **6.2** — Archetype-specifieke aanval-animaties in gevecht (M)

Alles daarna (P1/P2 in de tabellen hierboven, met name §7.4 medailles, §2.3 buddy-dier,
§1.2 dag/nacht) is prima materiaal voor een volgende sessie, maar minder urgent dan
bovenstaande tien.
