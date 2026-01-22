/**
 * Google Analytics 4 Component
 * 
 * Uses @next/third-parties for optimized GA4 integration
 * 
 * To get your GA4 Measurement ID:
 * 1. Go to https://analytics.google.com/
 * 2. Create or select a GA4 property
 * 3. Go to Admin > Data Streams > Web
 * 4. Copy the Measurement ID (format: G-XXXXXXXXXX)
 * 5. Set NEXT_PUBLIC_GA4_ID environment variable
 * 
 * To load GA4 via GTM instead:
 * Set NEXT_PUBLIC_GA4_VIA_GTM=true in .env.production
 * Then configure GA4 Configuration tag in GTM with Measurement ID: G-Z68W3D9YRF
 * See: docs/tracking/GA4_GTM_CONNECTION_GUIDE.md
 */

'use client';

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';
import { trackingConfig, validateTrackingConfig } from '@/lib/tracking-config';

export default function GoogleAnalytics() {
  // Option to load GA4 via GTM instead of direct integration
  // Set NEXT_PUBLIC_GA4_VIA_GTM=true in .env.production to disable this component
  if (trackingConfig.ga4ViaGTM) {
    // GA4 will be loaded via GTM instead
    return null;
  }

  // Only render if GA4 ID is configured
  if (!trackingConfig.ga4Id || !validateTrackingConfig()) {
    return null;
  }

  return <NextGoogleAnalytics gaId={trackingConfig.ga4Id} />;
}
