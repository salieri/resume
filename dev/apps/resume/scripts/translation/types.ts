import { OpenRouter } from '@openrouter/sdk';
import { z } from 'zod';

import type { LanguageCode } from '~/i18n/i18n';
import { languageCodes } from '~/i18n/i18n';

export const TranslationInputData = z.record(z.string(), z.json())
  .describe('Translation input JSON object.');
export type TranslationInputData = z.infer<typeof TranslationInputData>;

const TranslationLanguageCode = z.string()
  .refine((value) => languageCodes.includes(value as LanguageCode), 'Unsupported language code.')
  .describe('Supported language code for translation.');

type TranslationLanguageCode = z.infer<typeof TranslationLanguageCode>;

export const ModelParams = z.object({
  temperature: z.number().min(0).max(1).describe('Sampling temperature.'),
  frequencyPenalty: z.number().min(-2).max(2).describe('Frequency penalty.'),
  presencePenalty: z.number().min(-2).max(2).describe('Presence penalty.'),
  model: z.string().min(1).describe('OpenRouter model identifier.'),
})
  .describe('OpenRouter model parameters.');

export const TranslateParams = z.object({
  sourceLanguage: TranslationLanguageCode,
  targetLanguage: TranslationLanguageCode,
  promptTemplate: z.string().min(1).describe('Prompt template for translation.'),
  inputData: TranslationInputData,
  openRouter: z.instanceof(OpenRouter).describe('OpenRouter client instance.'),
  modelParams: ModelParams,
})
  .refine((data) => data.sourceLanguage !== data.targetLanguage, 'Source and target languages must differ.')
  .describe('Parameters for translation runs.');

export type TranslateParams = z.infer<typeof TranslateParams>;
