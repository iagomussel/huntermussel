import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './i18n/en.json';
import ptTranslations from './i18n/pt.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: ptTranslations }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
