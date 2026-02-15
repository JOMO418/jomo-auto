import { supabase } from './supabase';
import type { Product, ProductWithCategory, ProductWithDetails, Vehicle, Category } from './supabase';

// ================================================
// PRODUCT QUERIES
// ================================================

/**
 * Get all products with category information
 */
export async function getAllProducts(): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data as ProductWithCategory[];
}

/**
 * Get a single product by slug with full details (category + compatibility)
 */
export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      compatibility:product_vehicle_compatibility(
        compatibility_string,
        year_start,
        year_end,
        vehicle:vehicles(*)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching product:', error);
    throw error;
  }

  return data as ProductWithDetails;
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(limit: number = 10): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('featured', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }

  return data as ProductWithCategory[];
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories!inner(*)
    `)
    .eq('category.slug', categorySlug);

  if (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }

  return data as ProductWithCategory[];
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('featured', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error searching products:', error);
    throw error;
  }

  return data as ProductWithCategory[];
}

// ================================================
// VEHICLE QUERIES
// ================================================

/**
 * Get all vehicles
 */
export async function getAllVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('popular', { ascending: false })
    .order('brand', { ascending: true });

  if (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }

  return data;
}

/**
 * Get a single vehicle by slug
 */
export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching vehicle:', error);
    throw error;
  }

  return data;
}

/**
 * Get popular vehicles
 */
export async function getPopularVehicles(limit: number = 10): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('popular', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching popular vehicles:', error);
    throw error;
  }

  return data;
}

/**
 * Get all products compatible with a specific vehicle
 */
export async function getProductsByVehicle(vehicleId: string): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('product_vehicle_compatibility')
    .select(`
      product:products(
        *,
        category:categories(*)
      )
    `)
    .eq('vehicle_id', vehicleId);

  if (error) {
    console.error('Error fetching products by vehicle:', error);
    throw error;
  }

  return data.map((item: any) => item.product).filter(Boolean) as ProductWithCategory[];
}

// ================================================
// CATEGORY QUERIES
// ================================================

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data;
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching category:', error);
    throw error;
  }

  return data;
}
