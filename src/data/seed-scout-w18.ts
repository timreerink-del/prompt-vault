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

// Weekly scout — 2026-W18 (Apr 27 – May 3).
// Post-Claude-Design-launch week 2: the ecosystem moved from "what is this"
// to "how do I actually use it." Three picks that fill real gaps in the vault:
// a chained 10-prompt workflow, a meta-practice note, and a CLAUDE.md framing
// from Anthropic itself. Skipped Zieminski (paywalled).
export const SCOUT_W18_DATA: SeedItem[] = [
  // ──────────────── 1. Pillitteri — chained 10-prompt sequence ────────────────
  {
    title: "Senior UX Designer Workflow — 10-Prompt Sequence",
    category: "workflow",
    status: "active",
    description:
      "Ten prompts run in order inside one Claude Design project so each step inherits the prior context — IA through prototype testing.",
    content: `# Senior UX Designer Workflow — 10-Prompt Sequence

A chained workflow from Pasquale Pillitteri (2026-04-27): instead of asking Claude Design for a finished product in one prompt, run ten role-scoped prompts inside the same project. Each subsequent prompt inherits the design system, brand, and IA from the prior one — output stays coherent across the whole flow.

## The sequence

\`\`\`
01  Information Architect       → product structure, nav, content taxonomy, flows
02  Zero-Budget Researcher      → interview guide, card sort, testing protocol
03  Design System from Scratch  → tokens, colors, type scale, component specs
04  Microcopy Writer            → onboarding copy, errors, labels, CTAs
05  Activation/Onboarding       → minimum steps to first value (under 10 min)
06  Usability Auditor           → Nielsen heuristic eval + friction map
07  Data Dashboard Designer     → metric layout, charts, filters, hierarchy
08  WCAG + EAA Expert           → European Accessibility Act compliance + remediation
09  GDPR-Compliant Form Designer→ field design, validation, privacy disclosures
10  Prototype Tester (No Tools) → think-aloud protocol, task list, 48-hour synthesis
\`\`\`

## Why the order matters

Run them out of order and you re-spec the same fundamentals five times. Run them in order and prompt 04 already knows what tone the brand wants because prompt 03 set the foundation; prompt 09 already knows what data the form collects because prompt 01 mapped it.

The two prompts most worth lifting on their own:

- **Prompt 08 — WCAG + EAA Expert.** The European Accessibility Act lens is rare in English-language prompt packs. Generates remediation plans aligned to EU enforcement, not just WCAG AA.
- **Prompt 09 — GDPR-Compliant Form Designer.** Combines conversion optimization with privacy disclosure design — the two usually get prompted separately.

## How to run

Open one Claude Design project. Paste prompt 01. Refine until the IA holds. Then prompt 03 to lock the system. From there, prompts 04–10 inherit both. If you skip 03, every later prompt drifts.

## Where the full prompts live

The full prompt text is on the source page below — Pillitteri publishes them in the open. No paywall.`,
    output:
      "A coherent product spec built across 10 chained prompts: IA, research plan, design system, copy, onboarding, usability audit, dashboard, EAA accessibility plan, GDPR-compliant forms, and a tooling-free prototype test plan.",
    landsIn: "Claude Design",
    tags: [
      "workflow",
      "claude-design",
      "chained-prompts",
      "accessibility",
      "eaa",
      "gdpr",
      "design-system",
    ],
    files: [],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl:
      "https://pasqualepillitteri.it/en/news/1486/claude-design-prompts-senior-ux-designer-guide",
    linkedItems: [],
    author: "Pasquale Pillitteri",
    starred: false,
    usageCount: 0,
  },

  // ──────────────── 2. Muzli — Claude Design operating principles ────────────────
  {
    title: "Claude Design — Operating Principles",
    category: "workflow",
    status: "active",
    description:
      "Five durable practices from week-one power users: token economy, dense first prompts, brand kit on day one, parallel variations, intent-preserving handoff.",
    content: `# Claude Design — Operating Principles

Not a prompt — a meta-practice note. Distilled from Muzli's week-one retro on Claude Design (2026-04-27). Five rules that change the unit economics of working with the tool.

## The five

**1. Tweaks panel beats chat for non-structural edits.**
Sliders for typography, color, spacing and section reordering don't consume chat tokens. Save chat for structural changes. On Pro/Max plans this is the difference between hitting your weekly limit on Wednesday and finishing the project.

**2. Write dense first prompts.**
Audience + content + visual tone + constraints in one paragraph. Hits usable first-draft quality ~2/3 of the time. Vague first prompts almost never do — and burn tokens recovering.

**3. Set the brand kit on day one.**
The single highest-leverage task in any Claude Design project. Point it at your codebase, design files, or reference screenshots before asking for any output. Every later prompt inherits.

**4. Request three variations, not one refinement.**
Linear refinement on a single direction is a tax. "Show me three versions, each with a different aesthetic angle" is exponentially faster to good output.

**5. Hand off to Claude Code with intent, not just files.**
The design → dev handoff preserves architectural decisions when you tell Claude Code *why* the design is the way it is. Files alone lose the constraint reasoning.

## How to use this entry

Stick the five principles at the top of any \`CLAUDE.md\` you use for design work. They are pre-prompts, not prompts. They change *how* you talk to Claude Design, not *what* you ask for.`,
    output:
      "Five operating rules to embed at the top of a Claude Design CLAUDE.md or session: tweaks-over-chat, dense first prompts, day-one brand kit, parallel variations, intent-preserving handoff.",
    landsIn: "Claude Design",
    tags: [
      "claude-design",
      "technique",
      "claude-md",
      "token-economy",
      "handoff",
    ],
    files: [],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl:
      "https://muz.li/blog/claude-design-one-week-in-hacks-best-practices-tips-from-real-world-use/",
    linkedItems: [],
    author: "Muzli",
    starred: false,
    usageCount: 0,
  },

  // ──────────────── 3. Anthropic — onboarding-style CLAUDE.md ────────────────
  {
    title: "CLAUDE.md as New-Hire Onboarding",
    category: "workflow",
    status: "active",
    description:
      "Reframe CLAUDE.md the way you'd ramp a new dev: load-bearing context, what to avoid, who to ask — not a code style guide.",
    content: `# CLAUDE.md as New-Hire Onboarding

A framing shift from Anthropic's own engineering team (claude.com/blog, 2026-04-28). They tested Claude Code on a 17-year-old, 700K-line C# codebase (Skyline / MacCoss Lab) and found that the CLAUDE.md files that worked weren't style guides — they were onboarding docs.

## The shift

Don't write CLAUDE.md to teach Claude *how to write code*. Write it to teach Claude *how this codebase actually works*. Same way you'd ramp a new senior hire who already knows the language.

## Three sections worth stealing

\`\`\`
## Load-bearing context
What this codebase does, who uses it, what historical decisions are
non-obvious from the code itself. The stuff a new hire would need a
human to explain because git blame won't.

## What to avoid
Patterns that look reasonable but are wrong here. Files that look like
they should be edited but are generated. APIs that exist but are
deprecated and shouldn't be reused.

## Who to ask
Which team owns which area. Where to find domain experts. What's
documented in the wiki vs. what only lives in someone's head.
\`\`\`

## Why this works on legacy code

The pain point on a 17-year-old codebase isn't syntax — Claude can read C#. The pain point is *implicit context*: why \`UpdateLegacyXmlSchema()\` exists, why nobody touches \`/old/\`, why the third-party lib in \`/vendor/\` is pinned to a 2014 version.

A style-guide CLAUDE.md doesn't help with that. An onboarding CLAUDE.md does — it surfaces the institutional memory Claude can't infer.

## Use it for

- Inheriting a codebase you didn't build
- Onboarding Claude to a complex Figma library or design system
- Any project where the *why* matters more than the *what*

## Source

Full post: Anthropic blog, "Onboarding Claude Code like a new developer: Lessons from 17 years of development" (Apr 28, 2026 per blog index).`,
    output:
      "A CLAUDE.md template structured as new-hire onboarding (load-bearing context, what to avoid, who to ask) — surfaces institutional memory Claude can't infer from the code.",
    landsIn: "Claude Code",
    tags: [
      "claude-md",
      "claude-code",
      "onboarding",
      "legacy-code",
      "context-engineering",
    ],
    files: [],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl:
      "https://claude.com/blog/onboarding-claude-code-like-a-new-developer-lessons-from-17-years-of-development",
    linkedItems: [],
    author: "Anthropic",
    starred: false,
    usageCount: 0,
  },
];
