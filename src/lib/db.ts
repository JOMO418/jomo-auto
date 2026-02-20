/**
 * db.ts — Live Supabase data layer
 * Replaces dummy-data.ts. All products come from Supabase.
 * Returns data in the same frontend Product shape used across the app.
 */

import { createClient } from '@supabase/supabase-js';
import type { Product } from './types';

// Use the public anon client (reads are public)
function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ─── Transform Supabase row → frontend Product ───────────────────────────────
// Supabase uses snake_case + joins. Frontend expects camelCase flat shape.
function transform(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    images: Array.isArray(row.images) ? row.images : [],
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    stock: row.stock,
    condition: row.condition,
    category: row.category?.name ?? row.category_name ?? '',
    compatibility: Array.isArray(row.compatibility)
      ? row.compatibility.map((c: any) =>
          typeof c === 'string' ? c : c.compatibility_string ?? ''
        )
      : [],
    description: row.description ?? '',
    specs: row.specs ?? {},
    origin: row.origin ?? '',
    featured: row.featured ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Base select used everywhere ─────────────────────────────────────────────
const PRODUCT_SELECT = `
  *,
  category:categories(name),
  compatibility:product_vehicle_compatibility(compatibility_string)
`;

// ─── Public API ───────────────────────────────────────────────────────────────

/** All products, newest first */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[db] getAllProducts error:', error.message);
    return [];
  }
  return (data ?? []).map(transform);
}

/** Featured products only */
export async function getFeaturedProducts(limit = 20): Promise<Product[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('featured', true)
    .limit(limit);

  if (error) {
    console.error('[db] getFeaturedProducts error:', error.message);
    return [];
  }
  return (data ?? []).map(transform);
}

/** Products that have a discount (originalPrice > price) */
export async function getDealsProducts(limit = 12): Promise<Product[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .not('original_price', 'is', null)
    .limit(limit);

  if (error) {
    console.error('[db] getDealsProducts error:', error.message);
    return [];
  }

  return (data ?? [])
    .map(transform)
    .filter((p) => p.originalPrice && p.originalPrice > p.price);
}

/** Products by category name (case-insensitive) */
export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .select(`*, category:categories!inner(name), compatibility:product_vehicle_compatibility(compatibility_string)`)
    .ilike('categories.name', categoryName);

  if (error) {
    console.error('[db] getProductsByCategory error:', error.message);
    return [];
  }
  return (data ?? []).map(transform);
}

/** Single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[db] getProductBySlug error:', error.message);
    }
    return null;
  }
  return transform(data);
}

/** Newest products, sorted by created_at */
export async function getNewArrivals(limit = 60): Promise<Product[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[db] getNewArrivals error:', error.message);
    return [];
  }
  return (data ?? []).map(transform);
}

/** All category names from the categories table, alphabetically */
export async function getCategories(): Promise<string[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name');

  if (error) {
    console.error('[db] getCategories error:', error.message);
    return [];
  }
  return (data ?? []).map((row: any) => row.name as string);
}

/** Quick count of total products (for admin dashboard) */
export async function getProductCount(): Promise<number> {
  const supabase = getClient();
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (error) return 0;
  return count ?? 0;
}
