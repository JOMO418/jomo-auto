import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixLocalImages() {
  console.log('🔍 Fetching all products from Supabase...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, images');

  if (error) {
    console.error('❌ Failed to fetch products:', error.message);
    process.exit(1);
  }

  // Only products that still have at least one local path
  const localProducts = (products as any[]).filter((p) =>
    Array.isArray(p.images) &&
    p.images.some((img: string) => img.startsWith('/product-images/'))
  );

  if (localProducts.length === 0) {
    console.log('✅ All product images are already on Cloudinary. Nothing to do.');
    return;
  }

  console.log(`Found ${localProducts.length} products with local image paths.\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < localProducts.length; i++) {
    const product = localProducts[i];
    const newImages: string[] = [];
    let hasChanges = false;

    console.log(`[${i + 1}/${localProducts.length}] ${product.name}`);

    for (const imgPath of product.images as string[]) {
      if (!imgPath.startsWith('/product-images/')) {
        // Already a Cloudinary URL or external — keep as-is
        newImages.push(imgPath);
        continue;
      }

      const filename = imgPath.replace('/product-images/', '');
      const localPath = path.join(process.cwd(), 'public', 'product-images', filename);

      if (!fs.existsSync(localPath)) {
        console.log(`  ⚠️  File not found: "${filename}" — skipping`);
        newImages.push(imgPath);
        skipped++;
        continue;
      }

      try {
        // Use the filename (without extension, spaces → dashes) as the public_id
        const publicId = path.parse(filename).name
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9_-]/g, '');

        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'jomo-auto-world/products',
          public_id: publicId,
          overwrite: true,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
          ],
        });

        newImages.push(result.secure_url);
        hasChanges = true;
        console.log(`  ✅ Uploaded → ${result.secure_url}`);
      } catch (err: any) {
        console.log(`  ❌ Upload failed for "${filename}": ${err.message}`);
        newImages.push(imgPath); // keep the old path on failure
        failed++;
      }
    }

    if (hasChanges) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: newImages })
        .eq('id', product.id);

      if (updateError) {
        console.log(`  ❌ Supabase update failed: ${updateError.message}`);
        failed++;
      } else {
        console.log(`  💾 Supabase updated.\n`);
        updated++;
      }
    } else {
      console.log(`  ⏭️  No changes needed.\n`);
    }
  }

  console.log('='.repeat(55));
  console.log('📊 DONE');
  console.log(`✅ Products updated in Supabase : ${updated}`);
  console.log(`⚠️  Files not found (skipped)    : ${skipped}`);
  console.log(`❌ Failures                      : ${failed}`);
  console.log('='.repeat(55));
  console.log('\nNext step → run:  npm run sync:data\n');
}

fixLocalImages().catch((err) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
