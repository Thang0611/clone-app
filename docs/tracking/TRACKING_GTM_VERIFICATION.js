/**
 * GTM Configuration Verification Script
 * 
 * Paste this into browser console after GTM is configured
 * Helps verify that GTM tags are firing correctly
 */

(function() {
  console.log('========================================');
  console.log('GTM Configuration Verification');
  console.log('========================================\n');

  // Check if GTM is loaded
  if (typeof window.google_tag_manager === 'undefined') {
    console.error('❌ GTM is not loaded!');
    console.log('Please check:');
    console.log('  1. GTM container ID is correct');
    console.log('  2. GTM container is published');
    console.log('  3. GTM script is loading (check Network tab)');
    return;
  }

  console.log('✅ GTM is loaded');
  console.log('');

  // Check if Meta Pixel is loaded
  if (typeof window.fbq === 'undefined') {
    console.warn('⚠️  Meta Pixel (fbq) is not loaded');
    console.log('This is OK if Meta Pixel is loaded via GTM');
  } else {
    console.log('✅ Meta Pixel (fbq) is loaded');
  }
  console.log('');

  // Check dataLayer
  if (typeof window.dataLayer === 'undefined') {
    console.error('❌ dataLayer is not defined!');
    return;
  }

  console.log('✅ dataLayer exists');
  console.log(`📊 Total events: ${window.dataLayer.length}\n`);

  // Check for required events
  const events = window.dataLayer
    .map(e => e.event)
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);

  const requiredEvents = [
    'page_view',
    'view_content',
    'form_start',
    'form_submit',
    'begin_checkout',
    'purchase'
  ];

  console.log('========================================');
  console.log('Event Verification');
  console.log('========================================\n');

  requiredEvents.forEach(event => {
    const found = events.includes(event);
    const icon = found ? '✅' : '❌';
    console.log(`${icon} ${event.padEnd(20)} ${found ? 'Found' : 'Missing'}`);
  });

  console.log('');

  // Check dataLayer variables
  console.log('========================================');
  console.log('DataLayer Variables Check');
  console.log('========================================\n');

  const latestEvent = window.dataLayer[window.dataLayer.length - 1];
  if (latestEvent && latestEvent.event) {
    console.log(`Latest event: ${latestEvent.event}`);
    console.log('Available variables:');
    
    Object.keys(latestEvent).forEach(key => {
      if (key !== 'event' && key !== 'timestamp') {
        const value = latestEvent[key];
        const displayValue = typeof value === 'object' 
          ? JSON.stringify(value).substring(0, 50) + '...'
          : String(value).substring(0, 50);
        console.log(`  - ${key}: ${displayValue}`);
      }
    });
  }

  console.log('');

  // GTM-specific checks
  console.log('========================================');
  console.log('GTM Container Info');
  console.log('========================================\n');

  const gtmContainers = Object.keys(window.google_tag_manager || {});
  if (gtmContainers.length > 0) {
    console.log(`✅ GTM Containers loaded: ${gtmContainers.length}`);
    gtmContainers.forEach(container => {
      console.log(`   - ${container}`);
    });
  } else {
    console.warn('⚠️  No GTM containers found');
  }

  console.log('');

  // Meta Pixel check
  if (typeof window.fbq !== 'undefined') {
    console.log('========================================');
    console.log('Meta Pixel Info');
    console.log('========================================\n');
    
    // Try to get pixel ID from GTM
    const pixelScript = document.querySelector('script[src*="fbevents.js"]');
    if (pixelScript) {
      console.log('✅ Meta Pixel script found');
    } else {
      console.warn('⚠️  Meta Pixel script not found in DOM');
      console.log('   (May be loaded via GTM)');
    }
  }

  console.log('');

  // Recommendations
  console.log('========================================');
  console.log('Recommendations');
  console.log('========================================\n');

  const missingEvents = requiredEvents.filter(e => !events.includes(e));
  
  if (missingEvents.length === 0) {
    console.log('🎉 All required events are present!');
    console.log('✅ GTM configuration appears correct');
  } else {
    console.log('⚠️  Missing events:', missingEvents.join(', '));
    console.log('');
    console.log('To trigger missing events:');
    console.log('  - page_view: Navigate between pages');
    console.log('  - view_content: Wait 3+ seconds on homepage');
    console.log('  - form_start: Focus email input');
    console.log('  - form_submit: Submit form');
    console.log('  - begin_checkout: Open checkout modal');
    console.log('  - purchase: Complete payment');
  }

  console.log('\n========================================');
  console.log('Next Steps:');
  console.log('========================================');
  console.log('1. Open GTM Preview mode');
  console.log('2. Verify tags fire on events');
  console.log('3. Check Facebook Events Manager');
  console.log('4. Check GA4 DebugView');
  console.log('========================================\n');

  // Return summary
  return {
    gtmLoaded: typeof window.google_tag_manager !== 'undefined',
    dataLayerExists: typeof window.dataLayer !== 'undefined',
    events: events,
    requiredEvents: requiredEvents,
    missingEvents: missingEvents,
    allPresent: missingEvents.length === 0
  };
})();
