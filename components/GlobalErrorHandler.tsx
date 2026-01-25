"use client";

import { useEffect } from "react";

/**
 * Global Error Handler Component
 * Suppresses non-critical errors from browser extensions and Next.js HMR
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    // Suppress errors from browser extensions (content scripts)
    const originalError = window.console.error;
    const originalWarn = window.console.warn;

    window.console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      
      // Suppress known non-critical errors
      if (
        // Browser extension content script errors
        errorMessage.includes('content_script.js') ||
        errorMessage.includes('Cannot read properties of null') ||
        errorMessage.includes('postMessage') ||
        // Next.js HMR WebSocket errors (only in development)
        (process.env.NODE_ENV === 'development' && 
         (errorMessage.includes('webpack-hmr') || 
          errorMessage.includes('WebSocket connection to') ||
          errorMessage.includes('HMR')))
      ) {
        // Silently ignore these errors
        return;
      }
      
      // Log other errors normally
      originalError.apply(console, args);
    };

    window.console.warn = (...args: any[]) => {
      const warnMessage = args.join(' ');
      
      // Suppress known non-critical warnings
      if (
        // Browser extension warnings
        warnMessage.includes('content_script.js') ||
        // Next.js HMR WebSocket warnings (only in development)
        (process.env.NODE_ENV === 'development' && 
         (warnMessage.includes('webpack-hmr') || 
          warnMessage.includes('WebSocket connection to')))
      ) {
        // Silently ignore these warnings
        return;
      }
      
      // Log other warnings normally
      originalWarn.apply(console, args);
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason || '');
      
      // Suppress known non-critical promise rejections
      if (
        errorMessage.includes('content_script.js') ||
        errorMessage.includes('postMessage') ||
        (process.env.NODE_ENV === 'development' && 
         (errorMessage.includes('webpack-hmr') || 
          errorMessage.includes('WebSocket')))
      ) {
        event.preventDefault(); // Prevent default error logging
        return;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup on unmount
    return () => {
      window.console.error = originalError;
      window.console.warn = originalWarn;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}
