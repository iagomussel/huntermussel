import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const Plans = () => {
  const { t } = useTranslation();

  const plans: Plan[] = [
    {
      name: 'Basic',
      price: 'R$ 199/month',
      description: 'Perfect for small practices',
      features: [
        'Up to 2 dentists',
        'Basic appointment scheduling',
        'Patient records',
        'Basic reports',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: 'R$ 399/month',
      description: 'For growing practices',
      features: [
        'Up to 5 dentists',
        'Advanced scheduling',
        'Complete patient management',
        'Financial reports',
        'Priority support',
        'Online booking',
        'SMS reminders'
      ],
      isPopular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large clinics',
      features: [
        'Unlimited dentists',
        'Custom features',
        'API access',
        'White-label option',
        'Dedicated support',
        'Custom integrations',
        'Training sessions'
      ]
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {t('plans.title')}
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            {t('plans.description')}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.isPopular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-gray-600">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full py-3 px-4 rounded-lg font-medium ${
                    plan.isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {t('plans.select')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;
