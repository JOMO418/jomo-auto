import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ================================================
// KENYAN POPULAR VEHICLES (Focus on Toyota)
// ================================================
const KENYAN_VEHICLES = [
  // Toyota (Majority - Most Popular)
  { brand: 'Toyota', model: 'Vitz', code: 'NCP91', years: '2005-2010', popular: true },
  { brand: 'Toyota', model: 'Vitz', code: 'KSP90', years: '2005-2010', popular: true },
  { brand: 'Toyota', model: 'Probox', code: 'NCP51', years: '2002-2014', popular: true },
  { brand: 'Toyota', model: 'Probox', code: 'NCP160', years: '2014-2020', popular: true },
  { brand: 'Toyota', model: 'Fielder', code: 'NZE141', years: '2006-2012', popular: true },
  { brand: 'Toyota', model: 'Fielder', code: 'NZE144', years: '2006-2012', popular: true },
  { brand: 'Toyota', model: 'Fielder', code: 'NZE161', years: '2012-2020', popular: true },
  { brand: 'Toyota', model: 'Corolla', code: 'AE110', years: '1995-2002', popular: true },
  { brand: 'Toyota', model: 'Corolla', code: 'AE111', years: '1995-2000', popular: true },
  { brand: 'Toyota', model: 'Corolla', code: 'NZE120', years: '2000-2006', popular: true },
  { brand: 'Toyota', model: 'Wish', code: 'ZNE10', years: '2003-2009', popular: true },
  { brand: 'Toyota', model: 'Wish', code: 'ZGE20', years: '2009-2017', popular: true },
  { brand: 'Toyota', model: 'Belta', code: 'NCP96', years: '2005-2012', popular: true },
  { brand: 'Toyota', model: 'Hiace', code: 'KDH200 5L', years: '2005-2019', popular: true },
  { brand: 'Toyota', model: 'Hiace', code: 'KDH201', years: '2005-2019', popular: true },
  { brand: 'Toyota', model: 'Noah', code: 'AZR60', years: '2001-2007', popular: true },
  { brand: 'Toyota', model: 'Voxy', code: 'AZR60', years: '2001-2007', popular: true },
  { brand: 'Toyota', model: 'Prado', code: '120', years: '2002-2009', popular: true },
  { brand: 'Toyota', model: 'Prado', code: '150', years: '2009-2023', popular: true },
  { brand: 'Toyota', model: 'Harrier', code: 'ACU30', years: '2003-2013', popular: false },
  { brand: 'Toyota', model: 'Mark X', code: 'GRX120', years: '2004-2009', popular: false },
  { brand: 'Toyota', model: 'Premio', code: 'NZT260', years: '2007-2016', popular: false },
  { brand: 'Toyota', model: 'Allion', code: 'NZT260', years: '2007-2016', popular: false },
  { brand: 'Toyota', model: 'Ractis', code: 'NCP100', years: '2005-2010', popular: false },
  { brand: 'Toyota', model: 'Axio', code: 'NZE141', years: '2006-2012', popular: false },

  // Nissan (Some Popular Models)
  { brand: 'Nissan', model: 'Note', code: 'E11', years: '2005-2012', popular: true },
  { brand: 'Nissan', model: 'Note', code: 'E12', years: '2012-2020', popular: true },
  { brand: 'Nissan', model: 'Wingroad', code: 'Y12', years: '2005-2018', popular: true },
  { brand: 'Nissan', model: 'Tiida', code: 'C11', years: '2004-2012', popular: true },
  { brand: 'Nissan', model: 'March', code: 'K12', years: '2002-2010', popular: false },
  { brand: 'Nissan', model: 'X-Trail', code: 'T31', years: '2007-2014', popular: false },
  { brand: 'Nissan', model: 'Serena', code: 'C25', years: '2005-2010', popular: false },

  // Mazda (Few Models)
  { brand: 'Mazda', model: 'Demio', code: 'DY', years: '2002-2007', popular: true },
  { brand: 'Mazda', model: 'Demio', code: 'DE', years: '2007-2014', popular: true },
  { brand: 'Mazda', model: 'Axela', code: 'BK', years: '2003-2009', popular: false },
];

// ================================================
// PRODUCT CATEGORIES
// ================================================
const CATEGORIES = [
  'Suspension',
  'Engine',
  'Brakes',
  'Electrical',
  'Body',
  'Interior',
  'Wheels & Tires',
  'Transmission',
];

// ================================================
// PART TYPE IDENTIFICATION (Based on Filename/Image)
// ================================================
function identifyPartType(filename: string): {
  category: string;
  partType: string;
  position?: string;
} {
  const lower = filename.toLowerCase();

  // Suspension Parts
  if (lower.includes('shock') || lower.includes('absorber') || lower.includes('strut')) {
    return { category: 'Suspension', partType: 'Shock Absorber', position: 'Front/Rear' };
  }
  if (lower.includes('control') && lower.includes('arm')) {
    return { category: 'Suspension', partType: 'Control Arm', position: 'Front' };
  }
  if (lower.includes('spring') || lower.includes('coil')) {
    return { category: 'Suspension', partType: 'Coil Spring', position: 'Rear' };
  }
  if (lower.includes('stabilizer') || lower.includes('sway')) {
    return { category: 'Suspension', partType: 'Stabilizer Link' };
  }
  if (lower.includes('bush') && !lower.includes('bushing')) {
    return { category: 'Suspension', partType: 'Suspension Bush' };
  }

  // Engine Parts
  if (lower.includes('ac') && (lower.includes('pump') || lower.includes('compressor'))) {
    return { category: 'Engine', partType: 'AC Compressor Pump' };
  }
  if (lower.includes('alt') || lower.includes('alternator')) {
    return { category: 'Electrical', partType: 'Alternator' };
  }
  if (lower.includes('air') && (lower.includes('filter') || lower.includes('cleaner'))) {
    return { category: 'Engine', partType: 'Air Filter' };
  }
  if (lower.includes('oil') && lower.includes('filter')) {
    return { category: 'Engine', partType: 'Oil Filter' };
  }
  if (lower.includes('fuel') && lower.includes('pump')) {
    return { category: 'Engine', partType: 'Fuel Pump' };
  }
  if (lower.includes('radiator')) {
    return { category: 'Engine', partType: 'Radiator' };
  }
  if (lower.includes('thermostat')) {
    return { category: 'Engine', partType: 'Thermostat' };
  }
  if (lower.includes('water') && lower.includes('pump')) {
    return { category: 'Engine', partType: 'Water Pump' };
  }
  if (lower.includes('timing') && lower.includes('belt')) {
    return { category: 'Engine', partType: 'Timing Belt' };
  }

  // Brake Parts
  if (lower.includes('brake') && lower.includes('pad')) {
    return { category: 'Brakes', partType: 'Brake Pads', position: 'Front/Rear' };
  }
  if (lower.includes('brake') && (lower.includes('disc') || lower.includes('rotor'))) {
    return { category: 'Brakes', partType: 'Brake Disc Rotor' };
  }
  if (lower.includes('brake') && lower.includes('caliper')) {
    return { category: 'Brakes', partType: 'Brake Caliper' };
  }

  // Electrical
  if (lower.includes('starter')) {
    return { category: 'Electrical', partType: 'Starter Motor' };
  }
  if (lower.includes('battery')) {
    return { category: 'Electrical', partType: 'Battery' };
  }
  if (lower.includes('headlight') || lower.includes('head lamp')) {
    return { category: 'Electrical', partType: 'Headlight Assembly' };
  }

  // Body Parts
  if (lower.includes('bumper')) {
    return { category: 'Body', partType: 'Bumper', position: 'Front/Rear' };
  }
  if (lower.includes('fender') || lower.includes('wing')) {
    return { category: 'Body', partType: 'Fender/Wing Panel' };
  }
  if (lower.includes('door')) {
    return { category: 'Body', partType: 'Door Panel' };
  }
  if (lower.includes('bonnet') || lower.includes('hood')) {
    return { category: 'Body', partType: 'Bonnet/Hood' };
  }
  if (lower.includes('mirror')) {
    return { category: 'Body', partType: 'Side Mirror' };
  }

  // Wheels & Tires
  if (lower.includes('wheel') || lower.includes('rim')) {
    return { category: 'Wheels & Tires', partType: 'Alloy Wheel Rim' };
  }
  if (lower.includes('tire') || lower.includes('tyre')) {
    return { category: 'Wheels & Tires', partType: 'Tire' };
  }

  // Transmission
  if (lower.includes('gearbox') || lower.includes('transmission')) {
    return { category: 'Transmission', partType: 'Gearbox/Transmission' };
  }
  if (lower.includes('clutch')) {
    return { category: 'Transmission', partType: 'Clutch Kit' };
  }

  // Default fallback
  return { category: 'Engine', partType: 'Auto Part' };
}

// ================================================
// GENERATE RANDOM PRICE
// ================================================
function generatePrice(category: string): { price: number; originalPrice?: number } {
  const priceRanges: Record<string, [number, number]> = {
    'Suspension': [5000, 15000],
    'Engine': [3000, 20000],
    'Brakes': [4000, 12000],
    'Electrical': [8000, 25000],
    'Body': [10000, 50000],
    'Interior': [2000, 15000],
    'Wheels & Tires': [15000, 60000],
    'Transmission': [30000, 150000],
  };

  const [min, max] = priceRanges[category] || [5000, 15000];
  const price = Math.floor(Math.random() * (max - min) + min);

  // 30% chance of having an original price (discount)
  const hasDiscount = Math.random() < 0.3;
  const originalPrice = hasDiscount ? Math.floor(price * 1.2) : undefined;

  return { price, originalPrice };
}

// ================================================
// GENERATE PRODUCT SLUG
// ================================================
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ================================================
// MAIN MIGRATION FUNCTION
// ================================================
async function smartMigration() {
  console.log('🚀 Starting Smart Image Migration...\n');
  console.log('This will:');
  console.log('  1. Upload all images to Cloudinary');
  console.log('  2. Analyze each image to identify part type');
  console.log('  3. Generate realistic product data');
  console.log('  4. Create products in Supabase\n');

  try {
    // ================================================
    // STEP 1: Create Categories
    // ================================================
    console.log('📁 Step 1: Creating Categories...');
    const categoryMap = new Map<string, string>();

    for (const categoryName of CATEGORIES) {
      const slug = generateSlug(categoryName);

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryName,
          slug: slug,
          description: `${categoryName} parts and accessories`
        })
        .select()
        .single();

      if (error && error.code === '23505') {
        const { data: existing } = await supabase
          .from('categories')
          .select('id, name')
          .eq('slug', slug)
          .single();

        if (existing) {
          categoryMap.set(categoryName, existing.id);
          console.log(`   ⚠️  Category exists: ${categoryName}`);
        }
      } else if (data) {
        categoryMap.set(categoryName, data.id);
        console.log(`   ✅ Created: ${categoryName}`);
      }
    }

    // ================================================
    // STEP 2: Create Vehicles
    // ================================================
    console.log('\n🚗 Step 2: Creating Vehicles...');
    const vehicleMap = new Map<string, { id: string; vehicle: typeof KENYAN_VEHICLES[0] }>();

    for (const vehicle of KENYAN_VEHICLES) {
      const slug = generateSlug(`${vehicle.brand} ${vehicle.model} ${vehicle.code}`);
      const key = `${vehicle.brand} ${vehicle.model} ${vehicle.code}`;

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

      if (error && error.code === '23505') {
        const { data: existing } = await supabase
          .from('vehicles')
          .select('id')
          .eq('slug', slug)
          .single();

        if (existing) {
          vehicleMap.set(key, { id: existing.id, vehicle });
          console.log(`   ⚠️  Vehicle exists: ${key}`);
        }
      } else if (data) {
        vehicleMap.set(key, { id: data.id, vehicle });
        console.log(`   ✅ Created: ${key}`);
      }
    }

    // ================================================
    // STEP 3: Process Images
    // ================================================
    console.log('\n📸 Step 3: Processing Images...');
    const imagesDir = path.join(process.cwd(), 'public/product-images');
    const files = fs.readdirSync(imagesDir);

    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.jfif', '.gif'].includes(ext);
    });

    console.log(`   Found ${imageFiles.length} images\n`);

    let created = 0;
    let skipped = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const filePath = path.join(imagesDir, file);

      console.log(`[${i + 1}/${imageFiles.length}] Processing: ${file}`);

      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'jomo-auto-world/products',
          public_id: path.parse(file).name,
          overwrite: true,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }
          ]
        });

        const imageUrl = uploadResult.secure_url;

        // Identify part type
        const partInfo = identifyPartType(file);

        // Get random vehicles (2-4 compatible vehicles)
        const vehicleCount = Math.floor(Math.random() * 3) + 2; // 2-4 vehicles
        const vehicleArray = Array.from(vehicleMap.values());

        // Prefer Toyota (70%), then Nissan (20%), then Mazda (10%)
        const weightedVehicles = vehicleArray.filter(v => {
          const rand = Math.random();
          if (v.vehicle.brand === 'Toyota') return rand < 0.7;
          if (v.vehicle.brand === 'Nissan') return rand < 0.2;
          return rand < 0.1;
        });

        const selectedVehicles = weightedVehicles
          .sort(() => Math.random() - 0.5)
          .slice(0, vehicleCount);

        if (selectedVehicles.length === 0) {
          // Fallback to any vehicle
          selectedVehicles.push(vehicleArray[Math.floor(Math.random() * vehicleArray.length)]);
        }

        const mainVehicle = selectedVehicles[0].vehicle;

        // Generate product name
        const position = partInfo.position ? ` ${partInfo.position}` : '';
        const productName = `${mainVehicle.model} ${mainVehicle.code} ${partInfo.partType}${position}`;

        // Generate slug
        const productSlug = generateSlug(productName) + `-${i + 1}`;

        // Generate price
        const { price, originalPrice } = generatePrice(partInfo.category);

        // Generate description
        const condition = Math.random() < 0.6 ? 'Used' : 'New';
        const origin = Math.random() < 0.8 ? 'Japan' : 'UAE';

        const description = `${condition} ${partInfo.partType.toLowerCase()} for ${mainVehicle.brand} ${mainVehicle.model} ${mainVehicle.code}. ${
          condition === 'Used' ? 'Ex-Japan quality, thoroughly inspected.' : 'Brand new OEM quality part.'
        } Compatible with multiple models. ${origin === 'Japan' ? 'Direct import from Japan.' : 'Imported from UAE.'}`;

        // Generate specs
        const specs: Record<string, string> = {
          'Condition': condition,
          'Origin': origin,
          'Warranty': condition === 'New' ? '6 months' : '3 months',
          'Brand': mainVehicle.brand,
        };

        if (partInfo.position) {
          specs['Position'] = partInfo.position;
        }

        // Stock
        const stock = Math.floor(Math.random() * 15) + 3; // 3-17 items

        // Featured (20% chance)
        const featured = Math.random() < 0.2;

        // Get category ID
        const categoryId = categoryMap.get(partInfo.category);

        if (!categoryId) {
          console.log(`   ❌ Category not found: ${partInfo.category}`);
          skipped++;
          continue;
        }

        // Create product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .insert({
            slug: productSlug,
            name: productName,
            description: description,
            price: price,
            original_price: originalPrice,
            stock: stock,
            condition: condition,
            category_id: categoryId,
            origin: origin,
            featured: featured,
            images: [imageUrl],
            specs: specs
          })
          .select()
          .single();

        if (productError) {
          console.log(`   ❌ Error creating product: ${productError.message}`);
          skipped++;
          continue;
        }

        // Create compatibility relationships
        for (const { id: vehicleId, vehicle } of selectedVehicles) {
          const compatString = `${vehicle.brand} ${vehicle.model} ${vehicle.code} (${vehicle.years})`;

          await supabase
            .from('product_vehicle_compatibility')
            .insert({
              product_id: productData.id,
              vehicle_id: vehicleId,
              compatibility_string: compatString,
              year_start: parseInt(vehicle.years.split('-')[0]),
              year_end: parseInt(vehicle.years.split('-')[1])
            });
        }

        console.log(`   ✅ Created: ${productName}`);
        created++;

      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
        skipped++;
      }
    }

    // ================================================
    // SUMMARY
    // ================================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION COMPLETE!');
    console.log('='.repeat(60));
    console.log(`✅ Products created: ${created}`);
    console.log(`⚠️  Skipped: ${skipped}`);
    console.log(`📁 Categories: ${categoryMap.size}`);
    console.log(`🚗 Vehicles: ${vehicleMap.size}`);
    console.log('='.repeat(60) + '\n');

    console.log('🎉 Your Jomo Auto World store is ready!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Open: http://localhost:3000');
    console.log('   3. Browse your products!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
smartMigration();
