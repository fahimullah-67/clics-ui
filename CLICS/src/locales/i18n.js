import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en/translation.json';
import ur from './ur/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ur'],
    nonExplicitSupportedLngs: false,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false }
  });

export default i18n;
