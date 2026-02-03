/**
 * Tracking Console Test Script
 * 
 * Paste this into browser console to test tracking
 * Run after visiting the site and performing actions
 */

(function() {
  console.log('========================================');
  console.log('Tracking System Test');
  console.log('========================================\n');

  // Check dataLayer exists
  if (typeof window.dataLayer === 'undefined') {
    console.error('❌ window.dataLayer is not defined!');
    console.log('Tracking may not be initialized.');
    return;
  }

  console.log('✅ window.dataLayer exists');
  console.log(`📊 Total events: ${window.dataLayer.length}\n`);

  // Get all events
  const events = window.dataLayer
    .map(e => e.event)
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i); // Unique

  console.log('📋 Events found:', events);
  console.log('');

  // Required events checklist
  const requiredEvents = {
    'page_view': 'Page view tracking',
    'set_user_properties': 'User properties tracking',
    'view_content': 'View content tracking',
    'form_start': 'Form start tracking',
    'form_submit': 'Form submit tracking',
    'form_submit_success': 'Form submit success tracking',
    'form_submit_error': 'Form submit error tracking',
    'begin_checkout': 'Checkout tracking',
    'purchase': 'Purchase tracking'
  };

  console.log('========================================');
  console.log('Event Checklist');
  console.log('========================================\n');

  Object.entries(requiredEvents).forEach(([event, description]) => {
    const found = events.includes(event);
    const icon = found ? '✅' : '❌';
    console.log(`${icon} ${event.padEnd(25)} - ${description}`);
  });

  console.log('');

  // Check latest events
  console.log('========================================');
  console.log('Latest 5 Events');
  console.log('========================================\n');

  const latestEvents = window.dataLayer
    .filter(e => e.event)
    .slice(-5)
    .reverse();

  latestEvents.forEach((event, index) => {
    console.log(`${index + 1}. ${event.event}`);
    if (event.page_path) console.log(`   Path: ${event.page_path}`);
    if (event.form_id) console.log(`   Form: ${event.form_id}`);
    if (event.value) console.log(`   Value: ${event.value} ${event.currency || ''}`);
    if (event.items) console.log(`   Items: ${event.items.length}`);
    console.log('');
  });

  // Check user properties
  const userProps = window.dataLayer.find(e => e.event === 'set_user_properties');
  if (userProps && userProps.user_properties) {
    console.log('========================================');
    console.log('User Properties');
    console.log('========================================\n');
    console.log(JSON.stringify(userProps.user_properties, null, 2));
    console.log('');
  }

  // Check for errors
  const errors = window.dataLayer.filter(e => e.event && e.event.includes('error'));
  if (errors.length > 0) {
    console.log('========================================');
    console.log('⚠️  Error Events Found');
    console.log('========================================\n');
    errors.forEach(error => {
      console.log(`❌ ${error.event}`);
      if (error.error_message) console.log(`   Message: ${error.error_message}`);
    });
    console.log('');
  }

  // Summary
  console.log('========================================');
  console.log('Summary');
  console.log('========================================\n');

  const foundCount = Object.keys(requiredEvents).filter(e => events.includes(e)).length;
  const totalCount = Object.keys(requiredEvents).length;
  const percentage = Math.round((foundCount / totalCount) * 100);

  console.log(`Events Found: ${foundCount}/${totalCount} (${percentage}%)`);
  console.log('');

  if (foundCount === totalCount) {
    console.log('🎉 All required events are present!');
    console.log('✅ Tracking system is working correctly.');
  } else {
    console.log('⚠️  Some events are missing.');
    console.log('Please perform the following actions:');
    console.log('  1. Navigate between pages (page_view)');
    console.log('  2. Wait 3+ seconds on homepage (view_content)');
    console.log('  3. Focus email input (form_start)');
    console.log('  4. Submit form (form_submit, form_submit_success)');
    console.log('  5. Open checkout modal (begin_checkout)');
    console.log('  6. Complete payment (purchase)');
  }

  console.log('\n========================================');
  console.log('For detailed testing, see:');
  console.log('docs/TRACKING_TEST_GUIDE.md');
  console.log('========================================');

  // Return data for further inspection
  return {
    dataLayer: window.dataLayer,
    events: events,
    latestEvents: latestEvents,
    userProperties: userProps?.user_properties,
    summary: {
      total: window.dataLayer.length,
      unique: events.length,
      found: foundCount,
      required: totalCount,
      percentage: percentage
    }
  };
})();
