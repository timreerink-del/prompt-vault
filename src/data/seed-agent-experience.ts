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

// Items in this file get the "agent-experience" tag so they surface under
// the Agent Experience sidebar filter. This is a topical filter (designing
// *for* and *with* AI agents) — it cross-cuts content types, so entries
// keep their native category (workflow / skill / agent).
export const AGENT_EXPERIENCE_DATA: SeedItem[] = [
  {
    title: "Four-phase Claude Design stack",
    category: "workflow",
    status: "active",
    description:
      "Phase-aware mental model for combining Claude Design, Figma, Claude Code, and Vercel into one designer-AI pipeline — with explicit handoffs instead of tool-mush.",
    content: `# Four-phase Claude Design stack

A mental model for combining AI design tools without mushing them together. The new Claude Design product fills the *exploration* slot; Figma stays as the systematization layer; Claude Code handles production; Vercel ships.

## The four phases

**1. Exploration — Claude Design**
Generate variations fast. Input design *intent* (emotional register, information hierarchy, differentiation strategy) — not just a feature brief. Reject default outputs: clean corners, blue-purple gradients, generic padding. If what comes back feels templated, you didn't specify hard enough.

**2. Systematization — Figma**
Structure components, states, responsive behavior. This is where the exploration becomes a *system* — and where human judgment about hierarchy and naming lives. Don't skip this to go straight from Claude Design to code; you'll lose the system.

**3. Production — Claude Code + GSD meta-prompting**
Claude Design emits a handoff command you paste into Claude Code; Claude Code fetches the design via API endpoint and generates deployable code. Use a Get Shit Done meta-prompting setup to keep the output shippable rather than clever.

**4. Shipping — Vercel**
Deploy. Gather user feedback. Return to phase 1 with new intent.

## The rule that holds it together

Judgment, taste, and instinct aren't prompt-engineering skills. AI produces breadth; designers must bring strategic direction. Without it, outputs homogenize — the "omologation" of AI-generated interfaces that all look and feel the same.`,
    output: "Phase-assigned workflow with explicit handoff points between Claude Design, Figma, Claude Code, and Vercel.",
    landsIn: "Claude.ai",
    tags: ["agent-experience", "workflow", "claude-design", "claude-code", "figma", "vercel"],
    files: [],
    author: "Tommaso Nervegna (Sorted Pixels)",
    starred: true,
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "https://nervegna.substack.com/p/claude-design-just-dropped-heres",
    linkedItems: [],
    usageCount: 0,
  },

  {
    title: "/team-onboarding — teammate ramp-up guide",
    category: "skill",
    status: "active",
    description:
      "Built-in Claude Code slash command that reads your local usage (history, installed skills, MCP servers, settings) and synthesizes an onboarding doc for new teammates joining your AI stack.",
    content: `# /team-onboarding

Native Claude Code command (v2.1.101+, enhanced in v2.1.111). Generates a ramp-up guide tailored to how you actually use Claude Code — which slash commands you run, which skills you've installed, which MCP servers you've configured, and which settings matter.

## Usage

\`\`\`
/team-onboarding
\`\`\`

Run it at the end of a working session or after setting up a new project. The output is a markdown doc a new teammate can read end-to-end to understand how to work inside your Claude Code setup.

## When to use

- Onboarding a designer to your team's AI stack
- Documenting a project's Claude workflow before handing it off
- Auditing your own setup ("what am I actually using?")
- Refresh the doc periodically — setups drift

## Why it matters for agent experience

The onboarding problem for AI stacks is unlike code onboarding: the "stack" lives in slash commands, skills, settings, and MCP registrations — not in code the new teammate can read. This command makes the invisible stack readable.`,
    output: "Markdown onboarding doc tailored to your current Claude Code setup.",
    landsIn: "Claude Code",
    tags: ["agent-experience", "claude-code", "onboarding", "team", "built-in"],
    files: [],
    author: "Anthropic (Claude Code v2.1.101)",
    starred: false,
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "https://code.claude.com/docs/en/changelog",
    linkedItems: [],
    usageCount: 0,
  },

  {
    title: "Brand learning onboarding pattern",
    category: "workflow",
    status: "active",
    description:
      "Pre-seed Claude Design with your brand (Figma files, codebase, website, reference screens) on first use — the derived design system becomes the default for every future project in the workspace.",
    content: `# Brand learning onboarding pattern

When you start a new Claude Design workspace, treat the first session as a setup ritual, not a design task. Teach Claude your house style *once* so every future prompt inherits it as default.

## The onboarding prompt

\`\`\`
Learn our brand. I'm attaching:
— our Figma design system [URL or file]
— our production codebase [URL or path]
— our live website [URL]
— 3 reference screens we consider on-brand [screenshots]

Extract:
1. Color tokens (primary, accent, neutral ramps, semantic)
2. Typographic scale (font families, sizes, weights, line-heights)
3. Spacing system (base unit, scale)
4. Component patterns (buttons, inputs, cards, navigation)
5. Voice & visual register (formal/playful, dense/spacious, dark/light)

Use these as workspace defaults for every future project unless I tell you otherwise. Show me the extracted system before locking it in.
\`\`\`

## Why this works

Claude Design's workspace-level brand learning is *persistent* — unlike per-prompt style instructions that have to be repeated every time. One upfront session pays back across every subsequent prompt in the workspace.

## When to refresh

- Brand updates (new colors, new type, new principles)
- Design system version bumps
- When you notice Claude drifting toward generic defaults (blue-purple gradients, etc.)`,
    output: "Persistent workspace-level design system locked in as Claude Design defaults.",
    landsIn: "Claude.ai",
    tags: ["agent-experience", "claude-design", "brand", "workspace", "onboarding"],
    files: [],
    author: "Pattern from Claude Design launch (Apr 17, 2026)",
    starred: false,
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "https://www.anthropic.com/news/claude-opus-4-7",
    linkedItems: [],
    usageCount: 0,
  },

  {
    title: "Designpowers — 10-agent design team",
    category: "agent",
    status: "active",
    description:
      "Open-source multi-agent system: 10 specialized agents run a 13-phase inclusive design process while the human acts as creative director. Direct mode approves each handoff; Auto mode proceeds with safeguards. MIT-licensed.",
    content: `# Designpowers

A team of 10 specialized Claude Code agents that run a complete inclusive design process with the human as creative director. Built by MC Dean.

## The 10 agents

1. **design-strategist** — Flows, IA, personas, design principles, journey maps
2. **design-scout** — Competitive research and pattern analysis
3. **inspiration-scout** — Aesthetic references and mood boards
4. **design-lead** — Visual design (layout, color, typography)
5. **motion-designer** — Animation, transitions, micro-interactions
6. **content-writer** — Interface copy at Grade 6 reading level
7. **design-builder** — Specifications to production code
8. **accessibility-reviewer** — WCAG + COGA compliance with fix loops
9. **design-critic** — Reviews work against brief, principles, personas
10. **heuristic-evaluator** — Nielsen's 10 heuristics + cognitive walkthroughs

## The 13-phase process

Discover → Research → Strategise → Taste → Inspire → Plan → Design → Build → Taste Check → Review → Fix → Ship → Retrospective

Agents pass work through a shared design state document. All handoffs are visible to the human director.

## Modes

- **Direct mode** — Human approves each handoff
- **Auto mode** — Agents proceed with safeguards between phases

## Install

\`\`\`bash
git clone https://github.com/Owl-Listener/designpowers.git
cd designpowers
\`\`\`

Follow the repo README for Claude Code integration steps. MIT licensed.`,
    output: "13-phase design artifact chain with agent-authored intermediate work at each handoff.",
    landsIn: "Claude Code",
    tags: ["agent-experience", "multi-agent", "design-process", "accessibility", "claude-code"],
    files: [],
    author: "MC Dean",
    starred: true,
    attachments: [],
    actionType: "install",
    installCommand: "git clone https://github.com/Owl-Listener/designpowers.git",
    sourceUrl: "https://github.com/Owl-Listener/designpowers",
    linkedItems: [],
    usageCount: 0,
  },
];
