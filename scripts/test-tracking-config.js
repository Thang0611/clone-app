#!/usr/bin/env node
/**
 * Test script to verify GA4, GTM, and Meta Pixel configuration
 * Checks environment variables and component usage
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark(pass) {
  return pass ? '✓' : '✗';
}

// Load environment variables
function loadEnv(filePath) {
  const env = {};
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          env[key] = value;
        }
      }
    });
  }
  return env;
}

// Check tracking config file
function checkTrackingConfig() {
  const configPath = path.join(__dirname, '../lib/tracking-config.ts');
  if (!fs.existsSync(configPath)) {
    log(`   ${checkmark(false)} tracking-config.ts not found`, 'red');
    return null;
  }

  const content = fs.readFileSync(configPath, 'utf8');
  return {
    hasGTM: content.includes('NEXT_PUBLIC_GTM_ID'),
    hasGA4: content.includes('NEXT_PUBLIC_GA4_ID'),
    hasPixel: content.includes('NEXT_PUBLIC_META_PIXEL_ID'),
    content
  };
}

// Check components
function checkComponents() {
  const components = {
    gtm: fs.existsSync(path.join(__dirname, '../components/GoogleTagManager.tsx')),
    ga4: fs.existsSync(path.join(__dirname, '../components/GoogleAnalytics.tsx')),
    pixel: fs.existsSync(path.join(__dirname, '../components/MetaPixel.tsx')),
  };
  return components;
}

// Validate ID formats
function validateGTMId(id) {
  return /^GTM-[A-Z0-9]+$/.test(id);
}

function validateGA4Id(id) {
  return /^G-[A-Z0-9]+$/.test(id);
}

function validatePixelId(id) {
  return /^\d{15,16}$/.test(id);
}

// Main test function
function main() {
  log('\n🔍 Testing GA4, GTM, and Meta Pixel Configuration\n', 'cyan');

  // Load environment files
  const envProduction = loadEnv(path.join(__dirname, '../.env.production'));
  const envLocal = loadEnv(path.join(__dirname, '../.env.local'));

  // Check tracking config
  log('📋 Checking tracking-config.ts...', 'blue');
  const config = checkTrackingConfig();
  if (config) {
    log(`   ${checkmark(config.hasGTM)} GTM ID reference found`, config.hasGTM ? 'green' : 'yellow');
    log(`   ${checkmark(config.hasGA4)} GA4 ID reference found`, config.hasGA4 ? 'green' : 'yellow');
    log(`   ${checkmark(config.hasPixel)} Pixel ID reference found`, config.hasPixel ? 'green' : 'yellow');
  }

  // Check components
  log('\n📦 Checking components...', 'blue');
  const components = checkComponents();
  log(`   ${checkmark(components.gtm)} GoogleTagManager.tsx`, components.gtm ? 'green' : 'red');
  log(`   ${checkmark(components.ga4)} GoogleAnalytics.tsx`, components.ga4 ? 'green' : 'red');
  log(`   ${checkmark(components.pixel)} MetaPixel.tsx`, components.pixel ? 'green' : 'red');

  // Check environment variables
  log('\n🔐 Checking Environment Variables...', 'blue');
  
  // GTM ID
  const gtmId = envProduction.NEXT_PUBLIC_GTM_ID || envLocal.NEXT_PUBLIC_GTM_ID;
  if (gtmId) {
    const isValid = validateGTMId(gtmId);
    log(`   ${checkmark(isValid)} NEXT_PUBLIC_GTM_ID: ${gtmId}`, isValid ? 'green' : 'red');
    if (!isValid) {
      log(`      ⚠️  Format should be: GTM-XXXXXXX`, 'yellow');
    }
  } else {
    log(`   ${checkmark(false)} NEXT_PUBLIC_GTM_ID not found`, 'red');
    log(`      Check .env.production or .env.local`, 'yellow');
  }

  // GA4 ID
  const ga4Id = envProduction.NEXT_PUBLIC_GA4_ID || envLocal.NEXT_PUBLIC_GA4_ID;
  if (ga4Id) {
    const isValid = validateGA4Id(ga4Id);
    log(`   ${checkmark(isValid)} NEXT_PUBLIC_GA4_ID: ${ga4Id}`, isValid ? 'green' : 'red');
    if (!isValid) {
      log(`      ⚠️  Format should be: G-XXXXXXXXXX`, 'yellow');
    }
  } else {
    log(`   ${checkmark(false)} NEXT_PUBLIC_GA4_ID not found`, 'red');
    log(`      Check .env.production or .env.local`, 'yellow');
  }

  // Pixel ID
  const pixelId = envProduction.NEXT_PUBLIC_META_PIXEL_ID || envLocal.NEXT_PUBLIC_META_PIXEL_ID;
  if (pixelId) {
    const isValid = validatePixelId(pixelId);
    log(`   ${checkmark(isValid)} NEXT_PUBLIC_META_PIXEL_ID: ${pixelId}`, isValid ? 'green' : 'red');
    if (!isValid) {
      log(`      ⚠️  Format should be: 15-16 digits`, 'yellow');
    }
  } else {
    log(`   ${checkmark(false)} NEXT_PUBLIC_META_PIXEL_ID not found`, 'red');
    log(`      Check .env.production or .env.local`, 'yellow');
  }

  // Summary
  log('\n📊 Summary:', 'cyan');
  const allValid = gtmId && validateGTMId(gtmId) && 
                   ga4Id && validateGA4Id(ga4Id) && 
                   pixelId && validatePixelId(pixelId);
  
  if (allValid) {
    log('   ✅ All tracking IDs are configured correctly!', 'green');
    log('\n💡 Next steps:', 'blue');
    log('   1. Restart your dev server or rebuild for production', 'yellow');
    log('   2. Check browser console for tracking initialization', 'yellow');
    log('   3. Use Facebook Events Manager Test Events to verify Pixel', 'yellow');
    log('   4. Check GA4 Real-time reports to verify GA4', 'yellow');
    log('   5. Check GTM Preview mode to verify GTM', 'yellow');
  } else {
    log('   ⚠️  Some tracking IDs need attention', 'yellow');
    log('\n💡 Fix issues:', 'blue');
    if (!gtmId || !validateGTMId(gtmId)) {
      log('   - Set NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX in .env.production', 'yellow');
    }
    if (!ga4Id || !validateGA4Id(ga4Id)) {
      log('   - Set NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX in .env.production', 'yellow');
    }
    if (!pixelId || !validatePixelId(pixelId)) {
      log('   - Set NEXT_PUBLIC_META_PIXEL_ID=1234567890123456 in .env.production', 'yellow');
    }
  }

  log('\n');
}

main();
