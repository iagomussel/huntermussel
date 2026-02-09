import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CasesSection from "@/components/CasesSection";
import AboutSection from "@/components/AboutSection";
import TechSection from "@/components/TechSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useRef } from "react";
import ParallaxSection from "@/components/ParallaxSection";
import SmoothScroll from "@/components/SmoothScroll";
import StackingCard from "@/components/StackingCard";

const Index = () => {
  return (
    <SmoothScroll>
      <Helmet>
        <title>HunterMussel | AI Process Management & DevOps</title>
        <meta name="description" content="Automate and optimize your company's process management with Artificial Intelligence, intelligent automation, and DevOps." />
        <link rel="canonical" href="https://huntermussel.com/" />
      </Helmet>

      <div className="bg-background relative">
        <header className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </header>

        <main className="relative">
          <HeroSection />

          <ParallaxSection />
          
          <StackingCard index={1} totalCards={6}>
            <ServicesSection />
          </StackingCard>

          <StackingCard index={2} totalCards={6}>
            <CasesSection />
          </StackingCard>

          <StackingCard index={3} totalCards={6}>
            <AboutSection />
          </StackingCard>

          <StackingCard index={4} totalCards={6}>
            <TechSection />
          </StackingCard>

          <StackingCard index={5} totalCards={6}>
            <ContactSection />
          </StackingCard>

          <Footer />
        </main>
      </div>
    </SmoothScroll>
  );
};

export default Index;
