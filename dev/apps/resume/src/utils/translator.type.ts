import type { useTranslation } from 'react-i18next';

export type TranslatorFn = ReturnType<typeof useTranslation>['t'];
