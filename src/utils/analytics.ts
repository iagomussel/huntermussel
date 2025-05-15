// Analytics utilities for tracking user behavior

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-NENC1CBCTS', {
      page_path: path,
    });
  }
};

// Track custom events
export const trackEvent = ({ category, action, label, value }: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Initialize performance measurement
export const initPerformanceTracking = () => {
  if (typeof window !== 'undefined') {
    // Report Web Vitals
    window.addEventListener('load', () => {
      // After the page loads, wait a bit and then measure
      setTimeout(() => {
        const { loadTime, domInteractive, domContentLoaded } = getPerformanceMetrics();
        
        // Send performance data to Google Analytics
        trackEvent({
          category: 'Performance',
          action: 'page_load_time',
          value: loadTime,
        });
      }, 100);
    });
  }
};

// Get performance metrics from Navigation Timing API
const getPerformanceMetrics = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    const domInteractive = perfData.domInteractive - perfData.navigationStart;
    const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
    
    return { loadTime, domInteractive, domContentLoaded };
  }
  
  return { loadTime: 0, domInteractive: 0, domContentLoaded: 0 };
}; 