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

  const eventData = {
    ...data,
    timestamp: new Date().toISOString(),
  };

  if (window.dataLayer) {
    window.dataLayer.push(eventData);
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Tracking] Event pushed to dataLayer:', eventData);
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
 */
export function trackViewContent(
  contentType: string,
  contentName?: string,
  contentCategory?: string
): void {
  pushToDataLayer({
    event: 'view_content',
    content_type: contentType,
    content_name: contentName,
    content_category: contentCategory,
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
 */
export function trackFormSubmit(
  formId: string,
  formName: string,
  formLocation?: string,
  courseCount?: number
): void {
  pushToDataLayer({
    event: 'form_submit',
    form_id: formId,
    form_name: formName,
    form_location: formLocation,
    course_count: courseCount,
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
  transactionId?: string
): void {
  pushToDataLayer({
    event: 'begin_checkout',
    currency: currency || trackingConfig.currency,
    value: value,
    items: items,
    transaction_id: transactionId || `temp_${Date.now()}`,
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
