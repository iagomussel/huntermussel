import React from 'react';
import type { Page, SiteTheme, Block, HeroProps, FeaturesProps } from '../types/schema';
import { ChevronRight, Check, Zap, Shield, Cloud } from 'lucide-react';

// Custom interface for Pricing since it's specific to SaaS/Startups
interface PricingProps {
  title: string;
  subtitle?: string;
  plans: {
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    ctaText: string;
    ctaLink: string;
  }[];
}

/**
 * ============================================================================
 * SaaS BLOCK COMPONENTS
 * ============================================================================
 */

const SaaSHeroBlock: React.FC<{ props: HeroProps; theme: SiteTheme }> = ({ props, theme }) => {
  return (
    <section
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center px-6"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      {/* Background glowing gradient effect typical for SaaS */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 blur-[100px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Optional Badge */}
        <div
          className="mb-8 inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border"
          style={{ borderColor: `${theme.primaryColor}40`, color: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }}
        >
          <Zap className="w-4 h-4 mr-2" />
          <span>Discover the new standard</span>
        </div>

        <h1
          className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          style={{ fontFamily: theme.fontFamilyHeading }}
        >
          {props.headline}
        </h1>

        <p className="text-xl lg:text-2xl mb-10 opacity-70 max-w-2xl leading-relaxed">
          {props.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center">
          <a
            href={props.primaryCtaLink}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: theme.primaryColor,
              color: '#ffffff',
              borderRadius: theme.borderRadius === 'full' ? '9999px' : theme.borderRadius === 'lg' ? '0.75rem' : '0.375rem'
            }}
          >
            {props.primaryCtaText}
            <ChevronRight className="ml-2 w-5 h-5" />
          </a>

          {props.secondaryCtaText && (
            <a
              href={props.secondaryCtaLink || '#'}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium transition-colors border"
              style={{
                borderColor: 'var(--border-color, #e5e7eb)',
                color: theme.textColor,
                borderRadius: theme.borderRadius === 'full' ? '9999px' : theme.borderRadius === 'lg' ? '0.75rem' : '0.375rem'
              }}
            >
              {props.secondaryCtaText}
            </a>
          )}
        </div>
      </div>

      {/* Product Mockup Image */}
      {props.imageUrl && (
        <div className="relative z-10 mt-20 w-full max-w-6xl mx-auto perspective-1000">
          <div
            className="rounded-xl overflow-hidden shadow-2xl border border-gray-200/20"
            style={{ transform: 'rotateX(5deg) scale(1.05)', borderRadius: theme.borderRadius === 'full' ? '1.5rem' : theme.borderRadius === 'lg' ? '1rem' : '0.5rem' }}
          >
            <img
              src={props.imageUrl}
              alt="Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
};

const SaaSFeaturesBlock: React.FC<{ props: FeaturesProps; theme: SiteTheme }> = ({ props, theme }) => {
  return (
    <section
      className="py-24 px-6 lg:px-12"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2
            className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: theme.fontFamilyHeading }}
          >
            {props.title}
          </h2>
          {props.subtitle && (
            <p className="text-xl opacity-70">{props.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {props.items.map((item, idx) => (
            <div
              key={idx}
              className="p-8 border transition-all hover:shadow-lg group"
              style={{
                borderColor: 'var(--border-color, #e5e7eb)',
                backgroundColor: 'var(--card-bg, transparent)',
                borderRadius: theme.borderRadius === 'full' ? '1.5rem' : theme.borderRadius === 'lg' ? '1rem' : '0.5rem'
              }}
            >
              <div
                className="w-12 h-12 mb-6 flex items-center justify-center rounded-lg transition-colors"
                style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
              >
                {/* Fallback generic icon for SaaS features */}
                {idx % 3 === 0 ? <Cloud className="w-6 h-6" /> : idx % 3 === 1 ? <Zap className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: theme.fontFamilyHeading }}>
                {item.title}
              </h3>
              <p className="opacity-70 leading-relaxed text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SaaSPricingBlock: React.FC<{ props: PricingProps; theme: SiteTheme }> = ({ props, theme }) => {
  // If no plans are provided by the schema yet, provide a fallback for the template visual
  const plans = props.plans || [
    { name: 'Starter', price: '$0', description: 'Perfect for trying out our platform.', features: ['1 User', 'Basic Analytics', 'Community Support'], ctaText: 'Get Started', ctaLink: '#' },
    { name: 'Pro', price: '$29', description: 'Everything you need to scale your business.', features: ['Up to 10 Users', 'Advanced Analytics', 'Priority Support', 'Custom Domain'], isPopular: true, ctaText: 'Start Free Trial', ctaLink: '#' },
    { name: 'Enterprise', price: 'Custom', description: 'Advanced security and support for large teams.', features: ['Unlimited Users', 'Dedicated Success Manager', 'SSO & Advanced Security', 'Custom Integrations'], ctaText: 'Contact Sales', ctaLink: '#' },
  ];

  return (
    <section
      className="py-24 px-6 lg:px-12"
      style={{
        backgroundColor: theme.backgroundColor === '#ffffff' ? '#fcfcfc' : theme.backgroundColor,
        color: theme.textColor
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2
            className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: theme.fontFamilyHeading }}
          >
            {props.title || "Simple, transparent pricing"}
          </h2>
          <p className="text-xl opacity-70">
            {props.subtitle || "Choose the right plan for your team."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col p-8 ${plan.isPopular ? 'shadow-2xl md:-translate-y-4' : 'shadow-sm border'}`}
              style={{
                backgroundColor: theme.backgroundColor,
                borderColor: plan.isPopular ? theme.primaryColor : 'var(--border-color, #e5e7eb)',
                borderWidth: plan.isPopular ? '2px' : '1px',
                borderRadius: theme.borderRadius === 'full' ? '2rem' : theme.borderRadius === 'lg' ? '1.5rem' : '0.5rem',
                zIndex: plan.isPopular ? 10 : 1
              }}
            >
              {plan.isPopular && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 text-sm font-bold uppercase tracking-wider rounded-full"
                  style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="opacity-70 h-10">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-lg opacity-70 font-medium">/mo</span>}
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start">
                    <Check className="w-5 h-5 mr-3 shrink-0" style={{ color: theme.primaryColor }} />
                    <span className="opacity-80">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaLink}
                className="w-full py-4 text-center font-semibold transition-colors"
                style={{
                  backgroundColor: plan.isPopular ? theme.primaryColor : 'transparent',
                  color: plan.isPopular ? '#ffffff' : theme.textColor,
                  border: plan.isPopular ? 'none' : `1px solid var(--border-color, #e5e7eb)`,
                  borderRadius: theme.borderRadius === 'full' ? '9999px' : theme.borderRadius === 'lg' ? '0.5rem' : '0.25rem'
                }}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * ============================================================================
 * MAIN SAAS TEMPLATE ENGINE
 * ============================================================================
 */

interface SaaSTemplateProps {
  page: Page;
  theme: SiteTheme;
}

export default function SaaSTemplate({ page, theme }: SaaSTemplateProps) {
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'Hero':
        return <SaaSHeroBlock key={block.id} props={block.props as HeroProps} theme={theme} />;
      case 'Features':
        return <SaaSFeaturesBlock key={block.id} props={block.props as FeaturesProps} theme={theme} />;
      case 'Pricing':
        return <SaaSPricingBlock key={block.id} props={block.props as PricingProps} theme={theme} />;

      // Fallbacks for unimplemented blocks
      default:
        return (
          <div key={block.id} className="p-12 text-center border-2 border-dashed border-gray-300 m-4 rounded-lg">
            <h3 className="text-xl font-bold text-gray-500">[{block.type} Block]</h3>
            <p className="text-gray-400">Component pending implementation for SaaS theme.</p>
          </div>
        );
    }
  };

  return (
    <main
      className="w-full min-h-screen antialiased flex flex-col selection:bg-black selection:text-white"
      style={{
        fontFamily: theme.fontFamilyBody,
        backgroundColor: theme.backgroundColor,
        // CSS variables for nested components to use easily
        '--theme-primary': theme.primaryColor,
        '--border-color': theme.backgroundColor === '#000000' || theme.backgroundColor === '#111827' ? '#374151' : '#e5e7eb',
        '--card-bg': theme.backgroundColor === '#000000' || theme.backgroundColor === '#111827' ? '#1f2937' : '#ffffff',
      } as React.CSSProperties}
    >
      {/*
        SaaS Header / Navbar
        Driven globally by the platform, allows users to Login / Sign Up
      */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 h-20 flex items-center justify-between backdrop-blur-md border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: `${theme.backgroundColor}CC` }}>
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white" style={{ backgroundColor: theme.primaryColor }}>
            {page.title.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-xl tracking-tight" style={{ color: theme.textColor }}>
            {page.title.split('-')[0] || "Startup"}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm opacity-80">
          <a href="#features" className="hover:opacity-100 transition-opacity">Features</a>
          <a href="#pricing" className="hover:opacity-100 transition-opacity">Pricing</a>
          <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="#" className="hidden sm:block text-sm font-medium hover:opacity-70 transition-opacity">Log in</a>
          <a
            href="#"
            className="px-4 py-2 text-sm font-semibold transition-transform hover:scale-105"
            style={{
              backgroundColor: theme.textColor,
              color: theme.backgroundColor,
              borderRadius: theme.borderRadius === 'full' ? '9999px' : '0.5rem'
            }}
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Render the ordered blocks generated by the AI */}
      <div className="flex-1 flex flex-col w-full">
        {page.blocks
          .sort((a, b) => a.order - b.order)
          .map(renderBlock)}
      </div>

      {/* Standard SaaS Footer */}
      <footer className="py-12 border-t mt-auto text-center" style={{ borderColor: 'var(--border-color)' }}>
        <p className="opacity-50 text-sm">
          © {new Date().getFullYear()} {page.title.split('-')[0] || "Company"}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
