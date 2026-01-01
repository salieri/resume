import type { OpenRouter } from '@openrouter/sdk';
import { describe, expect, it, vi } from 'vitest';

import { defaultRequestOptions, extractOpenRouterSummary, runOpenRouterPrompt } from './openrouter';

const createSummaryText = () => 'Summary text';

const buildResponse = (summary: string) => ({
  choices: [{ message: { content: summary } }],
});

describe('extractOpenRouterSummary', () => {
  it('extracts summary content', () => {
    const summary = createSummaryText();
    const response = buildResponse(summary);

    expect(extractOpenRouterSummary(response)).toBe(summary);
  });

  it('throws on empty response', () => {
    const response = buildResponse('   ');

    expect(() => extractOpenRouterSummary(response)).toThrow();
  });
});

describe('runOpenRouterPrompt', () => {
  it('renders and sends a prompt to OpenRouter', async () => {
    const response = buildResponse(createSummaryText());
    const send = vi.fn().mockResolvedValue(response);

    const openRouter = {
      chat: {
        send,
      },
    } as unknown as OpenRouter;

    const result = await runOpenRouterPrompt({
      openRouter,
      template: { template: 'Hello {{NAME}}' },
      data: { NAME: 'Grace Hopper' },
      model: 'openai/gpt-4.1-mini',
      modelParams: { temperature: 0.3 },
    });

    expect(result.prompt).toBe('Hello Grace Hopper');
    expect(result.result).toEqual(response);

    expect(send).toHaveBeenCalledWith({
      model: 'openai/gpt-4.1-mini',
      messages: [{ role: 'user', content: 'Hello Grace Hopper' }],
      temperature: 0.3,
    }, defaultRequestOptions);
  });
});
