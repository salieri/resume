import { findWorkspaceRoot, runCodexExec } from '@faust/llm-utils';

import { createScriptLogger } from '../shared/logger';

import { getGitStatus } from './git';

const logger = createScriptLogger('fix-pr');

/**
 * Logs the prompt content for dry runs.
 */
export const logDryRunPrompt = (prompt: string) => {
  process.stdout.write('===== Codex Prompt (dry run) =====\n');
  process.stdout.write(`${prompt}\n`);
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

  await runCodexExec(prompt, { apiKey, model, unsafeMode: isGitHubActions, cwd: await findWorkspaceRoot() });

  const status = await getGitStatus();

  if (!status) {
    throw new Error('Codex produced no changes.');
  }
};
