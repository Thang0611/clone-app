/**
 * Tracking Utilities
 * 
 * Type-safe functions for pushing events to dataLayer
 */

import { trackingConfig } from './tracking-config';

// Declare dataLayer type for TypeScript
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Initialize dataLayer if it doesn't exist
 */
function initDataLayer(): void {
  if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = [];
  }
}

/**
 * Get test event code from URL if present
 */
function getTestEventCode(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const testCode = urlParams.get('test_event_code');
    return testCode || undefined;
  } catch (error) {
    return undefined;
  }
}

/**
 * Push event to dataLayer (for GTM)
 */
export function pushToDataLayer(data: Record<string, any>): void {
  if (!trackingConfig.enabled) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  initDataLayer();

  // Get test event code from URL if present
  const testEventCode = getTestEventCode();

  const eventData = {
    ...data,
    timestamp: new Date().toISOString(),
    // Add test event code if present in URL
    ...(testEventCode && { test_event_code: testEventCode }),
  };

  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Tracking] Event pushed to dataLayer:', eventData);
    if (testEventCode) {
      console.log(`[Tracking] Test event code: ${testEventCode}`);
    }
  }
}

/**
 * Track Page View
 */
export function trackPageView(path: string, title?: string): void {
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: title || document.title,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  });
}

/**
 * Track View Content
 * @param contentIds - optional: mã khóa học (content_ids) để Facebook hiển thị thông tin khóa học
 */
export function trackViewContent(
  contentType: string,
  contentName?: string,
  contentCategory?: string,
  contentIds?: string[]
): void {
  pushToDataLayer({
    event: 'view_content',
    content_type: contentType,
    content_name: contentName,
    content_category: contentCategory,
    ...(contentIds?.length ? { content_ids: contentIds } : {}),
  });
}

/**
 * Track Form Start
 */
export function trackFormStart(
  formId: string,
  formName: string,
  formLocation?: string
): void {
  pushToDataLayer({
    event: 'form_start',
    form_id: formId,
    form_name: formName,
    form_location: formLocation,
  });
}

/**
 * Track Form Submit
 * @param emailHash - Optional: SHA-256 hashed email for Advanced Matching
 */
export function trackFormSubmit(
  formId: string,
  formName: string,
  formLocation?: string,
  courseCount?: number,
  emailHash?: string
): void {
  pushToDataLayer({
    event: 'form_submit',
    form_id: formId,
    form_name: formName,
    form_location: formLocation,
    course_count: courseCount,
    email_hash: emailHash,
    ...(emailHash && {
      user_data: {
        sha256_email_address: emailHash
      }
    }),
  });
}

/**
 * Track Form Submit Success
 */
export function trackFormSubmitSuccess(
  formId: string,
  courseCount: number,
  validCourses: number
): void {
  pushToDataLayer({
    event: 'form_submit_success',
    form_id: formId,
    course_count: courseCount,
    valid_courses: validCourses,
  });
}

/**
 * Track Form Submit Error
 */
export function trackFormSubmitError(
  formId: string,
  errorMessage: string
): void {
  pushToDataLayer({
    event: 'form_submit_error',
    form_id: formId,
    error_message: errorMessage,
  });
}

/**
 * Track Begin Checkout (InitiateCheckout)
 * @param emailHash - Optional: SHA-256 hashed email for Advanced Matching
 */
export function trackBeginCheckout(
  value: number,
  currency: string,
  items: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    item_brand?: string;
    price: number;
    quantity: number;
  }>,
  transactionId?: string,
  emailHash?: string
): void {
  pushToDataLayer({
    event: 'begin_checkout',
    currency: currency || trackingConfig.currency,
    value: value,
    items: items,
    transaction_id: transactionId || `temp_${Date.now()}`,
    email_hash: emailHash,
    ...(emailHash && {
      user_data: {
        sha256_email_address: emailHash
      }
    }),
  });
}

/**
 * Track Purchase
 */
export function trackPurchase(
  transactionId: string,
  value: number,
  currency: string,
  items: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    item_brand?: string;
    price: number;
    quantity: number;
  }>,
  paymentType?: string,
  emailHash?: string
): void {
  pushToDataLayer({
    event: 'purchase',
    transaction_id: transactionId,
    value: value,
    currency: currency || trackingConfig.currency,
    tax: 0,
    shipping: 0,
    items: items,
    payment_type: paymentType,
    email_hash: emailHash,
    ...(emailHash && {
      user_data: {
        sha256_email_address: emailHash
      }
    }),
  });
}

/**
 * Hash email for privacy (SHA-256)
 * Note: This is a simple implementation. For production, consider using a more robust hashing solution
 */
export async function hashEmail(email: string): Promise<string> {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('[Tracking] Error hashing email:', error);
    return '';
  }
}

/**
 * Set user properties
 * Call this to set user-level properties that will be included in all subsequent events
 */
export function setUserProperties(properties: {
  user_type?: 'new' | 'returning';
  device_type?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  traffic_source?: string;
  campaign_id?: string;
  ad_group?: string;
  [key: string]: any;
}): void {
  pushToDataLayer({
    event: 'set_user_properties',
    user_properties: properties,
  });
}

/**
 * Track custom event
 * Use this for any custom events not covered by the standard tracking functions
 */
export function trackCustomEvent(
  eventName: string,
  eventData?: Record<string, any>
): void {
  pushToDataLayer({
    event: eventName,
    ...eventData,
  });
}

/**
 * Track user engagement
 * Tracks user interactions like scroll depth, time on page, clicks, etc.
 */
export function trackUserEngagement(
  engagementType: 'scroll' | 'time' | 'click' | 'video' | 'download',
  value: number,
  additionalData?: Record<string, any>
): void {
  pushToDataLayer({
    event: 'user_engagement',
    engagement_type: engagementType,
    engagement_value: value,
    ...additionalData,
  });
}
