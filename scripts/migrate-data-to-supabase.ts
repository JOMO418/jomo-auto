import { createClient } from '@supabase/supabase-js';
import { products } from '../src/lib/dummy-data';
import { CATEGORIES, VEHICLE_DATA } from '../src/lib/constants';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to create slug from text
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to extract year range from compatibility string
function extractYearRange(compatString: string): { start: number | null; end: number | null } {
  const match = compatString.match(/\((\d{4})-(\d{4})\)/);
  if (match) {
    return {
      start: parseInt(match[1]),
      end: parseInt(match[2])
    };
  }
  return { start: null, end: null };
}

// Helper function to extract vehicle info from compatibility string
function parseCompatibilityString(compatString: string): { brand: string; model: string; code: string } | null {
  // Example: "Corolla AE110 (1995-2002)" -> brand: Toyota, model: Corolla, code: AE110
  const parts = compatString.split('(')[0].trim().split(' ');

  if (parts.length >= 2) {
    const model = parts[0];
    const code = parts[1];

    // Find matching vehicle in VEHICLE_DATA
    const vehicle = VEHICLE_DATA.find(v =>
      v.model.toLowerCase() === model.toLowerCase()
    );

    if (vehicle) {
      return {
        brand: vehicle.brand,
        model: vehicle.model,
        code: code
      };
    }
  }

  return null;
}

async function migrateData() {
  console.log('🚀 Starting Supabase data migration...\n');

  try {
    // ================================================
    // STEP 1: Migrate Categories
    // ================================================
    console.log('📁 Step 1: Migrating Categories...');

    const categoryMap = new Map<string, string>();

    for (const categoryName of CATEGORIES) {
      const slug = createSlug(categoryName);

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryName,
          slug: slug,
          description: `${categoryName} parts and accessories`
        })
        .select()
        .single();

      if (error) {
        // Check if already exists
        if (error.code === '23505') { // Unique violation
          const { data: existing } = await supabase
            .from('categories')
            .select('id, name')
            .eq('slug', slug)
            .single();

          if (existing) {
            categoryMap.set(categoryName, existing.id);
            console.log(`   ⚠️  Category already exists: ${categoryName}`);
          }
        } else {
          throw error;
        }
      } else {
        categoryMap.set(categoryName, data.id);
        console.log(`   ✅ Created category: ${categoryName}`);
      }
    }

    console.log(`✅ Categories migrated: ${categoryMap.size}\n`);

    // ================================================
    // STEP 2: Migrate Vehicles
    // ================================================
    console.log('🚗 Step 2: Migrating Vehicles...');

    const vehicleMap = new Map<string, string>();

    for (const vehicle of VEHICLE_DATA) {
      const slug = createSlug(`${vehicle.brand} ${vehicle.model}`);
      const key = `${vehicle.brand} ${vehicle.model}`;

      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          brand: vehicle.brand,
          model: vehicle.model,
          code: vehicle.code,
          slug: slug,
          popular: vehicle.popular
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          const { data: existing } = await supabase
            .from('vehicles')
            .select('id, brand, model')
            .eq('slug', slug)
            .single();

          if (existing) {
            vehicleMap.set(key, existing.id);
            console.log(`   ⚠️  Vehicle already exists: ${key}`);
          }
        } else {
          throw error;
        }
      } else {
        vehicleMap.set(key, data.id);
        console.log(`   ✅ Created vehicle: ${key}`);
      }
    }

    console.log(`✅ Vehicles migrated: ${vehicleMap.size}\n`);

    // ================================================
    // STEP 3: Load Cloudinary URLs (if available)
    // ================================================
    console.log('🖼️  Step 3: Loading image URLs...');

    let cloudinaryUrls: any = {};
    const cloudinaryUrlsPath = path.join(process.cwd(), 'scripts/cloudinary-urls.json');

    if (fs.existsSync(cloudinaryUrlsPath)) {
      const fileContent = fs.readFileSync(cloudinaryUrlsPath, 'utf-8');
      cloudinaryUrls = JSON.parse(fileContent);
      console.log('   ✅ Loaded Cloudinary URLs from cloudinary-urls.json\n');
    } else {
      console.log('   ⚠️  No cloudinary-urls.json found, will use original Unsplash URLs\n');
    }

    // ================================================
    // STEP 4: Migrate Products
    // ================================================
    console.log('📦 Step 4: Migrating Products...');

    let productsCreated = 0;
    let productsSkipped = 0;
    let compatibilityCreated = 0;

    for (const product of products) {
      // Get category ID
      const categoryId = categoryMap.get(product.category);

      if (!categoryId) {
        console.warn(`   ⚠️  Skipping product "${product.name}" - category not found`);
        productsSkipped++;
        continue;
      }

      // Insert product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          original_price: product.originalPrice || null,
          stock: product.stock,
          condition: product.condition,
          category_id: categoryId,
          origin: product.origin || null,
          featured: product.featured || false,
          images: product.images,
          specs: product.specs || {}
        })
        .select()
        .single();

      if (productError) {
        if (productError.code === '23505') {
          console.log(`   ⚠️  Product already exists: ${product.name}`);
          productsSkipped++;

          // Get existing product for compatibility updates
          const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', product.slug)
            .single();

          if (existing && product.compatibility) {
            // Try to add compatibility for existing product
            for (const compatString of product.compatibility) {
              const vehicleInfo = parseCompatibilityString(compatString);
              if (vehicleInfo) {
                const vehicleKey = `${vehicleInfo.brand} ${vehicleInfo.model}`;
                const vehicleId = vehicleMap.get(vehicleKey);

                if (vehicleId) {
                  const years = extractYearRange(compatString);

                  const { error: compatError } = await supabase
                    .from('product_vehicle_compatibility')
                    .insert({
                      product_id: existing.id,
                      vehicle_id: vehicleId,
                      compatibility_string: compatString,
                      year_start: years.start,
                      year_end: years.end
                    });

                  if (!compatError) {
                    compatibilityCreated++;
                  }
                }
              }
            }
          }
          continue;
        } else {
          console.error(`   ❌ Error creating product "${product.name}":`, productError);
          productsSkipped++;
          continue;
        }
      }

      console.log(`   ✅ Created product: ${product.name}`);
      productsCreated++;

      // ================================================
      // STEP 5: Create Compatibility Relationships
      // ================================================
      if (product.compatibility && productData) {
        for (const compatString of product.compatibility) {
          const vehicleInfo = parseCompatibilityString(compatString);

          if (vehicleInfo) {
            const vehicleKey = `${vehicleInfo.brand} ${vehicleInfo.model}`;
            const vehicleId = vehicleMap.get(vehicleKey);

            if (vehicleId) {
              const years = extractYearRange(compatString);

              const { error: compatError } = await supabase
                .from('product_vehicle_compatibility')
                .insert({
                  product_id: productData.id,
                  vehicle_id: vehicleId,
                  compatibility_string: compatString,
                  year_start: years.start,
                  year_end: years.end
                });

              if (compatError && compatError.code !== '23505') {
                console.error(`      ⚠️  Compatibility error for "${compatString}":`, compatError.message);
              } else {
                compatibilityCreated++;
              }
            } else {
              console.warn(`      ⚠️  Vehicle not found for compatibility: ${vehicleKey}`);
            }
          }
        }
      }
    }

    // ================================================
    // MIGRATION SUMMARY
    // ================================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Categories: ${categoryMap.size}`);
    console.log(`✅ Vehicles: ${vehicleMap.size}`);
    console.log(`✅ Products created: ${productsCreated}`);
    console.log(`⚠️  Products skipped: ${productsSkipped}`);
    console.log(`✅ Compatibility relationships: ${compatibilityCreated}`);
    console.log('='.repeat(60) + '\n');

    console.log('✅ Migration complete! Your data is now in Supabase.');
    console.log('\n🔍 Next steps:');
    console.log('   1. Check Supabase dashboard to verify data');
    console.log('   2. Test the application: npm run dev');
    console.log('   3. Update components to use Supabase queries\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();
