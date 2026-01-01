export const MAX_CONTEXT_CHARS = 65_536;

/**
 * Trims long context strings to keep within model limits.
 */
export const trimContext = (input: string, maxChars = MAX_CONTEXT_CHARS) => {
  if (input.length <= maxChars) {
    return input;
  }

  return `${input.slice(0, maxChars)}\n...truncated to ${maxChars} characters to respect context budget.`;
};

/**
 * Normalizes GitHub text content for prompt inclusion.
 */
export const formatGhText = (input?: string | null) => input?.trim().replaceAll(/\s+/g, ' ') ?? '';

/**
 * Parses a GitHub repository owner/repo from a remote URL.
 */
export const parseGitHubRepoFromUrl = (remoteUrl: string) => {
  const sshMatch = remoteUrl.match(/git@[^:]+:([^/]+)\/(.+?)(?:\.git)?$/);

  if (sshMatch) {
    return { owner: sshMatch[1], repo: sshMatch[2].replace(/\.git$/, '') };
  }

  try {
    const parsed = new URL(remoteUrl.replace(/^git\+/, ''));
    const parts = parsed.pathname.replace(/^\//, '').replace(/\.git$/, '').split('/').filter(Boolean);
    const owner = parts.at(-2);
    const repo = parts.at(-1);

    if (owner && repo) {
      return { owner, repo };
    }
  } catch {
    // fall through to error below
  }

  throw new Error(`Unable to parse GitHub repository from remote URL "${remoteUrl}".`);
};
