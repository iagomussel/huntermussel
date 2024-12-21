import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="text-gray-700 hover:text-indigo-600"
    >
      {i18n.language === 'en' ? '🇺🇸' : '🇧🇷'}
    </button>
  );
};

export default LanguageSwitcher;
