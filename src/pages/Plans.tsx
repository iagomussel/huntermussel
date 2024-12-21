import React from 'react';
import Plans from '../components/Plans';
import { useTranslation } from 'react-i18next';

const PlansPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">{t('plans.title')}</h1>
            <p className="mt-4 text-xl">{t('plans.subtitle')}</p>
          </div>
        </div>
      </div>
      <Plans />
    </div>
  );
};

export default PlansPage;
