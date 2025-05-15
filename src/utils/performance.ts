// Performance utilities for optimizing assets and monitoring performance

/**
 * Lazy loads images that are outside the viewport
 * @param imageSelector - The CSS selector for images to lazy load
 */
export const setupLazyLoading = (imageSelector = 'img[data-src]') => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target as HTMLImageElement;
        const src = lazyImage.dataset.src;
        
        if (src) {
          lazyImage.src = src;
          lazyImage.removeAttribute('data-src');
          lazyImage.classList.add('loaded');
        }
        
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  document.querySelectorAll(imageSelector).forEach((image) => {
    lazyImageObserver.observe(image);
  });
};

/**
 * Defers non-critical resources until after page load
 */
export const deferNonCriticalResources = () => {
  if (typeof window === 'undefined') return;
  
  // Function to load deferred scripts
  const loadDeferredResources = () => {
    // Find all elements with data-defer attribute
    document.querySelectorAll('[data-defer]').forEach((element) => {
      const el = element as HTMLElement;
      
      // For scripts
      if (el.tagName === 'SCRIPT') {
        const script = document.createElement('script');
        Array.from(el.attributes).forEach((attr) => {
          if (attr.name !== 'data-defer') {
            script.setAttribute(attr.name, attr.value);
          }
        });
        script.textContent = el.textContent;
        document.head.appendChild(script);
        el.remove();
      }
      
      // For stylesheets
      if (el.tagName === 'LINK' && el.getAttribute('rel') === 'stylesheet') {
        el.setAttribute('rel', 'stylesheet');
        el.removeAttribute('data-defer');
      }
    });
  };

  // Load after page load or when user interacts
  if (document.readyState === 'complete') {
    loadDeferredResources();
  } else {
    window.addEventListener('load', loadDeferredResources);
    // Also load on user interaction
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach((event) => {
      window.addEventListener(event, loadDeferredResources, { once: true });
    });
  }
};

/**
 * Optimizes image loading based on viewport size
 */
export const setupResponsiveImages = () => {
  if (typeof window === 'undefined') return;
  
  const optimizeImage = (img: HTMLImageElement) => {
    // Get device pixel ratio for higher resolution screens
    const dpr = window.devicePixelRatio || 1;
    
    // Get container width to determine appropriate image size
    const container = img.parentElement;
    const containerWidth = container ? container.offsetWidth : window.innerWidth;
    
    // Calculate optimal width based on container and device pixel ratio
    const targetWidth = Math.round(containerWidth * dpr);
    
    // Apply width to srcset if available
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    
    // If image has responsive URLs in data attributes
    if (img.dataset.src) {
      // If image has responsive size options
      if (img.dataset.sizes) {
        img.sizes = img.dataset.sizes;
      } else {
        // Set sizes based on container width
        img.sizes = `${containerWidth}px`;
      }
    }
  };
  
  // Process all images with data-src attributes
  document.querySelectorAll('img[data-src]').forEach(optimizeImage);
  
  // Reprocess on window resize
  window.addEventListener('resize', () => {
    document.querySelectorAll('img[data-src]').forEach(optimizeImage);
  });
}; 