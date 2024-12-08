import React from 'react';
import { motion } from 'framer-motion';
import { Code, GitBranch, Cloud, Smartphone } from 'lucide-react';
import { services } from '../data/services';

const Services = () => {
  const getIcon = (iconName: string) => {
    const icons = {
      code: Code,
      'git-branch': GitBranch,
      cloud: Cloud,
      smartphone: Smartphone,
    };
    return icons[iconName as keyof typeof icons];
  };

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Soluções completas em desenvolvimento de software e tecnologia
            </p>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-lg"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                    {Icon && <Icon className="h-6 w-6 text-indigo-600" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3 text-gray-600">
                    {service.id === 'web-dev' && [
                      'Desenvolvimento de aplicações web responsivas',
                      'Single Page Applications (SPA)',
                      'Progressive Web Apps (PWA)',
                      'Integrações com APIs RESTful'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Pronto para começar seu projeto?</h2>
          <a
            href="/contato"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
          >
            Fale com nossos especialistas
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;