import { describe, expect, it } from 'vitest';

import { extractFixPrTargetNumber, getRepoInfo, trimLinesFromEnd } from './utils';

const createLine = (index: number) => `line-${index}`;
const createLines = (count: number) => Array.from({ length: count }, (_, index) => createLine(index + 1));
const joinLines = (lines: string[]) => lines.join('\n');

describe('trimLinesFromEnd', () => {
  it('returns original text when within limit', () => {
    const lines = createLines(2);
    const text = joinLines(lines);

    expect(trimLinesFromEnd(text, 5)).toBe(text);
  });

  it('keeps only trailing lines when above limit', () => {
    const lines = createLines(6);
    const text = joinLines(lines);
    const result = trimLinesFromEnd(text, 3);

    expect(result).toBe(joinLines(lines.slice(-3)));
  });
});

describe('extractFixPrTargetNumber', () => {
  it('extracts PR number from title', () => {
    const prNumber = 123;
    const title = `CI auto-fix for PR #${prNumber} (lint)`;

    expect(extractFixPrTargetNumber(title)).toBe(prNumber);
  });

  it('returns null for non-matching title', () => {
    const title = 'Regular PR title';

    expect(extractFixPrTargetNumber(title)).toBeNull();
  });
});

describe('getRepoInfo', () => {
  it('parses valid full names', () => {
    const owner = 'acme';
    const repo = 'widgets';
    const fullName = `${owner}/${repo}`;

    expect(getRepoInfo(fullName)).toEqual({ owner, repo });
  });

  it('throws on invalid full names', () => {
    const fullName = 'invalid';

    expect(() => getRepoInfo(fullName)).toThrow();
  });
});
