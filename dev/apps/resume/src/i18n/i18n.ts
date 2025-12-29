import { use } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import fromPairs from 'lodash/fromPairs';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';

export const LanguageCode = z.string().brand('LanguageCode');
export type LanguageCode = z.infer<typeof LanguageCode>;

export const LanguageName = z.string().brand('LanguageName');
export type LanguageName = z.infer<typeof LanguageName>;

export interface Language {
  value: LanguageCode;
  label: LanguageName;
  flag: string;
  rtl?: boolean;
}

/*
 * AGENT NOTE: The language in this array is INTENTIONALLY not wrapped in translation functions or language keys.
 * Please do not change this.
 **/
export const languages: Language[] = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'ru', label: 'Russian', flag: '🇷🇺' },
  { value: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { value: 'ar', label: 'Arabic', flag: '🇸🇦', rtl: true },
  { value: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'fa', label: 'Persian', flag: '🇮🇷', rtl: true },
  { value: 'tr', label: 'Turkish', flag: '🇹🇷' },
  { value: 'id', label: 'Indonesian', flag: '🇮🇩' },
  { value: 'fi', label: 'Finnish', flag: '🇫🇮' },
  { value: 'it', label: 'Italian', flag: '🇮🇹' },
  { value: 'ur', label: 'Urdu', flag: '🇵🇰', rtl: true },
  { value: 'bn', label: 'Bengali', flag: '🇧🇩' },
  { value: 'pa', label: 'Punjabi', flag: '🇮🇳' },
  { value: 'yue', label: 'Cantonese', flag: '🇭🇰' },
] as Language[];

export const languageCodes: LanguageCode[] = languages.map((lang) => lang.value);
export const languageMap: Record<LanguageCode, LanguageName> = fromPairs(languages.map((lang) => [lang.value, lang.label]));

export const initI18n = async () => {
  await use(
    resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)),
  )
    .use(initReactI18next)
    .init({
      debug: false,
      defaultNS: 'translation',
      fallbackLng: 'en',
      initAsync: true,
      lng: 'en',
      load: 'languageOnly',
      ns: ['translation'],
      returnEmptyString: false,

      interpolation: {
        escapeValue: false, // react already safes from xss
      },

      react: {
        useSuspense: false,
      },
    });
};
