-- Seed data for entries table
-- Auto-generated from seed.ts, seed-agents.ts, and seed-ux-collection.ts

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('UX Designer', 'ux-designer', 'skill', 'skill', 'Flows, user psychology, information architecture, wireframes, usability', $$Expert UX design thinking. Activates when building, reviewing, or discussing any user-facing interface.

Triggers: user flows, wireframes, prototypes, usability, information architecture, 'how should this flow', 'make it easier'.

---

Output: UX audit, flow recommendations, wireframe descriptions, usability analysis$$, '{}', NULL, ARRAY['ux', 'design', 'flows'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('UI Designer', 'ui-designer', 'skill', 'skill', 'Visual craft, components, design tokens, spacing, typography, color, dark mode', $$Expert visual design craft. 8pt grid spacing, mathematical type scale (1.2 ratio), 60-30-10 color rule.

Buttons and inputs share same height scale (32-48px). Max 4 font sizes. Border-radius: pick ONE style.

---

Output: Visual audit (score /10), component specs, design token recommendations$$, '{}', NULL, ARRAY['ui', 'design', 'visual', 'tokens'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('UX Copywriter', 'ux-copywriter', 'skill', 'skill', 'Microcopy, button labels, error messages, empty states, tooltips, tone of voice', $$UX Copy Specialist. Words are interface — every label, message, tooltip is a design decision.

Triggers: microcopy, UX copy, button label, error message, empty state, onboarding text.

---

Output: Microcopy variants (warm vs direct), copy audit, tone of voice guide$$, '{}', NULL, ARRAY['copy', 'ux', 'microcopy'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Implement Design (Figma → Code)', 'implement-design-figma-code', 'skill', 'skill', 'Translates Figma designs to production-ready code via Figma MCP — 1:1 fidelity', $$Requires: Figma MCP server.
Extracts design tokens, component hierarchy, spacing, colors directly from Figma.

---

Output: Production-ready React/HTML components that match Figma 1:1$$, '{}', NULL, ARRAY['figma', 'code', 'mcp'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Frontend Design', 'frontend-design', 'skill', 'skill', 'Production-grade interfaces with high design quality — no generic AI aesthetics', $$Bold aesthetic direction. Distinctive fonts (never Arial/Inter/Roboto). CSS variables. Staggered reveals, scroll-triggering, hover states.

---

Output: Complete React/HTML components with polished visual design$$, '{}', NULL, ARRAY['frontend', 'design', 'react'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('DOCX Creator', 'docx-creator', 'skill', 'skill', 'Word documents create, read, edit — table of contents, headings, tables', $$npm install -g docx. US Letter = 12240×15840 DXA. Never use unicode bullets.

---

Output: .docx files with professional formatting$$, '{}', NULL, ARRAY['docx', 'word'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('PDF Creator & Reader', 'pdf-creator-reader', 'skill', 'skill', 'Read, create, merge, split PDF files, watermarks, OCR', $$Everything with PDF files: read, extract, combine, split, rotate, OCR.

---

Output: .pdf files, extracted text/tables$$, '{}', NULL, ARRAY['pdf', 'document'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('PPTX Presentations', 'pptx-presentations', 'skill', 'skill', 'PowerPoint presentations create, read, edit', $$Any task involving a .pptx file.

---

Output: .pptx presentation files$$, '{}', NULL, ARRAY['pptx', 'slides'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('XLSX Spreadsheets', 'xlsx-spreadsheets', 'skill', 'skill', 'Spreadsheets create, read, edit — formulas, charts, data cleaning', $$Spreadsheet as primary input or output: .xlsx, .xlsm, .csv, .tsv.

---

Output: .xlsx spreadsheet files$$, '{}', NULL, ARRAY['xlsx', 'data'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Canvas Design', 'canvas-design', 'skill', 'skill', 'Visual art in .png and .pdf — posters, art, static pieces', $$Step 1: Design Philosophy Creation (.md)
Step 2: Express on canvas (.pdf or .png)

---

Output: .png or .pdf visual designs$$, '{}', NULL, ARRAY['design', 'art', 'poster'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Skill Creator', 'skill-creator', 'skill', 'skill', 'Create new skills, improve existing ones, run evaluations', $$Create a skill, test with prompts, evaluate qualitatively and quantitatively.

---

Output: SKILL.md files, eval results$$, '{}', NULL, ARRAY['skill', 'meta'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Doc Co-Authoring', 'doc-coauthoring', 'skill', 'skill', 'Structured workflow for collaborative writing of docs, proposals, specs', $$3 phases: Context Gathering → Refinement & Structure → Reader Testing.

---

Output: Structured documents, proposals, specs$$, '{}', NULL, ARRAY['writing', 'docs'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('MCP Builder', 'mcp-builder', 'skill', 'skill', 'Build MCP servers — Python (FastMCP) or Node/TypeScript (MCP SDK)', $$Guide for MCP servers that connect LLMs with external services.

---

Output: Working MCP server code$$, '{}', NULL, ARRAY['mcp', 'server', 'api'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Internal Comms', 'internal-comms', 'skill', 'skill', 'Status reports, leadership updates, stakeholder updates, newsletters', $$Stakeholder updates (Progress, Plans, Problems), newsletters, FAQ, incident reports.

---

Output: Formatted internal communications$$, '{}', NULL, ARRAY['comms', 'writing'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Theme Factory', 'theme-factory', 'skill', 'skill', '10 pre-set themes for artifacts — slides, docs, HTML pages', $$Styling toolkit with 10 pre-set themes. Applicable to slides, docs, HTML.

---

Output: Styled artifacts with consistent theme$$, '{}', NULL, ARRAY['theme', 'styling'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Web Artifacts Builder', 'web-artifacts-builder', 'skill', 'skill', 'Complex multi-component artifacts with React, Tailwind, shadcn/ui', $$For complex artifacts with state management, routing, shadcn/ui.

---

Output: Multi-component React artifacts$$, '{}', NULL, ARRAY['react', 'artifacts'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Algorithmic Art', 'algorithmic-art', 'skill', 'skill', 'Generative art with p5.js — flow fields, particle systems', $$p5.js with seeded randomness. Output: .md, .html (viewer), .js.

---

Output: Interactive generative artworks$$, '{}', NULL, ARRAY['art', 'generative', 'p5js'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Product Self-Knowledge', 'product-self-knowledge', 'skill', 'skill', 'Facts about products: API, pricing, plans', $$Consult when response contains specific facts about products.

---

Output: Accurate product information$$, '{}', NULL, ARRAY['product'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Review a user flow', 'review-a-user-flow', 'prompt', 'prompt', 'Feedback on a flow — onboarding, feature adoption, profile setup', $$Load: CLAUDE.md + skills/ux-designer/SKILL.md + reference/aesthetics/visual-language.md

I'm designing the [flow name] for [project name].
The user is a [user type].
Here is the current flow: [describe or screenshot]

Review against our design principles. Where does it create friction?
What would modern competitors do differently? Give me 3 specific improvements.

---

Output: UX audit with 3 concrete improvement points, friction analysis$$, '{}', NULL, ARRAY['ux', 'review', 'flow'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Review screen against visual language', 'review-screen-against-visual-language', 'prompt', 'prompt', 'Visual critique of a screen — include screenshot', $$Load: CLAUDE.md + skills/ui-designer/SKILL.md + reference/aesthetics/visual-language.md
Attach: screenshot

Review this screen against our visual language.
— Is color used functionally or decoratively?
— Does the typography hierarchy work?
— Are we using [primary color] only for actions, or is it leaking?
Be direct. I'm looking for signal, not compliments.

---

Output: Visual audit: color usage, typography, hierarchy, strengths/weaknesses$$, '{}', NULL, ARRAY['ui', 'review', 'visual'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Write microcopy', 'write-microcopy', 'prompt', 'prompt', 'Button labels, error messages, empty states — 2 variants', $$Load: CLAUDE.md + skills/ux-copywriter/SKILL.md

Write the copy for the [component].

Context:
— The user just [action]
— They feel: [emotion]
— This screen must: [goal]

Tone: favorite coffee colleague, not a system.
Write 2 variants — one warmer, one more direct.

---

Output: 2 copy variants per element: warm + direct$$, '{}', NULL, ARRAY['copy', 'microcopy'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Prepare design review', 'prepare-design-review', 'prompt', 'prompt', 'Prep for stakeholder presentation — objectives, questions, pushback', $$Load: CLAUDE.md + skills/product-design.md + memory/projects/active.md

I have a design review tomorrow for [project].
Attendees: [names]
What I'm showing: [description]

1. What should my objectives be?
2. What questions should I ask?
3. What will I probably hear from [name]?
4. Where do I NOT ask for feedback?

---

Output: Review prep: objectives, questions, anticipated pushback, scope$$, '{}', NULL, ARRAY['review', 'prep', 'stakeholder'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Push feature further', 'push-feature-further', 'prompt', 'prompt', 'Force more ambitious framing when a feature feels too safe', $$Load: CLAUDE.md + reference/design-principles.md + reference/aesthetics/inspiration.md

We're designing the [feature] for [project name].
Current direction: [description]

This feels safe.
— What would category leaders do?
— What is the more ambitious version?
— What assumptions are we making that we shouldn't?
Give me 3 directions that push further.

---

Output: 3 more ambitious design directions with competitive framing$$, '{}', NULL, ARRAY['discovery', 'innovation'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Pick up project after break', 'pick-up-project-after-break', 'prompt', 'prompt', 'Eliminate cold-start — get directly into context after time away', $$Load: CLAUDE.md + memory/projects/active.md

I'm picking up [project] again after [time away].

1. Where did we leave off?
2. What are the 2-3 most important open questions?
3. What's the highest risk?
4. What should I do first today?

---

Output: Project briefing: status, open questions, risks, priorities$$, '{}', NULL, ARRAY['handoff', 'context'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Multi-market copy check', 'multi-market-copy-check', 'prompt', 'prompt', 'Localization check for CH/IT/NL/FR — translation, cultural flags', $$Load: CLAUDE.md + skills/ux-copywriter/SKILL.md

Review this copy for multi-market use.
Markets: Switzerland, Italy, Netherlands, France.

[paste copy]

Flag anything that:
— Doesn't translate cleanly
— Contains cultural assumptions
— Has idioms/metaphors that break
— Has length that breaks layouts in translation

---

Output: Localization audit: translation problems, cultural flags, layout risks$$, '{}', NULL, ARRAY['localization', 'copy', 'i18n'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Figma + MCP Setup', 'figma-mcp-setup', 'agent_workflow', 'workflow', 'Connect Claude Code with Figma — tokens and variables directly readable', $$STEP 1: Figma → Settings → Personal Access Tokens → Generate (figd_...)
STEP 2: claude mcp add figma-console -s user -e FIGMA_ACCESS_TOKEN=figd_TOKEN -e ENABLE_MCP_APPS=true -- npx -y figma-console-mcp@latest
STEP 3: Test: 'Inspect the design tokens from [Figma URL]'
STEP 4: Share Figma node-links in prompts

---

Output: Working Figma MCP — tokens readable in Claude Code$$, '{}', NULL, ARRAY['figma', 'mcp', 'setup'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Claude Code + Git Setup', 'claude-code-git-setup', 'agent_workflow', 'workflow', 'Clone repo, CLAUDE.md, sync skills, guardian workflow', $$1. nvm install 20 && nvm use 20
2. git clone [repo] && cd [repo]
3. ./setup/team-setup.sh
4. claude login
5. Check CLAUDE.md in root
6. Copy skills to .claude/skills/

DAILY: pull → guardian → build → guardian → restore-point → push

IMPORTANT: Skills in Claude.ai ≠ Claude Code. Copy to .claude/skills/!

---

Output: Working dev environment with CLAUDE.md context and guardian workflow$$, '{}', NULL, ARRAY['git', 'setup', 'claude-code'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('AI Workspace Scaffolding', 'ai-workspace-scaffolding', 'agent_workflow', 'workflow', 'Markdown folder structure for persistent AI context', $$STRUCTURE:
ai-workspace/
├── CLAUDE.md (paste FIRST every session)
├── memory/ (people, projects, business, preferences)
├── skills/ (task-specific instructions)
├── workflows/ (repeatable routines)
├── handoffs/ (project continuity)
└── reference/ (style guides)

1. Fill in memory/people/me.md
2. Add projects
3. Fill in working-style.md
4. Start: paste CLAUDE.md
5. Update as things change

---

Output: Structured AI context — every session knows you and your work$$, '{}', NULL, ARRAY['scaffolding', 'memory', 'workspace'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Use attachments effectively', 'use-attachments-effectively', 'agent_workflow', 'workflow', 'When which file type, how to share, why', $$SCREENSHOTS → UI reviews (upload directly + SKILL.md)
MARKDOWN → Context (paste as text, not as file)
CSV/EXCEL → Data (upload, specify columns)
PDF → Documents (upload, focus on section)
FIGMA → Designs (node-level URLs, MCP or screenshot)

RULE: One file per task. Name WHAT and WHY.

---

Output: Effective file sharing for best AI output$$, '{}', NULL, ARRAY['files', 'screenshots', 'workflow'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Design Review Agent', 'design-review-agent', 'agent_workflow', 'agent', 'Autonomous design audit — UX + visual + copy in one run. Upload screenshot or Figma URL.', $$# Design Review Agent

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
```
Load CLAUDE.md + visual-language.md
Upload: [screenshot]
Run: "Run a complete design review on this screen"
```

---

Output: Complete design audit: UX friction + visual compliance + copy review + prioritized action list$$, '{}', NULL, ARRAY['agent', 'review', 'ux', 'ui', 'copy', 'audit'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Figma-to-Code Agent', 'figma-to-code-agent', 'agent_workflow', 'agent', 'From Figma design to production-ready React code — tokens, components, 1:1 fidelity', $$# Figma-to-Code Agent

## What does this do?
Takes a Figma design and produces production-ready code in 3 steps: token extraction, component implementation, and visual polish.

## Requirements
- Figma MCP installed (see "Figma + MCP Setup" workflow)
- Figma node URL of the design to implement

## Setup (one-time)
```bash
claude mcp add figma-console -s user \
  -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN \
  -e ENABLE_MCP_APPS=true \
  -- npx -y figma-console-mcp@latest
```

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
```
Figma URL: [paste node URL]
Run: "Implement this Figma design as React components"
```

---

Output: Production-ready React components + CSS tokens that match Figma 1:1$$, '{}', NULL, ARRAY['agent', 'figma', 'code', 'react', 'tokens', 'implementation'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('UX Research Synthesis Agent', 'ux-research-synthesis-agent', 'agent_workflow', 'agent', 'From raw interviews to personas, journey maps and opportunities — complete research synthesis', $$# UX Research Synthesis Agent

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
```
Upload: [interview transcripts]
Run: "Analyze these interviews and create personas + journey map"
```

---

Output: Research synthesis + 2 personas + journey map + top 3 opportunities with evidence$$, '{}', NULL, ARRAY['agent', 'ux-research', 'personas', 'journey-map', 'synthesis'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Pre-Launch QA Agent', 'pre-launch-qa-agent', 'agent_workflow', 'agent', 'Complete pre-launch check — UX, accessibility, performance, design system, heuristics in one run', $$# Pre-Launch QA Agent

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
```
Context: [product type] for [target audience]
Run: "Run a complete pre-launch QA on this codebase"
```

---

Output: Combined QA report: UX + a11y + performance + design system + heuristics$$, '{}', NULL, ARRAY['agent', 'qa', 'audit', 'a11y', 'performance', 'pre-launch'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Design System Agent', 'design-system-agent', 'agent_workflow', 'agent', 'Build or audit a complete design system — tokens, typography, colors, theming', $$# Design System Agent

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
```
Figma: [URL] or Codebase: [path]
Run: "Build a design system" or "Audit the existing design system"
```

---

Output: Design system: tokens + spec + audit + light/dark theming$$, '{}', NULL, ARRAY['agent', 'design-system', 'tokens', 'theming', 'audit'], 'npx skills add nicepkg/ui-ux-pro-max -g', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('UX Copy Agent', 'ux-copy-agent', 'agent_workflow', 'agent', 'Complete UX copy workflow — microcopy, variants, and multi-market localization check', $$# UX Copy Agent

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
```
Component: [description]
Context: user just [action], feels [emotion]
Markets: [CH, IT, NL, FR]
Run: "Write all copy for this screen and check for multi-market"
```

---

Output: Copy variants + full state coverage + localization audit$$, '{}', NULL, ARRAY['agent', 'copy', 'microcopy', 'localization', 'ux-writing'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Stakeholder Prep Agent', 'stakeholder-prep-agent', 'agent_workflow', 'agent', 'Prepare for design reviews and stakeholder presentations — objectives, pushback, framing', $$# Stakeholder Prep Agent

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
```
Load: CLAUDE.md + memory/projects/active.md
Project: [name]
Attendees: [names]
What I'm showing: [description]
Run: "Prepare my design review"
```

---

Output: Review prep + critique framing$$, '{}', NULL, ARRAY['agent', 'review', 'stakeholder', 'prep', 'presentation'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Developer Handoff Agent', 'developer-handoff-agent', 'agent_workflow', 'agent', 'Generate a complete developer handoff — specs, states, edge cases, QA checklist', $$# Developer Handoff Agent

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
```
Component: [description or Figma URL]
Run: "Generate a developer handoff for this component"
```

---

Output: Complete handoff: measurements + states + responsive + edge cases + QA checklist$$, '{}', NULL, ARRAY['agent', 'handoff', 'developer', 'specs', 'qa'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('UX Friction Audit', 'ux-friction-audit', 'prompt', 'prompt', 'Find UX friction, unclear affordances, and missing feedback states in any live codebase', $$Review this site's interface and navigation patterns from a UX perspective. Identify friction points, unclear affordances, missing feedback states, and interactions that don't meet user expectations for a [describe your audience] audience. For each issue you find, describe the problem, explain why it's a problem, and suggest a specific fix. Prioritize issues by likely impact on user experience, not implementation complexity.

Context: This is a [type of product] used by [target audience] who [primary use case].

---

Output: Prioritised list of UX friction points with problem description, impact explanation, and specific fixes$$, '{}', NULL, ARRAY['ux', 'audit', 'friction', 'review'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Heuristic Evaluation', 'heuristic-evaluation', 'prompt', 'prompt', 'Structured Nielsen heuristic evaluation against any user flow', $$Run a heuristic evaluation of a [flow description] with these steps: [list steps]. For each step, evaluate against Nielsen's 10 heuristics. Flag usability issues by severity (Critical / Major / Minor / Cosmetic). For each issue, include: which heuristic is violated, what the user experiences, and a specific fix.

---

Output: Heuristic evaluation table with severity ratings, violated heuristics, user impact, and fixes per step$$, '{}', NULL, ARRAY['ux', 'heuristics', 'nielsen', 'evaluation'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Accessibility Pre-Launch Audit', 'accessibility-pre-launch-audit', 'prompt', 'prompt', 'Comprehensive WCAG AA compliance check — contrast, keyboard nav, screen readers, focus states', $$Audit this page for WCAG AA compliance. Check: colour contrast ratios (4.5:1 text, 3:1 large text), alt text on all images, form labels associated with inputs, keyboard navigation for all interactive elements, visible focus rings, ARIA attributes on custom components, prefers-reduced-motion respected, and no information conveyed by colour alone. For each failure, state the WCAG criterion, the specific element, and the fix.

---

Output: WCAG AA audit report with criterion references, failing elements, and remediation steps$$, '{}', 'https://github.com/accesslint/claude-marketplace', ARRAY['a11y', 'wcag', 'accessibility', 'audit'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Design Token Extraction from Figma', 'design-token-extraction-from-figma', 'prompt', 'prompt', 'Pull tokens from Figma and generate CSS custom properties with semantic naming', $$Extract the design tokens from this Figma file (spacing, typography, colors, border-radius, shadows) and generate a CSS custom properties file with semantic naming. Group tokens by category. Include light and dark mode variants where applicable. Use the naming convention: --{category}-{property}-{variant} (e.g. --color-text-primary, --space-md, --radius-card).

Figma file: [YOUR_FIGMA_FILE_KEY]

---

Output: CSS custom properties file with semantic token naming, light/dark mode variants$$, '{}', NULL, ARRAY['tokens', 'figma', 'css', 'design-system'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Design System Audit', 'design-system-audit', 'prompt', 'prompt', 'Check codebase for design system consistency — token coverage, naming, and drift', $$Audit this codebase for design system consistency. Check for: hardcoded colour values that should use tokens, inconsistent spacing values, components that don't use the design system's border-radius or shadow tokens, typography that bypasses the type scale, and any one-off values that suggest drift from the system. Report findings grouped by severity, with the file path and line number for each.

---

Output: Design system drift report grouped by severity with file paths and line numbers$$, '{}', NULL, ARRAY['design-system', 'audit', 'tokens', 'consistency'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Design System Generator', 'design-system-generator', 'skill', 'skill', 'Generate complete design system from project brief — colours, typography, spacing, components', $$Generate a complete design system for a [type of app] targeting [audience]. Include: colour palette with semantic naming and accessibility-passing contrast, typography scale with font pairing recommendations, spacing scale, border-radius tokens, shadow tokens, and component patterns. Also list anti-patterns to avoid.

---

Output: Complete design system: colour palette, type scale, spacing, tokens, component patterns, anti-patterns$$, '{}', 'https://github.com/nicepkg/ui-ux-pro-max', ARRAY['design-system', 'tokens', 'generator', 'ui-ux-pro-max'], 'npx skills add nicepkg/ui-ux-pro-max -g', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('User Persona Generator', 'user-persona-generator', 'prompt', 'prompt', 'Create detailed, empathetic personas from product context — beyond demographics', $$As a UX researcher, generate two distinct user personas for our [product name] — [one-line product description]. Consider users who have different motivations and contexts. For each persona, include: Name, Age, Occupation, Goals (related to the product), Frustrations/Pain Points (with existing methods or competitors), Motivations (why they need this), Typical Day (how they might interact with the product), Key Needs (what they expect), and a quote that captures their mindset. Ground each persona in realistic behavioural patterns, not stereotypes.

---

Output: Two distinct user personas with goals, frustrations, motivations, typical day, and key needs$$, '{}', NULL, ARRAY['ux-research', 'persona', 'users'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('User Interview Transcript Analysis', 'user-interview-transcript-analysis', 'skill', 'skill', 'Analyse raw interview transcripts — extract themes, pain points, and opportunities', $$Analyse these user interview transcripts. For each transcript, extract: key quotes (verbatim), pain points mentioned, goals expressed, workarounds described, emotional moments (frustration, delight, confusion), and feature requests (explicit or implied). Then synthesise across all transcripts: common themes ranked by frequency, unique insights that only appeared once but are significant, contradictions between participants, and the top 3 opportunities with supporting evidence.

---

Output: Synthesis report: themes, pain points, opportunities, key quotes, contradictions$$, '{}', NULL, ARRAY['ux-research', 'interviews', 'synthesis', 'analysis'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('User Journey Map', 'user-journey-map', 'prompt', 'prompt', 'Map complete user journey with actions, thoughts, feelings, touchpoints, and pain points', $$Create a detailed user journey map for [product name]. Focus on the persona of "[persona name and role]" who needs to [goal]. The journey starts when [trigger] and ends when [success state]. For each step, describe: the user's action, their thoughts and feelings, the UI elements they interact with, the emotional temperature (positive/neutral/negative), and potential pain points or opportunities for improvement. Include moments of truth where the experience could tip toward delight or frustration.

---

Output: Journey map with actions, thoughts, feelings, touchpoints, emotional temperature, and opportunities per step$$, '{}', NULL, ARRAY['ux-research', 'journey-map', 'users', 'flow'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Cross-Analogy Design Ideation', 'cross-analogy-design-ideation', 'prompt', 'prompt', 'Break creative blocks by connecting two unrelated domains for unexpected UI patterns', $$I'm designing a [product type] and want to make [specific interaction] feel more [desired quality]. Draw an analogy from [unrelated domain — e.g. video game design, restaurant hospitality, museum curation, music production, sports coaching], specifically how they [specific technique from that domain]. Apply that analogy concretely to my interface — suggest specific UI patterns, interactions, or visual treatments inspired by it. Don't just describe the analogy; show me what it looks like in the interface.

---

Output: Concrete UI patterns, interactions, and visual treatments inspired by cross-domain analogy$$, '{}', NULL, ARRAY['ideation', 'creativity', 'ui', 'analogy'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Microcopy Generator (full)', 'microcopy-generator-full', 'prompt', 'prompt', 'Generate on-brand UX copy for all interface states — buttons, errors, empty states, tooltips', $$Write all the microcopy for a [screen or flow description] in our [product name]. Include for each screen/state: headline, body text (2 sentences max), CTA button label, and any helper text or tooltips. Also write: error states (what went wrong + why + what to do), empty states (why it's empty + what to do), loading text (if needed), and success confirmation. Tone: [describe voice — e.g. warm, motivating, and simple / professional but approachable / calm and reassuring]. Language: English.

---

Output: Complete microcopy set: headlines, CTAs, errors, empty states, loading, success per screen/state$$, '{}', NULL, ARRAY['copy', 'microcopy', 'ux-writing', 'states'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Interface Design Persistence', 'interface-design-persistence', 'skill', 'skill', 'Maintain design consistency across Claude sessions — saves design decisions persistently', $$Maintains design consistency across multiple Claude sessions. Saves design decisions in a persistent file so spacing, colours, and patterns don't drift between conversations.

Key commands:
• /interface-design:init — set up principles
• /interface-design:audit — check file against system
• /interface-design:extract — pull patterns from existing code

---

Output: Persistent design system file that Claude reads automatically in every session$$, '{}', 'https://github.com/Dammyjay93/interface-design', ARRAY['design-system', 'persistence', 'consistency', 'skill'], '/plugin marketplace add Dammyjay93/interface-design', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Performance Audit', 'performance-audit', 'prompt', 'prompt', 'Find and fix file size, loading performance, and unused code issues', $$Audit this codebase for file size and loading performance issues. Identify unused CSS, redundant JavaScript imports, uncompressed assets, and synchronous loading patterns that should be async. Prioritize changes that would have the most impact on initial page load time, and implement the top five with explanations of what you changed and why.

---

Output: Top 5 performance fixes implemented with before/after impact explanations$$, '{}', NULL, ARRAY['performance', 'audit', 'optimization', 'loading'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('CSS Theming System', 'css-theming-system', 'prompt', 'prompt', 'Create light/dark mode theming with CSS custom properties — no JS on initial load', $$Create a CSS custom property theming system that supports light and dark modes, with a root class toggle approach that doesn't require JavaScript on initial load. Use our existing colour tokens as the base. Ensure all colour combinations pass WCAG AA contrast in both modes. Include a smooth transition between themes.

---

Output: CSS theming system with light/dark mode, WCAG-passing contrast, smooth transitions$$, '{}', NULL, ARRAY['css', 'theming', 'dark-mode', 'tokens'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Developer Handoff Package', 'developer-handoff-package', 'prompt', 'prompt', 'Generate complete handoff spec — measurements, behaviours, edge cases, QA checklist', $$Generate a developer handoff spec for a [screen/component description]. Include: all measurements and spacing (in px and rem), colour values with token references, typography specs (font, weight, size, line-height, letter-spacing), interactive states (default, hover, active, disabled, focus, loading, error, success), responsive breakpoints and how the layout adapts, edge cases (long text, missing data, 0 items, many items), animation specs (duration, easing, properties), and a QA checklist for the engineer to verify against.

---

Output: Complete handoff spec: measurements, states, responsive rules, edge cases, QA checklist$$, '{}', NULL, ARRAY['handoff', 'specs', 'developer', 'qa'], '', true, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Portfolio Case Study Writer', 'portfolio-case-study-writer', 'prompt', 'prompt', 'Structure a design case study with proper narrative arc for your portfolio', $$Help me write a portfolio case study. The project was [brief description]. The key outcome was [measurable result]. Walk me through the full structure: hook/headline, problem statement, my role, research insights, design process (show iterations, not just finals), key decisions with rationale, challenges and how I solved them, outcome with metrics, and reflection/learnings. Write it in first person. Make it read like a story, not a report.

---

Output: Portfolio case study: hook, problem, role, research, process, decisions, challenges, outcome, learnings$$, '{}', NULL, ARRAY['portfolio', 'case-study', 'writing', 'career'], '', false, 'published');

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES ('Design Critique Framing', 'design-critique-framing', 'prompt', 'prompt', 'Structure actionable design feedback — not just ''I don''t like it''', $$I'm about to give design feedback on [describe the screen/feature]. Help me structure my critique using these lenses:

1. User impact — does this serve the user's goal effectively?
2. Design system compliance — does this follow our established patterns?
3. Hierarchy — is the most important thing the most visible?
4. Edge cases — what states are missing or underdesigned?
5. Feasibility — is this realistic to build well?

For each concern, help me frame it as "[observation] because [user impact], consider [alternative]" rather than just pointing out problems.

---

Output: Structured critique: 5 lenses with observation/impact/alternative framing per concern$$, '{}', NULL, ARRAY['review', 'critique', 'feedback', 'stakeholder'], '', false, 'published');
