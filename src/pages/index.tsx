import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import CasesSection from "../components/CasesSection";
import AboutSection from "../components/AboutSection";
import TechSection from "../components/TechSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const Home = () => {
  const title = "AI Process Management & DevOps";
  const description =
    "Automate and optimize your company's process management with Artificial Intelligence, intelligent automation, and DevOps.";

  return (
    <Layout title={title} description={description}>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://huntermussel.com/" />
        <meta property="og:site_name" content="HunterMussel" />
        <meta
          property="og:image"
          content="https://huntermussel.com/images/blog/rich-content-google-search_16x9_high.webp"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content="https://huntermussel.com/images/blog/rich-content-google-search_16x9_high.webp"
        />
      </Head>

      <div className="min-h-screen bg-background">
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
    </Layout>
  );
};

export default Home;
