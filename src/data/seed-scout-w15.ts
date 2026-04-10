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

export const SCOUT_W15_DATA: SeedItem[] = [
  // ──────────────── 1. Awesome Design MD ────────────────
  {
    title: "Awesome Design MD",
    category: "skill",
    status: "tested",
    description:
      "Brand design reference library — say 'build me a page like Stripe' and get pixel-accurate UI from exact design tokens",
    content: `# Awesome Design MD Skill

AI-native skill that packages design systems following the Agent Skills open standard, enabling AI to generate pixel-accurate UIs based on brand design tokens.

## What it does

- **7 brand archetypes bundled locally** (~60KB): Apple, Claude, Cursor, Figma, Spotify, Stripe, Vercel
- **47+ additional systems** fetchable on-demand via script
- Generates UI components matching specific brands using their exact design tokens
- Guides users through creating custom DESIGN.md files for their own brand
- Fetches design systems on-demand from the repository

## How to use

1. Install the skill (copy skill directory into \`~/.claude/skills/\`)
2. Ask Claude: "build me a page like Stripe" or "create a DESIGN.md for my app"
3. Get pixel-accurate UI generated from the exact design tokens of that brand

## Example prompts

- "Build me a landing page using the Spotify design system"
- "Create a DESIGN.md for our product based on Apple HIG"
- "Generate a dashboard component following Figma's design tokens"
- "Show me the design tokens for Vercel's system"

## Why use this

Bridges the gap between abstract design tokens and actual brand-level UI generation. Instead of Claude guessing at styles, it references real production design systems.`,
    output:
      "Pixel-accurate UI components matching brand design systems, or custom DESIGN.md files",
    landsIn: "Claude Code",
    tags: ["design-system", "tokens", "brand", "ui", "reference"],
    files: [],
    attachments: [],
    actionType: "link",
    installCommand: "",
    sourceUrl:
      "https://github.com/VoltAgent/awesome-design-md/issues/90",
    linkedItems: ["Design System Agent"],
    author: "VoltAgent",
    starred: false,
    usageCount: 0,
  },

  // ──────────────── 2. Inclusive Design Skills ────────────────
  {
    title: "Inclusive Design Skills",
    category: "skill",
    status: "tested",
    description:
      "40 design-phase accessibility skills across 6 plugins — cognitive a11y, inclusive personas, adaptive interfaces. Catches problems before code exists.",
    content: `# Inclusive Design Skills

40 skills across 6 plugins that intervene at the design phase — before code exists — unlike traditional accessibility audits that check after implementation.

## 6 Plugins

### 1. Cognitive Accessibility
Cognitive load assessment, plain language, wayfinding, focus/attention, memory load reduction, error prevention, contextual help, adaptive personalisation.

### 2. Inclusive Interaction
Keyboard navigation, touch targets, voice interaction, multi-modal input, motion sensitivity, gesture alternatives, cross-sensory feedback.

### 3. Accessible Content
Alt text, heading hierarchy, readable content, link text, table accessibility, form labeling, multimedia accessibility.

### 4. Inclusive Personas
Build user stories that naturally integrate disability as a diversity dimension with assistive technology details and environmental contexts.

### 5. Adaptive Interfaces
System preference detection, responsive accessibility, flexible typography, colour independence, simplified views, information density control.

### 6. Accessibility Decisions
Documentation framework preserving design rationale across team changes. Generates testable specs with HTML elements, keyboard behaviours, screen reader cues.

## Key commands

- \`/cognitive-accessibility:review\` — assess whether fatigued, unfamiliar users can complete tasks unaided
- \`/inclusive-personas:generate\` — create personas with specific assistive tech and environmental contexts
- \`/accessibility-decisions:handoff\` — generate testable specifications with HTML elements, keyboard behaviours, screen reader cues

## Install

\`\`\`bash
claude install github:Owl-Listener/inclusive-design-skills
\`\`\`

Or individual plugins:
\`\`\`bash
claude install github:Owl-Listener/inclusive-design-skills/cognitive-accessibility
\`\`\`

Compatible with Cursor, Gemini CLI, and other tools supporting SKILL.md format.

## Why use this

Traditional accessibility tools ask: "does code comply?"
These skills ask: "are design decisions right for actual users?"

Key distinction: they intervene *before* coding, not after. Standard audits catch problems once implementation exists — multiplying fix costs. These prompt early design-phase decisions.

The crucial gap they fill: **preserving institutional knowledge** so accessibility decisions survive team transitions and redesigns.`,
    output:
      "Design-phase accessibility reviews, inclusive personas, testable a11y specifications",
    landsIn: "Claude Code",
    tags: [
      "accessibility",
      "inclusive-design",
      "a11y",
      "cognitive",
      "personas",
      "wcag",
    ],
    files: [],
    attachments: [],
    actionType: "install",
    installCommand:
      "claude install github:Owl-Listener/inclusive-design-skills",
    sourceUrl:
      "https://marieclairedean.substack.com/p/i-built-40-inclusive-design-skills",
    linkedItems: ["Pre-Launch QA Agent"],
    author: "Marie Claire Dean",
    starred: true,
    usageCount: 0,
  },

  // ──────────────── 3. Grill Me — Requirements Stress-Test ────────────────
  {
    title: "Grill Me — Requirements Stress-Test",
    category: "skill",
    status: "tested",
    description:
      "Stress-tests your design requirements through decision trees before any coding begins. Forces you to resolve ambiguities upfront.",
    content: `# Grill Me Skill

Part of the julianoczkowski/designer-skills collection (7 skills that follow a real design process). Grill Me is skill #1 — the requirements validator.

## What it does

Stress-tests your design requirements through decision trees *before* any coding begins. Instead of letting vague requirements turn into wasted design work, it forces you to resolve ambiguities upfront.

## How it works

1. You describe what you want to build (e.g. "I want an asset management application")
2. Grill Me interrogates your requirements through structured decision trees
3. It identifies gaps, contradictions, and unstated assumptions
4. You get a validated, unambiguous brief before moving to design or code

## The full 7-skill process

1. **Grill Me** — stress-test requirements (this skill)
2. **Design Brief** — analyse codebase, generate design docs with emotional tone and visual references
3. **Information Architecture** — structure pages, navigation, content hierarchy
4. **Design Tokens** — create CSS custom properties
5. **Brief to Tasks** — break down into dependency-aware tasks
6. **Frontend Design** — build the actual UI
7. **Design Review** — analyse output via screenshots

## Install

\`\`\`bash
npx skills add julianoczkowski/designer-skills
\`\`\`

Installs all 7 skills. Grill Me is available as the first step in the workflow.

## Why use this

Prevents the most expensive kind of waste: building the wrong thing. Catches "I want an asset management app" vagueness before it becomes weeks of wasted design work.

Pairs well with the Design Review Agent for a full requirements → review loop.`,
    output:
      "Validated requirements brief with resolved ambiguities, identified gaps, and explicit assumptions",
    landsIn: "Claude Code",
    tags: [
      "requirements",
      "validation",
      "planning",
      "brief",
      "decision-tree",
    ],
    files: [],
    attachments: [],
    actionType: "install",
    installCommand: "npx skills add julianoczkowski/designer-skills",
    sourceUrl:
      "https://dev.to/aiforwork/7-claude-code-design-skills-that-follow-a-real-design-process-4f63",
    linkedItems: ["Design Review Agent"],
    author: "Julian Oczkowski",
    starred: false,
    usageCount: 0,
  },

  // ──────────────── 4. UX Designer Skill (19 sources) ────────────────
  {
    title: "UX Designer Skill (19 Sources)",
    category: "skill",
    status: "tested",
    description:
      "Comprehensive UX/UI guidance synthesised from 19 authoritative sources — NNG, WCAG 2.2, Material Design, Apple HIG, Laws of UX, and more.",
    content: `# UX Designer Skill

A Claude Code skill that provides comprehensive UX/UI design guidance based on modern best practices, synthesised from 19 authoritative sources.

## Sources integrated

1. Nielsen Norman Group (NNG)
2. WCAG 2.2
3. Material Design (Google)
4. Apple Human Interface Guidelines (HIG)
5. Laws of UX
6. Google PAIR (People + AI Research)
7. Microsoft HAX Toolkit
8. Baymard Institute
9. The A11y Project
10. web.dev
11. ...and 9 more industry-standard references

## What it does

Equips Claude with in-depth UX/UI design knowledge for:
- Creating interfaces and components following established patterns
- Design system creation with proper patterns and best practices
- Accessibility-first design decisions
- User research methodology guidance
- Information architecture principles
- Interaction design patterns

## Install

\`\`\`bash
claude install github:szilu/ux-designer-skill
\`\`\`

## Why use this

Cross-references 19 canonical sources in a single skill. Good as a second opinion alongside our existing UX Designer prompt — this one is more reference-heavy, ours is more workflow-oriented. Together they cover both theory and practice.`,
    output:
      "UX/UI design guidance grounded in 19 authoritative industry sources",
    landsIn: "Claude Code",
    tags: [
      "ux",
      "ui",
      "design-guidelines",
      "nng",
      "wcag",
      "material-design",
      "hig",
    ],
    files: [],
    attachments: [],
    actionType: "install",
    installCommand: "claude install github:szilu/ux-designer-skill",
    sourceUrl: "https://github.com/szilu/ux-designer-skill",
    linkedItems: ["Design Review Agent"],
    author: "szilu",
    starred: false,
    usageCount: 0,
  },
];
