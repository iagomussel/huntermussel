import React from 'react';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Users, Trophy, Rocket } from 'lucide-react';

const Home = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { icon: Code2, value: '200+', label: 'Projects Delivered' },
    { icon: Users, value: '150+', label: 'Satisfied Clients' },
    { icon: Trophy, value: '18+', label: 'Years of Experience' },
    { icon: Rocket, value: '99%', label: 'Success Rate' },
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Hunter Mussel</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine technical expertise with personalized service to deliver exceptional results for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Technical Expertise",
                description: "Over 18 years of experience in developing high-quality software solutions for businesses of all sizes.",
              },
              {
                title: "Personalized Solutions",
                description: "We create custom software tailored to your specific business needs and requirements.",
              },
              {
                title: "Ongoing Support",
                description: "Our commitment doesn't end with deployment - we provide continuous support and maintenance.",
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

      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Your Project?</h2>
          <a
            href="/contact"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
