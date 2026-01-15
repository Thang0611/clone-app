import { useState, useRef, useCallback, useEffect } from 'react';

interface UseHorizontalScrollProps {
  enabled?: boolean;
  scrollAmount?: number;
}

export function useHorizontalScroll({ 
  enabled = true, 
  scrollAmount = 300 
}: UseHorizontalScrollProps = {}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /**
   * Check scroll position for navigation arrows
   */
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !enabled) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, [enabled]);

  /**
   * Scroll horizontally in specified direction
   */
  const scrollHorizontal = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container || !enabled) return;

    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, [enabled, scrollAmount]);

  /**
   * Check scroll position on resize
   */
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [enabled, checkScrollPosition]);

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollHorizontal,
    checkScrollPosition,
  };
}
