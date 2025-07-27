import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTouch: boolean;
  userAgent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export function useMobileDetection(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTouch: false,
    userAgent: '',
    deviceType: 'desktop'
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    
    // Mobile detection patterns
    const mobilePatterns = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
      /Mobile/i
    ];

    const tabletPatterns = [
      /iPad/i,
      /Android(?=.*Tablet)/i,
      /Tablet/i
    ];

    const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent));
    const isTablet = tabletPatterns.some(pattern => pattern.test(userAgent));
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (isTablet) {
      deviceType = 'tablet';
    } else if (isMobile) {
      deviceType = 'mobile';
    }

    setDetection({
      isMobile: isMobile && !isTablet,
      isTouch,
      userAgent,
      deviceType
    });
  }, []);

  return detection;
}