import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Plans = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$85',
      period: '/hour',
      description: 'For small projects with limited scope',
      features: [
        'Junior & Mid-level Developers',
        'Standard Technical Support',
        'Weekly Progress Updates',
        'Dedicated Project Manager',
        'Standard Documentation',
        'Up to 160 Hours Per Project'
      ],
      highlighted: false
    },
    {
      name: 'Standard',
      price: '$125',
      period: '/hour',
      description: 'For medium-sized business applications',
      features: [
        'Senior Developers & Specialists',
        'Priority Technical Support',
        'Bi-weekly Progress Meetings',
        'Dedicated Senior Project Manager',
        'Comprehensive Documentation',
        'QA & Testing Included',
        'Flexible Resource Allocation'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: '$150-200',
      period: '/hour',
      description: 'For large enterprise solutions',
      features: [
        'Elite Development Team',
        'Architecture Consulting',
        '24/7 Premium Support',
        'Weekly Executive Briefings',
        'Custom SLA Agreement',
        'Advanced Security Protocols',
        'Ongoing Maintenance Options'
      ],
      highlighted: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Flexible Hourly Rates for Every Need
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer transparent hourly pricing options based on project complexity and resource requirements.
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            variants={childVariants}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              plan.highlighted
                ? 'border-2 border-indigo-500 transform md:scale-105 z-10'
                : 'border border-gray-200'
            }`}
          >
            {plan.highlighted && (
              <div className="bg-indigo-500 text-white text-center py-2">
                <span className="font-semibold">Most Popular</span>
              </div>
            )}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <div className="p-6">
              <a
                href="/contact"
                className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Plans;
