#!/usr/bin/env node

/**
 * Password Hash Generator Script
 * Generates bcrypt hash from plain text password
 * 
 * Usage:
 *   node scripts/generate-hash.js <password>
 *   node scripts/generate-hash.js "$(openssl rand -base64 16)"
 *   node scripts/generate-hash.js "your-plain-text-password"
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generateHash(password) {
  if (!password) {
    // Try to read from .env.local file
    try {
      const envPath = path.join(__dirname, '../.env.local');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/ADMIN_PASSWORD=(.+)/);
        if (match && match[1]) {
          password = match[1].trim();
          console.log('📋 Found ADMIN_PASSWORD in .env.local');
        }
      }
    } catch (error) {
      // Ignore errors
    }
    
    if (!password) {
      // Prompt for password
      password = await new Promise((resolve) => {
        rl.question('Enter password to hash: ', (answer) => {
          resolve(answer);
        });
      });
    }
  }

  if (!password) {
    console.error('❌ Error: Password is required');
    console.log('\nUsage:');
    console.log('  node scripts/generate-hash.js <password>');
    console.log('  node scripts/generate-hash.js "$ADMIN_PASSWORD"');
    console.log('  Or set ADMIN_PASSWORD in .env.local and run: node scripts/generate-hash.js');
    process.exit(1);
  }

  // Generate hash with salt rounds (10 is recommended)
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  console.log('\n✅ Password hash generated successfully!\n');
  console.log('📋 Copy this hash to your .env.production file:');
  console.log('─────────────────────────────────────────────────────');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('─────────────────────────────────────────────────────\n');
  
  console.log('⚠️  IMPORTANT:');
  console.log('   1. Copy the hash above');
  console.log('   2. Replace ADMIN_PASSWORD with ADMIN_PASSWORD_HASH in .env.production');
  console.log('   3. Delete or secure your original plain text password');
  console.log('   4. Never commit the plain text password to git\n');

  // Verify hash works
  const isValid = await bcrypt.compare(password, hash);
  if (isValid) {
    console.log('✅ Hash verification: SUCCESS');
  } else {
    console.log('❌ Hash verification: FAILED');
    process.exit(1);
  }

  rl.close();
}

// Get password from command line argument
const password = process.argv[2];

generateHash(password).catch((error) => {
  console.error('❌ Error generating hash:', error);
  rl.close();
  process.exit(1);
});
