/**
 * Trims a multi-line string to a maximum number of lines from the end.
 */
export const trimLinesFromEnd = (text: string, maxLines: number) => {
  const lines = text.split('\n');

  if (lines.length <= maxLines) {
    return text;
  }

  return lines.slice(-maxLines).join('\n');
};

/**
 * Extracts a target PR number from an auto-fix PR title.
 */
export const extractFixPrTargetNumber = (title: string) => {
  const match = title.match(/^CI auto-fix for PR #(\d+)\b/i);

  if (!match) {
    return null;
  }

  return Number(match[1]);
};

/**
 * Parses owner and repo from a full repo name string.
 */
export const getRepoInfo = (fullName: string) => {
  const [owner, repo] = fullName.split('/');

  if (!owner || !repo) {
    throw new Error(`Invalid repository full name "${fullName}"`);
  }

  return { owner, repo };
};
