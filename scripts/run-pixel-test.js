#!/usr/bin/env node

/**
 * Run Pixel Tracking Test
 * 
 * This script helps test pixel tracking by:
 * 1. Checking server is running
 * 2. Providing test URLs
 * 3. Opening test page in browser (if possible)
 */

const http = require('http');
const { exec } = require('child_process');

const TEST_EVENT_CODE = 'TEST59193';
const PORT = 4000;
const BASE_URL = `http://localhost:${PORT}`;
const TEST_URL = `${BASE_URL}?test_event_code=${TEST_EVENT_CODE}`;
const TEST_PAGE_URL = `${BASE_URL}/test-pixel.html?test_event_code=${TEST_EVENT_CODE}`;

console.log('\n========================================');
console.log('🧪 Meta Pixel Tracking Test');
console.log('========================================\n');

// Check if server is running
function checkServer() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/',
      method: 'HEAD',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      reject(false);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(false);
    });

    req.end();
  });
}

// Main test function
async function runTest() {
  console.log('1. Checking server...');
  
  try {
    await checkServer();
    console.log(`   ✅ Server is running on port ${PORT}\n`);
  } catch (error) {
    console.log(`   ❌ Server is not running on port ${PORT}`);
    console.log(`   💡 Start server with: npm run dev\n`);
    process.exit(1);
  }

  console.log('2. Test URLs:');
  console.log(`   📄 Test Page: ${TEST_PAGE_URL}`);
  console.log(`   🏠 Homepage: ${TEST_URL}\n`);

  console.log('3. Test Event Code:');
  console.log(`   🔑 Code: ${TEST_EVENT_CODE}\n`);

  console.log('4. How to test:');
  console.log('   a) Open test page in browser:');
  console.log(`      ${TEST_PAGE_URL}\n`);
  console.log('   b) Or open homepage with test code:');
  console.log(`      ${TEST_URL}\n`);
  console.log('   c) Open DevTools (F12) > Console');
  console.log('   d) Run test script:');
  console.log('      - Copy scripts/test-pixel-with-code.js');
  console.log('      - Paste in console\n');
  console.log('   e) Check Facebook Events Manager:');
  console.log('      - Go to: https://business.facebook.com/events_manager2/');
  console.log('      - Select your Pixel');
  console.log('      - Go to "Test Events" tab');
  console.log(`      - Enter code: ${TEST_EVENT_CODE}\n`);

  console.log('5. Test Page Features:');
  console.log('   ✅ Interactive test buttons');
  console.log('   ✅ Real-time console output');
  console.log('   ✅ Automatic test event code');
  console.log('   ✅ All events testing\n');

  // Try to open browser (optional)
  const platform = process.platform;
  let openCommand = '';

  if (platform === 'darwin') {
    openCommand = `open "${TEST_PAGE_URL}"`;
  } else if (platform === 'win32') {
    openCommand = `start "${TEST_PAGE_URL}"`;
  } else {
    openCommand = `xdg-open "${TEST_PAGE_URL}"`;
  }

  console.log('6. Opening test page...');
  console.log(`   Command: ${openCommand}\n`);

  exec(openCommand, (error) => {
    if (error) {
      console.log('   ⚠️  Could not open browser automatically');
      console.log(`   💡 Please open manually: ${TEST_PAGE_URL}\n`);
    } else {
      console.log('   ✅ Browser opened!\n');
    }

    console.log('========================================');
    console.log('✅ Test setup complete!');
    console.log('========================================\n');
    console.log('Next steps:');
    console.log('1. Test page should be open in browser');
    console.log('2. Click test buttons to send events');
    console.log('3. Check console output on page');
    console.log('4. Verify events in Facebook Events Manager');
    console.log('========================================\n');
  });
}

// Run test
runTest().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
