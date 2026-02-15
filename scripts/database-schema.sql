-- ================================================
-- JOMO AUTO WORLD - SUPABASE DATABASE SCHEMA
-- ================================================
-- Run this entire script in Supabase SQL Editor
-- (https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. CATEGORIES TABLE
-- ================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 2. VEHICLES TABLE
-- ================================================
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  code TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 3. PRODUCTS TABLE
-- ================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  condition TEXT NOT NULL CHECK (condition IN ('New', 'Used', 'Refurbished')),
  category_id UUID REFERENCES categories(id),
  origin TEXT,
  featured BOOLEAN DEFAULT FALSE,
  images JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 4. PRODUCT-VEHICLE COMPATIBILITY TABLE
-- ================================================
CREATE TABLE product_vehicle_compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  compatibility_string TEXT NOT NULL,
  year_start INTEGER,
  year_end INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, vehicle_id)
);

-- ================================================
-- 5. INDEXES FOR PERFORMANCE
-- ================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_popular ON vehicles(popular);
CREATE INDEX idx_compatibility_product ON product_vehicle_compatibility(product_id);
CREATE INDEX idx_compatibility_vehicle ON product_vehicle_compatibility(vehicle_id);

-- ================================================
-- 6. AUTO-UPDATE TIMESTAMP TRIGGER
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_vehicle_compatibility ENABLE ROW LEVEL SECURITY;

-- Public read access policies (anyone can view)
CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public read vehicles"
  ON vehicles FOR SELECT
  USING (true);

CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Public read compatibility"
  ON product_vehicle_compatibility FOR SELECT
  USING (true);

-- Admin write policies (for now, allow all writes - you can add auth later)
CREATE POLICY "Admin insert categories"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin update categories"
  ON categories FOR UPDATE
  USING (true);

CREATE POLICY "Admin delete categories"
  ON categories FOR DELETE
  USING (true);

CREATE POLICY "Admin insert vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin update vehicles"
  ON vehicles FOR UPDATE
  USING (true);

CREATE POLICY "Admin delete vehicles"
  ON vehicles FOR DELETE
  USING (true);

CREATE POLICY "Admin insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin update products"
  ON products FOR UPDATE
  USING (true);

CREATE POLICY "Admin delete products"
  ON products FOR DELETE
  USING (true);

CREATE POLICY "Admin insert compatibility"
  ON product_vehicle_compatibility FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin update compatibility"
  ON product_vehicle_compatibility FOR UPDATE
  USING (true);

CREATE POLICY "Admin delete compatibility"
  ON product_vehicle_compatibility FOR DELETE
  USING (true);

-- ================================================
-- SCHEMA CREATION COMPLETE!
-- ================================================
-- Next steps:
-- 1. Verify all tables created successfully in Supabase Table Editor
-- 2. Run the data migration script to populate tables
