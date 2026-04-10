-- Prompt Scout Report: 5 new entries
-- Paste this into Supabase SQL Editor and click "Run"

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES (
  'Awesome Design MD Skill',
  'awesome-design-md-skill',
  'skill',
  'skill',
  'Curated design skill for Claude Code — visual hierarchy, spacing, typography, color theory baked in',
  $$Community-curated design skill from VoltAgent/awesome-design-md. Gives Claude deep design knowledge for generating polished UI components.

Covers: visual hierarchy, spacing systems, typography scales, color theory, responsive patterns.

---

Install: Copy skill folder to ~/.claude/skills/
Source: github.com/VoltAgent/awesome-design-md$$,
  '{}',
  'https://github.com/VoltAgent/awesome-design-md',
  ARRAY['design', 'skill', 'ui', 'claude-code'],
  'Copy to ~/.claude/skills/',
  true,
  'published'
);

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES (
  'Inclusive Design Skills',
  'inclusive-design-skills',
  'skill',
  'collection',
  '40 accessibility-first design skills + 6 plugins — WCAG, color contrast, screen readers, cognitive load',
  $$Massive skill collection from Owl-Listener. 40 individual skills covering every aspect of inclusive and accessible design, plus 6 companion plugins.

Covers: WCAG compliance, color contrast, screen reader optimization, cognitive load reduction, motor accessibility, neurodivergent-friendly patterns.

---

Install: claude install github:Owl-Listener/inclusive-design-skills$$,
  '{}',
  'https://github.com/Owl-Listener/inclusive-design-skills',
  ARRAY['accessibility', 'a11y', 'wcag', 'inclusive', 'design', 'collection'],
  'claude install github:Owl-Listener/inclusive-design-skills',
  true,
  'published'
);

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES (
  'AI-to-Figma Token Pipeline',
  'ai-to-figma-token-pipeline',
  'workflow',
  'workflow',
  'Bidirectional design token sync between Claude Code and Figma — read tokens, push updates, keep systems aligned',
  $$Workflow built on the Figma Developer MCP. Enables bidirectional design token synchronization between your codebase and Figma.

Read tokens from Figma → generate code variables. Update code tokens → push back to Figma. Keeps design systems perfectly aligned.

---

Install: npm install -g figma-developer-mcp
Requires: Figma MCP server connection$$,
  ARRAY['Figma MCP server'],
  'https://www.npmjs.com/package/figma-developer-mcp',
  ARRAY['figma', 'tokens', 'design-system', 'mcp', 'workflow'],
  'npm install -g figma-developer-mcp',
  true,
  'published'
);

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES (
  'Grill Me — Requirements Stress-Test',
  'grill-me-requirements-stress-test',
  'skill',
  'skill',
  'Claude becomes a ruthless product critic — stress-tests your PRD, user stories, and edge cases before you build',
  $$From julianoczkowski/designer-skills. Instead of Claude being helpful, it becomes adversarial — grilling your requirements document, user stories, and specifications.

Finds: missing edge cases, contradictory requirements, unclear acceptance criteria, accessibility gaps, unscoped features.

---

Install: npx skills add julianoczkowski/designer-skills$$,
  '{}',
  'https://github.com/julianoczkowski/designer-skills',
  ARRAY['requirements', 'prd', 'stress-test', 'review', 'quality'],
  'npx skills add julianoczkowski/designer-skills',
  false,
  'published'
);

INSERT INTO entries (title, slug, type, category, description, content, prerequisites, source_url, tags, install_command, featured, status)
VALUES (
  'Figma Skills for Claude Code',
  'figma-skills-for-claude-code',
  'skill',
  'collection',
  'Official Figma skill collection — design-to-code, inspect, tokens, and component extraction via Figma MCP',
  $$Official Figma-provided skills for Claude Code. Works through the Figma MCP server to give Claude direct access to your Figma files.

Capabilities: design-to-code translation, component inspection, design token extraction, layout analysis, style guide generation.

---

Requires: Figma MCP server connection
Source: Official Figma MCP integration$$,
  ARRAY['Figma MCP server'],
  'https://github.com/nicholasgriffintn/figma-mcp-server',
  ARRAY['figma', 'design-to-code', 'mcp', 'official', 'collection'],
  '',
  true,
  'published'
);
