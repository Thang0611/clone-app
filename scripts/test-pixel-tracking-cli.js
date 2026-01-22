#!/usr/bin/env node

/**
 * Meta Pixel Tracking CLI Test
 * 
 * Command-line test script to verify Meta Pixel tracking setup
 * 
 * Usage:
 *   node scripts/test-pixel-tracking-cli.js
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark(passed) {
  return passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
}

function warning() {
  return `${colors.yellow}⚠${colors.reset}`;
}

console.log('\n========================================');
log('Meta Pixel Tracking Test (CLI)', 'cyan');
console.log('========================================\n');

const results = {
  envFile: false,
  trackingEnabled: false,
  pixelId: false,
  gtmId: false,
  trackingFiles: [],
  errors: []
};

// Test 1: Check .env.local file
log('1. Checking environment configuration...', 'blue');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  results.envFile = true;
  log(`   ${checkmark(true)} .env.local file exists`);
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      envVars[key] = value;
    }
  });

  // Check NEXT_PUBLIC_META_PIXEL_ID
  if (envVars.NEXT_PUBLIC_META_PIXEL_ID) {
    const pixelId = envVars.NEXT_PUBLIC_META_PIXEL_ID;
    if (pixelId && pixelId !== '' && pixelId !== 'YOUR_PIXEL_ID_HERE') {
      results.pixelId = true;
      log(`   ${checkmark(true)} NEXT_PUBLIC_META_PIXEL_ID is set: ${pixelId}`);
    } else {
      log(`   ${checkmark(false)} NEXT_PUBLIC_META_PIXEL_ID is empty or placeholder`, 'yellow');
      results.errors.push('Meta Pixel ID not configured');
    }
  } else {
    log(`   ${checkmark(false)} NEXT_PUBLIC_META_PIXEL_ID not found`, 'yellow');
    results.errors.push('Meta Pixel ID not found in .env.local');
  }

  // Check NEXT_PUBLIC_GTM_ID
  if (envVars.NEXT_PUBLIC_GTM_ID) {
    const gtmId = envVars.NEXT_PUBLIC_GTM_ID;
    if (gtmId && gtmId !== '' && gtmId !== 'GTM-XXXXXXX') {
      results.gtmId = true;
      log(`   ${checkmark(true)} NEXT_PUBLIC_GTM_ID is set: ${gtmId}`);
    } else {
      log(`   ${warning()} NEXT_PUBLIC_GTM_ID is empty or placeholder`, 'yellow');
    }
  } else {
    log(`   ${warning()} NEXT_PUBLIC_GTM_ID not found`, 'yellow');
  }

  // Check NEXT_PUBLIC_ENABLE_TRACKING
  if (envVars.NEXT_PUBLIC_ENABLE_TRACKING === 'true') {
    results.trackingEnabled = true;
    log(`   ${checkmark(true)} Tracking enabled for development`);
  } else {
    log(`   ${warning()} Tracking may be disabled (NEXT_PUBLIC_ENABLE_TRACKING not set to true)`, 'yellow');
    log('      Set NEXT_PUBLIC_ENABLE_TRACKING=true in .env.local for testing', 'yellow');
  }
} else {
  results.envFile = false;
  log(`   ${checkmark(false)} .env.local file not found`, 'red');
  results.errors.push('.env.local file missing');
  log('      Create .env.local with NEXT_PUBLIC_META_PIXEL_ID', 'yellow');
}

console.log('');

// Test 2: Check tracking files
log('2. Checking tracking implementation files...', 'blue');
const trackingFiles = [
  { path: 'lib/tracking.ts', name: 'Tracking utilities' },
  { path: 'lib/tracking-config.ts', name: 'Tracking configuration' },
  { path: 'hooks/useTracking.ts', name: 'Tracking React hook' },
  { path: 'components/GoogleTagManager.tsx', name: 'GTM component' },
  { path: 'components/PageViewTracker.tsx', name: 'Page view tracker' },
  { path: 'components/UserPropertiesTracker.tsx', name: 'User properties tracker' }
];

trackingFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  if (fs.existsSync(filePath)) {
    results.trackingFiles.push(file.path);
    log(`   ${checkmark(true)} ${file.name} (${file.path})`);
  } else {
    log(`   ${checkmark(false)} ${file.name} not found (${file.path})`, 'red');
    results.errors.push(`Missing file: ${file.path}`);
  }
});

console.log('');

// Test 3: Check if tracking config uses Meta Pixel ID
log('3. Checking tracking configuration...', 'blue');
const configPath = path.join(process.cwd(), 'lib/tracking-config.ts');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('metaPixelId')) {
    log(`   ${checkmark(true)} Meta Pixel ID configuration found`);
  } else {
    log(`   ${checkmark(false)} Meta Pixel ID configuration not found`, 'red');
    results.errors.push('Meta Pixel ID not configured in tracking-config.ts');
  }

  if (configContent.includes('NEXT_PUBLIC_META_PIXEL_ID')) {
    log(`   ${checkmark(true)} Environment variable reference found`);
  } else {
    log(`   ${checkmark(false)} Environment variable reference not found`, 'red');
  }
} else {
  log(`   ${checkmark(false)} tracking-config.ts not found`, 'red');
}

console.log('');

// Test 4: Check documentation
log('4. Checking documentation...', 'blue');
const docs = [
  { path: 'docs/TRACKING_TEST_GUIDE.md', name: 'Testing guide' },
  { path: 'docs/TRACKING_PHASE4_GTM_CONFIG.md', name: 'GTM configuration guide' },
  { path: 'docs/TRACKING_GTM_TAGS_REFERENCE.md', name: 'GTM tags reference' }
];

docs.forEach(doc => {
  const docPath = path.join(process.cwd(), doc.path);
  if (fs.existsSync(docPath)) {
    log(`   ${checkmark(true)} ${doc.name}`);
  } else {
    log(`   ${warning()} ${doc.name} not found`, 'yellow');
  }
});

console.log('');

// Test 5: Check dev server
log('5. Checking development server...', 'blue');
const http = require('http');
const testUrl = 'http://localhost:4000';
const url = new URL(testUrl);

const req = http.request({
  hostname: url.hostname,
  port: url.port,
  path: url.pathname,
  method: 'HEAD',
  timeout: 2000
}, (res) => {
  log(`   ${checkmark(true)} Dev server is running on port 4000`);
  log(`      Visit: ${testUrl}`);
  console.log('');
  printSummary();
});

req.on('error', (err) => {
  log(`   ${warning()} Dev server not running on port 4000`, 'yellow');
  log(`      Start with: npm run dev`, 'yellow');
  console.log('');
  printSummary();
});

req.on('timeout', () => {
  req.destroy();
  log(`   ${warning()} Dev server not responding`, 'yellow');
  console.log('');
  printSummary();
});

req.end();

function printSummary() {
  console.log('========================================');
  log('Test Summary', 'cyan');
  console.log('========================================\n');

  const allPassed = results.envFile && results.pixelId && results.trackingFiles.length === trackingFiles.length;

  log('Configuration Status:', 'blue');
  console.log(`   Environment file: ${results.envFile ? checkmark(true) : checkmark(false)}`);
  console.log(`   Meta Pixel ID: ${results.pixelId ? checkmark(true) : checkmark(false)}`);
  console.log(`   GTM ID: ${results.gtmId ? checkmark(true) : warning()}`);
  console.log(`   Tracking enabled: ${results.trackingEnabled ? checkmark(true) : warning()}`);
  console.log(`   Tracking files: ${results.trackingFiles.length}/${trackingFiles.length}`);

  if (results.errors.length > 0) {
    console.log('\n');
    log('Issues Found:', 'red');
    results.errors.forEach(error => {
      log(`   ${checkmark(false)} ${error}`, 'red');
    });
  }

  console.log('\n');
  log('Next Steps:', 'blue');
  
  if (!results.envFile || !results.pixelId) {
    log('1. Configure environment variables:', 'yellow');
    log('   - Create .env.local if missing', 'yellow');
    log('   - Set NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id', 'yellow');
    log('   - Set NEXT_PUBLIC_ENABLE_TRACKING=true (for testing)', 'yellow');
  }

  if (results.trackingFiles.length < trackingFiles.length) {
    log('2. Missing tracking files detected', 'yellow');
    log('   - Check that all tracking files exist', 'yellow');
  }

  log('3. Start development server:', 'yellow');
  log('   npm run dev', 'yellow');
  log('   Then visit http://localhost:4000', 'yellow');

  log('4. Test in browser:', 'yellow');
  log('   - Open DevTools (F12) > Console', 'yellow');
  log('   - Paste scripts/test-pixel-tracking.js', 'yellow');
  log('   - Or use docs/TRACKING_GTM_VERIFICATION.js', 'yellow');

  log('5. Configure GTM (if using):', 'yellow');
  log('   - Follow docs/TRACKING_PHASE4_GTM_CONFIG.md', 'yellow');
  log('   - Add Meta Pixel tags in GTM', 'yellow');

  console.log('\n========================================\n');

  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}
