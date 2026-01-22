#!/usr/bin/env node
/**
 * Convert images to WebP format optimized for web
 * Usage: node scripts/convert-to-webp.js [input-file] [output-file]
 *        node scripts/convert-to-webp.js (converts all images in public/images/)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// WebP optimization settings
const WEBP_OPTIONS = {
  quality: 85, // Good balance between quality and file size (0-100)
  effort: 6,   // Compression effort (0-6, higher = better compression but slower)
  lossless: false, // Use lossy compression for smaller files
  nearLossless: false,
  smartSubsample: true, // Better quality for photos
};

// Convert single image
async function convertImage(inputPath, outputPath) {
  try {
    const stats = await fs.promises.stat(inputPath);
    const originalSize = stats.size;

    console.log(`Converting: ${path.basename(inputPath)}`);
    
    await sharp(inputPath)
      .webp(WEBP_OPTIONS)
      .toFile(outputPath);

    const newStats = await fs.promises.stat(outputPath);
    const newSize = newStats.size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(`  ✅ Created: ${path.basename(outputPath)}`);
    console.log(`  📊 Size: ${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB (${savings}% smaller)`);
    
    return { success: true, originalSize, newSize, savings };
  } catch (error) {
    console.error(`  ❌ Error converting ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Convert all images in directory
async function convertDirectory(dirPath) {
  const files = await fs.promises.readdir(dirPath);
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
  
  const imageFiles = files.filter(file => {
    const ext = path.extname(file);
    return imageExtensions.includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log('No image files found in', dirPath);
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to convert:\n`);

  const results = [];
  for (const file of imageFiles) {
    const inputPath = path.join(dirPath, file);
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(dirPath, `${baseName}.webp`);

    // Skip if already WebP
    if (ext.toLowerCase() === '.webp') {
      console.log(`⏭️  Skipping (already WebP): ${file}`);
      continue;
    }

    const result = await convertImage(inputPath, outputPath);
    results.push({ file, ...result });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Conversion Summary:');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
    const totalNew = successful.reduce((sum, r) => sum + r.newSize, 0);
    const totalSavings = ((1 - totalNew / totalOriginal) * 100).toFixed(1);
    
    console.log(`✅ Successfully converted: ${successful.length} file(s)`);
    console.log(`📦 Total size: ${(totalOriginal / 1024).toFixed(2)}KB → ${(totalNew / 1024).toFixed(2)}KB`);
    console.log(`💾 Total savings: ${totalSavings}%`);
  }
  
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length} file(s)`);
    failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);

  // Check if sharp is available
  try {
    require('sharp');
  } catch (error) {
    console.error('❌ Error: sharp package not found!');
    console.log('\nInstall sharp:');
    console.log('  npm install sharp');
    process.exit(1);
  }

  if (args.length === 0) {
    // Convert all images in public/images/
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    if (fs.existsSync(imagesDir)) {
      await convertDirectory(imagesDir);
    } else {
      console.error('❌ Directory not found:', imagesDir);
      process.exit(1);
    }
  } else if (args.length === 1) {
    // Single file - output to same directory with .webp extension
    const inputPath = args[0];
    if (!fs.existsSync(inputPath)) {
      console.error('❌ File not found:', inputPath);
      process.exit(1);
    }

    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);
    const outputPath = path.join(dir, `${baseName}.webp`);

    await convertImage(inputPath, outputPath);
  } else if (args.length === 2) {
    // Input and output specified
    const [inputPath, outputPath] = args;
    if (!fs.existsSync(inputPath)) {
      console.error('❌ File not found:', inputPath);
      process.exit(1);
    }

    await convertImage(inputPath, outputPath);
  } else {
    console.log('Usage:');
    console.log('  node scripts/convert-to-webp.js                    # Convert all in public/images/');
    console.log('  node scripts/convert-to-webp.js <input>             # Convert single file');
    console.log('  node scripts/convert-to-webp.js <input> <output>    # Convert with custom output');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
