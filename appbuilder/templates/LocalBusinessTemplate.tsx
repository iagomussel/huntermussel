import React from 'react';
import type { Page, SiteTheme, Block, HeroProps, FeaturesProps } from '../types/schema';
import { ArrowRight, CheckCircle, MapPin, Phone } from 'lucide-react';

/**
 * ============================================================================
 * BLOCK COMPONENTS (These would usually be in separate files)
 * ============================================================================
 */

const HeroBlock: React.FC<{ props: HeroProps; theme: SiteTheme }> = ({ props, theme }) => {
  const isSplit = props.layout.includes('split');
  const isRight = props.layout === 'split-right';

  return (
    <section
      className="relative flex items-center min-h-[70vh] px-6 py-20 lg:px-12 overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className={`container mx-auto max-w-7xl flex flex-col ${isSplit ? 'lg:flex-row' : 'items-center text-center'} gap-12 ${isRight ? 'lg:flex-row-reverse' : ''}`}>

        {/* Text Content */}
        <div className={`flex-1 flex flex-col ${isSplit ? 'items-start text-left' : 'items-center text-center'} z-10`}>
          <h1
            className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
            style={{ fontFamily: theme.fontFamilyHeading }}
          >
            {props.headline}
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl leading-relaxed">
            {props.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={props.primaryCtaLink}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold transition-transform hover:scale-105"
              style={{
                backgroundColor: theme.primaryColor,
                color: '#fff',
                borderRadius: theme.borderRadius === 'full' ? '9999px' : theme.borderRadius === 'lg' ? '0.5rem' : '0'
              }}
            >
              {props.primaryCtaText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>

            {props.secondaryCtaText && (
              <a
                href={props.secondaryCtaLink || '#'}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold border-2 transition-colors hover:bg-black/5"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.textColor,
                  borderRadius: theme.borderRadius === 'full' ? '9999px' : theme.borderRadius === 'lg' ? '0.5rem' : '0'
                }}
              >
                {props.secondaryCtaText}
              </a>
            )}
          </div>
        </div>

        {/* Media / Image */}
        {(props.imageUrl || props.backgroundImageUrl) && isSplit && (
          <div className="flex-1 w-full relative z-10">
            <div className="relative h-[400px] lg:h-[600px] w-full shadow-2xl overflow-hidden" style={{ borderRadius: theme.borderRadius === 'full' ? '2rem' : theme.borderRadius === 'lg' ? '1rem' : '0' }}>
              <img
                src={props.imageUrl || props.backgroundImageUrl}
                alt="Hero Local Business"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Background Image Overlay for non-split layouts */}
      {!isSplit && props.backgroundImageUrl && (
        <div
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${props.backgroundImageUrl})` }}
        />
      )}
    </section>
  );
};

const FeaturesBlock: React.FC<{ props: FeaturesProps; theme: SiteTheme }> = ({ props, theme }) => {
  const gridCols = props.columns === 4 ? 'lg:grid-cols-4' : props.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  return (
    <section
      className="py-24 px-6 lg:px-12"
      style={{
        backgroundColor: theme.backgroundColor === '#ffffff' ? '#f8fafc' : theme.backgroundColor, // Slight contrast
        color: theme.textColor
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2
            className="text-4xl lg:text-5xl font-bold mb-6"
            style={{ fontFamily: theme.fontFamilyHeading }}
          >
            {props.title}
          </h2>
          {props.subtitle && (
            <p className="text-xl opacity-80">{props.subtitle}</p>
          )}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-8 lg:gap-12`}>
          {props.items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col p-8 bg-white shadow-lg hover:shadow-xl transition-shadow"
              style={{
                borderRadius: theme.borderRadius === 'full' ? '1.5rem' : theme.borderRadius === 'lg' ? '1rem' : '0'
              }}
            >
              {item.imageUrl && (
                <div className="w-full h-48 mb-6 overflow-hidden rounded-t-lg -mx-8 -mt-8 w-[calc(100%+4rem)]">
                   <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}

              {!item.imageUrl && (
                <div
                  className="w-14 h-14 mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor, borderRadius: '50%' }}
                >
                  <CheckCircle className="w-7 h-7" />
                </div>
              )}

              <h3 className="text-2xl font-bold mb-4" style={{ color: theme.textColor }}>
                {item.title}
              </h3>
              <p className="text-lg opacity-80 leading-relaxed flex-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * ============================================================================
 * MAIN TEMPLATE ENGINE
 * ============================================================================
 * This component receives the schema data (generated by AI) and maps it
 * to the corresponding React components to build the Local Business page.
 */

interface LocalBusinessTemplateProps {
  page: Page;
  theme: SiteTheme;
}

export default function LocalBusinessTemplate({ page, theme }: LocalBusinessTemplateProps) {

  // The Block Renderer maps the JSON "type" to a real React Component
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'Hero':
        return <HeroBlock key={block.id} props={block.props as HeroProps} theme={theme} />;
      case 'Features':
        return <FeaturesBlock key={block.id} props={block.props as FeaturesProps} theme={theme} />;

      // Future block implementations will be added here
      case 'Testimonials':
      case 'Pricing':
      case 'FAQ':
      case 'ContactForm':
        return (
          <div key={block.id} className="p-12 text-center border-2 border-dashed border-gray-300 m-4">
            <h3 className="text-xl font-bold text-gray-500">[{block.type} Block]</h3>
            <p className="text-gray-400">Component pending implementation.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main
      className="w-full min-h-screen antialiased flex flex-col selection:bg-black selection:text-white"
      style={{
        fontFamily: theme.fontFamilyBody,
        // Optional: Injecting CSS variables for advanced Tailwind usage
        '--theme-primary': theme.primaryColor,
        '--theme-secondary': theme.secondaryColor,
      } as React.CSSProperties}
    >
      {/*
        A Local Business header usually has a Top Bar with contact info.
        This could also be driven by the schema (e.g. site settings).
      */}
      <header className="w-full py-3 px-6 flex justify-between items-center bg-gray-900 text-white text-sm">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> (555) 123-4567</span>
          <span className="flex items-center gap-2 hidden sm:flex"><MapPin className="w-4 h-4" /> 123 Main St, City, State</span>
        </div>
        <div className="font-bold tracking-wider uppercase">
          {page.title.split('-')[0] || "Local Business"}
        </div>
      </header>

      {/* Render the ordered blocks generated by the AI */}
      {page.blocks
        .sort((a, b) => a.order - b.order)
        .map(renderBlock)}

    </main>
  );
}
