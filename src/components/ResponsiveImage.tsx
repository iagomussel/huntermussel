import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
};

export default ResponsiveImage;
