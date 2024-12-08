import React from 'react';
import { Icon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: Icon;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: IconComponent }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
    >
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
        <IconComponent className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default ServiceCard;