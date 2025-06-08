import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Innovative Software
            <span className="text-blue-300 block mt-2">Solutions</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 leading-relaxed px-4">
            We transform ideas into powerful digital solutions that drive business growth
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/contato"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center text-sm sm:text-base"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              to="/sobre"
              className="border-2 border-blue-300 text-blue-100 hover:bg-blue-300 hover:text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;