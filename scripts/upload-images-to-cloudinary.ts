import { v2 as cloudinary } from 'cloudinary';
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

interface UploadedImages {
  [category: string]: Array<{
    filename: string;
    url: string;
    publicId: string;
  }>;
}

async function uploadImages() {
  console.log('🚀 Starting Cloudinary image upload...\n');

  // Check if credentials are configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ ERROR: Cloudinary credentials not found in .env.local');
    console.error('Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  const imagesDir = path.join(process.cwd(), 'public/product-images');

  // Check if images directory exists
  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ ERROR: Images directory not found at ${imagesDir}`);
    console.error('Please create public/product-images/ and organize your images into category folders');
    process.exit(1);
  }

  const categories = fs.readdirSync(imagesDir);
  const uploadedImages: UploadedImages = {};

  let totalUploaded = 0;
  let totalFailed = 0;

  for (const category of categories) {
    const categoryPath = path.join(imagesDir, category);

    // Skip if not a directory
    if (!fs.statSync(categoryPath).isDirectory()) {
      console.log(`⏭️  Skipping ${category} (not a directory)`);
      continue;
    }

    console.log(`\n📁 Processing category: ${category}`);
    const files = fs.readdirSync(categoryPath);

    if (files.length === 0) {
      console.log(`   ⚠️  No files found in ${category}`);
      continue;
    }

    uploadedImages[category] = [];

    for (const file of files) {
      const filePath = path.join(categoryPath, file);

      // Skip if not an image file
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
        console.log(`   ⏭️  Skipping ${file} (not an image)`);
        continue;
      }

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: `jomo-auto-world/${category}`,
          public_id: path.parse(file).name,
          overwrite: true,
          transformation: [
            {
              width: 1200,
              height: 1200,
              crop: 'limit',
              quality: 'auto:good',
              fetch_format: 'auto'
            }
          ]
        });

        uploadedImages[category].push({
          filename: file,
          url: result.secure_url,
          publicId: result.public_id,
        });

        console.log(`   ✅ ${file} → ${result.secure_url}`);
        totalUploaded++;
      } catch (error: any) {
        console.error(`   ❌ Failed to upload ${file}:`, error.message);
        totalFailed++;
      }
    }
  }

  // Save mapping to JSON file
  const outputPath = path.join(process.cwd(), 'scripts/cloudinary-urls.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(uploadedImages, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully uploaded: ${totalUploaded} images`);
  console.log(`❌ Failed: ${totalFailed} images`);
  console.log(`📄 URLs saved to: ${outputPath}`);
  console.log('='.repeat(60) + '\n');

  if (totalUploaded > 0) {
    console.log('✅ Image upload complete! Next step: Run the data migration script');
    console.log('   Command: npm run migrate:data\n');
  }
}

// Run the upload
uploadImages().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
