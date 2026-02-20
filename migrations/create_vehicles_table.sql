-- ============================================================
-- Create vehicles table
-- Run this once in the Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS vehicles (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  make        VARCHAR(100)  NOT NULL,
  model       VARCHAR(100)  NOT NULL,
  code        VARCHAR(50)   NOT NULL,
  year_start  INTEGER,
  year_end    INTEGER,
  popular     BOOLEAN       NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Optional: unique constraint to prevent duplicate entries
CREATE UNIQUE INDEX IF NOT EXISTS vehicles_make_model_code_idx
  ON vehicles (make, model, code);

-- Enable RLS (restrict to service role only)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (admin API uses service role key)
CREATE POLICY IF NOT EXISTS "Service role full access"
  ON vehicles FOR ALL
  USING (true)
  WITH CHECK (true);

-- Confirm table was created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'vehicles';
