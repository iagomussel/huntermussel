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
            AWS Account Audits &
            <span className="text-blue-300 block mt-2">Mission-Critical Software</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 leading-relaxed px-4">
            Uncover hidden risk, wasted spend, and growth opportunities with our flagship AWS Audit plus executive-ready modernization roadmap.
          </p>
          <div className="mb-6 sm:mb-8">
            <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔍 72-Hour AWS Audit Turnaround
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a
              href="https://awsaudit.huntermussel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg font-bold transition-all inline-flex items-center justify-center text-sm sm:text-base shadow-xl transform hover:scale-105"
            >
              Book Your AWS Audit
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <Link
              to="/contact"
              className="border-2 border-blue-300 text-blue-100 hover:bg-blue-300 hover:text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Talk to a Cloud Architect
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            ⚡ Executive briefing included | 🛡️ Led by senior AWS solutions architects
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;