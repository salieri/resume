import { OpenRouter } from '@openrouter/sdk';
import { z } from 'zod';

import { languageCodes } from '@/i18n/i18n';

export const ModelParams = z.object({
  temperature: z.number().min(0).max(1),
  frequencyPenalty: z.number().min(-2).max(2),
  presencePenalty: z.number().min(-2).max(2),
  model: z.string().min(1),
});

export const TranslateParams = z.object({
  sourceLanguage: z.literal(languageCodes),
  targetLanguage: z.literal(languageCodes),
  promptTemplate: z.string().min(1),
  inputData: z.json(),
  openRouter: z.instanceof(OpenRouter),
  modelParams: ModelParams,
})
  .refine((data) => data.sourceLanguage !== data.targetLanguage);

export type TranslateParams = z.infer<typeof TranslateParams>;
