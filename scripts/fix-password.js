#!/usr/bin/env node

/**
 * Password Fix Script
 * Helps fix password configuration issues
 */

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    return fs.readFileSync(envPath, 'utf8');
  }
  return null;
}

function saveEnv(content) {
  const envPath = path.join(__dirname, '../.env.local');
  fs.writeFileSync(envPath, content, 'utf8');
  console.log('✅ Updated .env.local');
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function fixPassword() {
  console.log('\n🔧 Password Configuration Fix\n');
  console.log('='.repeat(60));

  const envContent = loadEnv();
  if (!envContent) {
    console.error('❌ .env.local not found!');
    process.exit(1);
  }

  // Check current configuration
  const hasHash = envContent.includes('ADMIN_PASSWORD_HASH=');
  const hasPlain = envContent.match(/^ADMIN_PASSWORD=(?!HASH)/m);
  
  console.log('\n📋 Current Configuration:');
  console.log('-'.repeat(60));
  console.log(`ADMIN_PASSWORD_HASH: ${hasHash ? '✅ Set' : '❌ Not set'}`);
  console.log(`ADMIN_PASSWORD (plain): ${hasPlain ? '⚠️  Set' : '✅ Not set'}`);

  if (hasHash && hasPlain) {
    console.log('\n⚠️  WARNING: Both ADMIN_PASSWORD_HASH and ADMIN_PASSWORD are set!');
    console.log('   This can cause confusion. The system uses ADMIN_PASSWORD_HASH first.');
  }

  // Get password from user
  console.log('\n🔐 Enter the correct password (will not be displayed):');
  const password = await question('Password: ');
  
  if (!password || password.trim().length === 0) {
    console.error('❌ Password cannot be empty!');
    rl.close();
    process.exit(1);
  }

  // Generate hash
  console.log('\n🔨 Generating hash...');
  const saltRounds = 10;
  const hash = await bcrypt.hash(password.trim(), saltRounds);
  
  // Verify hash
  const isValid = await bcrypt.compare(password.trim(), hash);
  if (!isValid) {
    console.error('❌ Hash verification failed!');
    rl.close();
    process.exit(1);
  }

  console.log('✅ Hash generated and verified successfully!\n');

  // Update .env.local
  let newContent = envContent;
  
  // Remove ADMIN_PASSWORD (plain text) lines (keep ADMIN_PASSWORD_HASH)
  newContent = newContent.replace(/^ADMIN_PASSWORD=(?!HASH).*$/gm, '');
  
  // Update or add ADMIN_PASSWORD_HASH
  if (hasHash) {
    // Replace existing hash
    newContent = newContent.replace(
      /^ADMIN_PASSWORD_HASH=.*$/m,
      `ADMIN_PASSWORD_HASH=${hash}`
    );
    console.log('✅ Updated ADMIN_PASSWORD_HASH');
  } else {
    // Add new hash (find ADMIN_EMAIL to add after it)
    if (newContent.includes('ADMIN_EMAIL=')) {
      newContent = newContent.replace(
        /^(ADMIN_EMAIL=.*)$/m,
        `$1\nADMIN_PASSWORD_HASH=${hash}`
      );
    } else {
      newContent = `ADMIN_PASSWORD_HASH=${hash}\n${newContent}`;
    }
    console.log('✅ Added ADMIN_PASSWORD_HASH');
  }

  // Remove empty lines
  newContent = newContent.replace(/\n\n\n+/g, '\n\n');

  // Show what will be changed
  console.log('\n📋 Changes to be made:');
  console.log('-'.repeat(60));
  console.log(`1. ADMIN_PASSWORD_HASH will be set to: ${hash.substring(0, 30)}...`);
  if (hasPlain) {
    console.log('2. ADMIN_PASSWORD (plain text) will be REMOVED');
  }
  
  // Confirm
  console.log('\n⚠️  This will update .env.local');
  const confirm = await question('Continue? (yes/no): ');
  
  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('❌ Cancelled');
    rl.close();
    process.exit(0);
  }

  // Save
  saveEnv(newContent);

  console.log('\n' + '='.repeat(60));
  console.log('✅ Configuration Updated Successfully!');
  console.log('='.repeat(60));
  console.log('\n📋 Next Steps:');
  console.log('   1. Restart the server:');
  console.log('      pkill -f "next dev"');
  console.log('      npm run dev');
  console.log('   2. Test login with the password you just entered');
  console.log('   3. Test with: node scripts/test-password.js "' + password.trim() + '"');
  console.log('\n');

  rl.close();
}

fixPassword().catch((error) => {
  console.error('❌ Error:', error);
  rl.close();
  process.exit(1);
});
