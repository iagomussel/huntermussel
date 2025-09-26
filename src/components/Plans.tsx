import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Service {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const Services = () => {
  const services: Service[] = [
    {
      name: 'AWS Audit Accelerator',
      price: 'Fixed $2,500',
      description: '72-hour AWS account assessment + executive workshop',
      features: [
        '45+ point security, reliability, and cost review',
        'Executive-ready scorecards and heat maps',
        'Live debrief with senior AWS architect',
        '30-60-90 day remediation roadmap',
        'Optional implementation support add-ons'
      ],
      isPopular: true
    },
    {
      name: 'Web Development',
      price: 'From $5,000',
      description: 'Custom web applications',
      features: [
        'Responsive design',
        'Frontend & backend development',
        'API integration',
        'Database development',
        'Basic SEO optimization'
      ]
    },
    {
      name: 'Enterprise Solutions',
      price: 'From $15,000',
      description: 'Complete business systems',
      features: [
        'Custom business software',
        'Process automation',
        'Data analytics & reporting',
        'Integration with existing systems',
        'User training',
        'Extended support',
        'Regular updates'
      ]
    },
    {
      name: 'Mobile Development',
      price: 'From $8,000',
      description: 'iOS & Android applications',
      features: [
        'Native or cross-platform',
        'UI/UX design',
        'Backend API development',
        'App Store submission',
        'Performance optimization',
        'Push notifications',
        'Analytics integration'
      ]
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Professional software development solutions for your business
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <motion.div
              key={service.name}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                service.isPopular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {service.isPopular && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                <p className="mt-4 text-gray-600">{service.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">{service.price}</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full py-3 px-4 rounded-lg font-medium ${
                    service.isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {service.name === 'AWS Audit Accelerator' ? 'Book AWS Audit' : 'Get Started'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
