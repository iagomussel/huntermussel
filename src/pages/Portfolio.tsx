import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Project, ProjectCategory, TranslatedProject } from '../types/portfolio';

const Portfolio = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loadedProjects: Project[] = Array.from({ length: 24 }, (_, i) => {
        const projectKey = `portfolio.projects.project${i + 1}`;
        const translatedProject = t(projectKey, { returnObjects: true });
        
        if (!translatedProject || !translatedProject.title) {
          throw new Error(`Translation missing for project ${i + 1}`);
        }

        return {
          id: `project${i + 1}`,
          ...(translatedProject as TranslatedProject)
        };
      });

      setProjects(loadedProjects);
    } catch (err) {
      setError('Error loading projects. Please try again.');
      console.error('Portfolio loading error:', err);
    }
  }, [t]);

  const categories = [
    { id: 'all', label: t('portfolio.categories.all') },
    { id: 'web', label: t('portfolio.categories.web') },
    { id: 'mobile', label: t('portfolio.categories.mobile') },
    { id: 'cloud', label: t('portfolio.categories.cloud') },
  ] as const;

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('portfolio.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto">
              {t('portfolio.description')}
            </p>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-4 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode='wait'>
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">{t('portfolio.cta.title')}</h2>
          <a
            href="/contact"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
          >
            {t('portfolio.cta.button')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
