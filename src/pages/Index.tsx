import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CasesSection from "@/components/CasesSection";
import AboutSection from "@/components/AboutSection";
import TechSection from "@/components/TechSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>HunterMussel | AI Process Management & DevOps</title>
        <meta name="description" content="Automate and optimize your company's process management with Artificial Intelligence, intelligent automation, and DevOps." />
        <link rel="canonical" href="https://huntermussel.com/" />
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
