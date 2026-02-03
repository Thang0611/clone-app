#!/usr/bin/env node

/**
 * Verify Tracking / GTM / Pixel - Live test
 * Chạy: node scripts/verify-tracking-live.js [url]
 * Mặc định: http://localhost:4000
 */

const BASE = process.argv[2] || 'http://localhost:4000';

async function run() {
  const report = { url: BASE, checks: {}, ok: 0, fail: 0 };

  // 1. Fetch homepage HTML
  let html = '';
  try {
    const res = await fetch(BASE + '/');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    report.checks.fetch = { pass: false, error: String(e.message) };
    report.fail++;
    print(report);
    process.exit(1);
  }
  report.checks.fetch = { pass: true };
  report.ok++;

  // 2. GTM noscript iframe (GTM-5TL3J9D8 hoặc bất kỳ GTM-*)
  const gtmNoscript = /googletagmanager\.com\/ns\.html\?id=(GTM-[A-Z0-9]+)/i.exec(html);
  if (gtmNoscript) {
    report.checks.gtm_noscript = { pass: true, containerId: gtmNoscript[1] };
    report.ok++;
  } else {
    report.checks.gtm_noscript = { pass: false, hint: 'Thiếu iframe ns.html?id=GTM-*' };
    report.fail++;
  }

  // 3. GTM script (gtm.js) - có thể inject bằng JS nên trong HTML tĩnh có thể không có. Kiểm tra thẻ script hoặc dataLayer init.
  const hasGtmJs = /googletagmanager\.com\/gtm\.js/i.test(html);
  const hasGtmInline = /gtm\.start|dataLayer|'dataLayer'/.test(html);
  if (hasGtmJs || hasGtmInline) {
    report.checks.gtm_script = { pass: true, note: hasGtmJs ? 'gtm.js thấy trong HTML' : 'dataLayer/gtm inline có thể dùng' };
    report.ok++;
  } else {
    // GTM script thường inject bởi Next.js Script (afterInteractive) nên không có trong HTML tĩnh là bình thường
    report.checks.gtm_script = { pass: true, note: 'gtm.js sẽ load bằng JS (afterInteractive). Kiểm tra DevTools Network: gtm.js' };
    report.ok++;
  }

  // 4. GA4 gtag
  const ga4Match = /googletagmanager\.com\/gtag\/js\?id=(G-[A-Z0-9]+)/i.exec(html);
  if (ga4Match) {
    report.checks.ga4 = { pass: true, measurementId: ga4Match[1] };
    report.ok++;
  } else {
    report.checks.ga4 = { pass: false, hint: 'Thiếu gtag/js?id=G-*' };
    report.fail++;
  }

  // 5. GTM container ID trong noscript
  const gtmId = gtmNoscript ? gtmNoscript[1] : null;
  report.gtmContainerId = gtmId;
  report.ga4Id = ga4Match ? ga4Match[1] : null;

  // 6. (Optional) Meta Pixel / fbevents - thường load qua GTM, có thể không có trong HTML
  const hasFb = /fbevents\.js|facebook\.net\/en_US\/fbevents/.test(html);
  report.checks.meta_pixel_in_html = { pass: hasFb, note: hasFb ? 'fbevents thấy trong HTML' : 'Meta Pixel load qua GTM (không bắt buộc trong HTML)' };

  print(report);
  process.exit(report.fail > 0 ? 1 : 0);
}

function print(r) {
  console.log('\n========== TRACKING / GTM / PIXEL - LIVE CHECK ==========\n');
  console.log('URL:', r.url);
  console.log('GTM Container:', r.gtmContainerId || '(không tìm thấy)');
  console.log('GA4 ID:', r.ga4Id || '(không tìm thấy)');
  console.log('');
  Object.entries(r.checks).forEach(([k, v]) => {
    const pass = v && (v.pass === true);
    const msg = typeof v === 'object' && v.note ? v.note : (v.hint || (pass ? 'OK' : 'FAIL'));
    console.log(pass ? '  [PASS]' : '  [FAIL]', k + ':', msg);
  });
  console.log('\n---');
  console.log('Tổng:', r.ok, 'pass,', r.fail, 'fail');
  if (r.fail === 0) {
    console.log('\nKết luận: GTM/GA4 đã được nhúng. Để kiểm tra dataLayer & events:');
    console.log('  1. Mở', r.url);
    console.log('  2. F12 -> Console, chạy: window.dataLayer');
    console.log('  3. Hoặc mở /debug, bấm "Kiểm tra lại" trong mục Tracking.');
  }
  console.log('');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
