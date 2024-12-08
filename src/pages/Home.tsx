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
    { icon: Code2, value: '200+', label: 'Projetos Entregues' },
    { icon: Users, value: '150+', label: 'Clientes Satisfeitos' },
    { icon: Trophy, value: '18+', label: 'Anos de Experiência' },
    { icon: Rocket, value: '99%', label: 'Taxa de Sucesso' },
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher Professor Mussel?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combinamos vasta experiência técnica com uma abordagem personalizada para entregar soluções que impulsionam o crescimento do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expertise Comprovada',
                description: 'Mais de 18 anos de experiência em desenvolvimento e mais de 200 projetos entregues com sucesso.',
              },
              {
                title: 'Abordagem Personalizada',
                description: 'Cada projeto é único e recebe atenção dedicada para atender às necessidades específicas do cliente.',
              },
              {
                title: 'Suporte Contínuo',
                description: 'Acompanhamento próximo e suporte dedicado durante todo o ciclo de desenvolvimento.',
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
          <h2 className="text-3xl font-bold mb-8">Pronto para transformar sua ideia em realidade?</h2>
          <a
            href="/contato"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Fale Conosco
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;