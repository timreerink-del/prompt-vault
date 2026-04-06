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
    description: "Autonomous design audit — UX + visual + copy in one run. Upload screenshot or Figma URL.",
    content: `# Design Review Agent

## What does this do?
Runs a complete design review in 3 steps: UX audit, visual critique, and copy review. Combines 3 skills and 3 prompts automatically.

## Requirements
- CLAUDE.md loaded as context
- reference/aesthetics/visual-language.md available
- Screenshot or Figma URL of the screen to review

## Steps

### Step 1: UX Review
Load: skills/ux-designer/SKILL.md
Run: "Review a user flow" prompt
→ Identify friction points, missing feedback states, flow issues

### Step 2: Visual Review
Load: skills/ui-designer/SKILL.md
Run: "Review screen against visual language" prompt
→ Check color usage, typography hierarchy, spacing, design system compliance

### Step 3: Copy Review
Load: skills/ux-copywriter/SKILL.md
Run: "Write microcopy" prompt (review mode)
→ Evaluate button labels, error messages, empty states, tone of voice

## Output
Combined audit with:
- UX friction score + 3 improvement points
- Visual compliance score /10 + token recommendations
- Copy variants (warm vs direct) per element
- Prioritized action list

## Usage
\`\`\`
Load CLAUDE.md + visual-language.md
Upload: [screenshot]
Run: "Run a complete design review on this screen"
\`\`\``,
    output: "Complete design audit: UX friction + visual compliance + copy review + prioritized action list",
    landsIn: "Claude.ai",
    tags: ["agent", "review", "ux", "ui", "copy", "audit"],
    files: ["CLAUDE.md", "skills/ux-designer/SKILL.md", "skills/ui-designer/SKILL.md", "skills/ux-copywriter/SKILL.md", "reference/aesthetics/visual-language.md"],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["UX Designer", "UI Designer", "UX Copywriter", "Review a user flow", "Review screen against visual language", "Write microcopy"],
    author: "Tim",
    starred: true,
    usageCount: 0,
  },
  {
    title: "Figma-to-Code Agent",
    category: "agent",
    status: "active",
    description: "From Figma design to production-ready React code — tokens, components, 1:1 fidelity",
    content: `# Figma-to-Code Agent

## What does this do?
Takes a Figma design and produces production-ready code in 3 steps: token extraction, component implementation, and visual polish.

## Requirements
- Figma MCP installed (see "Figma + MCP Setup" workflow)
- Figma node URL of the design to implement

## Setup (one-time)
\`\`\`bash
claude mcp add figma-console -s user \\
  -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN \\
  -e ENABLE_MCP_APPS=true \\
  -- npx -y figma-console-mcp@latest
\`\`\`

## Steps

### Step 1: Token Extraction
Run: "Design Token Extraction from Figma" prompt
→ Generate CSS custom properties with semantic naming

### Step 2: Component Implementation
Load: skills/implement-design/SKILL.md
→ Translate Figma hierarchy to React components with exact spacing, colors, typography

### Step 3: Visual Polish
Load: skills/frontend-design/SKILL.md
→ Add hover states, transitions, scroll-triggered animations
→ Ensure responsive breakpoints

## Output
- CSS custom properties file with design tokens
- React/HTML components that match Figma 1:1
- Responsive layout with breakpoints
- Hover states and micro-interactions

## Usage
\`\`\`
Figma URL: [paste node URL]
Run: "Implement this Figma design as React components"
\`\`\``,
    output: "Production-ready React components + CSS tokens that match Figma 1:1",
    landsIn: "Claude Code",
    tags: ["agent", "figma", "code", "react", "tokens", "implementation"],
    files: [".claude/skills/implement-design/SKILL.md", "skills/frontend-design/SKILL.md", "Figma MCP"],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["Implement Design (Figma → Code)", "Frontend Design", "Design Token Extraction from Figma", "Figma + MCP Setup"],
    author: "Tim",
    starred: true,
    usageCount: 0,
  },
  {
    title: "UX Research Synthesis Agent",
    category: "agent",
    status: "active",
    description: "From raw interviews to personas, journey maps and opportunities — complete research synthesis",
    content: `# UX Research Synthesis Agent

## What does this do?
Takes raw research data (interview transcripts, notes) and produces a complete synthesis: themes, personas, journey map, and prioritized opportunities.

## Requirements
- Interview transcripts or research notes (paste as text or upload)

## Steps

### Step 1: Transcript Analysis
Run: "User Interview Transcript Analysis"
→ Extract: key quotes, pain points, goals, workarounds, emotional moments
→ Synthesize: themes, unique insights, contradictions

### Step 2: Persona Creation
Run: "User Persona Generator"
→ Generate 2 distinct personas from the research data
→ Goals, frustrations, motivations, typical day

### Step 3: Journey Mapping
Run: "User Journey Map"
→ Map the complete journey per persona
→ Actions, thoughts, feelings, touchpoints, pain points

## Output
- Research synthesis: themes + key quotes + contradictions
- 2 user personas with behavioral patterns
- Journey map with emotional temperature per step
- Top 3 opportunities with evidence from data

## Usage
\`\`\`
Upload: [interview transcripts]
Run: "Analyze these interviews and create personas + journey map"
\`\`\``,
    output: "Research synthesis + 2 personas + journey map + top 3 opportunities with evidence",
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
    description: "Complete pre-launch check — UX, accessibility, performance, design system, heuristics in one run",
    content: `# Pre-Launch QA Agent

## What does this do?
Runs 5 audits on a codebase/URL before launch: UX friction, WCAG accessibility, performance, design system consistency, and heuristic evaluation.

## Requirements
- Access to the codebase (Claude Code) or live URL
- Description of the target audience and product type

## Steps

### Step 1: UX Friction Audit
Run: "UX Friction Audit"
→ Friction points, unclear affordances, missing feedback states

### Step 2: Accessibility Audit
Run: "Accessibility Pre-Launch Audit"
→ WCAG AA compliance: contrast, keyboard nav, ARIA, focus states

### Step 3: Performance Audit
Run: "Performance Audit"
→ Unused CSS/JS, synchronous loading, uncompressed assets

### Step 4: Design System Audit
Run: "Design System Audit"
→ Hardcoded values, inconsistent spacing, token drift

### Step 5: Heuristic Evaluation
Run: "Heuristic Evaluation"
→ Nielsen's 10 heuristics per step in the flow

## Output
Combined QA report with:
- UX friction score + fixes
- WCAG compliance status + failing elements
- Performance top 5 fixes
- Design system drift report
- Heuristic violations per severity
- Prioritized master action list

## Usage
\`\`\`
Context: [product type] for [target audience]
Run: "Run a complete pre-launch QA on this codebase"
\`\`\``,
    output: "Combined QA report: UX + a11y + performance + design system + heuristics",
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
    description: "Build or audit a complete design system — tokens, typography, colors, theming",
    content: `# Design System Agent

## What does this do?
Builds a complete design system OR audits an existing one. Combines token extraction, system generation, consistency audit, and CSS theming.

## Requirements
- Figma file (for new system) OR existing codebase (for audit)
- Optional: npx skills add nicepkg/ui-ux-pro-max -g

## Steps

### Step 1: Token Extraction (if Figma available)
Run: "Design Token Extraction from Figma"
→ Spacing, typography, colors, border-radius, shadows as CSS custom properties

### Step 2: System Generation
Run: "Design System Generator" (UI/UX Pro Max)
→ Complete palette, type scale, spacing scale, component patterns, anti-patterns

### Step 3: Consistency Audit
Run: "Design System Audit"
→ Hardcoded values, inconsistent spacing, token drift

### Step 4: Theming
Run: "CSS Theming System"
→ Light/dark mode with WCAG-passing contrast, smooth transitions

## Output
- CSS custom properties with semantic naming
- Complete design system spec
- Drift audit report with file paths + line numbers
- Light/dark mode theming system

## Usage
\`\`\`
Figma: [URL] or Codebase: [path]
Run: "Build a design system" or "Audit the existing design system"
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
    description: "Complete UX copy workflow — microcopy, variants, and multi-market localization check",
    content: `# UX Copy Agent

## What does this do?
Writes and reviews all interface copy in 3 steps: skill-based copy, full state coverage, and multi-market localization check.

## Requirements
- Component/screen description
- Target markets (optional, for localization)

## Steps

### Step 1: Write Microcopy
Load: skills/ux-copywriter/SKILL.md
Run: "Write microcopy"
→ 2 variants per element: warm + direct
→ Context: user emotion, screen goal

### Step 2: Full State Coverage
Run: "Microcopy Generator (full)"
→ Headlines, CTAs, error states, empty states, loading, success per screen
→ Helper text, tooltips

### Step 3: Localization Check
Run: "Multi-market copy check"
→ Flag translation problems for CH/IT/NL/FR
→ Cultural assumptions, idioms that break, length issues

## Output
- Copy variants (warm + direct) per element
- Complete copy set for all states
- Localization audit with flags per market

## Usage
\`\`\`
Component: [description]
Context: user just [action], feels [emotion]
Markets: [CH, IT, NL, FR]
Run: "Write all copy for this screen and check for multi-market"
\`\`\``,
    output: "Copy variants + full state coverage + localization audit",
    landsIn: "Claude.ai",
    tags: ["agent", "copy", "microcopy", "localization", "ux-writing"],
    files: ["skills/ux-copywriter/SKILL.md"],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["UX Copywriter", "Write microcopy", "Microcopy Generator (full)", "Multi-market copy check"],
    author: "Tim",
    starred: false,
    usageCount: 0,
  },
  {
    title: "Stakeholder Prep Agent",
    category: "agent",
    status: "active",
    description: "Prepare for design reviews and stakeholder presentations — objectives, pushback, framing",
    content: `# Stakeholder Prep Agent

## What does this do?
Prepares you fully for a design review or stakeholder presentation. Generates objectives, expected questions, pushback framing, and an update draft.

## Requirements
- CLAUDE.md + memory/projects/active.md loaded
- Project name, attendees, what you're showing

## Steps

### Step 1: Review Prep
Run: "Prepare design review"
→ Objectives, questions to ask, expected pushback per person
→ Scope: where you DON'T ask for feedback

### Step 2: Critique Framing
Run: "Design Critique Framing"
→ Structure feedback on 5 axes: user impact, system compliance, hierarchy, edge cases, feasibility
→ Frame as "[observation] because [impact], consider [alternative]"

## Output
- Review prep: objectives + anticipated pushback
- Critique framing: structured feedback per axis

## Usage
\`\`\`
Load: CLAUDE.md + memory/projects/active.md
Project: [name]
Attendees: [names]
What I'm showing: [description]
Run: "Prepare my design review"
\`\`\``,
    output: "Review prep + critique framing",
    landsIn: "Claude.ai",
    tags: ["agent", "review", "stakeholder", "prep", "presentation"],
    files: ["CLAUDE.md", "memory/projects/active.md"],
    attachments: [],
    actionType: "copy",
    installCommand: "",
    sourceUrl: "",
    linkedItems: ["Prepare design review", "Design Critique Framing"],
    author: "Tim",
    starred: false,
    usageCount: 0,
  },
  {
    title: "Developer Handoff Agent",
    category: "agent",
    status: "active",
    description: "Generate a complete developer handoff — specs, states, edge cases, QA checklist",
    content: `# Developer Handoff Agent

## What does this do?
Generates a complete developer handoff package including measurements, interactive states, responsive rules, edge cases, and QA checklist. Optional design system consistency check.

## Requirements
- Screen/component description or Figma URL
- Optional: access to codebase for design system audit

## Steps

### Step 1: Handoff Spec
Run: "Developer Handoff Package"
→ Measurements (px + rem), color tokens, typography specs
→ Interactive states: default, hover, active, disabled, focus, loading, error, success
→ Responsive breakpoints + layout adaptation
→ Edge cases: long text, missing data, 0 items, many items
→ Animation specs: duration, easing, properties
→ QA checklist

### Step 2: Design System Check (optional)
Run: "Design System Audit"
→ Verify the spec is consistent with the existing design system
→ Flag hardcoded values that should be tokens

## Output
- Complete handoff spec with all measurements
- Interactive states per component
- Responsive rules
- Edge case handling
- QA checklist for the engineer
- Optional: design system compliance report

## Usage
\`\`\`
Component: [description or Figma URL]
Run: "Generate a developer handoff for this component"
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
