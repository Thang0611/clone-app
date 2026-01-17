#!/usr/bin/env node

/**
 * Password Testing Script
 * Tests password authentication to debug login issues
 */

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          // Remove quotes if present
          const cleanValue = value.replace(/^["']|["']$/g, '');
          process.env[key.trim()] = cleanValue;
        }
      }
    });
  }
}

async function testPassword() {
  loadEnv();

  console.log('\n🔍 Password Authentication Test\n');
  console.log('='.repeat(60));

  // Get password from command line argument
  const testPassword = process.argv[2];

  if (!testPassword) {
    console.error('❌ Error: Please provide password to test');
    console.log('\nUsage:');
    console.log('  node scripts/test-password.js <password>');
    process.exit(1);
  }

  // Get environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPasswordPlain = process.env.ADMIN_PASSWORD;

  console.log('\n📋 Environment Variables:');
  console.log('-'.repeat(60));
  console.log(`ADMIN_EMAIL: ${adminEmail ? '✅ Set' : '❌ Not set'}`);
  if (adminEmail) {
    console.log(`  Value: ${adminEmail}`);
  }

  console.log(`\nADMIN_PASSWORD_HASH: ${adminPasswordHash ? '✅ Set' : '❌ Not set'}`);
  if (adminPasswordHash) {
    console.log(`  Value: ${adminPasswordHash.substring(0, 30)}...`);
    console.log(`  Length: ${adminPasswordHash.length} characters`);
  }

  console.log(`\nADMIN_PASSWORD (plain): ${adminPasswordPlain ? '⚠️  Set (legacy)' : '✅ Not set (good)'}`);
  if (adminPasswordPlain) {
    console.log(`  Length: ${adminPasswordPlain.length} characters`);
  }

  // Check which password method is being used
  console.log('\n🔐 Authentication Method:');
  console.log('-'.repeat(60));
  
  if (adminPasswordHash) {
    console.log('✅ Using ADMIN_PASSWORD_HASH (bcrypt - secure)');
  } else if (adminPasswordPlain) {
    console.log('⚠️  Using ADMIN_PASSWORD (plain text - less secure)');
  } else {
    console.error('❌ ERROR: No password configured!');
    console.error('   Please set ADMIN_PASSWORD_HASH or ADMIN_PASSWORD in .env.local');
    process.exit(1);
  }

  // Test password comparison
  console.log('\n🧪 Password Test:');
  console.log('-'.repeat(60));
  console.log(`Test Password: ${testPassword}`);
  console.log(`Test Password Length: ${testPassword.length} characters`);

  let passwordValid = false;
  let comparisonMethod = '';

  if (adminPasswordHash) {
    console.log('\nTesting with bcrypt.compare():');
    try {
      passwordValid = await bcrypt.compare(testPassword, adminPasswordHash);
      comparisonMethod = 'bcrypt.compare()';
      console.log(`✅ bcrypt.compare() executed successfully`);
      console.log(`Result: ${passwordValid ? '✅ MATCH' : '❌ NO MATCH'}`);
    } catch (error) {
      console.error(`❌ Error in bcrypt.compare():`, error.message);
      console.error(`   This might indicate the hash is corrupted or invalid`);
      process.exit(1);
    }
  } else if (adminPasswordPlain) {
    console.log('\nTesting with plain text comparison:');
    passwordValid = testPassword === adminPasswordPlain;
    comparisonMethod = 'plain text ===';
    console.log(`Result: ${passwordValid ? '✅ MATCH' : '❌ NO MATCH'}`);
    
    if (!passwordValid) {
      console.log('\n⚠️  Debug Info:');
      console.log(`  Test password length: ${testPassword.length}`);
      console.log(`  Config password length: ${adminPasswordPlain.length}`);
      console.log(`  Test password chars: ${JSON.stringify(testPassword)}`);
      console.log(`  Config password chars: ${JSON.stringify(adminPasswordPlain)}`);
    }
  }

  // Final result
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULT:');
  console.log('='.repeat(60));
  
  if (passwordValid) {
    console.log('✅ SUCCESS: Password is CORRECT!');
    console.log(`   Authentication method: ${comparisonMethod}`);
    console.log('\n💡 If login still fails, check:');
    console.log('   1. Email matches ADMIN_EMAIL exactly');
    console.log('   2. Server is restarted after env changes');
    console.log('   3. Environment variables are loaded correctly');
  } else {
    console.log('❌ FAILED: Password is INCORRECT!');
    console.log(`   Authentication method: ${comparisonMethod}`);
    console.log('\n💡 Solutions:');
    console.log('   1. Check if password has extra spaces or special characters');
    console.log('   2. If using hash, regenerate with: node scripts/generate-hash.js "<password>"');
    console.log('   3. Verify ADMIN_PASSWORD_HASH in .env.local matches generated hash');
    console.log('   4. Make sure you\'re using the correct password');
    
    if (adminPasswordHash) {
      console.log('\n💡 To regenerate hash:');
      console.log(`   node scripts/generate-hash.js "${testPassword}"`);
      console.log('   Then copy the hash to ADMIN_PASSWORD_HASH in .env.local');
    }
  }

  console.log('\n');
}

testPassword().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
