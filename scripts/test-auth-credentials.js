/**
 * Test script to verify admin credentials and authentication
 * Usage: node scripts/test-auth-credentials.js [email] [password]
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
function loadEnvFile() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFileName = nodeEnv === 'production' ? '.env.production' : '.env';
  const envPath = path.join(process.cwd(), envFileName);
  
  console.log(`\n📁 Loading environment from: ${envPath}`);
  console.log(`   NODE_ENV: ${nodeEnv}`);
  console.log(`   File exists: ${fs.existsSync(envPath)}\n`);
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    let loadedCount = 0;
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          if (!process.env[key]) {
            process.env[key] = value;
            loadedCount++;
          }
        }
      }
    });
    console.log(`✅ Loaded ${loadedCount} environment variables\n`);
    return true;
  } else {
    console.log(`❌ ${envFileName} not found\n`);
    return false;
  }
}

// Test credentials validation
async function testCredentials(email, password) {
  console.log('='.repeat(60));
  console.log('🧪 TESTING ADMIN CREDENTIALS');
  console.log('='.repeat(60));
  
  // Load env
  loadEnvFile();
  
  // Get environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPasswordPlain = process.env.ADMIN_PASSWORD;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  
  console.log('\n📋 Environment Variables:');
  console.log('   ADMIN_EMAIL:', adminEmail ? `✅ Set (${adminEmail})` : '❌ NOT SET');
  console.log('   ADMIN_PASSWORD_HASH:', adminPasswordHash ? `✅ Set (${adminPasswordHash.length} chars)` : '❌ NOT SET');
  console.log('   ADMIN_PASSWORD (plain):', adminPasswordPlain ? `✅ Set (${adminPasswordPlain.length} chars)` : '❌ NOT SET');
  console.log('   NEXTAUTH_SECRET:', nextAuthSecret ? `✅ Set (${nextAuthSecret.length} chars)` : '❌ NOT SET');
  console.log('   NEXTAUTH_URL:', nextAuthUrl ? `✅ Set (${nextAuthUrl})` : '❌ NOT SET');
  
  // Check if required vars are set
  if (!adminEmail) {
    console.log('\n❌ ERROR: ADMIN_EMAIL is not set!');
    return false;
  }
  
  if (!adminPasswordHash && !adminPasswordPlain) {
    console.log('\n❌ ERROR: Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD is set!');
    return false;
  }
  
  if (!nextAuthSecret) {
    console.log('\n❌ ERROR: NEXTAUTH_SECRET is not set!');
    return false;
  }
  
  if (nextAuthSecret.length < 32) {
    console.log('\n⚠️  WARNING: NEXTAUTH_SECRET should be at least 32 characters for security');
  }
  
  // Test email
  console.log('\n📧 Testing Email:');
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedAdminEmail = adminEmail.trim().toLowerCase();
  console.log(`   Entered: "${email}"`);
  console.log(`   Expected: "${adminEmail}"`);
  console.log(`   Normalized entered: "${normalizedEmail}"`);
  console.log(`   Normalized expected: "${normalizedAdminEmail}"`);
  
  if (normalizedEmail !== normalizedAdminEmail) {
    console.log('   ❌ Email mismatch!');
    return false;
  }
  console.log('   ✅ Email matches!');
  
  // Test password
  console.log('\n🔐 Testing Password:');
  let passwordValid = false;
  
  if (adminPasswordHash) {
    console.log('   Using bcrypt comparison...');
    try {
      passwordValid = await bcrypt.compare(password, adminPasswordHash);
      console.log(`   Result: ${passwordValid ? '✅ Valid' : '❌ Invalid'}`);
      
      if (!passwordValid) {
        console.log(`   Hash length: ${adminPasswordHash.length}`);
        console.log(`   Password length: ${password.length}`);
        console.log(`   Hash prefix: ${adminPasswordHash.substring(0, 30)}...`);
        console.log('\n   💡 Tip: Make sure the password you entered matches the one used to generate the hash');
        return false;
      }
    } catch (error) {
      console.log(`   ❌ Error comparing password: ${error.message}`);
      return false;
    }
  } else if (adminPasswordPlain) {
    console.log('   Using plain text comparison...');
    passwordValid = password === adminPasswordPlain;
    console.log(`   Result: ${passwordValid ? '✅ Valid' : '❌ Invalid'}`);
    
    if (!passwordValid) {
      console.log(`   Entered: "${password}"`);
      console.log(`   Expected: "${adminPasswordPlain}"`);
      return false;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL TESTS PASSED! Credentials are valid.');
  console.log('='.repeat(60));
  return true;
}

// Generate password hash helper
function generatePasswordHash(password) {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  console.log('\n🔑 Generated Password Hash:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('\n💡 Add this to your .env file');
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/test-auth-credentials.js [email] [password]');
    console.log('   or: node scripts/test-auth-credentials.js --generate-hash [password]');
    console.log('\nExamples:');
    console.log('   node scripts/test-auth-credentials.js admin@example.com mypassword');
    console.log('   node scripts/test-auth-credentials.js --generate-hash mypassword');
    process.exit(1);
  }
  
  if (args[0] === '--generate-hash') {
    if (args.length < 2) {
      console.log('❌ Error: Please provide a password to hash');
      process.exit(1);
    }
    generatePasswordHash(args[1]);
    process.exit(0);
  }
  
  if (args.length < 2) {
    console.log('❌ Error: Please provide both email and password');
    process.exit(1);
  }
  
  const email = args[0];
  const password = args[1];
  
  const result = await testCredentials(email, password);
  process.exit(result ? 0 : 1);
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
