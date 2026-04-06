import { Category, Status, Attachment, ActionType } from "@/lib/types";

interface SeedItem {
  title: string;
  category: Category;
  status: Status;
  description: string;
  content: string;
  output: string;
  landsIn: string;
  tags: string[];
  files: string[];
  attachments: Attachment[];
  actionType: ActionType;
  installCommand: string;
  sourceUrl: string;
  linkedItems: string[];
  author: string;
  starred: boolean;
  usageCount: number;
}

export const AGENT_DATA: SeedItem[] = [
  {
    title: "Design Review Agent",
    category: "agent",
    status: "active",
    description: "Autonome design audit \u2014 UX + visual + copy in \u00E9\u00E9n run. Upload screenshot of Figma URL.",
    content: `# Design Review Agent

## Wat doet dit?
Voert een complete design review uit in 3 stappen: UX audit, visuele critique, en copy review. Combineert 3 skills en 3 prompts automatisch.

## Vereisten
- CLAUDE.md geladen als context
- reference/aesthetics/visual-language.md beschikbaar
- Screenshot of Figma URL van het te reviewen scherm

## Stappen

### Stap 1: UX Review
Laad: skills/ux-designer/SKILL.md
Run: "Review een user flow" prompt
\u2192 Identificeer friction points, ontbrekende feedback states, flow-problemen

### Stap 2: Visual Review
Laad: skills/ui-designer/SKILL.md
Run: "Review scherm tegen visual language" prompt
\u2192 Check kleurgebruik, typografie hi\u00EBrarchie, spacing, design system compliance

### Stap 3: Copy Review
Laad: skills/ux-copywriter/SKILL.md
Run: "Microcopy schrijven" prompt (review mode)
\u2192 Evalueer button labels, error messages, empty states, tone of voice

## Output
Gecombineerde audit met:
- UX friction score + 3 verbeterpunten
- Visual compliance score /10 + token recommendations
- Copy varianten (warm vs direct) per element
- Geprioriteerde actielijst

## Gebruik
\`\`\`
Laad CLAUDE.md + visual-language.md
Upload: [screenshot]
Run: "Voer een complete design review uit op dit scherm"
\`\`\``,
    output: "Complete design audit: UX friction + visual compliance + copy review + geprioriteerde actielijst",
    landsIn: "Claude.ai",
    tags: ["agent", "review", "ux", "ui", "copy", "audit"],
    files: ["CLAUDE.md", "skills/ux-designer/SKILL.md", "skills/ui-designer/SKILL.md", "skills/ux-copywriter/SKILL.md", "reference/aesthetics/visual-language.md"],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["UX Designer", "UI Designer", "UX Copywriter", "Review een user flow", "Review scherm tegen visual language", "Microcopy schrijven"],
    author: "Tim",
    starred: true,
    usageCount: 0,
  },
  {
    title: "Figma-to-Code Agent",
    category: "agent",
    status: "active",
    description: "Van Figma design naar production-ready React code \u2014 tokens, componenten, 1:1 fidelity",
    content: `# Figma-to-Code Agent

## Wat doet dit?
Neemt een Figma design en produceert production-ready code in 3 stappen: token extractie, component implementatie, en visuele polish.

## Vereisten
- Figma MCP ge\u00EFnstalleerd (zie "Figma + Southleft MCP Setup" workflow)
- Figma node URL van het te implementeren design

## Setup (eenmalig)
\`\`\`bash
claude mcp add figma-console -s user \\
  -e FIGMA_ACCESS_TOKEN=figd_JOUW_TOKEN \\
  -e ENABLE_MCP_APPS=true \\
  -- npx -y figma-console-mcp@latest
\`\`\`

## Stappen

### Stap 1: Token Extractie
Run: "Design Token Extraction from Figma" prompt
\u2192 Genereer CSS custom properties met semantische naming

### Stap 2: Component Implementatie
Laad: skills/implement-design/SKILL.md
\u2192 Vertaal Figma hierarchy naar React componenten met exacte spacing, colors, typography

### Stap 3: Visual Polish
Laad: skills/frontend-design/SKILL.md
\u2192 Voeg hover states, transitions, scroll-triggered animations toe
\u2192 Zorg voor responsive breakpoints

## Output
- CSS custom properties file met design tokens
- React/HTML componenten die Figma 1:1 matchen
- Responsive layout met breakpoints
- Hover states en micro-interactions

## Gebruik
\`\`\`
Figma URL: [plak node URL]
Run: "Implementeer dit Figma design als React componenten"
\`\`\``,
    output: "Production-ready React componenten + CSS tokens die Figma 1:1 matchen",
    landsIn: "Claude Code",
    tags: ["agent", "figma", "code", "react", "tokens", "implementation"],
    files: [".claude/skills/implement-design/SKILL.md", "skills/frontend-design/SKILL.md", "Figma MCP"],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["Implement Design (Figma \u2192 Code)", "Frontend Design", "Design Token Extraction from Figma", "Figma + Southleft MCP Setup"],
    author: "Tim",
    starred: true,
    usageCount: 0,
  },
  {
    title: "UX Research Synthesis Agent",
    category: "agent",
    status: "active",
    description: "Van ruwe interviews naar personas, journey maps en kansen \u2014 volledige research synthese",
    content: `# UX Research Synthesis Agent

## Wat doet dit?
Neemt ruwe research data (interview transcripts, notities) en produceert een complete synthese: thema's, personas, journey map, en geprioriteerde kansen.

## Vereisten
- Interview transcripts of research notities (plak als tekst of upload)

## Stappen

### Stap 1: Transcript Analyse
Run: "User Interview Transcript Analysis"
\u2192 Extraheer: key quotes, pain points, goals, workarounds, emotionele momenten
\u2192 Synthetiseer: thema's, unieke inzichten, contradicties

### Stap 2: Persona Creatie
Run: "User Persona Generator"
\u2192 Genereer 2 distinct personas vanuit de research data
\u2192 Goals, frustrations, motivations, typical day

### Stap 3: Journey Mapping
Run: "User Journey Map"
\u2192 Map de complete journey per persona
\u2192 Acties, gedachten, gevoelens, touchpoints, pain points

## Output
- Research synthese: thema's + key quotes + contradicties
- 2 user personas met gedragspatronen
- Journey map met emotionele temperatuur per stap
- Top 3 kansen met bewijs uit de data

## Gebruik
\`\`\`
Upload: [interview transcripts]
Run: "Analyseer deze interviews en maak personas + journey map"
\`\`\``,
    output: "Research synthese + 2 personas + journey map + top 3 kansen met bewijs",
    landsIn: "Claude.ai",
    tags: ["agent", "ux-research", "personas", "journey-map", "synthesis"],
    files: [],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["User Interview Transcript Analysis", "User Persona Generator", "User Journey Map"],
    author: "Tim",
    starred: false,
    usageCount: 0,
  },
  {
    title: "Pre-Launch QA Agent",
    category: "agent",
    status: "active",
    description: "Complete pre-launch check \u2014 UX, accessibility, performance, design system, heuristics in \u00E9\u00E9n run",
    content: `# Pre-Launch QA Agent

## Wat doet dit?
Voert 5 audits uit op een codebase/URL v\u00F3\u00F3r launch: UX friction, WCAG accessibility, performance, design system consistency, en heuristic evaluation.

## Vereisten
- Toegang tot de codebase (Claude Code) of live URL
- Beschrijving van de doelgroep en product type

## Stappen

### Stap 1: UX Friction Audit
Run: "UX Friction Audit"
\u2192 Friction points, onduidelijke affordances, ontbrekende feedback states

### Stap 2: Accessibility Audit
Run: "Accessibility Pre-Launch Audit"
\u2192 WCAG AA compliance: contrast, keyboard nav, ARIA, focus states

### Stap 3: Performance Audit
Run: "Performance Audit"
\u2192 Ongebruikte CSS/JS, synchrone loading, ongecomprimeerde assets

### Stap 4: Design System Audit
Run: "Design System Audit"
\u2192 Hardcoded values, inconsistente spacing, token drift

### Stap 5: Heuristic Evaluation
Run: "Heuristic Evaluation"
\u2192 Nielsen's 10 heuristics per stap in de flow

## Output
Gecombineerd QA rapport met:
- UX friction score + fixes
- WCAG compliance status + failing elements
- Performance top 5 fixes
- Design system drift report
- Heuristic violations per severity
- Geprioriteerde master actielijst

## Gebruik
\`\`\`
Context: [product type] voor [doelgroep]
Run: "Voer een complete pre-launch QA uit op deze codebase"
\`\`\``,
    output: "Gecombineerd QA rapport: UX + a11y + performance + design system + heuristics",
    landsIn: "Claude Code",
    tags: ["agent", "qa", "audit", "a11y", "performance", "pre-launch"],
    files: [],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["UX Friction Audit", "Accessibility Pre-Launch Audit", "Performance Audit", "Design System Audit", "Heuristic Evaluation"],
    author: "Tim",
    starred: true,
    usageCount: 0,
  },
  {
    title: "Design System Agent",
    category: "agent",
    status: "active",
    description: "Bouw of audit een compleet design system \u2014 tokens, typografie, kleuren, theming",
    content: `# Design System Agent

## Wat doet dit?
Bouwt een compleet design system OF auditet een bestaand systeem. Combineert token extractie, systeem generatie, consistency audit, en CSS theming.

## Vereisten
- Figma file (voor nieuw systeem) OF bestaande codebase (voor audit)
- Optioneel: npx skills add nicepkg/ui-ux-pro-max -g

## Stappen

### Stap 1: Token Extractie (als Figma beschikbaar)
Run: "Design Token Extraction from Figma"
\u2192 Spacing, typography, colors, border-radius, shadows als CSS custom properties

### Stap 2: Systeem Generatie
Run: "Design System Generator" (UI/UX Pro Max)
\u2192 Complete palette, type scale, spacing scale, component patterns, anti-patterns

### Stap 3: Consistency Audit
Run: "Design System Audit"
\u2192 Hardcoded values, inconsistente spacing, token drift

### Stap 4: Theming
Run: "CSS Theming System"
\u2192 Light/dark mode met WCAG-passing contrast, smooth transitions

## Output
- CSS custom properties met semantische naming
- Complete design system spec
- Drift audit rapport met file paths + line numbers
- Light/dark mode theming systeem

## Gebruik
\`\`\`
Figma: [URL] of Codebase: [pad]
Run: "Bouw een design system" of "Audit het bestaande design system"
\`\`\``,
    output: "Design system: tokens + spec + audit + light/dark theming",
    landsIn: "Claude Code",
    tags: ["agent", "design-system", "tokens", "theming", "audit"],
    files: [],
    attachments: [],
    actionType: "install",
    installCommand: "npx skills add nicepkg/ui-ux-pro-max -g",
    sourceUrl: "https://github.com/nicepkg/ui-ux-pro-max",
    linkedItems: ["Design Token Extraction from Figma", "Design System Generator", "Design System Audit", "CSS Theming System"],
    author: "Tim",
    starred: false,
    usageCount: 0,
  },
  {
    title: "UX Copy Agent",
    category: "agent",
    status: "active",
    description: "Complete UX copy workflow \u2014 microcopy, varianten, en multi-market localisatie check",
    content: `# UX Copy Agent

## Wat doet dit?
Schrijft en reviewt alle interface copy in 3 stappen: skill-based copy, volledige state coverage, en multi-market localisatie check.

## Vereisten
- Component/screen beschrijving
- Doelmarkten (optioneel, voor localisatie)

## Stappen

### Stap 1: Microcopy Schrijven
Laad: skills/ux-copywriter/SKILL.md
Run: "Microcopy schrijven"
\u2192 2 varianten per element: warm + direct
\u2192 Context: gebruiker emotie, scherm doel

### Stap 2: Volledige State Coverage
Run: "Microcopy Generator (full)"
\u2192 Headlines, CTAs, error states, empty states, loading, success per scherm
\u2192 Helper text, tooltips

### Stap 3: Localisatie Check
Run: "Multi-market copy check"
\u2192 Flag vertaalproblemen voor CH/IT/NL/FR
\u2192 Culturele aannames, idiomen die breken, lengte-issues

## Output
- Copy varianten (warm + direct) per element
- Volledige copy set voor alle states
- Localisatie audit met flags per markt

## Gebruik
\`\`\`
Component: [beschrijving]
Context: gebruiker heeft net [actie], voelt zich [emotie]
Markten: [CH, IT, NL, FR]
Run: "Schrijf alle copy voor dit scherm en check voor multi-market"
\`\`\``,
    output: "Copy varianten + volledige state coverage + localisatie audit",
    landsIn: "Claude.ai",
    tags: ["agent", "copy", "microcopy", "localization", "ux-writing"],
    files: ["skills/ux-copywriter/SKILL.md"],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["UX Copywriter", "Microcopy schrijven", "Microcopy Generator (full)", "Multi-market copy check"],
    author: "Tim",
    starred: false,
    usageCount: 0,
  },
  {
    title: "Stakeholder Prep Agent",
    category: "agent",
    status: "active",
    description: "Bereid je voor op design reviews en stakeholder presentaties \u2014 objectieven, pushback, framing",
    content: `# Stakeholder Prep Agent

## Wat doet dit?
Bereidt je volledig voor op een design review of stakeholder presentatie. Genereert objectieven, verwachte vragen, pushback framing, en een update draft.

## Vereisten
- CLAUDE.md + memory/projects/active.md geladen
- Project naam, aanwezigen, wat je laat zien

## Stappen

### Stap 1: Review Prep
Run: "Design review voorbereiden"
\u2192 Objectieven, vragen om te stellen, verwachte pushback per persoon
\u2192 Scope: waar vraag je GEEN feedback op

### Stap 2: Critique Framing
Run: "Design Critique Framing"
\u2192 Structureer feedback op 5 assen: user impact, system compliance, hierarchy, edge cases, feasibility
\u2192 Frame als "[observatie] omdat [impact], overweeg [alternatief]"

## Output
- Review prep: objectieven + anticipated pushback
- Critique framing: gestructureerde feedback per as

## Gebruik
\`\`\`
Laad: CLAUDE.md + memory/projects/active.md
Project: [naam]
Aanwezigen: [namen]
Wat ik laat zien: [beschrijving]
Run: "Bereid mijn design review voor"
\`\`\``,
    output: "Review prep + critique framing",
    landsIn: "Claude.ai",
    tags: ["agent", "review", "stakeholder", "prep", "presentation"],
    files: ["CLAUDE.md", "memory/projects/active.md"],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["Design review voorbereiden", "Design Critique Framing"],
    author: "Tim",
    starred: false,
    usageCount: 0,
  },
  {
    title: "Developer Handoff Agent",
    category: "agent",
    status: "active",
    description: "Genereer een complete developer handoff \u2014 specs, states, edge cases, QA checklist",
    content: `# Developer Handoff Agent

## Wat doet dit?
Genereert een complete developer handoff package inclusief measurements, interactive states, responsive rules, edge cases, en QA checklist. Optioneel met design system consistency check.

## Vereisten
- Screen/component beschrijving of Figma URL
- Optioneel: toegang tot codebase voor design system audit

## Stappen

### Stap 1: Handoff Spec
Run: "Developer Handoff Package"
\u2192 Measurements (px + rem), colour tokens, typography specs
\u2192 Interactive states: default, hover, active, disabled, focus, loading, error, success
\u2192 Responsive breakpoints + layout adaptatie
\u2192 Edge cases: long text, missing data, 0 items, many items
\u2192 Animation specs: duration, easing, properties
\u2192 QA checklist

### Stap 2: Design System Check (optioneel)
Run: "Design System Audit"
\u2192 Controleer of de spec consistent is met het bestaande design system
\u2192 Flag hardcoded values die tokens moeten zijn

## Output
- Complete handoff spec met alle measurements
- Interactive states per component
- Responsive rules
- Edge case handling
- QA checklist voor de engineer
- Optioneel: design system compliance rapport

## Gebruik
\`\`\`
Component: [beschrijving of Figma URL]
Run: "Genereer een developer handoff voor dit component"
\`\`\``,
    output: "Complete handoff: measurements + states + responsive + edge cases + QA checklist",
    landsIn: "Claude Code",
    tags: ["agent", "handoff", "developer", "specs", "qa"],
    files: [],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["Developer Handoff Package", "Design System Audit"],
    author: "Tim",
    starred: false,
    usageCount: 0,
  },
];
