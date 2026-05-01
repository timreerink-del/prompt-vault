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

// Weekly scout — 2026-W17 (Apr 18–24).
// Picks that fill real gaps in the existing vault. Sorted Pixels' Claude Design
// workflow was considered but is already covered by "Four-phase Claude Design
// stack" (seed-agent-experience.ts, W16) — same author, same source URL.
export const SCOUT_W17_DATA: SeedItem[] = [
  // ──────────────── 1. diagram-design ────────────────
  {
    title: "Diagram Design — Brand-Aware Editorial Diagrams",
    category: "skill",
    status: "active",
    description:
      "14 editorial-quality diagram types in self-contained HTML+SVG, auto-styled from your live brand tokens. WCAG AA contrast-verified.",
    content: `# Diagram Design

Claude Code skill that generates editorial-quality diagrams matching your brand's colors and typography. Extracts design tokens from your website on-the-fly and applies them across every diagram type.

## What it generates

14 diagram types:
- Architecture
- Flowchart
- Sequence
- State machine
- ER / data model
- Timeline
- Swimlane
- Quadrant
- Nested hierarchy
- Tree
- Layer stack
- Venn diagram
- Pyramid / funnel
- Consultant 2×2 scenario matrix

Each rendered in three variants: minimal light, minimal dark, full editorial.

## Install

Via plugin marketplace:

\`\`\`
/plugin marketplace add cathrynlavery/diagram-design
/plugin install diagram-design@diagram-design
\`\`\`

Or via git clone + symlink:

\`\`\`bash
git clone git@github.com:cathrynlavery/diagram-design.git ~/code/diagram-design
ln -s ~/code/diagram-design/skills/diagram-design ~/.claude/skills/diagram-design
\`\`\`

## Why use this

The existing vault covers design-token extraction and design-system audits, but nothing that *consumes* those tokens to produce communication artifacts. This skill plugs into a handoff/case-study workflow: feed it your URL, get on-brand diagrams back as self-contained HTML (no build step) suitable for docs, decks, or PR descriptions.

## Notable technical choices

- Self-contained HTML + SVG output — drops into any context without a bundler
- Automatic brand extraction from the URL you provide
- WCAG AA contrast verification baked into rendering`,
    output:
      "Self-contained HTML+SVG diagrams styled with your brand tokens, in 14 editorial diagram types across 3 rendering variants.",
    landsIn: "Claude Code",
    tags: [
      "diagram",
      "visualization",
      "design-system",
      "handoff",
      "documentation",
      "svg",
    ],
    files: [],
    attachments: [],
    actionType: "install",
    installCommand:
      "/plugin marketplace add cathrynlavery/diagram-design",
    sourceUrl: "https://github.com/cathrynlavery/diagram-design",
    linkedItems: [],
    author: "Cathryn Lavery",
    starred: false,
    usageCount: 0,
  },

  // ──────────────── 2. design-extract / designlang ────────────────
  {
    title: "design-extract — Live Design System Ripper",
    category: "skill",
    status: "active",
    description:
      "Point at a live URL, get 17+ files back: DTCG tokens, Tailwind config, Figma variables, component anatomy, a11y audit — plus drift/lint/visual-diff companion commands.",
    content: `# design-extract (designlang)

Claude Code skill that rips a complete design system from any live URL. Analyzes live DOM styles, then emits a multi-platform token package and companion tooling for maintaining the extracted system.

## Invoke

\`\`\`
/extract-design <url>
\`\`\`

## What you get back

17+ generated files including:
- **DTCG tokens** (design-tokens.json)
- **Tailwind config**
- **Figma variables** (import-ready)
- **Component anatomy** (buttons, inputs, cards, navigation)
- **Accessibility audit** (contrast, focus states, touch targets)

Multi-platform exports: iOS SwiftUI, Android Compose, Flutter, shadcn/ui, WordPress.

## Companion commands

Beyond one-shot extraction, the underlying \`designlang\` tool ships:

- \`designlang score\` — quantify a design's fidelity to its extracted system
- \`designlang drift\` — detect divergence between current implementation and the extracted baseline
- \`designlang lint\` — flag token violations in a codebase
- \`designlang visual-diff\` — screenshot-level diff between two design states

## Install

\`\`\`bash
npx skills add Manavarya09/design-extract
\`\`\`

## Why use this

The vault already has a token-extraction prompt, but the real differentiator here is the companion tooling — drift, lint, and visual-diff turn a one-shot extraction into an ongoing design-system health check. Use it for:

- Reverse-engineering a competitor's system as a starting point
- Documenting your own site's implicit system
- Ongoing drift monitoring after a redesign

## Version

v10.5.0 "Forms & States" (2026-04-22) — active weekly release cadence.`,
    output:
      "17+ files: DTCG tokens, Tailwind config, Figma variables, component anatomy, accessibility audit, plus drift/lint/visual-diff utilities.",
    landsIn: "Claude Code",
    tags: [
      "design-tokens",
      "design-system",
      "extraction",
      "tailwind",
      "figma",
      "accessibility",
      "drift-detection",
    ],
    files: [],
    attachments: [],
    actionType: "install",
    installCommand: "npx skills add Manavarya09/design-extract",
    sourceUrl: "https://github.com/Manavarya09/design-extract",
    linkedItems: [],
    author: "Manavarya",
    starred: false,
    usageCount: 0,
  },

  // ──────────────── 3. Sub-agent per design role ────────────────
  {
    title: "Sub-agent per design role",
    category: "workflow",
    status: "active",
    description:
      "Treat recurring design tasks as named agents — each with its own context window, tool access, and permissions — instead of running them in a single sprawling session.",
    content: `# Sub-agent per design role

A framing pattern from Nick Babich (UX Planet, 2026-04-03): move recurring product-design tasks out of one sprawling Claude session into dedicated sub-agents. Each agent has:

- Its **own context window** (fresh, unpolluted by unrelated prior turns)
- **Designated tool access** (only the MCP servers / skills the role needs)
- **Specific permission levels** (auto-approve for narrow tasks, prompt for destructive ones)

## The pattern

Pick 3–5 roles you run repeatedly. For each, spec:

1. **Role name** — e.g. "ui-auditor", "copy-reviewer", "handoff-packager"
2. **Charter** — one sentence describing what this agent does and explicitly does *not* do
3. **Tools** — the minimum set of MCP servers / skills it needs
4. **Permissions** — read-only by default; write/delete only when the charter requires it
5. **Trigger** — the slash command or phrase that invokes it

## Babich's starter set (three example roles)

- **Code Review Agent** — reviews implementation against design spec
- **Documentation Agent** — writes user-facing docs in the product's voice
- **Security Audit Agent** — flags exposed secrets, insecure patterns, a11y-as-security overlaps

His article promises 5 ready-to-use design-specific agents (UI auditor, research synthesizer, etc.) but the full templates are member-only. The reusable *pattern* is the value here: you draft your own agents from your team's actual repeating tasks.

## Why this matters

Running everything in one session has two failure modes: context pollution (earlier unrelated turns bias later outputs) and permission over-grant (the single session has every tool, so a typo in one prompt can move files for the wrong task).

Per-role agents fix both, at the cost of upfront specification work.

## Starting prompt

\`\`\`
I want to define a sub-agent for my Claude Code setup.

Role name: [name]
Charter: [one sentence — what it does and does NOT do]
Needed tools: [list of MCP servers / skills]
Permissions: [read-only / write / destructive]
Trigger: [/command or phrase]

Write the agent spec file in the format Claude Code expects.
Then tell me what to save it as and where.
\`\`\``,
    output:
      "A per-role sub-agent spec file with scoped tools, permissions, and a clear trigger — ready to drop into Claude Code's agents directory.",
    landsIn: "Claude Code",
    tags: [
      "agent-experience",
      "sub-agents",
      "claude-code",
      "workflow",
      "permissions",
    ],
    files: [],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl:
      "https://uxplanet.org/how-to-automate-product-design-tasks-with-claude-code-5284b5e8c9e0",
    linkedItems: [],
    author: "Nick Babich (UX Planet)",
    starred: false,
    usageCount: 0,
  },
];
