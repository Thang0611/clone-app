/**
 * Meta Pixel (Facebook Pixel) - Init from app
 *
 * Dùng khi bạn KHÔNG dùng tag "Meta Pixel - Base Code" trong GTM (ví dụ: biến
 * {{Meta Pixel ID}} trong GTM bị null → lỗi "Invalid PixelID: null").
 *
 * Cách dùng:
 * 1. Đặt NEXT_PUBLIC_META_PIXEL_ID trong .env (ID 15–16 chữ số từ Facebook Events Manager).
 * 2. Thêm <MetaPixel /> vào layout (sau GoogleTagManager).
 * 3. Trong GTM: TẮT tag "Meta Pixel - Base Code" để tránh init 2 lần và lỗi null.
 * 4. Các tag Meta trong GTM chỉ gọi fbq('track', ...) — giữ nguyên.
 *
 * Test Event Code: thêm ?test_event_code=TEST15091 vào URL để xem event trong
 * Facebook Events Manager → Test Events. fbq('init') và fbq('track','PageView') sẽ gửi kèm test_event_code.
 */

'use client';

import Script from 'next/script';
import { trackingConfig } from '@/lib/tracking-config';

export default function MetaPixel() {
  const id = trackingConfig.metaPixelId?.trim() || '';

  if (!id || !trackingConfig.enabled) {
    return null;
  }

  return (
    <Script
      id="meta-pixel-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  var pixelId = '${id.replace(/'/g, "\\'")}';
  if (!pixelId) return;
  var testCode = '';
  try { testCode = (new URLSearchParams(window.location.search).get('test_event_code') || '').trim(); } catch(e) {}
  var opts = testCode ? { test_event_code: testCode } : {};
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  // ❌ REMOVED: {em: '{{DLV - email_hash}}'} - GTM syntax không hoạt động trong React component
  // ✅ Email hash sẽ được set bằng fbq('set', 'user', { em: emailHash }) khi có email
  // Xem: app/order/[orderCode]/page.tsx và GTM Facebook Pixel Template tags
  fbq('init', pixelId, {}, opts);
  fbq('track', 'PageView', {}, opts);
})();
        `,
      }}
    />
  );
}
