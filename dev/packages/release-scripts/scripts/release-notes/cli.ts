/* eslint-disable no-console,unicorn/no-process-exit */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { OpenRouter } from '@openrouter/sdk';
import { Option, program } from 'commander';
import { Octokit } from 'octokit';
import { serializeError } from 'serialize-error';

import { runWithOctokitRateLimit, summarizeRelease } from './summarize-release';

interface ReleaseNotesCliArgs {
  currentTag: string;
  previousTag?: string;
  promptTemplate: string;
  model: string;
  apiKey: string;
  output?: string;
  dryRun: boolean;
}

const MAX_CONTEXT_CHARS = 65_536;

const DEFAULT_PROMPT_TEMPLATE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'prompt.md',
);

const execGit = async (args: string[]) => {
  const { stdout } = await promisify(execFile)('git', args, { encoding: 'utf8' });

  return stdout.trim();
};

const renderReleaseNotes = (summary: string, opts: ReleaseNotesCliArgs, range: string) => {
  return [`# Release ${opts.currentTag}`, summary.trim(), `> Range: \`${range}\``].join('\n\n');
};

const buildPrompt = async (templatePath: string, replacements: Record<string, string>) => {
  const template = await fs.readFile(templatePath, 'utf8');

  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.entries(replacements).reduce(
    (accum, [key, value]) => accum.replaceAll(`{{${key}}}`, value),
    template,
  );
};

const trimContext = (input: string) => {
  if (input.length <= MAX_CONTEXT_CHARS) {
    return input;
  }

  return `${input.slice(0, MAX_CONTEXT_CHARS)}\n...truncated to ${MAX_CONTEXT_CHARS} characters to respect context budget.`;
};

const buildCodeChangesContext = async (range: string, previousTag?: string) => {
  // If we don't have a previous tag, show the tagged commit changes itself.
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

const getReleaseSummary = async (opts: ReleaseNotesCliArgs) => summarizeRelease({
  currentTag: opts.currentTag,
  previousTag: opts.previousTag?.trim() || undefined,
});

const formatGhText = (input?: string | null) => input?.trim().replaceAll(/\s+/g, ' ') ?? '';

const parseGitHubRepoFromUrl = (remoteUrl: string) => {
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
    // fallthrough to error below
  }

  throw new Error(`Unable to parse GitHub repository from remote URL "${remoteUrl}".`);
};

const getRepoInfo = async () => {
  const envRepo = process.env.GITHUB_REPOSITORY;

  if (envRepo) {
    const [owner, repo] = envRepo.split('/');

    if (owner && repo) {
      return { owner, repo };
    }
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

const formatReviews = (reviews: { body?: string | null; user?: { login?: string | null } | null; state?: string | null }[]) => {
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

const buildPrConversationsContext = async (pullRequestNumbers: number[]) => {
  if (pullRequestNumbers.length === 0) {
    return 'No pull requests detected in commit range.';
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (!token) {
    return 'GitHub token (GITHUB_TOKEN or GH_TOKEN) not available; skipping PR conversations.';
  }

  let repoInfo: { owner: string; repo: string };

  try {
    repoInfo = await getRepoInfo();
  } catch (error) {
    return `Unable to determine GitHub repository: ${String(error)}`;
  }

  const octokit = new Octokit({ auth: token });

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
    buildPrConversationsContext(summary.pullRequestNumbers),
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
  }, { retries: {
    strategy: 'backoff',
    backoff: {
      initialInterval: 500,
      maxInterval: 10_000,
      exponent: 1.5,
      maxElapsedTime: 600_000,
    },
    retryConnectionErrors: true,
  } });

  const summaryText = (llmResult.choices[0]?.message?.content as string)?.trim();

  if (!summaryText) {
    throw new Error('Received empty summary from model.');
  }

  return summaryText;
};

const outputSummary = async (content: string, outputPath?: string) => {
  if (!outputPath) {
    console.info(content);

    return;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  console.info('✅ Release summary written to', outputPath);
};

try {
  program
    .name('release-notes')
    .description('Summarize changes between two release tags')
    .requiredOption('--current-tag <tag>', 'Current release tag to summarize')
    .addOption(new Option('--previous-tag <tag>', 'Previous release tag to compare against'))
    .option('--prompt-template <file>', 'Prompt template file', DEFAULT_PROMPT_TEMPLATE)
    .option('--model <model>', 'Model to use for summarization', 'openai/gpt-5.2')
    .option('--api-key <key>', 'OpenRouter API Key', process.env.OPENROUTER_API_KEY || '')
    .option('--output <file>', 'Optional output file')
    .option('--dry-run', 'Print the prompt instead of calling the LLM', false)
    .action(async (opts: ReleaseNotesCliArgs) => {
      const releaseSummary = await getReleaseSummary(opts);
      const prompt = await buildReleasePrompt(opts, releaseSummary);

      if (opts.dryRun) {
        console.info('===== LLM Prompt (dry run) =====');
        console.info(prompt);

        return;
      }

      const apiKey = validateApiKey(opts.apiKey);
      const summaryText = await summarizeWithModel(prompt, opts.model, apiKey);
      const content = renderReleaseNotes(summaryText, opts, releaseSummary.range);
      await outputSummary(content, opts.output);
    });

  await program.parseAsync();
} catch (error) {
  console.error('❌ Error generating release notes:', serializeError(error));
  process.exit(1);
}
