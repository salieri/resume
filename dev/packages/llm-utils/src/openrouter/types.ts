import type { OpenRouter } from '@openrouter/sdk';
import { z } from 'zod';

import type { PromptTemplateSource } from '../template/types';

type OpenRouterChatRequest = Parameters<OpenRouter['chat']['send']>[0];
type OpenRouterChatOptions = Parameters<OpenRouter['chat']['send']>[1];
export type OpenRouterChatResult = Awaited<ReturnType<OpenRouter['chat']['send']>>;

export interface RunOpenRouterPromptArgs {
  openRouter: OpenRouter;
  template: PromptTemplateSource;
  data: Record<string, unknown>;
  model: string;
  modelParams?: Omit<OpenRouterChatRequest, 'model' | 'messages'>;
  requestOptions?: OpenRouterChatOptions;
}

export interface OpenRouterPromptResult {
  prompt: string;
  result: OpenRouterChatResult;
  summary: string;
}

const OpenRouterMessage = z.object({
  content: z.string().min(1).describe('LLM response content'),
}).describe('OpenRouter message');

const OpenRouterChoice = z.object({
  message: OpenRouterMessage.describe('OpenRouter choice message'),
}).describe('OpenRouter choice');

export const OpenRouterResponse = z.object({
  choices: z.array(OpenRouterChoice).min(1).describe('OpenRouter choices'),
}).describe('OpenRouter chat response');

export type OpenRouterResponse = z.infer<typeof OpenRouterResponse>;
