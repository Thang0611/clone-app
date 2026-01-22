/**
 * Meta Pixel Tracking Test Script
 * 
 * This script tests Meta Pixel tracking functionality
 * Run in browser console after visiting the site
 * 
 * Usage:
 * 1. Open http://localhost:4000 in browser
 * 2. Open DevTools (F12) > Console
 * 3. Paste this entire script and press Enter
 * 4. Follow the interactive prompts
 */

(function() {
  'use strict';

  console.log('========================================');
  console.log('Meta Pixel Tracking Test');
  console.log('========================================\n');

  // Test results
  const results = {
    dataLayer: false,
    gtm: false,
    metaPixel: false,
    events: [],
    errors: []
  };

  // Check 1: dataLayer exists
  console.log('1. Checking dataLayer...');
  if (typeof window.dataLayer === 'undefined') {
    console.error('   ❌ window.dataLayer is not defined!');
    results.errors.push('dataLayer not initialized');
    return results;
  }
  console.log('   ✅ dataLayer exists');
  console.log(`   📊 Total events: ${window.dataLayer.length}`);
  results.dataLayer = true;

  // Check 2: GTM loaded
  console.log('\n2. Checking Google Tag Manager...');
  if (typeof window.google_tag_manager === 'undefined') {
    console.warn('   ⚠️  GTM not loaded (may be OK if using direct pixel)');
  } else {
    console.log('   ✅ GTM is loaded');
    const containers = Object.keys(window.google_tag_manager || {});
    console.log(`   📦 Containers: ${containers.length}`);
    containers.forEach(container => {
      console.log(`      - ${container}`);
    });
    results.gtm = true;
  }

  // Check 3: Meta Pixel (fbq) loaded
  console.log('\n3. Checking Meta Pixel (fbq)...');
  if (typeof window.fbq === 'undefined') {
    console.warn('   ⚠️  Meta Pixel (fbq) is not loaded');
    console.log('   ℹ️  This is OK if Meta Pixel is loaded via GTM');
    console.log('   ℹ️  Or if GTM tags are not yet configured');
  } else {
    console.log('   ✅ Meta Pixel (fbq) is loaded');
    results.metaPixel = true;

    // Check for pixel script in DOM
    const pixelScript = document.querySelector('script[src*="fbevents.js"]');
    if (pixelScript) {
      console.log('   ✅ Meta Pixel script found in DOM');
      const src = pixelScript.getAttribute('src');
      const pixelIdMatch = src.match(/id=(\d+)/);
      if (pixelIdMatch) {
        console.log(`   🆔 Pixel ID: ${pixelIdMatch[1]}`);
      }
    } else {
      console.log('   ℹ️  Meta Pixel script not in DOM (likely loaded via GTM)');
    }
  }

  // Check 4: Analyze dataLayer events
  console.log('\n4. Analyzing dataLayer events...');
  const events = window.dataLayer
    .filter(e => e.event)
    .map(e => e.event);

  const uniqueEvents = [...new Set(events)];
  console.log(`   📋 Found ${uniqueEvents.length} unique event types:`);
  uniqueEvents.forEach(event => {
    const count = events.filter(e => e === event).length;
    console.log(`      - ${event} (${count}x)`);
  });

  // Check for pixel-related events
  const pixelEvents = [
    'page_view',
    'view_content',
    'form_submit',
    'begin_checkout',
    'purchase'
  ];

  console.log('\n5. Checking for Meta Pixel events...');
  const foundPixelEvents = pixelEvents.filter(e => events.includes(e));
  const missingPixelEvents = pixelEvents.filter(e => !events.includes(e));

  foundPixelEvents.forEach(event => {
    console.log(`   ✅ ${event}`);
    results.events.push(event);
  });

  if (missingPixelEvents.length > 0) {
    console.log('\n   ⚠️  Missing events (these should fire during user actions):');
    missingPixelEvents.forEach(event => {
      console.log(`      - ${event}`);
    });
  }

  // Check 6: Latest events details
  console.log('\n6. Latest events details...');
  const latestEvents = window.dataLayer
    .filter(e => e.event)
    .slice(-5)
    .reverse();

  latestEvents.forEach((event, index) => {
    console.log(`\n   Event ${index + 1}: ${event.event}`);
    Object.keys(event).forEach(key => {
      if (key !== 'event' && key !== 'timestamp') {
        const value = event[key];
        let displayValue;
        if (typeof value === 'object') {
          displayValue = JSON.stringify(value).substring(0, 100);
          if (JSON.stringify(value).length > 100) displayValue += '...';
        } else {
          displayValue = String(value).substring(0, 100);
        }
        console.log(`      ${key}: ${displayValue}`);
      }
    });
  });

  // Check 7: Test Meta Pixel directly (if loaded)
  if (typeof window.fbq !== 'undefined') {
    console.log('\n7. Testing Meta Pixel directly...');
    try {
      // Try to get pixel ID from fbq
      const pixelId = window.fbq.callMethod ? 
        (window.fbq.queue && window.fbq.queue[0] ? 
          window.fbq.queue[0][1] : 'unknown') : 'unknown';
      
      console.log('   ✅ Meta Pixel is callable');
      console.log('   🧪 Testing fbq("track", "TestEvent")...');
      
      // Test event
      window.fbq('track', 'TestEvent', {
        test: true,
        timestamp: new Date().toISOString()
      });
      
      console.log('   ✅ Test event sent successfully');
      console.log('   ℹ️  Check Facebook Events Manager > Test Events to verify');
    } catch (error) {
      console.error('   ❌ Error testing Meta Pixel:', error);
      results.errors.push(`Meta Pixel test error: ${error.message}`);
    }
  } else {
    console.log('\n7. Skipping direct Meta Pixel test (fbq not loaded)');
    console.log('   ℹ️  Meta Pixel will be loaded via GTM when tags are configured');
  }

  // Check 8: Network requests
  console.log('\n8. Checking network requests...');
  console.log('   ℹ️  Open Network tab and filter for:');
  console.log('      - "fbevents.js" (Meta Pixel script)');
  console.log('      - "facebook.com/tr" (Meta Pixel tracking requests)');
  console.log('      - "gtm.js" (Google Tag Manager)');

  // Summary
  console.log('\n========================================');
  console.log('Test Summary');
  console.log('========================================\n');

  console.log('Status:');
  console.log(`   dataLayer: ${results.dataLayer ? '✅' : '❌'}`);
  console.log(`   GTM: ${results.gtm ? '✅' : '⚠️'}`);
  console.log(`   Meta Pixel: ${results.metaPixel ? '✅' : '⚠️'}`);
  console.log(`   Events found: ${results.events.length}/${pixelEvents.length}`);

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(error => {
      console.log(`   ❌ ${error}`);
    });
  }

  // Recommendations
  console.log('\n========================================');
  console.log('Recommendations');
  console.log('========================================\n');

  if (!results.dataLayer) {
    console.log('❌ Fix: dataLayer not initialized');
    console.log('   - Check if tracking is enabled in .env.local');
    console.log('   - Verify NEXT_PUBLIC_ENABLE_TRACKING=true');
    console.log('   - Restart dev server');
  }

  if (!results.metaPixel && !results.gtm) {
    console.log('⚠️  Meta Pixel not loaded');
    console.log('   - If using GTM: Configure Meta Pixel tags in GTM');
    console.log('   - If direct: Add Meta Pixel script to page');
    console.log('   - Verify NEXT_PUBLIC_META_PIXEL_ID is set');
  }

  if (results.events.length < pixelEvents.length) {
    console.log('⚠️  Some events are missing');
    console.log('   - Trigger events by using the site:');
    console.log('     • page_view: Navigate between pages');
    console.log('     • view_content: Wait 3+ seconds on homepage');
    console.log('     • form_start: Focus email input');
    console.log('     • form_submit: Submit form');
    console.log('     • begin_checkout: Open checkout modal');
    console.log('     • purchase: Complete payment');
  }

  console.log('\n========================================');
  console.log('Next Steps');
  console.log('========================================\n');
  console.log('1. If Meta Pixel not loaded:');
  console.log('   - Configure GTM tags (see docs/TRACKING_PHASE4_GTM_CONFIG.md)');
  console.log('   - Or add Meta Pixel directly to page');
  console.log('');
  console.log('2. Verify events in:');
  console.log('   - GTM Preview mode');
  console.log('   - Facebook Events Manager > Test Events');
  console.log('   - Browser Network tab (filter: facebook.com/tr)');
  console.log('');
  console.log('3. Install browser extensions:');
  console.log('   - Facebook Pixel Helper (Chrome)');
  console.log('   - Google Tag Assistant Legacy (Chrome)');
  console.log('========================================\n');

  // Return results for programmatic access
  return {
    ...results,
    uniqueEvents,
    totalEvents: window.dataLayer.length,
    pixelEventsFound: foundPixelEvents,
    pixelEventsMissing: missingPixelEvents
  };
})();
