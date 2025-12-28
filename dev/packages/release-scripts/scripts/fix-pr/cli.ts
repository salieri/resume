/* eslint-disable no-console,unicorn/no-process-exit */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { program } from 'commander';
import { Octokit } from 'octokit';
import { serializeError } from 'serialize-error';
import { z } from 'zod';

const WorkflowRunEvent = z.object({
  workflow_run: z.object({
    id: z.number(),
    html_url: z.string().optional(),
    conclusion: z.string().optional(),
    head_branch: z.string().optional(),
    head_sha: z.string().optional(),
    event: z.string().optional(),
    head_repository: z.object({ full_name: z.string().optional() }).optional(),
    pull_requests: z.array(z.object({ number: z.number() })).optional(),
  }),
  repository: z.object({ full_name: z.string().optional() }).optional(),
});

type WorkflowRunEvent = z.infer<typeof WorkflowRunEvent>;

interface FailureContext {
  repo: { owner: string; repo: string };
  prNumber: number;
  prTitle: string;
  prBody: string;
  headBranch: string;
  baseBranch: string;
  workflowUrl?: string;
  jobName: string;
  failedCommand: string;
  logSnippet: string;
  reproductionOutput: string;
}

interface FixPrCliOptions {
  dryRun: boolean;
  codexApiKey: string;
  githubToken: string;
  githubEventPath: string;
  githubRepository: string;
}

const COMMAND_BY_JOB: Record<string, string> = {
  build: 'pnpm build',
  lint: 'pnpm lint:ci',
  test: 'pnpm test:ci',
};

const LOG_TAIL_LINES = 400;
const MAX_FIX_PR_NESTING = 5;
const PROMPT_TEMPLATE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'prompt.md');

const execFileAsync = promisify(execFile);

const normalizeExecFailure = (error: unknown) => {
  const execError = error as { stdout?: string; stderr?: string; code?: number };

  return {
    code: typeof execError.code === 'number' ? execError.code : 1,
    stdout: execError.stdout ?? '',
    stderr: execError.stderr ?? '',
  };
};

const runCommand = async (command: string, opts?: { cwd?: string; allowFailure?: boolean; env?: NodeJS.ProcessEnv }) => {
  const execOptions = {
    shell: true,
    cwd: opts?.cwd ?? process.cwd(),
    env: { ...process.env, ...opts?.env },
    maxBuffer: 10 * 1024 * 1024,
    encoding: 'utf8' as const,
  };

  try {
    const { stdout, stderr } = await execFileAsync(command, execOptions);

    return { code: 0, stdout, stderr };
  } catch (error) {
    const result = normalizeExecFailure(error);

    if (!opts?.allowFailure) {
      throw Object.assign(new Error(result.stderr || result.stdout || String(error)), result);
    }

    return result;
  }
};

const runCommandArgs = async (
  file: string,
  args: string[],
  opts?: { cwd?: string; allowFailure?: boolean; env?: NodeJS.ProcessEnv },
) => {
  const execOptions = {
    cwd: opts?.cwd ?? process.cwd(),
    env: { ...process.env, ...opts?.env },
    maxBuffer: 10 * 1024 * 1024,
    encoding: 'utf8' as const,
  };

  try {
    console.info('runCommandArgs:', JSON.stringify({ file, execOptions, args }));

    const { stdout, stderr } = await execFileAsync(file, args, execOptions);

    return { code: 0, stdout, stderr };
  } catch (error) {
    const result = normalizeExecFailure(error);

    if (!opts?.allowFailure) {
      throw Object.assign(new Error(result.stderr || result.stdout || String(error)), result);
    }

    return result;
  }
};

const parseEvent = async (eventPath: string): Promise<WorkflowRunEvent> => {
  if (!eventPath) {
    throw new Error('GitHub event path is required.');
  }

  const content = await fs.readFile(eventPath, 'utf8');

  let raw: unknown;

  try {
    raw = JSON.parse(content);
  } catch (error) {
    throw new Error(`Unable to parse workflow event JSON: ${String(error)}`);
  }

  const parsed = WorkflowRunEvent.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`Invalid workflow_run payload: ${parsed.error.message}`);
  }

  return parsed.data;
};

const trimLinesFromEnd = (text: string, maxLines: number) => {
  const lines = text.split('\n');

  if (lines.length <= maxLines) {
    return text;
  }

  return lines.slice(-maxLines).join('\n');
};

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

const renderPrompt = async (templatePath: string, replacements: Record<string, string>) => {
  const template = await fs.readFile(templatePath, 'utf8');

  return template.replaceAll(/\{\{(\w+)\}\}/g, (_match, key: string) => replacements[key] ?? '');
};

const logDryRunPrompt = (prompt: string) => {
  console.info('===== Codex Prompt (dry run) =====');
  console.info(prompt);
};

const invokeCodex = async (prompt: string, apiKey: string) => {
  if (!apiKey) {
    throw new Error('Codex API key is required for @openai/codex');
  }

  const runCmd = path.join('.', 'node_modules', '.bin', 'codex');
  const codexArgs = ['exec', '--config', 'preferred_auth_method=apikey'];
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

  if (isGitHubActions) {
    codexArgs.push('--dangerously-bypass-approvals-and-sandbox');
  } else {
    codexArgs.push('--sandbox', 'workspace-write', '--ask-for-approval', 'untrusted');
  }

  codexArgs.push(prompt);

  const { code, stdout, stderr } = await runCommandArgs(
    runCmd,
    codexArgs,
    {
      env: { ...process.env, OPENAI_API_KEY: apiKey },
      allowFailure: true,
    },
  );

  console.info('codex stdout', stdout);

  if (code !== 0) {
    console.error('codex stderr', code, stderr);
    throw new Error(`@openai/codex CLI failed with exit code ${code}: ${stderr || stdout}`);
  }

  return stdout + stderr;
};

const getRepoInfo = (fullName: string) => {
  const [owner, repo] = fullName.split('/');

  if (!owner || !repo) {
    throw new Error(`Invalid repository full name "${fullName}"`);
  }

  return { owner, repo };
};

const getGitStatus = async () => {
  const { stdout } = await runCommand('git status --porcelain', { allowFailure: true });

  return stdout.trim();
};

const configureGitUser = async () => {
  await runCommand('git config user.name "ci-fix-bot"', { allowFailure: true });
  await runCommand('git config user.email "ci-fix-bot@users.noreply.github.com"', { allowFailure: true });
};

const commitChanges = async (message: string) => {
  await runCommand('git add -A');

  const commitResult = await runCommand(`git commit -m "${message}"`, { allowFailure: true });

  if (commitResult.code !== 0) {
    throw new Error(`Unable to commit changes: ${commitResult.stderr || commitResult.stdout}`);
  }
};

interface CreatePullRequestOptions {
  octokit: Octokit;
  repo: { owner: string; repo: string };
  head: string;
  base: string;
  prNumber: number;
  jobName: string;
  workflowUrl?: string;
}

const createPullRequest = async (opts: CreatePullRequestOptions) => {
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

const extractFixPrTargetNumber = (title: string) => {
  const match = title.match(/^CI auto-fix for PR #(\d+)\b/i);

  if (!match) {
    return null;
  }

  return Number(match[1]);
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

const getReproductionOutput = async (command: string) => {
  const reproductionResult = await runCommand(command, { allowFailure: true });

  return trimLinesFromEnd(
    [reproductionResult.stdout, reproductionResult.stderr].filter(Boolean).join('\n'),
    LOG_TAIL_LINES,
  );
};

const collectJobContext = async (octokit: Octokit, repo: { owner: string; repo: string }, workflowRunId: number) => {
  const failedJob = await fetchFailedJob(octokit, repo, workflowRunId);
  const jobName = failedJob.name ?? 'unknown';
  const failedCommand = COMMAND_BY_JOB[jobName.toLowerCase()] ?? 'pnpm build';
  const jobLog = await downloadJobLog(octokit, repo, failedJob.id);
  const jobLogTail = trimLinesFromEnd(jobLog, LOG_TAIL_LINES);
  const reproductionOutput = await getReproductionOutput(failedCommand);

  return { jobName, failedCommand, jobLogTail, reproductionOutput };
};

const buildFailureContext = async (
  octokit: Octokit,
  event: WorkflowRunEvent,
  opts: Pick<FixPrCliOptions, 'githubRepository'>,
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
    reproductionOutput: jobContext.reproductionOutput,
  };
};

const createFixBranch = async (branchName: string) => {
  const result = await runCommand(`git checkout -b "${branchName}"`, { allowFailure: true });

  if (result.code !== 0) {
    throw new Error(`Failed to create fix branch ${branchName}: ${result.stderr || result.stdout}`);
  }
};

const buildCodexPrompt = async (context: FailureContext) => {
  return renderPrompt(PROMPT_TEMPLATE_PATH, {
    JOB_NAME: context.jobName,
    FAILED_COMMAND: context.failedCommand,
    PR_NUMBER: String(context.prNumber),
    PR_TITLE: context.prTitle,
    PR_BODY: context.prBody,
    RUN_URL: context.workflowUrl ?? '',
    LOG_SNIPPET: context.logSnippet,
    REPRO_OUTPUT: context.reproductionOutput,
    HEAD_BRANCH: context.headBranch,
    BASE_BRANCH: context.baseBranch,
  });
};

const applyCodexFix = async (prompt: string, apiKey: string) => {
  await invokeCodex(prompt, apiKey);

  const status = await getGitStatus();

  if (!status) {
    throw new Error('Codex produced no changes.');
  }
};

const verifyWorkspace = async () => {
  const verifyCommands = ['pnpm build', 'pnpm lint:ci', 'pnpm test:ci'];

  for (const command of verifyCommands) {
    const result = await runCommand(command, { allowFailure: true });

    if (result.code !== 0) {
      throw new Error(`Verification command failed (${command}): ${result.stderr || result.stdout}`);
    }
  }
};

const pushBranch = async (branchName: string) => {
  const pushResult = await runCommand(`git push origin "${branchName}"`, { allowFailure: false });

  if (pushResult.code !== 0) {
    throw new Error(`Failed to push branch ${branchName}: ${pushResult.stderr || pushResult.stdout}`);
  }
};

const main = async (opts: FixPrCliOptions) => {
  const event = await parseEvent(opts.githubEventPath);

  if (!opts.githubToken) {
    throw new Error('GitHub token is required to fetch workflow data.');
  }

  const octokit = new Octokit({ auth: opts.githubToken });
  const context = await buildFailureContext(octokit, event, opts);
  const prompt = await buildCodexPrompt(context);

  console.info('Failure context:', JSON.stringify(context));

  if (opts.dryRun) {
    logDryRunPrompt(prompt);

    return;
  }

  const branchName = `ci-fix/pr-${context.prNumber}-${context.jobName.toLowerCase()}`;

  await createFixBranch(branchName);
  await configureGitUser();

  await applyCodexFix(prompt, opts.codexApiKey);
  await verifyWorkspace();

  await commitChanges(`chore: auto-fix ${context.jobName} failure for PR #${context.prNumber}`);
  await pushBranch(branchName);

  const prUrl = await createPullRequest({
    octokit,
    repo: context.repo,
    head: branchName,
    base: context.headBranch,
    prNumber: context.prNumber,
    jobName: context.jobName,
    workflowUrl: context.workflowUrl,
  });

  console.info('✅ Auto-fix PR created:', prUrl);
};

try {
  program
    .name('fix-pr')
    .description('Attempt to auto-fix CI failures for pull requests')
    .option(
      '--codex-api-key <key>',
      'Codex API Key (defaults to CODEX_API_KEY or OPENAI_API_KEY env var)',
      process.env.CODEX_API_KEY || process.env.OPENAI_API_KEY || '',
    )
    .option(
      '--github-token <token>',
      'GitHub token (defaults to GITHUB_TOKEN or GH_TOKEN env var)',
      process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '',
    )
    .option(
      '--github-event-path <path>',
      'GitHub event path (defaults to GITHUB_EVENT_PATH env var)',
      process.env.GITHUB_EVENT_PATH || '',
    )
    .option(
      '--github-repository <repo>',
      'GitHub repository (defaults to GITHUB_REPOSITORY env var)',
      process.env.GITHUB_REPOSITORY || '',
    )
    .option('--dry-run', 'Print the Codex prompt without applying changes', false)
    .action(async (opts: FixPrCliOptions) => {
      await main(opts);
    });

  await program.parseAsync();
} catch (error) {
  console.error('❌ Fix PR automation failed:', serializeError(error));
  process.exit(1);
}
