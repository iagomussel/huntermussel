import { LangProvider, type Lang } from "@/context/LangContext";
import HeroSection from "@/components/react/HeroSection";
import ServicesSection from "@/components/react/ServicesSection";
import CasesSection from "@/components/react/CasesSection";
import AboutSection from "@/components/react/AboutSection";
import TechSection from "@/components/react/TechSection";
import ToolsSection from "@/components/react/ToolsSection";
import FAQSection from "@/components/react/FAQSection";
import ContactSection from "@/components/react/ContactSection";
import { homeFAQ, homeFAQ_pt } from "@/data/faq";
import { faqT } from "@/data/translations";

interface HomePageProps {
  lang?: Lang;
}

const HomePage = ({ lang = "en" }: HomePageProps) => {
  const faqItems = lang === "pt" ? homeFAQ_pt : homeFAQ;
  const faqTitle = faqT[lang].title;

  return (
    <LangProvider lang={lang}>
      <HeroSection />
      <ServicesSection />
      <CasesSection />
      <AboutSection />
      <TechSection />
      <ToolsSection />
      <FAQSection items={faqItems} title={faqTitle} />
      <ContactSection />
    </LangProvider>
  );
};

export default HomePage;
