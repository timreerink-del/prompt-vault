-- Fix: Update Awesome Design MD entry with correct download link and description
-- Paste this into Supabase SQL Editor and click "Run"

UPDATE entries
SET
  description = 'Collection of 62+ DESIGN.md files from real websites — drop one into your project and AI agents build pixel-perfect UI that matches',
  content = $$Curated collection of DESIGN.md files inspired by real developer-focused websites. Introduced by Google Stitch — a plain-text design system that AI agents read to generate consistent UI.

Includes DESIGN.md for: Airbnb, Apple, BMW, Claude, Linear, Notion, Stripe, Vercel, and 50+ more.

How to use: Copy a DESIGN.md into your project root, then tell your AI agent "build me a page that looks like this" — get pixel-perfect UI that actually matches.

---

Download the zip from the Prompt Vault downloads page, or grab it from the source repo.$$,
  source_url = '/downloads/awesome-design-md.zip',
  install_command = 'Download zip → copy DESIGN.md to project root',
  updated_at = now()
WHERE slug = 'awesome-design-md-skill';
