import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface DistributionReport {
  totalProducts: number;
  totalCategories: number;
  totalVehicles: number;
  totalImages: number;
  productsPerCategory: Record<string, number>;
  productsPerVehicle: Record<string, number>;
  categoriesPerVehicle: Record<string, string[]>;
  productsWithoutImages: string[];
  imagesWithoutProducts: string[];
  gaps: {
    categoriesWithFewProducts: string[];
    vehiclesWithFewCategories: string[];
  };
}

async function analyzeDistribution(): Promise<void> {
  console.log('📊 Starting Product Distribution Analysis...\n');

  try {
    // Fetch all data from Supabase
    console.log('🔄 Fetching data from Supabase...');

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (categoriesError) throw categoriesError;

    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .order('popular', { ascending: false });

    if (vehiclesError) throw vehiclesError;

    const { data: compatibility, error: compatError } = await supabase
      .from('product_vehicle_compatibility')
      .select('*');

    if (compatError) throw compatError;

    console.log(`✅ Fetched ${products.length} products`);
    console.log(`✅ Fetched ${categories.length} categories`);
    console.log(`✅ Fetched ${vehicles.length} vehicles`);
    console.log(`✅ Fetched ${compatibility.length} compatibility relationships\n`);

    // Get all images from product-images directory
    const imagesDir = path.join(process.cwd(), 'public/product-images');
    const imageFiles = fs.readdirSync(imagesDir);

    console.log(`✅ Found ${imageFiles.length} images in /public/product-images/\n`);

    // Initialize report
    const report: DistributionReport = {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalVehicles: vehicles.length,
      totalImages: imageFiles.length,
      productsPerCategory: {},
      productsPerVehicle: {},
      categoriesPerVehicle: {},
      productsWithoutImages: [],
      imagesWithoutProducts: [],
      gaps: {
        categoriesWithFewProducts: [],
        vehiclesWithFewCategories: [],
      },
    };

    // Analyze products per category
    console.log('📈 Analyzing products per category...');
    categories.forEach((cat: any) => {
      const categoryProducts = products.filter((p: any) => p.category_id === cat.id);
      report.productsPerCategory[cat.name] = categoryProducts.length;

      if (categoryProducts.length < 8) {
        report.gaps.categoriesWithFewProducts.push(`${cat.name} (${categoryProducts.length})`);
      }
    });

    // Analyze products per vehicle and categories per vehicle
    console.log('📈 Analyzing products per vehicle...');
    vehicles.forEach((vehicle: any) => {
      const vehicleCode = `${vehicle.brand} ${vehicle.model}`;
      const vehicleCompatibility = compatibility.filter(
        (c: any) => c.compatibility_string === vehicleCode
      );

      report.productsPerVehicle[vehicleCode] = vehicleCompatibility.length;

      // Get unique categories for this vehicle
      const vehicleProductIds = vehicleCompatibility.map((c: any) => c.product_id);
      const vehicleProducts = products.filter((p: any) =>
        vehicleProductIds.includes(p.id)
      );

      const uniqueCategories = new Set(
        vehicleProducts.map((p: any) => {
          const cat = categories.find((c: any) => c.id === p.category_id);
          return cat?.name || 'Unknown';
        })
      );

      report.categoriesPerVehicle[vehicleCode] = Array.from(uniqueCategories);

      if (uniqueCategories.size < 5) {
        report.gaps.vehiclesWithFewCategories.push(
          `${vehicleCode} (${uniqueCategories.size} categories)`
        );
      }
    });

    // Analyze products without images
    console.log('📈 Analyzing product-image matching...');
    products.forEach((product: any) => {
      if (!product.images || product.images.length === 0) {
        report.productsWithoutImages.push(product.name);
      }
    });

    // Find images not referenced by any product
    const usedImages = new Set<string>();
    products.forEach((product: any) => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((img: string) => {
          const filename = img.split('/').pop();
          if (filename) usedImages.add(filename);
        });
      }
    });

    imageFiles.forEach((file) => {
      if (!usedImages.has(file)) {
        report.imagesWithoutProducts.push(file);
      }
    });

    // Print detailed report
    printReport(report, categories, vehicles);

    // Save report to JSON file
    const reportPath = path.join(process.cwd(), 'scripts/distribution-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Full report saved to: ${reportPath}`);

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

function printReport(
  report: DistributionReport,
  categories: any[],
  vehicles: any[]
): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 DISTRIBUTION REPORT');
  console.log('='.repeat(80));

  console.log('\n📦 OVERALL STATS:');
  console.log(`  Total Products: ${report.totalProducts}`);
  console.log(`  Total Categories: ${report.totalCategories}`);
  console.log(`  Total Vehicles: ${report.totalVehicles}`);
  console.log(`  Total Images: ${report.totalImages}`);

  console.log('\n📁 PRODUCTS PER CATEGORY:');
  Object.entries(report.productsPerCategory)
    .sort(([, a], [, b]) => a - b)
    .forEach(([category, count]) => {
      const status = count < 8 ? '❌' : count < 12 ? '⚠️' : '✅';
      console.log(`  ${status} ${category}: ${count} products`);
    });

  console.log('\n🚗 TOP VEHICLES BY PRODUCT COUNT:');
  Object.entries(report.productsPerVehicle)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([vehicle, count]) => {
      const categoryCount = report.categoriesPerVehicle[vehicle]?.length || 0;
      const status = categoryCount < 5 ? '❌' : categoryCount < 7 ? '⚠️' : '✅';
      console.log(`  ${status} ${vehicle}: ${count} products across ${categoryCount} categories`);
    });

  console.log('\n⚠️  GAPS IDENTIFIED:');

  if (report.gaps.categoriesWithFewProducts.length > 0) {
    console.log(`\n  Categories with < 8 products (${report.gaps.categoriesWithFewProducts.length}):`);
    report.gaps.categoriesWithFewProducts.forEach((cat) => {
      console.log(`    - ${cat}`);
    });
  }

  if (report.gaps.vehiclesWithFewCategories.length > 0) {
    console.log(`\n  Vehicles with < 5 categories (${report.gaps.vehiclesWithFewCategories.length}):`);
    report.gaps.vehiclesWithFewCategories.slice(0, 15).forEach((veh) => {
      console.log(`    - ${veh}`);
    });
    if (report.gaps.vehiclesWithFewCategories.length > 15) {
      console.log(`    ... and ${report.gaps.vehiclesWithFewCategories.length - 15} more`);
    }
  }

  console.log('\n🖼️  IMAGE ANALYSIS:');
  console.log(`  Products without images: ${report.productsWithoutImages.length}`);
  if (report.productsWithoutImages.length > 0 && report.productsWithoutImages.length <= 10) {
    report.productsWithoutImages.forEach((name) => {
      console.log(`    - ${name}`);
    });
  }

  console.log(`  Images not assigned to products: ${report.imagesWithoutProducts.length}`);
  if (report.imagesWithoutProducts.length > 0) {
    console.log(`    First 10 unassigned images:`);
    report.imagesWithoutProducts.slice(0, 10).forEach((img) => {
      console.log(`    - ${img}`);
    });
    if (report.imagesWithoutProducts.length > 10) {
      console.log(`    ... and ${report.imagesWithoutProducts.length - 10} more`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Analysis complete!');
  console.log('='.repeat(80) + '\n');
}

analyzeDistribution();
