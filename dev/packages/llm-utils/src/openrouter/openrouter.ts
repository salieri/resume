import type { JSONSchema4, JSONSchema6 } from 'json-schema';

import { renderTemplate } from '../template/render';

import { OpenRouterResponse } from './types';
import type { OpenRouterPromptResult, RunOpenRouterPromptArgs } from './types';

export const defaultRequestOptions: NonNullable<RunOpenRouterPromptArgs['requestOptions']> = {
  retries: {
    strategy: 'backoff',
    backoff: {
      initialInterval: 500,
      maxInterval: 10_000,
      exponent: 1.5,
      maxElapsedTime: 600_000,
    },
    retryConnectionErrors: true,
  },
};

/**
 * Extract a summary string from the OpenRouter response payload.
 */
export const extractOpenRouterSummary = (response: unknown) => {
  const parsed: OpenRouterResponse = OpenRouterResponse.parse(response);
  const summaryText = parsed.choices[0]?.message.content.trim();

  if (!summaryText) {
    throw new Error('Received empty summary from model.');
  }

  return summaryText;
};

/**
 * Render a template and send it to OpenRouter chat completion.
 */
export const runOpenRouterPrompt = async (args: RunOpenRouterPromptArgs): Promise<OpenRouterPromptResult> => {
  const prompt = await renderTemplate(args.template, args.data);

  const result = await args.openRouter.chat.send({
    model: args.model,
    messages: [{ role: 'user', content: prompt }],
    ...args.modelParams,
  }, args.requestOptions || defaultRequestOptions,
  );

  return { prompt, result, summary: extractOpenRouterSummary(result) };
};

export const runOpenRouterPromptWithStructuredResponse = async (
  args: RunOpenRouterPromptArgs,
  responseSchema: JSONSchema6 | JSONSchema4,
): Promise<OpenRouterPromptResult> => {
  return runOpenRouterPrompt({
    ...args,
    modelParams: {
      ...args.modelParams,
      responseFormat: {
        type: 'json_schema',
        jsonSchema: {
          name: 'response-schema',
          strict: true,
          schema: responseSchema,
        },
      },
    },
  });
};
