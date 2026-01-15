/**
 * Tracking Configuration
 * 
 * IMPORTANT: Replace these placeholder IDs with your actual tracking IDs
 * 
 * To get your IDs:
 * - GTM ID: Google Tag Manager > Admin > Container Settings > Container ID (format: GTM-XXXXXXX)
 * - GA4 ID: Google Analytics > Admin > Property Settings > Measurement ID (format: G-XXXXXXXXXX)
 * - Meta Pixel ID: Facebook Events Manager > Data Sources > Meta Pixel > Settings > Pixel ID (format: 1234567890123456)
 */

export const trackingConfig = {
  // Google Tag Manager ID
  // Get from: https://tagmanager.google.com/
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || '', // e.g., 'GTM-XXXXXXX'

  // Google Analytics 4 Measurement ID
  // Get from: https://analytics.google.com/
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || '', // e.g., 'G-XXXXXXXXXX'

  // Meta Pixel ID
  // Get from: https://business.facebook.com/events_manager2/
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '', // e.g., '1234567890123456'

  // Enable/disable tracking (useful for development)
  enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_TRACKING === 'true',

  // Currency for e-commerce events
  currency: 'VND',

  // Site domain
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'khoahocgiare.info',
} as const;

/**
 * Validate that all required tracking IDs are configured
 */
export function validateTrackingConfig(): boolean {
  if (!trackingConfig.enabled) {
    return false;
  }

  const missing: string[] = [];
  
  if (!trackingConfig.gtmId) {
    missing.push('GTM ID');
  }
  
  if (!trackingConfig.ga4Id) {
    missing.push('GA4 ID');
  }
  
  if (!trackingConfig.metaPixelId) {
    missing.push('Meta Pixel ID');
  }

  if (missing.length > 0) {
    console.warn(
      `[Tracking] Missing configuration: ${missing.join(', ')}. ` +
      `Please set the following environment variables:\n` +
      `- NEXT_PUBLIC_GTM_ID\n` +
      `- NEXT_PUBLIC_GA4_ID\n` +
      `- NEXT_PUBLIC_META_PIXEL_ID`
    );
    return false;
  }

  return true;
}
