-- ================================================================
-- Migration: Add year_start and year_end columns to vehicles table
-- Run this in Supabase SQL Editor if the vehicles table already exists
-- ================================================================

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS year_start INTEGER,
  ADD COLUMN IF NOT EXISTS year_end   INTEGER;

-- Optional: update existing rows with NULL years to a default
-- (rows seeded before this migration will have NULL — re-run setup-vehicles to fill them)
