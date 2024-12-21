import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Plans = () => {
  const { t } = useTranslation();

  const plans = [
    {
      id: 'essential',
      priceId: 'price_essential',
      price: '$150',
      hours: '5',
      features: ['plans.essential.features']
    },
    {
      id: 'professional',
      priceId: 'price_professional',
      price: '$450',
      hours: '15',
      popular: true,
      features: ['plans.professional.features']
    },
    {
      id: 'custom',
      features: ['plans.custom.features']
    }
  ];

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.id === 'custom') {
      window.location.href = '/contact';
      return;
    }

    const stripe = await stripePromise;
    
    if (!stripe) {
      console.error('Stripe not loaded');
      return;
    }

    try {
      // Redirect to your checkout page or handle the subscription UI
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: plan.priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/plans`,
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} 
                 className={`relative bg-white rounded-lg shadow-lg p-8 ${
                   plan.popular ? 'ring-2 ring-indigo-600' : ''
                 }`}>
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
                  {t('plans.mostPopular')}
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-4">{t(`plans.${plan.id}.title`)}</h3>
              {plan.id !== 'custom' ? (
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              ) : (
                <div className="mb-4">
                  <span className="text-2xl font-medium text-indigo-600">{t('plans.contactUs')}</span>
                </div>
              )}
              <p className="text-gray-600 mb-6">{t(`plans.${plan.id}.description`)}</p>
              
              {plan.hours && (
                <div className="mb-8">
                  <div className="font-semibold mb-2">{plan.hours} {t('plans.hoursIncluded')}</div>
                  <ul className="space-y-3">
                    {t(plan.features[0], { returnObjects: true }).map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-2 px-4 rounded-md ${
                  plan.id === 'custom'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {t(plan.id === 'custom' ? 'plans.contactUs' : 'plans.subscribe')}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">{t('plans.slaNote')}</p>
        </div>
      </div>
    </div>
  );
};

export default Plans;
