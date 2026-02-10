import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, className }) => {
  const isBlogImage = src.startsWith('/images/blog/') && !src.includes('_16x9_') && !src.includes('_1x1_') && !src.includes('_9x16_');

  if (!isBlogImage) {
    return <img src={src} alt={alt} className={className} loading="lazy" />;
  }

  // derive base path assuming extension is .webp, .jpg or .png (as per script)
  const basePath = src.split('.').slice(0, -1).join('.');

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
      {/* Square (1:1) for tablets or smaller screens */}
      <source
        media="(max-width: 1024px)"
        srcSet={getSrcSet('1x1')}
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
      {/* Default/Desktop Landscape (16:9) */}
      <img
        src={`${basePath}_16x9_med.webp`}
        srcSet={getSrcSet('16x9')}
        sizes="(max-width: 1280px) 100vw, 1280px"
        alt={alt}
        className={className}
        loading="lazy"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </picture>
  );
};

export default ResponsiveImage;
