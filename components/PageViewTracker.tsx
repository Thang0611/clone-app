/**
 * Page View Tracker
 * 
 * Tracks page views in Next.js App Router
 * Since App Router uses client-side navigation, we need to track route changes
 */

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/tracking';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Build full path with search params
    const fullPath = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Track page view
    trackPageView(fullPath);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[PageViewTracker] Page view tracked:', fullPath);
    }
  }, [pathname, searchParams]);

  return null;
}
