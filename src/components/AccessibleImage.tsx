import React from 'react';
import { trackEvent } from '../utils/analytics';

interface AccessibleImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  responsive?: boolean;
  srcSet?: string;
  sizes?: string;
  onClick?: () => void;
}

const AccessibleImage: React.FC<AccessibleImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  responsive = true,
  srcSet,
  sizes,
  onClick,
}) => {
  // Track image load error
  const handleError = () => {
    trackEvent({
      category: 'Error',
      action: 'image_load_error',
      label: src,
    });
  };

  // Track image click if onClick is provided
  const handleClick = () => {
    if (onClick) {
      onClick();
      trackEvent({
        category: 'Interaction',
        action: 'image_click',
        label: alt || src,
      });
    }
  };

  // Generate responsive attributes if needed
  const responsiveProps = responsive
    ? {
        srcSet: srcSet || undefined,
        sizes: sizes || undefined,
      }
    : {};

  // Generate lazy loading attributes
  const lazyLoadingProps = lazy
    ? {
        loading: 'lazy' as const,
        'data-src': src,
        src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E', // Tiny placeholder
      }
    : { src };

  return (
    <img
      {...lazyLoadingProps}
      {...responsiveProps}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      onClick={handleClick}
      className={`transition-opacity duration-300 ${lazy ? 'opacity-0' : 'opacity-100'} ${className}`}
      onLoad={(e) => {
        if (lazy) {
          e.currentTarget.classList.remove('opacity-0');
          e.currentTarget.classList.add('opacity-100');
        }
      }}
    />
  );
};

export default AccessibleImage; 