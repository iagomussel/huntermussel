import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TeamMember from '../components/TeamMember';
import { team } from '../data/team';
import { Code, Users, Heart, Zap } from 'lucide-react';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const values = [
    {
      icon: Code,
      title: 'Excelência Técnica',
      description: 'Comprometimento com as melhores práticas e tecnologias mais recentes.'
    },
    {
      icon: Users,
      title: 'Foco no Cliente',
      description: 'Atendimento personalizado e dedicação total aos objetivos do cliente.'
    },
    {
      icon: Heart,
      title: 'Paixão',
      description: 'Amor pelo desenvolvimento e pela criação de soluções inovadoras.'
    },
    {
      icon: Zap,
      title: 'Inovação',
      description: 'Busca constante por soluções criativas e tecnologias emergentes.'
    }
  ];

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Sobre Hunter Mussel</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Com mais de 18 anos de experiência em desenvolvimento de software, transformamos ideias em soluções digitais de sucesso.
            </p>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Princípios que guiam nossa jornada e definem nossa excelência
            </p>
          </div>

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <value.icon className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Liderança</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça quem está por trás das soluções inovadoras
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {team.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;