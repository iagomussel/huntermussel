import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Products = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Complete patient records and history tracking'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Efficient appointment management with reminders'
    },
    {
      icon: FileText,
      title: 'Electronic Records',
      description: 'Secure storage of patient dental charts and records'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Products - Hunter Mussel</title>
        <meta name="description" content="Explore our software product line. OdontoMaster: complete dental clinic management system and more innovative solutions." />
      </Helmet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl font-bold text-white mb-8">
                Our Products
              </h1>
              <p className="text-xl text-blue-100 mb-12">
                Innovative software solutions designed for your business needs
              </p>
            </motion.div>
          </div>
        </section>

        {/* OdontoMaster Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">OdontoMaster</h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    Complete management system for dental clinics. Simplify processes,
                    increase productivity, and offer a better experience to your patients.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3">Intelligent appointment scheduling</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3">Complete electronic medical records</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3">Integrated financial management</span>
                    </div>
                  </div>
                  <div className="mt-8 space-x-4">
                    <a
                      href="/produtos/odontomaster"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Learn More
                    </a>
                    <button
                      className="inline-block border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Schedule Demo
                    </button>
                  </div>
                </div>
                <div className="md:w-1/2 bg-gray-100 p-8 md:p-12">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="bg-white p-4 rounded-lg shadow"
                          >
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold mb-2">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Development & Custom Solutions Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Custom Development Solutions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Veterinary Management Systems</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive clinic management solutions for veterinary practices. Features include patient records, 
                  appointment scheduling, inventory management, billing, and treatment tracking. Built with modern 
                  technology to streamline veterinary operations and improve patient care.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Pet medical records and history</li>
                  <li>• Vaccination tracking and reminders</li>
                  <li>• Inventory and medication management</li>
                  <li>• Financial reporting and analytics</li>
                </ul>
                <Link 
                  to="/contato" 
                  className="inline-block text-blue-600 font-semibold hover:text-blue-700"
                >
                  Request Custom Development →
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Educational Management Platforms</h3>
                <p className="text-gray-600 mb-4">
                  Complete learning management systems for educational institutions. Our platforms support 
                  student enrollment, course management, grade tracking, communication tools, and administrative 
                  functions. Designed to enhance the educational experience for students, teachers, and administrators.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Student information systems</li>
                  <li>• Course and curriculum management</li>
                  <li>• Grade tracking and reporting</li>
                  <li>• Parent-teacher communication portals</li>
                </ul>
                <Link 
                  to="/contato" 
                  className="inline-block text-blue-600 font-semibold hover:text-blue-700"
                >
                  Request Custom Development →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise Business Solutions</h3>
                <p className="text-gray-600 mb-4">
                  Custom enterprise software development for businesses of all sizes. We create tailored solutions 
                  for inventory management, CRM systems, financial tracking, workflow automation, and business 
                  intelligence. Our solutions integrate seamlessly with existing business processes.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Custom CRM and ERP systems</li>
                  <li>• Business process automation</li>
                  <li>• Data analytics and reporting</li>
                  <li>• API integrations and migrations</li>
                </ul>
                <Link 
                  to="/contato" 
                  className="inline-block text-blue-600 font-semibold hover:text-blue-700"
                >
                  Request Custom Development →
                </Link>
              </div>
            </div>

            {/* Development Process Section */}
            <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Our Development Process</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Discovery & Planning</h4>
                  <p className="text-sm text-gray-600">We analyze your business needs and create a detailed project roadmap</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Design & Architecture</h4>
                  <p className="text-sm text-gray-600">Our team designs the user experience and technical architecture</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Development & Testing</h4>
                  <p className="text-sm text-gray-600">Agile development with continuous testing and quality assurance</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-xl">4</span>
                  </div>
                  <h4 className="font-semibold mb-2">Deployment & Support</h4>
                  <p className="text-sm text-gray-600">Seamless deployment with ongoing maintenance and support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            to="/contato"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Us
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </main>
    </>
  );
};

export default Products; 