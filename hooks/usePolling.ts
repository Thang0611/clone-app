// ============================================
// CUSTOM HOOK: usePolling
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { POLLING_INTERVAL, POLLING_TIMEOUT } from '@/lib/constants';

interface UsePollingOptions {
  enabled?: boolean;
  interval?: number;
  timeout?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onTimeout?: () => void;
}

interface UsePollingReturn {
  status: 'pending' | 'paid';
  isPolling: boolean;
  error: string | null;
  timeRemaining: number;
  stopPolling: () => void;
}

/**
 * Custom hook for polling payment status
 */
export function usePolling(
  orderCode: string | null,
  options: UsePollingOptions = {}
): UsePollingReturn {
  const {
    enabled = true,
    interval = POLLING_INTERVAL,
    timeout = POLLING_TIMEOUT,
    onSuccess,
    onError,
    onTimeout,
  } = options;

  const [status, setStatus] = useState<'pending' | 'paid'>('pending');
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(Math.floor(timeout / 1000));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const isPaymentSuccessHandledRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const checkStatus = useCallback(async () => {
    if (!orderCode || !isMountedRef.current) return;

    // Prevent multiple success handlers
    if (isPaymentSuccessHandledRef.current) return;

    try {
      const data = await apiClient.checkPaymentStatus(orderCode);

      if (!isMountedRef.current) return;

      if (data.status === 'paid' && !isPaymentSuccessHandledRef.current) {
        isPaymentSuccessHandledRef.current = true;
        setStatus('paid');
        stopPolling();
        onSuccess?.();
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;

      const errorMessage = err.message || 'Failed to check status';
      setError(errorMessage);
      onError?.(errorMessage);
      // Don't stop polling on error, continue checking
    }
  }, [orderCode, stopPolling, onSuccess, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    // Reset success handler flag when order code changes or polling is re-enabled
    isPaymentSuccessHandledRef.current = false;

    if (!orderCode || !enabled || status === 'paid') {
      return;
    }

    setIsPolling(true);
    setError(null);

    // Check immediately
    checkStatus();

    // Start polling interval
    intervalRef.current = setInterval(checkStatus, interval);

    // Start countdown timer
    let secondsLeft = Math.floor(timeout / 1000);
    setTimeRemaining(secondsLeft);

    countdownRef.current = setInterval(() => {
      secondsLeft -= 1;
      if (isMountedRef.current) {
        setTimeRemaining(secondsLeft);
      }
      if (secondsLeft <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    }, 1000);

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        stopPolling();
        onTimeout?.();
      }
    }, timeout);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [orderCode, enabled, status, interval, timeout, checkStatus, stopPolling, onTimeout]);

  return {
    status,
    isPolling,
    error,
    timeRemaining,
    stopPolling,
  };
}
