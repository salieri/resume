import type { Octokit } from 'octokit';

import { createScriptLogger } from '../shared/logger';

import type { WorkflowRunEvent } from './inputs';
import type { FailureContext, FixPrCliOptions } from './types';
import { extractFixPrTargetNumber, getRepoInfo, trimLinesFromEnd } from './utils';

const logger = createScriptLogger('fix-pr');

const COMMAND_BY_JOB: Record<string, string> = {
  build: 'pnpm build',
  lint: 'pnpm lint:ci',
  test: 'pnpm test:ci',
};

const LOG_TAIL_LINES = 400;
const MAX_FIX_PR_NESTING = 5;

const fetchFailedJob = async (octokit: Octokit, repo: { owner: string; repo: string }, runId: number) => {
  const jobs = await octokit.paginate(octokit.rest.actions.listJobsForWorkflowRun, {
    owner: repo.owner,
    repo: repo.repo,
    run_id: runId,
    per_page: 100,
  });

  const failed = jobs.find((job) => job.conclusion === 'failure');

  if (!failed) {
    throw new Error('No failed jobs found on the workflow run.');
  }

  return failed;
};

const downloadJobLog = async (octokit: Octokit, repo: { owner: string; repo: string }, jobId: number) => {
  const response = await octokit.rest.actions.downloadJobLogsForWorkflowRun({
    owner: repo.owner,
    repo: repo.repo,
    job_id: jobId,
  });

  if (typeof response.data === 'string') {
    return response.data;
  }

  return Buffer.from(response.data as ArrayBuffer).toString('utf8');
};

const assertPullRequestRun = (workflowRun: WorkflowRunEvent['workflow_run']) => {
  if (workflowRun.event !== 'pull_request') {
    throw new Error('Workflow run is not from a pull_request event; skipping fix.');
  }

  const prNumber = workflowRun.pull_requests?.[0]?.number;

  if (!prNumber) {
    throw new Error('Unable to determine pull request number from workflow_run payload.');
  }

  return prNumber;
};

const resolveRepoFromEvent = (event: WorkflowRunEvent, fallbackRepo?: string) => {
  const repoFullName = event.workflow_run.head_repository?.full_name
    ?? event.repository?.full_name
    ?? fallbackRepo;

  if (!repoFullName) {
    throw new Error('GitHub repository is required to resolve repo info.');
  }

  return getRepoInfo(repoFullName);
};

const ensurePushablePullRequest = (pr: Awaited<ReturnType<Octokit['rest']['pulls']['get']>>) => {
  if (pr.data.head.repo?.full_name !== pr.data.base.repo?.full_name) {
    throw new Error('Cannot push fixes to forked pull requests.');
  }
};

const getFixPrNestingDepth = async (
  octokit: Octokit,
  repo: { owner: string; repo: string },
  prNumber: number,
  prTitle: string,
) => {
  let depth = 0;
  let currentNumber = prNumber;
  let currentTitle = prTitle;
  const seen = new Set<number>([currentNumber]);

  while (true) {
    const targetNumber = extractFixPrTargetNumber(currentTitle);

    if (!targetNumber) {
      break;
    }

    depth += 1;

    if (depth >= MAX_FIX_PR_NESTING) {
      break;
    }

    if (seen.has(targetNumber)) {
      break;
    }

    seen.add(targetNumber);

    const response = await octokit.rest.pulls.get({
      owner: repo.owner,
      repo: repo.repo,
      pull_number: targetNumber,
    });

    currentNumber = response.data.number;
    currentTitle = response.data.title ?? '';
  }

  return depth;
};

const ensureFixPrNestingLimit = async (
  octokit: Octokit,
  repo: { owner: string; repo: string },
  pr: Awaited<ReturnType<Octokit['rest']['pulls']['get']>>,
) => {
  const depth = await getFixPrNestingDepth(octokit, repo, pr.data.number, pr.data.title ?? '');

  if (depth >= MAX_FIX_PR_NESTING) {
    throw new Error(`Fix PR nesting exceeds limit (${MAX_FIX_PR_NESTING}); skipping auto-fix.`);
  }
};

const collectJobContext = async (octokit: Octokit, repo: { owner: string; repo: string }, workflowRunId: number) => {
  const failedJob = await fetchFailedJob(octokit, repo, workflowRunId);
  const jobName = failedJob.name ?? 'unknown';
  const failedCommand = COMMAND_BY_JOB[jobName.toLowerCase()] ?? 'pnpm build';
  const jobLog = await downloadJobLog(octokit, repo, failedJob.id);
  const jobLogTail = trimLinesFromEnd(jobLog, LOG_TAIL_LINES);

  return { jobName, failedCommand, jobLogTail };
};

/**
 * Builds the failure context for Codex auto-fix.
 */
export const buildFailureContext = async (
  octokit: Octokit,
  event: WorkflowRunEvent,
  opts: Pick<FixPrCliOptions, 'githubRepository' | 'artifactPath'>,
): Promise<FailureContext> => {
  const workflowRun = event.workflow_run;

  if (workflowRun.conclusion !== 'failure') {
    throw new Error('Workflow concluded successfully; nothing to fix.');
  }

  const prNumber = assertPullRequestRun(workflowRun);
  const repo = resolveRepoFromEvent(event, opts.githubRepository);
  const pr = await octokit.rest.pulls.get({ owner: repo.owner, repo: repo.repo, pull_number: prNumber });

  ensurePushablePullRequest(pr);
  await ensureFixPrNestingLimit(octokit, repo, pr);

  const jobContext = await collectJobContext(octokit, repo, workflowRun.id);

  return {
    repo,
    prNumber,
    prTitle: pr.data.title ?? '',
    prBody: pr.data.body ?? '',
    headBranch: pr.data.head.ref,
    baseBranch: pr.data.base.ref,
    workflowUrl: workflowRun.html_url ?? '',
    jobName: jobContext.jobName,
    failedCommand: jobContext.failedCommand,
    logSnippet: jobContext.jobLogTail,
    artifactPath: opts.artifactPath,
  };
};

/**
 * Creates or reuses a pull request for the fix branch.
 */
export const createPullRequest = async (opts: {
  octokit: Octokit;
  repo: { owner: string; repo: string };
  head: string;
  base: string;
  prNumber: number;
  jobName: string;
  workflowUrl?: string;
}) => {
  const existing = await opts.octokit.paginate(opts.octokit.rest.pulls.list, {
    owner: opts.repo.owner,
    repo: opts.repo.repo,
    state: 'open',
    head: `${opts.repo.owner}:${opts.head}`,
    base: opts.base,
    per_page: 100,
  });

  if (existing.length > 0) {
    return existing[0].html_url ?? '';
  }

  const response = await opts.octokit.rest.pulls.create({
    owner: opts.repo.owner,
    repo: opts.repo.repo,
    head: opts.head,
    base: opts.base,
    title: `CI auto-fix for PR #${opts.prNumber} (${opts.jobName})`,
    body: [
      `Automated fix attempt for CI failure on PR #${opts.prNumber}.`,
      opts.workflowUrl ? `Source workflow: ${opts.workflowUrl}` : undefined,
    ]
      .filter(Boolean)
      .join('\n\n'),
    draft: false,
  });

  return response.data.html_url ?? '';
};

/**
 * Posts the fix PR link to the original pull request.
 */
export const postFixPrLink = async (
  octokit: Octokit,
  context: FailureContext,
  prUrl: string,
) => {
  await octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.prNumber,
    body: [
      `Auto-fix PR created for this failure: ${prUrl}`,
      context.workflowUrl ? `Source workflow: ${context.workflowUrl}` : undefined,
    ]
      .filter(Boolean)
      .join('\n'),
  });
};

/**
 * Collects job and workflow context for a fix run.
 */
export const collectFailureContext = async (
  octokit: Octokit,
  event: WorkflowRunEvent,
  opts: Pick<FixPrCliOptions, 'githubRepository' | 'artifactPath'>,
) => {
  const context = await buildFailureContext(octokit, event, opts);

  logger.info('fix-pr.context.built', { prNumber: context.prNumber, jobName: context.jobName });

  return context;
};
