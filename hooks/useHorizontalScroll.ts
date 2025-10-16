
import { useRef, useState, useEffect, useCallback } from 'react';

interface UseHorizontalScrollReturn {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  showLeftArrow: boolean;
  showRightArrow: boolean;
  scroll: (direction: 'left' | 'right') => void;
  checkScroll: () => void;
}

interface UseHorizontalScrollOptions {
  scrollAmount?: number;
  threshold?: number;
}

export const useHorizontalScroll = (
  options: UseHorizontalScrollOptions = {}
): UseHorizontalScrollReturn => {
  const { scrollAmount = 300, threshold = 10 } = options;
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - threshold);
    }
  }, [threshold]);

  // Scroll left or right
  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [scrollAmount]);

  // Setup scroll listener and window resize listener
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  return {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scroll,
    checkScroll,
  };
};