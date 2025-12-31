import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createScriptLogger } from '../shared/logger';

import { getGitStatus } from './git';

const logger = createScriptLogger('fix-pr');

/**
 * Renders the Codex prompt template with replacements.
 */
export const renderPrompt = async (templatePath: string, replacements: Record<string, string>) => {
  const template = await fs.readFile(templatePath, 'utf8');

  return template.replaceAll(/\{\{(\w+)\}\}/g, (_match, key: string) => replacements[key] ?? '');
};

/**
 * Logs the prompt content for dry runs.
 */
export const logDryRunPrompt = (prompt: string) => {
  process.stdout.write('===== Codex Prompt (dry run) =====\n');
  process.stdout.write(`${prompt}\n`);
};

/**
 * Invokes the Codex CLI to apply a fix.
 */
export const invokeCodex = async (prompt: string, apiKey: string, model: string, isGitHubActions: boolean) => {
  if (!apiKey) {
    throw new Error('Codex API key is required for @openai/codex');
  }

  const runCmd = path.join('.', 'node_modules', '.bin', 'codex');
  const codexArgs = ['--config', 'preferred_auth_method=apikey', '--config', `model=${model}`, 'exec'];

  if (isGitHubActions) {
    codexArgs.push('--dangerously-bypass-approvals-and-sandbox');
  } else {
    codexArgs.push('--sandbox', 'workspace-write', '--ask-for-approval', 'untrusted');
  }

  codexArgs.push(prompt);

  await new Promise<void>((resolve, reject) => {
    const child = spawn('env', [`CODEX_API_KEY=${apiKey}`, runCmd, ...codexArgs], {
      stdio: 'inherit',
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`@openai/codex CLI failed with exit code ${code}`));

        return;
      }

      resolve();
    });
  });
};

/**
 * Applies Codex changes and ensures there are resulting diffs.
 */
export const applyCodexFix = async (
  prompt: string,
  apiKey: string,
  model: string,
  isGitHubActions: boolean,
) => {
  logger.info('fix-pr.codex.invoke', { model });
  await invokeCodex(prompt, apiKey, model, isGitHubActions);

  const status = await getGitStatus();

  if (!status) {
    throw new Error('Codex produced no changes.');
  }
};
