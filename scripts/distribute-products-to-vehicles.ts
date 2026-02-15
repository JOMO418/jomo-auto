import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Vehicle type classifications
const VEHICLE_TYPES = {
  smallCars: ['Toyota Vitz', 'Mazda Demio', 'Nissan Note', 'Honda Fit', 'Toyota Passo', 'Nissan March'],
  sedans: ['Toyota Axio', 'Toyota Premio', 'Nissan Tiida', 'Honda Civic', 'Nissan Sylphy', 'Toyota Allion', 'Toyota Belta'],
  wagons: ['Nissan Wingroad', 'Toyota Fielder', 'Honda Airwave'],
  suvs: ['Toyota Harrier', 'Toyota Prado', 'Honda CR-V', 'Nissan X-Trail', 'Subaru Forester', 'Mazda CX-5'],
  vans: ['Toyota Wish', 'Toyota Voxy', 'Toyota Noah', 'Nissan Serena', 'Honda Stepwagon', 'Toyota Hiace'],
  trucks: ['Nissan Vanette', 'Toyota Probox', 'Nissan AD Van'],
  luxury: ['Toyota Crown', 'Toyota Mark X', 'Nissan Fuga'],
};

// Parts that are universal (fit most vehicles)
const UNIVERSAL_CATEGORIES = ['Engine', 'Electrical', 'Brakes'];

// Parts that may have vehicle-specific requirements
const SPECIFIC_CATEGORIES = ['Suspension', 'Transmission', 'Wheels & Tires', 'Body', 'Interior'];

function getVehicleType(vehicleModel: string): string {
  for (const [type, vehicles] of Object.entries(VEHICLE_TYPES)) {
    if (vehicles.includes(vehicleModel)) {
      return type;
    }
  }
  return 'general';
}

function shouldAssignProduct(
  productCategory: string,
  vehicleType: string,
  vehicleModel: string
): boolean {
  // Universal categories can be assigned to any vehicle
  if (UNIVERSAL_CATEGORIES.includes(productCategory)) {
    return true;
  }

  // Specific categories - assign based on vehicle type compatibility
  if (productCategory === 'Suspension') {
    // SUVs and trucks get heavier duty suspension parts
    if (vehicleType === 'suvs' || vehicleType === 'trucks') {
      return Math.random() > 0.2; // 80% chance
    }
    return Math.random() > 0.3; // 70% chance for others
  }

  if (productCategory === 'Transmission') {
    // All vehicles need transmission parts
    return Math.random() > 0.4; // 60% chance
  }

  if (productCategory === 'Wheels & Tires') {
    // Different vehicles use different hub sizes, but assign broadly
    return Math.random() > 0.3; // 70% chance
  }

  if (productCategory === 'Body') {
    // Body parts are usually vehicle-specific, but we'll assign some
    return Math.random() > 0.7; // 30% chance
  }

  if (productCategory === 'Interior') {
    // Interior parts are usually vehicle-specific
    return Math.random() > 0.7; // 30% chance
  }

  return true;
}

async function distributeProducts() {
  console.log('🚀 Starting Product-Vehicle Distribution...\n');

  try {
    // Fetch all products with their categories
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        categories!inner(name)
      `);

    if (productsError) throw productsError;

    // Fetch all vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, brand, model, code');

    if (vehiclesError) throw vehiclesError;

    console.log(`✅ Loaded ${products.length} products`);
    console.log(`✅ Loaded ${vehicles.length} vehicles\n`);

    // Delete existing compatibility relationships to start fresh
    console.log('🗑️  Clearing existing compatibility relationships...');
    const { error: deleteError } = await supabase
      .from('product_vehicle_compatibility')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) throw deleteError;
    console.log('✅ Cleared existing relationships\n');

    // Create new compatibility relationships
    const compatibilityRecords: any[] = [];
    let assignmentCount = 0;

    console.log('📝 Creating new compatibility relationships...\n');

    for (const vehicle of vehicles) {
      const vehicleModel = `${vehicle.brand} ${vehicle.model}`;
      const vehicleType = getVehicleType(vehicleModel);

      // Track categories for this vehicle
      const assignedCategories = new Set<string>();
      let assignedProducts = 0;

      // First pass: ensure at least some products from each category
      for (const product of products) {
        const categoryName = (product.categories as any).name;

        if (shouldAssignProduct(categoryName, vehicleType, vehicleModel)) {
          compatibilityRecords.push({
            product_id: product.id,
            vehicle_id: vehicle.id,
            compatibility_string: vehicleModel,
          });

          assignedCategories.add(categoryName);
          assignedProducts++;
        }
      }

      console.log(`✅ ${vehicleModel}: ${assignedProducts} products across ${assignedCategories.size} categories`);
      assignmentCount += assignedProducts;
    }

    console.log(`\n📊 Total compatibility relationships to create: ${compatibilityRecords.length}\n`);

    // Insert in batches to avoid overwhelming the database
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < compatibilityRecords.length; i += batchSize) {
      const batch = compatibilityRecords.slice(i, i + batchSize);

      const { error: insertError } = await supabase
        .from('product_vehicle_compatibility')
        .insert(batch);

      if (insertError) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, insertError);
        continue;
      }

      inserted += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(compatibilityRecords.length / batchSize)} (${inserted}/${compatibilityRecords.length})`);

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 DISTRIBUTION SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Total relationships created: ${inserted}`);
    console.log(`✅ Average products per vehicle: ${Math.round(inserted / vehicles.length)}`);
    console.log('\n✨ Distribution complete!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run analyze:distribution (to verify distribution)');
    console.log('  2. Run: npm run sync:data (to sync to local files)\n');

  } catch (error) {
    console.error('❌ Distribution failed:', error);
    process.exit(1);
  }
}

distributeProducts();
