#!/usr/bin/env node

/**
 * Login Test Script
 * Tests full login flow including email check
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

async function testLogin() {
  loadEnv();

  console.log('\n🔍 Full Login Flow Test\n');
  console.log('='.repeat(60));

  // Get credentials from command line
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('❌ Error: Please provide email and password');
    console.log('\nUsage:');
    console.log('  node scripts/test-login.js <email> <password>');
    console.log('\nExample:');
    console.log('  node scripts/test-login.js admin@example.com "password123"');
    process.exit(1);
  }

  // Get environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPasswordPlain = process.env.ADMIN_PASSWORD;

  console.log('\n📋 Environment Configuration:');
  console.log('-'.repeat(60));
  console.log(`ADMIN_EMAIL: ${adminEmail ? '✅ Set' : '❌ Not set'}`);
  if (adminEmail) {
    console.log(`  Value: "${adminEmail}"`);
    console.log(`  Length: ${adminEmail.length} characters`);
  }

  console.log(`\nADMIN_PASSWORD_HASH: ${adminPasswordHash ? '✅ Set' : '❌ Not set'}`);
  if (adminPasswordHash) {
    console.log(`  Hash length: ${adminPasswordHash.length} characters`);
  }

  console.log(`\nADMIN_PASSWORD (plain): ${adminPasswordPlain ? '⚠️  Set' : '✅ Not set'}`);

  // Test credentials
  console.log('\n🧪 Testing Credentials:');
  console.log('-'.repeat(60));
  console.log(`Email entered: "${email}"`);
  console.log(`Email from env: "${adminEmail}"`);
  console.log(`Email match: ${email === adminEmail ? '✅ YES' : '❌ NO'}`);
  console.log(`\nPassword length: ${password.length} characters`);

  // Test email
  console.log('\n📧 Email Check:');
  console.log('-'.repeat(60));
  
  if (!adminEmail) {
    console.error('❌ ERROR: ADMIN_EMAIL is not set!');
    process.exit(1);
  }

  const emailMatch = email === adminEmail;
  
  if (emailMatch) {
    console.log('✅ Email matches!');
  } else {
    console.log('❌ Email does NOT match!');
    console.log('\n⚠️  ISSUE FOUND: Email mismatch!');
    console.log('   This is why login fails.');
    console.log('\n💡 Solutions:');
    console.log(`   1. Use exact email: "${adminEmail}"`);
    console.log(`   2. Check for spaces: "${JSON.stringify(email)}" vs "${JSON.stringify(adminEmail)}"`);
    console.log(`   3. Check case sensitivity`);
    return;
  }

  // Test password
  console.log('\n🔐 Password Check:');
  console.log('-'.repeat(60));

  let passwordValid = false;
  let comparisonMethod = '';

  if (adminPasswordHash) {
    try {
      passwordValid = await bcrypt.compare(password, adminPasswordHash);
      comparisonMethod = 'bcrypt.compare()';
      if (passwordValid) {
        console.log('✅ Password matches!');
      } else {
        console.log('❌ Password does NOT match!');
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
  } else if (adminPasswordPlain) {
    passwordValid = password === adminPasswordPlain;
    comparisonMethod = 'plain text ===';
    if (passwordValid) {
      console.log('✅ Password matches!');
    } else {
      console.log('❌ Password does NOT match!');
    }
  } else {
    console.error('❌ ERROR: No password configured!');
    process.exit(1);
  }

  // Final result
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULT:');
  console.log('='.repeat(60));

  if (emailMatch && passwordValid) {
    console.log('✅ SUCCESS: Both email and password are CORRECT!');
    console.log(`   Email: ✅ Match`);
    console.log(`   Password: ✅ Match (${comparisonMethod})`);
    console.log('\n💡 If login still fails, check:');
    console.log('   1. Server is running and restarted after env changes');
    console.log('   2. Browser cache cleared (try incognito mode)');
    console.log('   3. Check server logs for NextAuth errors');
    console.log('   4. Check network tab in browser for API errors');
    console.log('   5. Try: curl -X POST http://localhost:4000/api/auth/callback/credentials');
  } else {
    console.log('❌ FAILED: Credentials are INCORRECT!');
    console.log(`   Email: ${emailMatch ? '✅ Match' : '❌ No match'}`);
    console.log(`   Password: ${passwordValid ? '✅ Match' : '❌ No match'}`);
    
    if (!emailMatch) {
      console.log('\n💡 Email Issue:');
      console.log(`   Use exact email: "${adminEmail}"`);
    }
    
    if (!passwordValid) {
      console.log('\n💡 Password Issue:');
      if (adminPasswordHash) {
        console.log('   Regenerate hash: node scripts/generate-hash.js "<password>"');
      } else {
        console.log('   Check ADMIN_PASSWORD in .env.local');
      }
    }
  }

  console.log('\n');
}

testLogin().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
