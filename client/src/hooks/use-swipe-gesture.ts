import { useCallback, useRef, useState } from 'react';

interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

interface SwipeGestureHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export function useSwipeGesture(config: SwipeGestureConfig): SwipeGestureHandlers {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    preventDefaultTouchmoveEvent = false
  } = config;

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleGesture = useCallback(() => {
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    
    // Only trigger swipe if horizontal movement is greater than vertical (to avoid conflicts with scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  // Touch handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  }, [preventDefaultTouchmoveEvent]);

  const onTouchEnd = useCallback(() => {
    handleGesture();
  }, [handleGesture]);

  // Mouse handlers (for desktop fallback)
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    touchEndX.current = e.clientX;
    touchEndY.current = e.clientY;
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    if (isDragging) {
      handleGesture();
      setIsDragging(false);
    }
  }, [handleGesture, isDragging]);

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave
  };
}