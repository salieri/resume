import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderTemplate } from '@faust/llm-utils';
import { Octokit } from 'octokit';

import { createScriptLogger } from '../shared/logger';

import { applyCodexFix, logDryRunPrompt } from './codex';
import { commitChanges, configureGitUser, createFixBranch, pushBranch, runCommand } from './git';
import { collectFailureContext, createPullRequest, postFixPrLink } from './github';
import { parseEvent } from './inputs';
import type { FailureContext, FixPrCliOptions } from './types';

const logger = createScriptLogger('fix-pr');

const PROMPT_TEMPLATE_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'prompt.md.hbs');

const buildCodexPrompt = async (context: FailureContext) => {
  return renderTemplate({ templatePath: PROMPT_TEMPLATE_PATH }, {
    JOB_NAME: context.jobName,
    FAILED_COMMAND: context.failedCommand,
    PR_NUMBER: String(context.prNumber),
    PR_TITLE: context.prTitle,
    PR_BODY: context.prBody,
    RUN_URL: context.workflowUrl ?? '',
    LOG_SNIPPET: context.logSnippet,
    HEAD_BRANCH: context.headBranch,
    BASE_BRANCH: context.baseBranch,
    ARTIFACT_PATH: context.artifactPath,
  });
};

const verifyWorkspace = async () => {
  const verifyCommands = ['build', 'lint:ci', 'test:ci'];

  for (const command of verifyCommands) {
    const result = await runCommand('pnpm', [command], { allowFailure: true });

    if (result.code !== 0) {
      throw new Error(`Verification command failed (pnpm ${command}): ${result.stderr || result.stdout}`);
    }
  }
};

const persistArtifacts = async (artifactPath: string, prompt: string, context: FailureContext) => {
  await fs.mkdir(artifactPath, { recursive: true });

  await Promise.all([
    fs.writeFile(path.join(artifactPath, 'prompt.md'), prompt, 'utf8'),
    fs.writeFile(path.join(artifactPath, 'context.json'), JSON.stringify(context, null, 2), 'utf8'),
  ]);
};

/**
 * Runs the fix PR workflow.
 */
export const runFixPr = async (opts: FixPrCliOptions) => {
  const event = await parseEvent(opts.githubEventPath);

  if (!opts.githubToken) {
    throw new Error('GitHub token is required to fetch workflow data.');
  }

  const octokit = new Octokit({ auth: opts.githubToken });
  const context = await collectFailureContext(octokit, event, opts);
  const prompt = await buildCodexPrompt(context);

  await persistArtifacts(opts.artifactPath, prompt, context);

  if (opts.dryRun) {
    logDryRunPrompt(prompt);

    return;
  }

  const branchName = `ci-fix/pr-${context.prNumber}-${context.jobName.toLowerCase()}-t${Math.round(Date.now() / 1000)}`;

  await createFixBranch(branchName);
  await configureGitUser();

  await applyCodexFix(prompt, opts.codexApiKey, opts.model, opts.githubActions);
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

  await postFixPrLink(octokit, context, prUrl);

  logger.info('fix-pr.completed', { prUrl });
};
