import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, className }) => {
  const isBlogImage = src.startsWith('/images/blog/') && src.endsWith('.webp') && !src.includes('_thumb') && !src.includes('_low');

  if (!isBlogImage) {
    return <img src={src} alt={alt} className={className} loading="lazy" />;
  }

  const basePath = src.replace('.webp', '');
  
  const getSrcSet = (ratio: string) => {
      let medWidth = 1280;
      if (ratio === '1x1') medWidth = 1024;
      if (ratio === '9x16') medWidth = 1080;
      
      return [
        `${basePath}_${ratio}_thumb.webp 320w`,
        `${basePath}_${ratio}_low.webp 640w`,
        `${basePath}_${ratio}_med.webp ${medWidth}w`,
        `${basePath}_${ratio}_high.webp 1920w`,
      ].join(', ');
  };

  return (
    <picture className={className}>
      {/* Mobile Vertical (9:16) */}
      <source 
        media="(max-width: 480px) and (orientation: portrait)" 
        srcSet={getSrcSet('9x16')} 
        sizes="100vw"
      />
      {/* Square (1:1) for small tablets or specific layouts */}
      <source 
        media="(max-width: 768px)" 
        srcSet={getSrcSet('1x1')} 
        sizes="100vw"
      />
      {/* Default/Desktop Landscape (16:9) */}
      <img
        src={`${basePath}_16x9_med.webp`}
        srcSet={getSrcSet('16x9')}
        sizes="(max-width: 1200px) 100vw, 1200px"
        alt={alt}
        className={className}
        loading="lazy"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </picture>
  );
};

export default ResponsiveImage;
