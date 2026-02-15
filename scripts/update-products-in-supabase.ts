import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProductMapping {
  image: string;
  name: string;
  category: string;
  description: string;
  condition: 'New' | 'Used' | 'Refurbished';
  price: number;
  stock: number;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateSpecs(name: string, category: string, condition: string): Record<string, string> {
  const baseSpecs: Record<string, string> = {
    Condition: condition,
    Warranty: condition === 'New' ? '12 months' : condition === 'Refurbished' ? '6 months' : '3 months',
  };

  // Category-specific specs
  switch (category) {
    case 'Engine':
      return {
        ...baseSpecs,
        Type: 'OEM Replacement',
        'Installation': 'Professional recommended',
      };
    case 'Brakes':
      return {
        ...baseSpecs,
        Material: 'Cast Iron / Steel',
        'Safety Standard': 'DOT Approved',
      };
    case 'Suspension':
      return {
        ...baseSpecs,
        Type: 'Heavy Duty',
        'Load Rating': 'Standard',
      };
    case 'Transmission':
      return {
        ...baseSpecs,
        Type: 'Manual/Automatic Compatible',
        Installation: 'Professional required',
      };
    case 'Electrical':
      return {
        ...baseSpecs,
        Voltage: '12V',
        Type: 'OEM Replacement',
      };
    case 'Wheels & Tires':
      return {
        ...baseSpecs,
        Material: 'Steel/Aluminum',
        Type: 'Hub Assembly',
      };
    case 'Body':
      return {
        ...baseSpecs,
        Finish: 'Painted/Primer',
        Fitment: 'Direct Replacement',
      };
    case 'Interior':
      return {
        ...baseSpecs,
        Material: 'OEM Quality',
        Fitment: 'Direct Replacement',
      };
    default:
      return baseSpecs;
  }
}

async function updateProducts() {
  console.log('🚀 Starting Product Update Process...\n');

  try {
    // Read the product mapping file
    const mappingPath = path.join(process.cwd(), 'scripts/product-image-mapping.json');
    const mappingData = fs.readFileSync(mappingPath, 'utf-8');
    const productMappings: ProductMapping[] = JSON.parse(mappingData);

    console.log(`📦 Loaded ${productMappings.length} product mappings\n`);

    // Fetch categories to get their IDs
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug');

    if (categoriesError) throw categoriesError;

    console.log(`✅ Fetched ${categories.length} categories from Supabase\n`);

    // Create a category name to ID mapping
    const categoryMap = new Map(categories.map((cat: any) => [cat.name, cat.id]));

    // Track success and failures
    let successCount = 0;
    let failureCount = 0;
    const failures: { product: string; error: string }[] = [];

    console.log('📝 Creating products in Supabase...\n');

    // Process each product mapping
    for (const mapping of productMappings) {
      try {
        const categoryId = categoryMap.get(mapping.category);

        if (!categoryId) {
          throw new Error(`Category '${mapping.category}' not found in database`);
        }

        const slug = generateSlug(mapping.name);
        const specs = generateSpecs(mapping.name, mapping.category, mapping.condition);
        const imageUrl = `/product-images/${mapping.image}`;

        // Check if product with same slug already exists
        const { data: existing } = await supabase
          .from('products')
          .select('id, slug')
          .eq('slug', slug)
          .single();

        if (existing) {
          // Update existing product
          const { error: updateError } = await supabase
            .from('products')
            .update({
              name: mapping.name,
              images: [imageUrl],
              price: mapping.price,
              stock: mapping.stock,
              condition: mapping.condition,
              category_id: categoryId,
              description: mapping.description,
              specs: specs,
              origin: 'Japan',
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;

          console.log(`✅ Updated: ${mapping.name} (${mapping.category})`);
        } else {
          // Create new product
          const { error: insertError } = await supabase
            .from('products')
            .insert({
              slug: slug,
              name: mapping.name,
              images: [imageUrl],
              price: mapping.price,
              stock: mapping.stock,
              condition: mapping.condition,
              category_id: categoryId,
              description: mapping.description,
              specs: specs,
              origin: 'Japan',
              featured: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (insertError) throw insertError;

          console.log(`✅ Created: ${mapping.name} (${mapping.category})`);
        }

        successCount++;

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        failureCount++;
        failures.push({
          product: mapping.name,
          error: error.message,
        });
        console.error(`❌ Failed: ${mapping.name} - ${error.message}`);
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 UPDATE SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successful: ${successCount}/${productMappings.length}`);
    console.log(`❌ Failed: ${failureCount}/${productMappings.length}`);

    if (failures.length > 0) {
      console.log('\nFailed Products:');
      failures.forEach(({ product, error }) => {
        console.log(`  - ${product}: ${error}`);
      });
    }

    console.log('\n✨ Product update complete!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run analyze:distribution (to verify distribution)');
    console.log('  2. Run: npm run sync:data (to sync to local files)\n');

  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateProducts();
