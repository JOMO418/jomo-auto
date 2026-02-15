import { createClient } from '@supabase/supabase-js';

// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ================================================
// TYPE DEFINITIONS
// ================================================

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  code: string;
  slug: string;
  popular: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  stock: number;
  condition: 'New' | 'Used' | 'Refurbished';
  category_id: string;
  origin: string | null;
  featured: boolean;
  images: string[];
  specs: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type ProductWithCategory = Product & {
  category: Category;
};

export type ProductWithDetails = Product & {
  category: Category;
  compatibility: Array<{
    compatibility_string: string;
    vehicle: Vehicle;
  }>;
};

export type ProductVehicleCompatibility = {
  id: string;
  product_id: string;
  vehicle_id: string;
  compatibility_string: string;
  year_start: number | null;
  year_end: number | null;
  created_at: string;
};
