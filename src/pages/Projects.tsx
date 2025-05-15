import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Code2, Database, Globe, Server, Smartphone } from 'lucide-react';

const projectsData = [
  {
    id: 1,
    title: "Dental Practice Management System",
    description: "A comprehensive solution for dental clinics to manage appointments, patient records, treatments, and billing in one integrated platform.",
    image: "/assets/images/projects/dental-system.jpg",
    category: "web",
    technologies: ["React", "Node.js", "MongoDB", "Express"]
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "A full-featured online store with product management, shopping cart, secure checkout, and customer accounts.",
    image: "/assets/images/projects/ecommerce.jpg",
    category: "web",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"]
  },
  {
    id: 3,
    title: "Mobile Fitness Tracker",
    description: "A mobile app that tracks workouts, nutrition, and progress with personalized recommendations.",
    image: "/assets/images/projects/fitness-app.jpg",
    category: "mobile",
    technologies: ["React Native", "Firebase", "Redux", "Google Fit API"]
  },
  {
    id: 4,
    title: "Cloud-based Document Management",
    description: "A secure system for storing, organizing, and collaborating on documents with advanced search capabilities.",
    image: "/assets/images/projects/document-management.jpg",
    category: "cloud",
    technologies: ["AWS", "Python", "Django", "Elasticsearch"]
  },
  {
    id: 5,
    title: "Real Estate Listing Platform",
    description: "A platform connecting property sellers with potential buyers, featuring detailed listings and search filters.",
    image: "/assets/images/projects/real-estate.jpg",
    category: "web",
    technologies: ["Vue.js", "Node.js", "MongoDB", "Google Maps API"]
  },
  {
    id: 6,
    title: "Inventory Management System",
    description: "A solution for tracking inventory levels, orders, sales, and deliveries for retail businesses.",
    image: "/assets/images/projects/inventory.jpg",
    category: "web",
    technologies: ["React", "Express", "MySQL", "Docker"]
  }
];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Projects', icon: Code2 },
    { id: 'web', label: 'Web Applications', icon: Globe },
    { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
    { id: 'cloud', label: 'Cloud Solutions', icon: Server },
    { id: 'database', label: 'Database Projects', icon: Database }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projectsData 
    : projectsData.filter(project => project.category === selectedCategory);

  return (
    <div className="bg-white">
      <Helmet>
        <title>Projects | Hunter Mussel Software Development</title>
        <meta 
          name="description" 
          content="Explore our portfolio of software development projects including web applications, mobile apps, and cloud solutions."
        />
        <meta name="keywords" content="software development, web applications, mobile apps, portfolio, projects" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#4B82F1] to-[#3A6ACF] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                Our Projects
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Discover our portfolio of custom software solutions designed to solve real-world business challenges.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Categories Filter */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#4B82F1] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <category.icon className="h-5 w-5 mr-2" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-100 text-[#4B82F1] rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Build Your Next Project?</h2>
          <a
            href="/contact"
            className="inline-block bg-[#4B82F1] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3A6ACF] transition-colors"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
};

export default Projects; 