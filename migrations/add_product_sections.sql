-- ============================================================
-- Migration: Add new_arrival and flash_deal columns to products
-- Run this ONCE in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- Add new_arrival column (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'new_arrival'
  ) THEN
    ALTER TABLE products ADD COLUMN new_arrival boolean NOT NULL DEFAULT false;
    RAISE NOTICE 'Added column: new_arrival';
  ELSE
    RAISE NOTICE 'Column new_arrival already exists — skipped';
  END IF;
END $$;

-- Add flash_deal column (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'flash_deal'
  ) THEN
    ALTER TABLE products ADD COLUMN flash_deal boolean NOT NULL DEFAULT false;
    RAISE NOTICE 'Added column: flash_deal';
  ELSE
    RAISE NOTICE 'Column flash_deal already exists — skipped';
  END IF;
END $$;

-- Verify
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('featured', 'new_arrival', 'flash_deal')
ORDER BY column_name;
