
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Services from '../components/Plans';
import ContactForm from '../components/ContactForm';
import MobileContactFlow from '../components/MobileContactFlow';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hunter Mussel",
    "url": "https://huntermussel.com",
    "logo": "https://huntermussel.com/assets/images/logo.svg",
    "description": "Professional software development company delivering innovative, high-quality software solutions for businesses across various industries.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://github.com/huntermussel",
      "https://linkedin.com/company/huntermussel"
    ],
    "offers": {
      "@type": "Service",
      "serviceType": "Software Development",
      "provider": {
        "@type": "Organization",
        "name": "Hunter Mussel"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Hunter Mussel - Professional Software Development | Custom Web & Mobile Solutions</title>
        <meta
          name="description"
          content="Hunter Mussel is a premier software development company delivering innovative web applications, mobile apps, and enterprise solutions. Get a free quote today!"
        />
        <meta name="keywords" content="software development, web development, mobile apps, custom software, enterprise solutions, react development, node.js" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://huntermussel.com/" />
        <meta property="og:title" content="Hunter Mussel - Professional Software Development" />
        <meta property="og:description" content="Transform your ideas into powerful digital solutions. Expert software development for web, mobile, and enterprise applications." />
        <meta property="og:image" content="https://huntermussel.com/assets/images/hero.jpg" />
        <meta property="og:site_name" content="Hunter Mussel" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://huntermussel.com/" />
        <meta name="twitter:title" content="Hunter Mussel - Professional Software Development" />
        <meta name="twitter:description" content="Transform your ideas into powerful digital solutions. Expert software development for web, mobile, and enterprise applications." />
        <meta name="twitter:image" content="https://huntermussel.com/assets/images/hero.jpg" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://huntermussel.com/" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <main id="main-content">
        <Hero />
        <Services />
        
        {/* Mobile Contact Flow Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50" aria-labelledby="contact-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 id="contact-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Quick Contact
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 px-4">
                Get in touch in just a few steps
              </p>
            </div>
            <div className="lg:hidden px-4">
              <MobileContactFlow />
            </div>
            <div className="hidden lg:block">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white" aria-labelledby="cta-heading">
          <div className="container mx-auto px-4 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 px-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100 px-4">
              Let's discuss your ideas and bring them to life
            </p>
            <Link
              to="/contato"
              className="inline-flex items-center px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm sm:text-base"
              aria-label="Contact us to get started on your project"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
