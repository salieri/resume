import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { createScriptLogger } from '../shared/logger';

const logger = createScriptLogger('fix-pr');

const execFileAsync = promisify(execFile);

const normalizeExecFailure = (error: unknown) => {
  const execError = error as { stdout?: string; stderr?: string; code?: number };

  return {
    code: typeof execError.code === 'number' ? execError.code : 1,
    stdout: execError.stdout ?? '',
    stderr: execError.stderr ?? '',
  };
};

/**
 * Runs a command and captures output.
 */
export const runCommand = async (
  cmd: string,
  args: string[],
  opts?: { cwd?: string; allowFailure?: boolean; env?: NodeJS.ProcessEnv },
) => {
  const execOptions = {
    cwd: opts?.cwd ?? process.cwd(),
    env: opts?.env,
    maxBuffer: 10 * 1024 * 1024,
    encoding: 'utf8' as const,
  };

  try {
    logger.info('fix-pr.runCommand.exec', { cmd, args });

    const { stdout, stderr } = await execFileAsync(cmd, args, execOptions);

    return { code: 0, stdout, stderr };
  } catch (error) {
    const result = normalizeExecFailure(error);

    logger.error('fix-pr.runCommand.error', { cmd, args, result });

    if (!opts?.allowFailure) {
      throw Object.assign(new Error(result.stderr || result.stdout || String(error)), result);
    }

    return result;
  }
};

/**
 * Reads the current git status.
 */
export const getGitStatus = async () => {
  const { stdout } = await runCommand('git', ['status', '--porcelain'], { allowFailure: true });

  return stdout.trim();
};

/**
 * Configures the git user for CI commits.
 */
export const configureGitUser = async () => {
  await runCommand('git', ['config', 'user.name', 'ci-fix-bot'], { allowFailure: true });
  await runCommand('git', ['config', 'user.email', 'ci-fix-bot@users.noreply.github.com'], { allowFailure: true });
};

/**
 * Commits all staged changes with the provided message.
 */
export const commitChanges = async (message: string) => {
  await runCommand('git', ['add', '-A']);

  const commitResult = await runCommand('git', ['commit', '-m', message], { allowFailure: true });

  if (commitResult.code !== 0) {
    throw new Error(`Unable to commit changes: ${commitResult.stderr || commitResult.stdout}`);
  }
};

/**
 * Creates a new git branch for fixes.
 */
export const createFixBranch = async (branchName: string) => {
  const result = await runCommand('git', ['checkout', '-b', branchName], { allowFailure: true });

  if (result.code !== 0) {
    throw new Error(`Failed to create fix branch ${branchName}: ${result.stderr || result.stdout}`);
  }
};

/**
 * Pushes the fix branch to origin.
 */
export const pushBranch = async (branchName: string) => {
  const pushResult = await runCommand('git', ['push', 'origin', branchName], { allowFailure: false });

  if (pushResult.code !== 0) {
    throw new Error(`Failed to push branch ${branchName}: ${pushResult.stderr || pushResult.stdout}`);
  }
};
