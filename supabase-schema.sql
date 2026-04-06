-- Prompt Vault — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor → New Query → paste → Run

-- ─── Entries table ───
CREATE TABLE IF NOT EXISTS entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'prompt',
  category text NOT NULL DEFAULT 'other',
  description text NOT NULL DEFAULT '',
  content text,
  prerequisites text[] DEFAULT '{}',
  source_url text,
  tags text[] DEFAULT '{}',
  install_command text,
  featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Proposals table ───
CREATE TABLE IF NOT EXISTS proposals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  user_name text,
  user_email text,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'prompt',
  category text NOT NULL DEFAULT 'other',
  description text NOT NULL DEFAULT '',
  content text,
  prerequisites text[] DEFAULT '{}',
  source_url text,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  admin_feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Indexes ───
CREATE INDEX IF NOT EXISTS idx_entries_slug ON entries(slug);
CREATE INDEX IF NOT EXISTS idx_entries_type ON entries(type);
CREATE INDEX IF NOT EXISTS idx_entries_status ON entries(status);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);

-- ─── Auto-update updated_at ───
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS entries_updated_at ON entries;
CREATE TRIGGER entries_updated_at
  BEFORE UPDATE ON entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS proposals_updated_at ON proposals;
CREATE TRIGGER proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Entries: anyone can read published
CREATE POLICY "Public read entries"
  ON entries FOR SELECT
  USING (status = 'published');

-- Entries: service role can do everything
CREATE POLICY "Service role manage entries"
  ON entries FOR ALL
  USING (true)
  WITH CHECK (true);

-- Proposals: anyone can insert
CREATE POLICY "Authenticated insert proposals"
  ON proposals FOR INSERT
  WITH CHECK (true);

-- Proposals: anyone can read
CREATE POLICY "Read proposals"
  ON proposals FOR SELECT
  USING (true);

-- Proposals: service role can update
CREATE POLICY "Service role manage proposals"
  ON proposals FOR ALL
  USING (true)
  WITH CHECK (true);
