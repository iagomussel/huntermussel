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
        <title>HunterMussel | Gestão de Processos com IA & DevOps</title>
        <meta name="description" content="Automatize e otimize a gestão de processos da sua empresa com Inteligência Artificial, automação inteligente e DevOps." />
        <link rel="canonical" href="https://huntermussel.com/" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <header>
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
