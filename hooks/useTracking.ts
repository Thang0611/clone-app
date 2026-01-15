/**
 * Custom React Hook for Tracking
 * 
 * Provides easy-to-use tracking functions in React components
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  trackPageView,
  trackViewContent,
  trackFormStart,
  trackFormSubmit,
  trackFormSubmitSuccess,
  trackFormSubmitError,
  trackBeginCheckout,
  trackPurchase,
  hashEmail,
  pushToDataLayer,
} from '@/lib/tracking';

/**
 * Custom hook for tracking events
 */
export function useTracking() {
  // Track if form has been started (to prevent duplicate events)
  const formStartTracked = useRef<Set<string>>(new Set());

  /**
   * Track page view
   */
  const trackPage = useCallback((path?: string, title?: string) => {
    if (typeof window === 'undefined') return;
    
    const pagePath = path || window.location.pathname + window.location.search;
    trackPageView(pagePath, title);
  }, []);

  /**
   * Track custom event
   */
  const trackEvent = useCallback((
    eventName: string,
    eventData?: Record<string, any>
  ) => {
    pushToDataLayer({
      event: eventName,
      ...eventData,
    });
  }, []);

  /**
   * Track view content
   */
  const trackContent = useCallback((
    contentType: string,
    contentName?: string,
    contentCategory?: string
  ) => {
    trackViewContent(contentType, contentName, contentCategory);
  }, []);

  /**
   * Track form start (only once per form per session)
   */
  const trackFormBegin = useCallback((
    formId: string,
    formName: string,
    formLocation?: string
  ) => {
    // Prevent duplicate tracking
    if (formStartTracked.current.has(formId)) {
      return;
    }

    trackFormStart(formId, formName, formLocation);
    formStartTracked.current.add(formId);
  }, []);

  /**
   * Track form submit
   */
  const trackForm = useCallback((
    formId: string,
    formName: string,
    formLocation?: string,
    courseCount?: number
  ) => {
    trackFormSubmit(formId, formName, formLocation, courseCount);
  }, []);

  /**
   * Track form submit success
   */
  const trackFormSuccess = useCallback((
    formId: string,
    courseCount: number,
    validCourses: number
  ) => {
    trackFormSubmitSuccess(formId, courseCount, validCourses);
  }, []);

  /**
   * Track form submit error
   */
  const trackFormError = useCallback((
    formId: string,
    errorMessage: string
  ) => {
    trackFormSubmitError(formId, errorMessage);
  }, []);

  /**
   * Track begin checkout
   */
  const trackCheckout = useCallback((
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
  ) => {
    trackBeginCheckout(value, currency, items, transactionId);
  }, []);

  /**
   * Track purchase
   */
  const trackPurchaseEvent = useCallback(async (
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
    email?: string
  ) => {
    // Hash email if provided
    const emailHash = email ? await hashEmail(email) : undefined;
    
    trackPurchase(
      transactionId,
      value,
      currency,
      items,
      paymentType,
      emailHash
    );
  }, []);

  /**
   * Set user properties
   */
  const setUserProperties = useCallback((
    properties: {
      user_type?: 'new' | 'returning';
      device_type?: 'desktop' | 'mobile' | 'tablet';
      browser?: string;
      traffic_source?: string;
      campaign_id?: string;
      ad_group?: string;
    }
  ) => {
    pushToDataLayer({
      event: 'set_user_properties',
      user_properties: properties,
    });
  }, []);

  /**
   * Track user engagement (scroll depth, time on page, etc.)
   */
  const trackEngagement = useCallback((
    engagementType: 'scroll' | 'time' | 'click',
    value: number,
    additionalData?: Record<string, any>
  ) => {
    pushToDataLayer({
      event: 'user_engagement',
      engagement_type: engagementType,
      engagement_value: value,
      ...additionalData,
    });
  }, []);

  return {
    // Page tracking
    trackPage,
    
    // Event tracking
    trackEvent,
    trackContent,
    
    // Form tracking
    trackFormBegin,
    trackForm,
    trackFormSuccess,
    trackFormError,
    
    // E-commerce tracking
    trackCheckout,
    trackPurchase: trackPurchaseEvent,
    
    // User properties
    setUserProperties,
    
    // Engagement tracking
    trackEngagement,
  };
}

/**
 * Hook to automatically detect and track user properties
 * Call this once in your root layout or app component
 */
export function useUserPropertiesTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect device type
    const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    // Detect browser
    const getBrowser = (): string => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('chrome')) return 'chrome';
      if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
      if (userAgent.includes('firefox')) return 'firefox';
      if (userAgent.includes('edge')) return 'edge';
      return 'other';
    };

    // Detect traffic source
    const getTrafficSource = (): string => {
      const referrer = document.referrer.toLowerCase();
      if (!referrer) return 'direct';
      if (referrer.includes('facebook.com') || referrer.includes('fb.com')) return 'facebook';
      if (referrer.includes('google.com')) return 'google';
      if (referrer.includes('bing.com')) return 'bing';
      return 'other';
    };

    // Set user properties
    pushToDataLayer({
      event: 'set_user_properties',
      user_properties: {
        device_type: getDeviceType(),
        browser: getBrowser(),
        traffic_source: getTrafficSource(),
        user_type: sessionStorage.getItem('user_visited') ? 'returning' : 'new',
      },
    });

    // Mark user as visited
    if (!sessionStorage.getItem('user_visited')) {
      sessionStorage.setItem('user_visited', 'true');
    }
  }, []);
}
