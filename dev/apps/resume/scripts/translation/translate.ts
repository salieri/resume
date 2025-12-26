import { languageMap } from '@/i18n/i18n';

import { toJsonSchema } from './to-json-schema';
import type { TranslateParams } from './types';

const translateSection = async (sectionData: Record<string, unknown>, sectionKey: string, params: TranslateParams, prompt: string) => {
  const schema = toJsonSchema(sectionData);

  const result // await params.openRouter.completions.generate({
    = await params.openRouter.chat.send({
      messages: [
        { role: 'user', content: prompt.replace('{{OUTPUT_FORMAT}}', JSON.stringify(sectionData, null, 2)) },
      ],
      ...params.modelParams,

      responseFormat: {
        type: 'json_schema',
        jsonSchema: {
          name: 'translation',
          strict: true,
          schema,
        },
      },
    }, { retries: {
      strategy: 'backoff',
      backoff: {
        initialInterval: 500,
        maxInterval: 10_000,
        exponent: 1.5,
        maxElapsedTime: 600_000,
      },
      retryConnectionErrors: true,
    } });

  return {
    sectionKey,
    result,
  };
};

export const translate = async (params: TranslateParams) => {
  const replacements = {
    '{{SOURCE_LANGUAGE}}': languageMap[params.sourceLanguage],
    '{{TARGET_LANGUAGE}}': languageMap[params.targetLanguage],
    '{{INPUT_CONTENT}}': JSON.stringify(params.inputData, null, 2),
  };

  // eslint-disable-next-line unicorn/no-array-reduce
  const prompt = Object.entries(replacements).reduce(
    (accum, kw) => accum.replaceAll(kw[0], kw[1]),
    params.promptTemplate,
  );

  // translate each top-level section separately due to the JSON schema complexity limits on OpenRouter
  const results = await Promise.all(
    Object.entries(params.inputData as object).map(async ([key, value]) =>
      translateSection(value as Record<string, unknown>, key, params, prompt)),
  );

  const combined = Object.fromEntries(results.map(({ sectionKey, result }) =>
    [sectionKey, JSON.parse(result.choices[0].message.content as string)]));

  return combined;
};
