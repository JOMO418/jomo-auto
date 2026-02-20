-- ============================================================
-- Migration: Link product_vehicle_compatibility to vehicles table
-- Adds vehicle_id FK so compatibility is tied to real DB records
-- instead of free-text strings. Safe to run multiple times.
-- ============================================================

-- 1. Add vehicle_id FK column (nullable — legacy rows won't have it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_vehicle_compatibility'
      AND column_name = 'vehicle_id'
  ) THEN
    ALTER TABLE product_vehicle_compatibility
      ADD COLUMN vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added column: vehicle_id';
  ELSE
    RAISE NOTICE 'Column vehicle_id already exists — skipped';
  END IF;
END $$;

-- 2. Index for fast product-by-vehicle lookups
CREATE INDEX IF NOT EXISTS idx_pvc_vehicle_id
  ON product_vehicle_compatibility(vehicle_id);

-- 3. Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_vehicle_compatibility'
ORDER BY ordinal_position;
