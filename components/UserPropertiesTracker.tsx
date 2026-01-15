/**
 * User Properties Tracker
 * 
 * Automatically detects and tracks user properties like device type, browser, traffic source
 * Call this once in your root layout
 */

'use client';

import { useEffect } from 'react';
import { setUserProperties } from '@/lib/tracking';

export default function UserPropertiesTracker() {
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
      if (userAgent.includes('chrome') && !userAgent.includes('edg')) return 'chrome';
      if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
      if (userAgent.includes('firefox')) return 'firefox';
      if (userAgent.includes('edg')) return 'edge';
      return 'other';
    };

    // Detect traffic source
    const getTrafficSource = (): string => {
      const referrer = document.referrer.toLowerCase();
      if (!referrer) return 'direct';
      if (referrer.includes('facebook.com') || referrer.includes('fb.com')) return 'facebook';
      if (referrer.includes('google.com')) return 'google';
      if (referrer.includes('bing.com')) return 'bing';
      if (referrer.includes('linkedin.com')) return 'linkedin';
      return 'other';
    };

    // Check if user is new or returning
    const isReturning = sessionStorage.getItem('user_visited') === 'true';
    const userType = isReturning ? 'returning' : 'new';

    // Extract UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('utm_campaign') || undefined;
    const adGroup = urlParams.get('utm_content') || urlParams.get('utm_term') || undefined;

    // Set user properties
    setUserProperties({
      user_type: userType,
      device_type: getDeviceType(),
      browser: getBrowser(),
      traffic_source: getTrafficSource(),
      campaign_id: campaignId,
      ad_group: adGroup,
    });

    // Mark user as visited
    if (!isReturning) {
      sessionStorage.setItem('user_visited', 'true');
    }
  }, []);

  return null;
}
