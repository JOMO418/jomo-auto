import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncData() {
  console.log('🔄 Syncing Supabase data to dummy-data.ts and constants.ts...\n');

  try {
    // Fetch all products from Supabase
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        compatibility:product_vehicle_compatibility(
          compatibility_string
        )
      `)
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    console.log(`✅ Fetched ${products.length} products from Supabase`);

    // Fetch all vehicles from Supabase
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .order('popular', { ascending: false });

    if (vehiclesError) throw vehiclesError;

    console.log(`✅ Fetched ${vehicles.length} vehicles from Supabase`);

    // Fetch all categories from Supabase
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (categoriesError) throw categoriesError;

    console.log(`✅ Fetched ${categories.length} categories from Supabase\n`);

    // Convert to dummy-data format
    const convertedProducts = products.map((p: any) => {
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        images: p.images,
        price: p.price,
        originalPrice: p.original_price || undefined,
        stock: p.stock,
        condition: p.condition,
        category: p.category.name,
        compatibility: p.compatibility?.map((c: any) => c.compatibility_string) || [],
        description: p.description,
        specs: p.specs,
        origin: p.origin || undefined,
        featured: p.featured,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    });

    // Generate the new dummy-data.ts file content
    const fileContent = `import type { Product } from "./types";

// ================================================
// AUTO-GENERATED FROM SUPABASE
// Last synced: ${new Date().toISOString()}
// Products: ${products.length}
// ================================================
// Run 'npm run sync:data' to update this file

export const products: Product[] = ${JSON.stringify(convertedProducts, null, 2)};

// ================================================
// HELPER FUNCTIONS
// ================================================

export function getAllProducts(): Product[] {
  return products;
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getRelatedProducts(productId: string, category: string, limit: number = 4): Product[] {
  return products
    .filter(p => p.id !== productId && p.category === category)
    .slice(0, limit);
}
`;

    // Write to dummy-data.ts
    const dataFilePath = path.join(process.cwd(), 'src/lib/dummy-data.ts');
    fs.writeFileSync(dataFilePath, fileContent, 'utf-8');

    console.log('✅ Successfully updated src/lib/dummy-data.ts');

    // ================================================
    // UPDATE CONSTANTS.TS WITH VEHICLES & CATEGORIES
    // ================================================

    const constantsContent = `// ================================================
// AUTO-GENERATED FROM SUPABASE
// Last synced: ${new Date().toISOString()}
// ================================================
// Run 'npm run sync:data' to update this file

export const CATEGORIES = ${JSON.stringify(categories.map((c: any) => c.name), null, 2)} as const;

// Expanded vehicle list from Supabase
export const VEHICLE_DATA = ${JSON.stringify(
      vehicles.map((v: any) => ({
        brand: v.brand,
        model: v.model,
        code: v.code,
        popular: v.popular,
      })),
      null,
      2
    )} as const;

// Vehicle models for sidebar (full names)
export const VEHICLE_MODELS = ${JSON.stringify(
      vehicles.map((v: any) => `${v.brand} ${v.model}`)
    )} as const;

// Contact information
export const CONTACT_INFO = {
  phone: "+254 712 345 678",
  email: "info@jomoautoworld.com",
  address: "Nairobi, Kenya"
} as const;

export const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=800&fit=crop";
`;

    const constantsFilePath = path.join(process.cwd(), 'src/lib/constants.ts');
    fs.writeFileSync(constantsFilePath, constantsContent, 'utf-8');

    console.log('✅ Successfully updated src/lib/constants.ts');
    console.log(`📊 Products: ${products.length}`);
    console.log(`📊 Vehicles: ${vehicles.length}`);
    console.log(`📊 Categories: ${categories.length}`);
    console.log('\n🎉 Sync complete! Your app now shows real Supabase data.\n');
    console.log('Next step: Refresh your browser to see the changes!\n');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

syncData();
