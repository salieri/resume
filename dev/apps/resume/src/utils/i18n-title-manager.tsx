import get from 'lodash/get';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatches } from 'react-router';

export interface TranslatableHandle {
  title?: string;
  titleKey?: string;
}

/**
 * Set i18n page titles
 * @constructor
 *
 * Expects routes to export a handle that satisfies `TranslatableHandle`.
 *
 * ```ts
 * export const handle: TranslatableHandle = {
 *    title: 'Hello world',
 * };
 * ```
 *
 */
export function I18nTitleManager() {
  const matches = useMatches();
  const { t } = useTranslation();

  useEffect(() => {
    const last = matches.findLast((m) => m.id);

    if (last) {
      document.title = t(
        `page.${get(last, 'handle.titleKey', 'untitled')}`,
        get(last, 'handle.title', 'Untitled Page'),
      );
    }
  }, [matches, t]);

  return null;
}
