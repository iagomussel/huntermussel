// Global type declarations

// Google Analytics gtag
interface Window {
  gtag: (
    command: string,
    targetId: string,
    config?: Record<string, any> | undefined
  ) => void;
  dataLayer: Record<string, any>[];
  performance: Performance;
}

// Web Vitals types
interface Performance {
  timing: {
    navigationStart: number;
    loadEventEnd: number;
    domInteractive: number;
    domContentLoadedEventEnd: number;
  };
} 