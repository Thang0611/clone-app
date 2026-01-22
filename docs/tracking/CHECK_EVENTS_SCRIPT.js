// 🔍 Script kiểm tra email_hash trong dataLayer
// Copy và paste vào Console để debug

(function() {
  console.log('🔍 Checking email_hash in dataLayer...\n');
  
  const events = window.dataLayer || [];
  
  // 1. Kiểm tra tất cả events có email_hash
  const eventsWithEmail = events.filter(e => e.email_hash);
  console.log('✅ Events with email_hash:', eventsWithEmail.length);
  if (eventsWithEmail.length > 0) {
    console.table(eventsWithEmail.map(e => ({
      event: e.event,
      email_hash: e.email_hash?.substring(0, 16) + '...',
      timestamp: e.timestamp
    })));
  }
  
  // 2. Kiểm tra từng event type
  console.log('\n📊 Event Breakdown:');
  
  const formSubmit = events.filter(e => e.event === 'form_submit');
  const beginCheckout = events.filter(e => e.event === 'begin_checkout');
  const purchase = events.filter(e => e.event === 'purchase');
  
  console.log(`\n1️⃣  form_submit: ${formSubmit.length} event(s)`);
  if (formSubmit.length > 0) {
    const latest = formSubmit[formSubmit.length - 1];
    console.log('   Latest form_submit:', {
      has_email_hash: !!latest.email_hash,
      email_hash: latest.email_hash ? latest.email_hash.substring(0, 16) + '...' : 'MISSING',
      form_id: latest.form_id,
      timestamp: latest.timestamp
    });
  } else {
    console.warn('   ⚠️  No form_submit events found!');
  }
  
  console.log(`\n2️⃣  begin_checkout: ${beginCheckout.length} event(s)`);
  if (beginCheckout.length > 0) {
    const latest = beginCheckout[beginCheckout.length - 1];
    console.log('   Latest begin_checkout:', {
      has_email_hash: !!latest.email_hash,
      email_hash: latest.email_hash ? latest.email_hash.substring(0, 16) + '...' : 'MISSING',
      value: latest.value,
      transaction_id: latest.transaction_id,
      timestamp: latest.timestamp
    });
  } else {
    console.warn('   ⚠️  No begin_checkout events found!');
    console.info('   💡 To trigger: Go to order page (after submitting form)');
  }
  
  console.log(`\n3️⃣  purchase: ${purchase.length} event(s)`);
  if (purchase.length > 0) {
    const latest = purchase[purchase.length - 1];
    console.log('   Latest purchase:', {
      has_email_hash: !!latest.email_hash,
      email_hash: latest.email_hash ? latest.email_hash.substring(0, 16) + '...' : 'MISSING',
      transaction_id: latest.transaction_id,
      value: latest.value,
      timestamp: latest.timestamp
    });
  } else {
    console.warn('   ⚠️  No purchase events found!');
    console.info('   💡 To trigger: Complete payment on order page');
  }
  
  // 3. Tổng kết
  console.log('\n📋 Summary:');
  console.log(`   ✅ form_submit: ${formSubmit.some(e => e.email_hash) ? 'HAS email_hash' : 'MISSING email_hash'}`);
  console.log(`   ${beginCheckout.length > 0 ? (beginCheckout.some(e => e.email_hash) ? '✅' : '❌') : '⏳'} begin_checkout: ${beginCheckout.length > 0 ? (beginCheckout.some(e => e.email_hash) ? 'HAS email_hash' : 'MISSING email_hash') : 'NOT FIRED YET'}`);
  console.log(`   ${purchase.length > 0 ? (purchase.some(e => e.email_hash) ? '✅' : '❌') : '⏳'} purchase: ${purchase.length > 0 ? (purchase.some(e => e.email_hash) ? 'HAS email_hash' : 'MISSING email_hash') : 'NOT FIRED YET'}`);
  
  // 4. Hướng dẫn test tiếp
  console.log('\n🎯 Next Steps:');
  if (beginCheckout.length === 0) {
    console.log('   1. Submit form → Get order code');
    console.log('   2. Go to order page: /order/[orderCode]');
    console.log('   3. begin_checkout should fire automatically');
  }
  if (purchase.length === 0) {
    console.log('   4. Complete payment');
    console.log('   5. purchase should fire when payment confirmed');
  }
  if (beginCheckout.length > 0 && !beginCheckout.some(e => e.email_hash)) {
    console.warn('   ⚠️  begin_checkout fired but missing email_hash!');
    console.log('   💡 Check: orderData.email must have value when trackCheckout() is called');
  }
  if (purchase.length > 0 && !purchase.some(e => e.email_hash)) {
    console.warn('   ⚠️  purchase fired but missing email_hash!');
    console.log('   💡 Check: orderData.email must have value when trackPurchase() is called');
  }
  
})();
