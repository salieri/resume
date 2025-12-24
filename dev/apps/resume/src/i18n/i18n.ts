import { use } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

export const languages = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'ru', label: 'Russian', flag: '🇷🇺' },
  { value: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { value: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'fa', label: 'Persian', flag: '🇮🇷' },
  { value: 'tr', label: 'Turkish', flag: '🇹🇷' },
  { value: 'id', label: 'Indonesian', flag: '🇮🇩' },
];

export const initI18n = async () => {
  await use(
    resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)),
  )
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      ns: ['translation'],
      defaultNS: 'translation',
      initAsync: true,
      debug: true,
      load: 'languageOnly',
      returnEmptyString: false,

      interpolation: {
        escapeValue: false, // react already safes from xss
      },

      react: {
        useSuspense: true,
      },
    });
};
