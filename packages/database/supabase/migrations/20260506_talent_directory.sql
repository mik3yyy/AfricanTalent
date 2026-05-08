-- talent_directory: pre-loaded profiles that exist before talent signup
-- When a talent signs up, they claim their row via email → claimed_user_id is set

CREATE TABLE IF NOT EXISTS talent_directory (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  headline            TEXT NOT NULL,
  bio                 TEXT NOT NULL,
  location            TEXT NOT NULL,
  country             TEXT NOT NULL,
  profile_photo_url   TEXT,
  cover_media_url     TEXT,
  sectors             TEXT[]  DEFAULT '{}',
  primary_skills      TEXT[]  DEFAULT '{}',
  secondary_skills    TEXT[]  DEFAULT '{}',
  years_of_experience INTEGER DEFAULT 0,
  availability        TEXT    DEFAULT '1 month',
  employment_type     TEXT[]  DEFAULT '{}',
  compensation_min    INTEGER DEFAULT 0,
  compensation_max    INTEGER DEFAULT 0,
  github_url          TEXT,
  linkedin_url        TEXT,
  portfolio_url       TEXT,
  twitter_url         TEXT,
  dribbble_url        TEXT,
  resume_url          TEXT,
  featured            BOOLEAN DEFAULT false,
  email               TEXT,
  claimed_user_id     UUID,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE talent_directory ENABLE ROW LEVEL SECURITY;

-- Companies (and anyone) can read all profiles
CREATE POLICY "talent_directory_public_read"
  ON talent_directory FOR SELECT
  USING (true);

-- Only service_role can insert / update / delete
CREATE POLICY "talent_directory_service_write"
  ON talent_directory FOR ALL
  USING (auth.role() = 'service_role');

-- Talent can update their own claimed row
CREATE POLICY "talent_directory_self_update"
  ON talent_directory FOR UPDATE
  USING (claimed_user_id = auth.uid());

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_talent_directory_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_talent_directory_updated_at
  BEFORE UPDATE ON talent_directory
  FOR EACH ROW EXECUTE FUNCTION update_talent_directory_updated_at();
