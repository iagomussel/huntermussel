import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, bio, social }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-indigo-600 mb-4">{role}</p>
        <p className="text-gray-600 mb-4">{t(bio)}</p>
        {social && (
          <div className="flex space-x-4">
            {social.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                <Github className="h-5 w-5" />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600">
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamMember;
