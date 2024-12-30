import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Plans from '../components/Plans';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Users, Trophy, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // Ensure i18n is imported and initialized

const Home = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.split('-')[0];
    
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else if (browserLanguage === 'pt') {
      i18n.changeLanguage('pt');
      localStorage.setItem('preferredLanguage', 'pt');
    } else {
      i18n.changeLanguage('en');
      localStorage.setItem('preferredLanguage', 'en');
    }
  }, []);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { icon: Code2, value: '200+', label: t('stats.projectsDelivered') },
    { icon: Users, value: '150+', label: t('stats.satisfiedClients') },
    { icon: Trophy, value: '18+', label: t('stats.yearsOfExperience') },
    { icon: Rocket, value: '99%', label: t('stats.successRate') },
  ];

  return (
    <div>
      <Hero />
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="mx-auto h-10 w-10 text-indigo-600 mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('whyChoose.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('whyChoose.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('whyChoose.items.expertise.title'),
                description: t('whyChoose.items.expertise.description'),
              },
              {
                title: t('whyChoose.items.personalized.title'),
                description: t('whyChoose.items.personalized.description'),
              },
              {
                title: t('whyChoose.items.support.title'),
                description: t('whyChoose.items.support.description'),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <Plans />
      </section>

      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">{t('cta.title')}</h2>
          <a
            href="/contact"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('cta.button')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
