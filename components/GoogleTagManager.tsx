/**
 * Google Tag Manager Component
 * 
 * Loads GTM script and initializes dataLayer
 * 
 * To get your GTM ID:
 * 1. Go to https://tagmanager.google.com/
 * 2. Create or select a container
 * 3. Copy the Container ID (format: GTM-XXXXXXX)
 * 4. Set NEXT_PUBLIC_GTM_ID environment variable
 */

'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { trackingConfig, validateTrackingConfig } from '@/lib/tracking-config';

export default function GoogleTagManager() {
  useEffect(() => {
    // Initialize dataLayer before GTM loads
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
    }
  }, []);

  // Don't render if GTM ID is not configured
  if (!trackingConfig.gtmId || !validateTrackingConfig()) {
    return null;
  }

  return (
    <>
      {/* GTM Script - Loads in head */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${trackingConfig.gtmId}');
          `,
        }}
      />
      
      {/* GTM Noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
