import { runOpenRouterPromptWithStructuredResponse, toJsonSchema } from '@faust/llm-utils';
import { ConsoleLogger } from '@faust/logger';
import { z } from 'zod';

import { LanguageCode, languageMap } from '~/i18n/i18n';

import { TranslationInputData } from './types';
import type { TranslateParams } from './types';

const logger = new ConsoleLogger('INFO', { scope: 'resume-translation' });

const TranslationResponse = z.object({
  choices: z.array(z.object({
    message: z.object({
      content: z.string().min(1).describe('Translated JSON content.'),
    }).describe('Choice message payload.'),
  }).describe('Translation choice.')).min(1).describe('Translation choices.'),
}).describe('OpenRouter translation response.');

/**
 * Parse JSON content returned from translation APIs.
 */
const parseTranslationContent = (content: string, sectionKey: string): TranslationInputData => {
  try {
    const parsed: unknown = JSON.parse(content);

    return TranslationInputData.parse(parsed);
  } catch (error) {
    throw new Error(`Failed to parse translation content for section: ${sectionKey}`, { cause: error });
  }
};

const translateSection = async (sectionData: unknown, sectionKey: string, params: TranslateParams, promptData: Record<string, unknown>) => {
  const schema = toJsonSchema(sectionData);
  const { model, ...modelParams } = params.modelParams;
  const outputFormat = JSON.stringify(sectionData, null, 2);

  const { result } = await runOpenRouterPromptWithStructuredResponse({
    openRouter: params.openRouter,
    template: { templatePath: params.promptTemplate },
    data: {
      ...promptData,
      OUTPUT_FORMAT: outputFormat,
    },
    model,
    modelParams,
  }, schema);

  const parsedResponse = TranslationResponse.parse(result);
  const translatedSection = parseTranslationContent(parsedResponse.choices[0].message.content, sectionKey);

  return {
    sectionKey,
    translatedSection,
  };
};

/**
 * Translate a full i18n payload using OpenRouter and JSON schema validation.
 */
export const translate = async (params: TranslateParams): Promise<TranslationInputData> => {
  const inputData = params.inputData;
  const sourceLanguage = LanguageCode.parse(params.sourceLanguage);
  const targetLanguage = LanguageCode.parse(params.targetLanguage);

  const promptData = {
    SOURCE_LANGUAGE: String(languageMap[sourceLanguage]),
    TARGET_LANGUAGE: String(languageMap[targetLanguage]),
    INPUT_CONTENT: JSON.stringify(inputData, null, 2),
  };

  // translate each top-level section separately due to the JSON schema complexity limits on OpenRouter
  const results = await Promise.all(
    Object.entries(inputData).map(async ([key, value]) =>
      translateSection(value, key, params, promptData)),
  );

  const combined: TranslationInputData = {};

  for (const { sectionKey, translatedSection } of results) {
    combined[sectionKey] = translatedSection;
  }

  logger.info('resume.translation.completed', { targetLanguage: params.targetLanguage });

  return combined;
};
