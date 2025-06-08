import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Services from '../components/Plans';
import ContactForm from '../components/ContactForm';
import MobileContactFlow from '../components/MobileContactFlow';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'react-feather';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>HunterMussel - Professional Software Development</title>
        <meta
          name="description"
          content="HunterMussel is a premier software house delivering innovative, high-quality software solutions for businesses across various industries."
        />
      </Helmet>
      <Hero />
      <Services />
       {/* Mobile Contact Flow Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Contact</h2>
              <p className="text-xl text-gray-600">
                Get in touch in just a few steps
              </p>
            </div>
            <div className="lg:hidden">
              <MobileContactFlow />
            </div>
            <div className="hidden lg:block">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Let's discuss your ideas and bring them to life
            </p>
            <Link
              to="/contato"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
    </>
  );
};

export default Home;