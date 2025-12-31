import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatches } from 'react-router';
import type { UIMatch } from 'react-router';

import type { TranslatorFn } from '~/utils/translator.type';

export interface TranslatableHandle {
  title?: (t: TranslatorFn) => string;
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
    const last = matches.findLast((m) => m.id) as UIMatch<unknown, TranslatableHandle> | undefined;

    if (last) {
      document.title = last.handle.title ? last.handle.title(t) : t('page.untitled', 'Untitled Page');
    }
  }, [matches, t]);

  return null;
}
