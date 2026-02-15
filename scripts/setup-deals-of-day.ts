import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Target: 1-2 products per major category for deals
const PRODUCTS_PER_CATEGORY = {
  'Engine': 2,
  'Brakes': 2,
  'Suspension': 2,
  'Electrical': 2,
  'Transmission': 2,
  'Wheels & Tires': 1,
  'Body': 1,
  'Interior': 1,
};

// Discount range: 15-30%
function calculateDiscount(price: number): number {
  const discountPercent = Math.floor(Math.random() * 16) + 15; // 15-30%
  const discount = Math.round((price * discountPercent) / 100);
  return price + discount;
}

async function setupDeals() {
  console.log('🎯 Setting Up Deals of the Day...\n');

  try {
    // First, reset all featured flags
    console.log('🔄 Resetting all featured flags...');
    const { error: resetError } = await supabase
      .from('products')
      .update({ featured: false, original_price: null })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

    if (resetError) throw resetError;
    console.log('✅ Reset complete\n');

    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name');

    if (categoriesError) throw categoriesError;

    console.log(`✅ Fetched ${categories.length} categories\n`);

    const dealsToCreate: any[] = [];

    // Select products from each category
    for (const category of categories) {
      const targetCount = PRODUCTS_PER_CATEGORY[category.name as keyof typeof PRODUCTS_PER_CATEGORY] || 1;

      // Fetch products from this category, ordered by stock (prefer well-stocked items)
      const { data: categoryProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .eq('category_id', category.id)
        .gte('stock', 10) // Only products with good stock
        .order('stock', { ascending: false })
        .limit(targetCount * 2); // Fetch more to have options

      if (productsError) throw productsError;

      if (!categoryProducts || categoryProducts.length === 0) {
        console.log(`⚠️  No products found in category: ${category.name}`);
        continue;
      }

      // Randomly select products from the available ones
      const shuffled = categoryProducts.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, targetCount);

      for (const product of selected) {
        const originalPrice = calculateDiscount(product.price);
        const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

        dealsToCreate.push({
          id: product.id,
          name: product.name,
          category: category.name,
          price: product.price,
          originalPrice: originalPrice,
          discount: discountPercent,
        });

        console.log(`✅ Selected: ${product.name} (${category.name}) - ${discountPercent}% off`);
      }
    }

    console.log(`\n📊 Total deals selected: ${dealsToCreate.length}\n`);

    // Update products to mark as featured and add original price
    console.log('💾 Updating products in database...\n');

    for (const deal of dealsToCreate) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          featured: true,
          original_price: deal.originalPrice,
        })
        .eq('id', deal.id);

      if (updateError) {
        console.error(`❌ Failed to update ${deal.name}:`, updateError);
      } else {
        console.log(`✅ Updated: ${deal.name} - KSh ${deal.price.toLocaleString()} (was KSh ${deal.originalPrice.toLocaleString()})`);
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('🎉 DEALS OF THE DAY SETUP COMPLETE');
    console.log('='.repeat(80));
    console.log(`✅ Total featured products: ${dealsToCreate.length}`);
    console.log('\nCategory breakdown:');

    const categoryCount: Record<string, number> = {};
    dealsToCreate.forEach(deal => {
      categoryCount[deal.category] = (categoryCount[deal.category] || 0) + 1;
    });

    Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} products`);
      });

    console.log('\nDiscount range:');
    const discounts = dealsToCreate.map(d => d.discount).sort((a, b) => a - b);
    console.log(`  Minimum: ${discounts[0]}%`);
    console.log(`  Maximum: ${discounts[discounts.length - 1]}%`);
    console.log(`  Average: ${Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length)}%`);

    console.log('\n✨ Setup complete!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run sync:data (to sync to local files)');
    console.log('  2. Check your homepage for the deals section\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDeals();
