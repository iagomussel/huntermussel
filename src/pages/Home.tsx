
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Services from '../components/Plans';
import ContactForm from '../components/ContactForm';
import { lazy } from 'react';
const MobileContactFlow = lazy(() => import('../components/MobileContactFlow'));
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, FileText, Calculator, Palette, Download, CheckCircle, Star, Zap, Shield, Clock, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

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

        {/* Social Proof & Stats Section */}
        <section ref={statsRef} className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <p className="text-gray-600 mb-8">Trusted by 200+ companies worldwide</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
                  <div className="text-gray-600">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-gray-600">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support Available</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section ref={benefitsRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Hunter Mussel?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We don't just code - we transform your business with strategic technology solutions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Lightning Fast Delivery</h3>
                <p className="text-gray-600 mb-4">Get your MVP ready in 30 days. We use agile methodologies to deliver results quickly without compromising quality.</p>
                <div className="flex items-center justify-center text-green-600 font-semibold">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  30-Day MVP Guarantee
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">ROI-Focused Development</h3>
                <p className="text-gray-600 mb-4">Every line of code is written with your business goals in mind. Average client sees 300% ROI within 12 months.</p>
                <div className="flex items-center justify-center text-green-600 font-semibold">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  300% Average ROI
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Enterprise-Grade Security</h3>
                <p className="text-gray-600 mb-4">Your data is protected with bank-level security. SOC 2 compliant with 99.9% uptime guarantee.</p>
                <div className="flex items-center justify-center text-green-600 font-semibold">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  99.9% Uptime SLA
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Clients Say
              </h2>
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">4.9/5 from 150+ reviews</span>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Hunter Mussel transformed our business with a custom CRM that increased our sales by 150%. The team was professional and delivered on time."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    JS
                  </div>
                  <div>
                    <p className="font-semibold">John Smith</p>
                    <p className="text-sm text-gray-600">CEO, TechStart Inc.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"The mobile app they built for us has over 10,000 downloads in the first month. Exceptional quality and ongoing support."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    MJ
                  </div>
                  <div>
                    <p className="font-semibold">Maria Johnson</p>
                    <p className="text-sm text-gray-600">Founder, HealthTech Solutions</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Their automation solutions saved us 20 hours per week. ROI was achieved in just 3 months. Highly recommend!"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    RB
                  </div>
                  <div>
                    <p className="font-semibold">Robert Brown</p>
                    <p className="text-sm text-gray-600">Operations Manager, RetailCorp</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Services />

        {/* Free Tools Section - Redesigned for higher conversion */}
        <section ref={ref} className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🎁 LIMITED TIME - FREE ACCESS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Professional Tools for Startups
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                Get $5,000+ worth of professional development tools absolutely free. 
                Perfect for validating your idea and planning your project.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm">✨ No Credit Card Required</div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm">🚀 Instant Access</div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm">💼 Professional Grade</div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Cost Calculator</h3>
                <p className="text-sm text-gray-600 mb-3">Get accurate development estimates</p>
                <div className="text-green-600 font-semibold text-sm">Worth $500</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">API Docs Generator</h3>
                <p className="text-sm text-gray-600 mb-3">Professional documentation instantly</p>
                <div className="text-green-600 font-semibold text-sm">Worth $800</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Brand Kit Generator</h3>
                <p className="text-sm text-gray-600 mb-3">Complete brand identity package</p>
                <div className="text-green-600 font-semibold text-sm">Worth $1,200</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Project Templates</h3>
                <p className="text-sm text-gray-600 mb-3">Professional requirement templates</p>
                <div className="text-green-600 font-semibold text-sm">Worth $300</div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <Link
                to="/free-tools"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Free Tools Now - $2,800 Value
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-2">Join 5,000+ entrepreneurs who've downloaded our tools</p>
            </motion.div>
          </div>
        </section>

        {/* Urgency-driven Contact Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🔥 LIMITED SPOTS AVAILABLE
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to 10X Your Business?
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                We only take on 8 new projects per month to ensure quality. 
                Book your free strategy call now before spots fill up.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm">Free 30-min consultation</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm">Custom strategy roadmap</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm">ROI projection analysis</p>
                </div>
              </div>

              <div className="lg:hidden mb-8">
                <MobileContactFlow />
              </div>
              <div className="hidden lg:block mb-8">
                <ContactForm />
              </div>
              
              <p className="text-sm text-gray-400">
                🛡️ No spam, ever. Your information is 100% secure.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Don't Let Your Competitors Get Ahead
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Every day you wait is another day your competitors might be building the solution you need. 
              Let's start your project today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Start Your Project Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/free-tools"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-300 text-blue-100 hover:bg-blue-300 hover:text-blue-900 rounded-lg font-semibold transition-colors"
              >
                Try Free Tools First
              </Link>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              ⚡ Average project starts within 48 hours
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
