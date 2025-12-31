import { describe, expect, it } from 'vitest';

import { extractOpenRouterSummary, formatGhText, parseGitHubRepoFromUrl, trimContext } from './utils';

const createString = (length: number, char = 'a') => char.repeat(length);
const SUMMARY_TEXT = 'Summary text';
const WHITESPACE_SAMPLE = '  hello   world \n';
const createRepoParts = () => ({ owner: 'acme', repo: 'widgets' });
const createHttpsUrl = (owner: string, repo: string) => `https://github.com/${owner}/${repo}.git`;
const createSshUrl = (owner: string, repo: string) => `git@github.com:${owner}/${repo}.git`;

describe('trimContext', () => {
  it('returns input when within limit', () => {
    const input = createString(5);
    const output = trimContext(input, 10);

    expect(output).toBe(input);
  });

  it('truncates when above limit', () => {
    const input = createString(20);
    const output = trimContext(input, 10);

    expect(output).toContain('...truncated to 10 characters');
    expect(output.startsWith(input.slice(0, 10))).toBe(true);
  });
});

describe('formatGhText', () => {
  it('normalizes whitespace and trims', () => {
    expect(formatGhText(WHITESPACE_SAMPLE)).toBe('hello world');
  });
});

describe('parseGitHubRepoFromUrl', () => {
  it('parses SSH URLs', () => {
    const { owner, repo } = createRepoParts();
    const url = createSshUrl(owner, repo);

    expect(parseGitHubRepoFromUrl(url)).toEqual({ owner, repo });
  });

  it('parses HTTPS URLs', () => {
    const { owner, repo } = createRepoParts();
    const url = createHttpsUrl(owner, repo);

    expect(parseGitHubRepoFromUrl(url)).toEqual({ owner, repo });
  });
});

describe('extractOpenRouterSummary', () => {
  it('extracts summary content', () => {
    const response = {
      choices: [{ message: { content: SUMMARY_TEXT } }],
    };

    expect(extractOpenRouterSummary(response)).toBe(SUMMARY_TEXT);
  });

  it('throws on empty response', () => {
    const response = {
      choices: [{ message: { content: '   ' } }],
    };

    expect(() => extractOpenRouterSummary(response)).toThrow();
  });
});
