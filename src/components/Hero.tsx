import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { sendProjectNotification } from '../utils/notifications';
import type { ProjectData } from './ProjectModal';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectSubmit = async (data: ProjectData) => {
    const success = await sendProjectNotification(data);
    if (success) {
      alert('Obrigado! Entraremos em contato em breve.');
    } else {
      alert('Ocorreu um erro. Por favor, tente novamente ou entre em contato por telefone.');
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 h-screen flex items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Hunter Mussel
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Excelência em Desenvolvimento
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Mais de 18 anos de experiência e mais de 200 projetos entregues com sucesso
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              Iniciar Projeto
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a
              href="/portfolio"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Ver Portfólio
            </a>
          </div>
        </motion.div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProjectSubmit}
      />
    </div>
  );
};

export default Hero;