import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CasesSection from "@/components/CasesSection";
import AboutSection from "@/components/AboutSection";
import TechSection from "@/components/TechSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import {
  createOrganizationJsonLd,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

const Index = () => {
  const title = `${SITE_NAME} | AI Process Management & DevOps`;
  const description = DEFAULT_DESCRIPTION;
  const canonical = `${SITE_URL}/`;
  const organizationJsonLd = createOrganizationJsonLd();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={DEFAULT_KEYWORDS.join(", ")} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <Navbar />
        </header>

        <main>
          <HeroSection />
          <ServicesSection />
          <CasesSection />
          <AboutSection />
          <TechSection />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
