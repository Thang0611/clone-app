/**
 * Meta Pixel Tracking Test with Test Event Code
 * 
 * Test script using Facebook Test Event Code: TEST59193
 * 
 * Usage:
 * 1. Open http://localhost:4000?test_event_code=TEST59193 in browser
 * 2. Open DevTools (F12) > Console
 * 3. Paste this script and press Enter
 * 4. Check Facebook Events Manager > Test Events
 */

(function() {
  'use strict';

  const TEST_EVENT_CODE = 'TEST59193';

  console.log('========================================');
  console.log('Meta Pixel Test with Event Code');
  console.log(`Test Event Code: ${TEST_EVENT_CODE}`);
  console.log('========================================\n');

  // Check if test event code is in URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlTestCode = urlParams.get('test_event_code');
  
  if (urlTestCode === TEST_EVENT_CODE) {
    console.log(`✅ Test event code found in URL: ${TEST_EVENT_CODE}`);
  } else {
    console.log(`⚠️  Test event code not in URL`);
    console.log(`   Current URL: ${window.location.href}`);
    console.log(`   Add ?test_event_code=${TEST_EVENT_CODE} to URL`);
    console.log(`   Example: http://localhost:4000?test_event_code=${TEST_EVENT_CODE}`);
  }

  console.log('');

  // Check dataLayer
  console.log('1. Checking dataLayer...');
  if (typeof window.dataLayer === 'undefined') {
    console.error('   ❌ window.dataLayer is not defined!');
    return;
  }
  console.log(`   ✅ dataLayer exists (${window.dataLayer.length} events)`);

  // Check Meta Pixel
  console.log('\n2. Checking Meta Pixel...');
  if (typeof window.fbq === 'undefined') {
    console.warn('   ⚠️  Meta Pixel (fbq) not loaded');
    console.log('   ℹ️  Meta Pixel will be loaded via GTM when configured');
  } else {
    console.log('   ✅ Meta Pixel (fbq) is loaded');
  }

  // Test tracking with test event code
  console.log('\n3. Testing events with test event code...');
  
  // Function to track event with test code
  function trackWithTestCode(eventName, eventData = {}) {
    const data = {
      ...eventData,
      test_event_code: TEST_EVENT_CODE
    };

    // Push to dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log(`   ✅ Pushed to dataLayer: ${eventName}`);
    }

    // If fbq is loaded, also track directly
    if (typeof window.fbq !== 'undefined') {
      try {
        window.fbq('track', eventName, data);
        console.log(`   ✅ Tracked via fbq: ${eventName}`);
      } catch (error) {
        console.error(`   ❌ Error tracking via fbq: ${error.message}`);
      }
    }
  }

  // Test PageView
  console.log('\n   Testing PageView...');
  trackWithTestCode('PageView', {
    content_name: 'Test Page',
    test: true
  });

  // Test ViewContent
  console.log('\n   Testing ViewContent...');
  trackWithTestCode('ViewContent', {
    content_type: 'test',
    content_name: 'Test Content',
    content_category: 'test'
  });

  // Test Lead
  console.log('\n   Testing Lead...');
  trackWithTestCode('Lead', {
    content_name: 'Test Form',
    content_category: 'test'
  });

  // Test InitiateCheckout
  console.log('\n   Testing InitiateCheckout...');
  trackWithTestCode('InitiateCheckout', {
    value: 1000,
    currency: 'VND',
    num_items: 1
  });

  // Test Purchase
  console.log('\n   Testing Purchase...');
  trackWithTestCode('Purchase', {
    value: 2000,
    currency: 'VND',
    contents: [{
      id: 'test_item_1',
      quantity: 1,
      item_price: 2000
    }],
    content_type: 'product',
    content_ids: ['test_item_1']
  });

  console.log('\n========================================');
  console.log('Test Summary');
  console.log('========================================\n');

  console.log(`Test Event Code: ${TEST_EVENT_CODE}`);
  console.log('\nEvents sent:');
  console.log('   ✅ PageView');
  console.log('   ✅ ViewContent');
  console.log('   ✅ Lead');
  console.log('   ✅ InitiateCheckout');
  console.log('   ✅ Purchase');

  console.log('\n========================================');
  console.log('Next Steps');
  console.log('========================================\n');

  console.log('1. Go to Facebook Events Manager:');
  console.log('   https://business.facebook.com/events_manager2/');
  console.log('');
  console.log('2. Select your Pixel');
  console.log('');
  console.log('3. Go to "Test Events" tab');
  console.log('');
  console.log('4. Enter test event code:');
  console.log(`   ${TEST_EVENT_CODE}`);
  console.log('');
  console.log('5. You should see the test events:');
  console.log('   - PageView');
  console.log('   - ViewContent');
  console.log('   - Lead');
  console.log('   - InitiateCheckout');
  console.log('   - Purchase');
  console.log('');
  console.log('6. Verify event data:');
  console.log('   - Check event parameters');
  console.log('   - Verify test_event_code is present');
  console.log('   - Check timestamps');
  console.log('');
  console.log('========================================\n');

  // Return test results
  return {
    testEventCode: TEST_EVENT_CODE,
    urlHasCode: urlTestCode === TEST_EVENT_CODE,
    dataLayerExists: typeof window.dataLayer !== 'undefined',
    metaPixelLoaded: typeof window.fbq !== 'undefined',
    eventsSent: ['PageView', 'ViewContent', 'Lead', 'InitiateCheckout', 'Purchase']
  };
})();
