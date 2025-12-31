import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { OpenRouter } from '@openrouter/sdk';
import { Octokit } from 'octokit';

import { createScriptLogger } from '../shared/logger';

import { runWithOctokitRateLimit, summarizeRelease } from './summarize-release';
import { extractOpenRouterSummary, formatGhText, parseGitHubRepoFromUrl, trimContext } from './utils';

export interface ReleaseNotesCliArgs {
  currentTag: string;
  previousTag?: string;
  promptTemplate: string;
  model: string;
  apiKey: string;
  output?: string;
  dryRun: boolean;
  githubToken: string;
  githubRepository: string;
}

const logger = createScriptLogger('release-notes');

const execGit = async (args: string[]) => {
  const { stdout } = await promisify(execFile)('git', args, { encoding: 'utf8' });

  return stdout.trim();
};

const buildPrompt = async (templatePath: string, replacements: Record<string, string>) => {
  let template = await fs.readFile(templatePath, 'utf8');

  for (const [key, value] of Object.entries(replacements)) {
    template = template.replaceAll(`{{${key}}}`, value);
  }

  return template;
};

const renderReleaseNotes = (summary: string, currentTag: string, range: string) => {
  return [`# Release ${currentTag}`, summary.trim(), `> Range: \`${range}\``].join('\n\n');
};

const buildCodeChangesContext = async (range: string, previousTag?: string) => {
  const diffArgs = previousTag
    ? ['diff', '--stat', '--unified=5', range]
    : ['show', '--stat', '--patch', '--unified=5', range];

  try {
    const diff = await execGit(diffArgs);

    return trimContext(diff.length > 0 ? diff : 'No code changes detected for this range.');
  } catch (error) {
    return `Unable to read code changes (git error): ${String(error)}`;
  }
};

const validateApiKey = (rawKey: string) => {
  const apiKey = rawKey.trim();

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required to summarize release notes.');
  }

  return apiKey;
};

const getRepoInfo = async (githubRepository: string) => {
  const envRepo = githubRepository.trim();

  if (envRepo) {
    const parts = envRepo.split('/');

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(`Invalid githubRepository value "${envRepo}". Expected format "owner/repo".`);
    }

    const [owner, repo] = parts;

    return { owner, repo };
  }

  const remote = await execGit(['remote', 'get-url', 'origin']);

  return parseGitHubRepoFromUrl(remote);
};

const formatComments = (comments: { body?: string | null; user?: { login?: string | null } | null }[]) => {
  return comments.length > 0
    ? comments
        .map((comment) => `- ${comment.user?.login ?? 'unknown'}: ${formatGhText(comment.body) || '(no content)'}`)
        .join('\n')
    : 'No PR comments.';
};

const formatReviews = (
  reviews: { body?: string | null; user?: { login?: string | null } | null; state?: string | null }[],
) => {
  return reviews.length > 0
    ? reviews
        .map((review) => `- ${review.user?.login ?? 'unknown'} (${review.state ?? 'REVIEW'}): ${formatGhText(review.body) || '(no notes)'}`)
        .join('\n')
    : 'No review summaries.';
};

const fetchPrConversation = async (octokit: Octokit, repo: { owner: string; repo: string }, prNumber: number) => {
  const prPromise = runWithOctokitRateLimit(() => octokit.rest.pulls.get({
    owner: repo.owner,
    repo: repo.repo,
    pull_number: prNumber,
  }));

  const reviewsPromise = runWithOctokitRateLimit(() => octokit.paginate(
    octokit.rest.pulls.listReviews,
    { owner: repo.owner, repo: repo.repo, pull_number: prNumber, per_page: 100 },
  ));

  const commentsPromise = runWithOctokitRateLimit(() => octokit.paginate(
    octokit.rest.issues.listComments,
    { owner: repo.owner, repo: repo.repo, issue_number: prNumber, per_page: 100 },
  ));

  const [pr, reviews, comments] = await Promise.all([prPromise, reviewsPromise, commentsPromise]);

  return {
    number: pr.data.number,
    title: pr.data.title ?? undefined,
    body: pr.data.body ?? undefined,
    reviews,
    comments,
  };
};

const buildPrConversationsContext = async (
  pullRequestNumbers: number[],
  githubToken: string,
  githubRepository: string,
) => {
  if (pullRequestNumbers.length === 0) {
    return 'No pull requests detected in commit range.';
  }

  if (!githubToken) {
    return 'GitHub token (GITHUB_TOKEN or GH_TOKEN) not available; skipping PR conversations.';
  }

  let repoInfo: { owner: string; repo: string };

  try {
    repoInfo = await getRepoInfo(githubRepository);
  } catch (error) {
    return `Unable to determine GitHub repository: ${String(error)}`;
  }

  const octokit = new Octokit({ auth: githubToken });

  const conversations = await Promise.all(
    pullRequestNumbers.map(async (prNumber) => {
      try {
        const pr = await fetchPrConversation(octokit, repoInfo, prNumber);

        const commentText = formatComments(pr.comments);
        const reviewText = formatReviews(pr.reviews);

        return [
          `### PR #${pr.number}: ${pr.title ?? 'No title'}`,
          `#### Description\n ${pr.body ? formatGhText(pr.body) : 'No description provided.'}\n`,
          `#### Reviews\n${reviewText}\n`,
          `#### Comments\n${commentText}`,
        ].join('\n');
      } catch (error) {
        return `### PR #${prNumber}\nUnable to fetch conversation (${String(error)})`;
      }
    }),
  );

  const combined = conversations.join('\n\n').trim();

  return trimContext(combined.length > 0 ? combined : 'No PR conversations available.');
};

const buildReleasePrompt = async (opts: ReleaseNotesCliArgs, summary: Awaited<ReturnType<typeof summarizeRelease>>) => {
  const [codeChanges, prConversations] = await Promise.all([
    buildCodeChangesContext(summary.range, summary.previousTag),
    buildPrConversationsContext(summary.pullRequestNumbers, opts.githubToken, opts.githubRepository),
  ]);

  const commitsBlock = summary.commits.length === 0
    ? 'No commits found in range.'
    : summary.commits.map(({ hash, subject }) => `${hash} ${subject}`).join('\n');

  return buildPrompt(opts.promptTemplate, {
    CURRENT_TAG: summary.currentTag,
    PREVIOUS_TAG: summary.previousTag ?? 'None (first release)',
    RANGE: summary.range,
    CURRENT_TAG_NOTES: summary.tagNotes.current ?? 'No tag annotation',
    PREVIOUS_TAG_NOTES: summary.tagNotes.previous ?? 'No tag annotation',
    COMMITS: commitsBlock,
    CODE_CHANGES: codeChanges,
    PR_CONVERSATIONS: prConversations,
  });
};

const summarizeWithModel = async (prompt: string, model: string, apiKey: string) => {
  const openRouter = new OpenRouter({ apiKey });

  const llmResult = await openRouter.chat.send({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  }, {
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
  });

  return extractOpenRouterSummary(llmResult);
};

const outputSummary = async (content: string, outputPath: string | undefined, prompt: string) => {
  logger.info('release-notes.output', { outputPath, content, prompt });

  if (!outputPath) {
    process.stdout.write(`${content}\n`);

    return;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
};

const outputPrompt = (prompt: string) => {
  process.stdout.write('===== LLM Prompt (dry run) =====\n');
  process.stdout.write(`${prompt}\n`);
};

/**
 * Runs the release notes generation workflow.
 */
export const runReleaseNotes = async (opts: ReleaseNotesCliArgs) => {
  const releaseSummary = await summarizeRelease({
    currentTag: opts.currentTag,
    previousTag: opts.previousTag?.trim() || undefined,
  });

  const prompt = await buildReleasePrompt(opts, releaseSummary);

  if (opts.dryRun) {
    outputPrompt(prompt);

    return;
  }

  const apiKey = validateApiKey(opts.apiKey);
  const summaryText = await summarizeWithModel(prompt, opts.model, apiKey);
  const content = renderReleaseNotes(summaryText, opts.currentTag, releaseSummary.range);
  await outputSummary(content, opts.output, prompt);
};
