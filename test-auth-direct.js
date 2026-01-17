#!/usr/bin/env node

/**
 * Direct Authentication Test
 * Tests NextAuth directly without going through HTTP
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env.local') });

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function testDirect() {
  console.log('\n🔍 Direct Authentication Test\n');
  console.log('='.repeat(60));

  // Load env manually
  const envPath = path.join(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        env[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  });

  const adminEmail = env.ADMIN_EMAIL;
  const adminPasswordHash = env.ADMIN_PASSWORD_HASH;
  const adminPasswordPlain = env.ADMIN_PASSWORD;

  console.log('\n📋 Environment:');
  console.log('-'.repeat(60));
  console.log(`ADMIN_EMAIL: ${adminEmail ? '✅ ' + adminEmail : '❌ Not set'}`);
  console.log(`ADMIN_PASSWORD_HASH: ${adminPasswordHash ? '✅ Set (' + adminPasswordHash.length + ' chars)' : '❌ Not set'}`);
  console.log(`ADMIN_PASSWORD: ${adminPasswordPlain ? '⚠️  Set (' + adminPasswordPlain.length + ' chars)' : '✅ Not set'}`);

  // Get test credentials
  const testEmail = process.argv[2] || adminEmail || 'test@example.com';
  const testPassword = process.argv[3] || 'test123';

  console.log('\n🧪 Testing with:');
  console.log('-'.repeat(60));
  console.log(`Email: "${testEmail}"`);
  console.log(`Password: "${testPassword}" (${testPassword.length} chars)`);

  // Test email
  console.log('\n📧 Email Check:');
  console.log('-'.repeat(60));
  const normalizedEmail = testEmail.trim().toLowerCase();
  const normalizedAdminEmail = adminEmail?.trim().toLowerCase() || '';
  
  const emailMatch = normalizedEmail === normalizedAdminEmail;
  console.log(`Email match: ${emailMatch ? '✅ YES' : '❌ NO'}`);
  if (!emailMatch) {
    console.log(`  Entered: "${testEmail}" → "${normalizedEmail}"`);
    console.log(`  Expected: "${adminEmail}" → "${normalizedAdminEmail}"`);
  }

  // Test password
  console.log('\n🔐 Password Check:');
  console.log('-'.repeat(60));
  
  let passwordValid = false;
  let method = '';

  if (adminPasswordHash) {
    try {
      passwordValid = await bcrypt.compare(testPassword, adminPasswordHash);
      method = 'bcrypt.compare()';
      console.log(`Method: ${method}`);
      console.log(`Result: ${passwordValid ? '✅ MATCH' : '❌ NO MATCH'}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
  } else if (adminPasswordPlain) {
    passwordValid = testPassword === adminPasswordPlain;
    method = 'plain text ===';
    console.log(`Method: ${method}`);
    console.log(`Result: ${passwordValid ? '✅ MATCH' : '❌ NO MATCH'}`);
    if (!passwordValid) {
      console.log(`  Entered: "${testPassword}" (${testPassword.length})`);
      console.log(`  Expected: "${adminPasswordPlain}" (${adminPasswordPlain.length})`);
    }
  } else {
    console.error('❌ No password configured!');
    return;
  }

  // Final result
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULT:');
  console.log('='.repeat(60));
  
  if (emailMatch && passwordValid) {
    console.log('✅ SUCCESS: Both email and password are CORRECT!');
    console.log(`   ✅ Email: Match`);
    console.log(`   ✅ Password: Match (${method})`);
    console.log('\n💡 If login still fails, it might be:');
    console.log('   1. Server not running or not restarted');
    console.log('   2. NextAuth configuration issue');
    console.log('   3. Browser cache issue');
    console.log('   4. Network/CORS issue');
  } else {
    console.log('❌ FAILED: Credentials are INCORRECT!');
    console.log(`   Email: ${emailMatch ? '✅ Match' : '❌ No match'}`);
    console.log(`   Password: ${passwordValid ? '✅ Match' : '❌ No match'}`);
    
    if (!emailMatch) {
      console.log('\n💡 Email Issue:');
      console.log(`   Use exact email: "${adminEmail}"`);
    }
    
    if (!passwordValid && adminPasswordHash) {
      console.log('\n💡 Password Issue:');
      console.log(`   Regenerate hash: node scripts/generate-hash.js "${testPassword}"`);
    }
  }

  console.log('\n');
}

testDirect().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
