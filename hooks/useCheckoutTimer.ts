import { useState, useEffect, useRef } from 'react';

const CHECKOUT_TIMER_DURATION = 900; // 15 minutes in seconds

interface UseCheckoutTimerProps {
  enabled: boolean;
  onExpired?: () => void;
}

export function useCheckoutTimer({ enabled, onExpired }: UseCheckoutTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(CHECKOUT_TIMER_DURATION);
  const [isExpired, setIsExpired] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Stop timer if disabled
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Reset timer
    setTimeRemaining(CHECKOUT_TIMER_DURATION);
    setIsExpired(false);

    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          if (onExpired) {
            onExpired();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, onExpired]);

  /**
   * Get timer color based on remaining time
   */
  const getTimerColor = () => {
    if (timeRemaining > 600) return "text-green-600 bg-green-100 border-green-300"; // > 10 minutes
    if (timeRemaining > 300) return "text-amber-600 bg-amber-100 border-amber-300"; // > 5 minutes
    return "text-red-600 bg-red-100 border-red-300"; // < 5 minutes
  };

  return {
    timeRemaining,
    isExpired,
    getTimerColor,
  };
}
