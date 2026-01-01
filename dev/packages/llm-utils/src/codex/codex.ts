import { spawn } from 'node:child_process';
import path from 'node:path';

import { renderTemplate } from '../template/render';

import type { RunCodexExecArgs, RunCodexExecPromptArgs } from './types';

/**
 * Invoke the Codex CLI with a prepared prompt.
 */
export const runCodexExec = async (prompt: string, args: RunCodexExecArgs) => {
  if (!args.apiKey) {
    throw new Error('Codex API key is required for @openai/codex');
  }

  const runCmd = path.join(import.meta.dirname, '..', '..', 'node_modules', '.bin', 'codex');
  const codexArgs = ['--config', 'preferred_auth_method=apikey', '--config', `model=${args.model}`, '--cd', args.cwd || process.cwd(), 'exec'];

  if (args.unsafeMode) {
    codexArgs.push('--dangerously-bypass-approvals-and-sandbox');
  } else {
    codexArgs.push('--sandbox', 'workspace-write', '--ask-for-approval', 'untrusted');
  }

  codexArgs.push(prompt);

  return new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve, reject) => {
    const child = spawn('env', [`CODEX_API_KEY=${args.apiKey}`, runCmd, ...codexArgs], {
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer) => {
      process.stdout.write(chunk); // behave like inherit
      stdout += chunk.toString(); // capture
    });

    child.stderr.on('data', (chunk: Buffer) => {
      process.stderr.write(chunk); // behave like inherit
      stderr += chunk.toString(); // capture
    });

    child.on('error', (error: Error) => {
      reject(error);
    });

    child.on('close', (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error(`@openai/codex CLI failed with exit code ${exitCode}`));

        return;
      }

      resolve({
        exitCode, stdout, stderr,
      });
    });
  });
};

/**
 * Render a template and invoke Codex CLI with the rendered prompt.
 */
export const runCodexExecTemplate = async (args: RunCodexExecPromptArgs) => {
  const prompt = await renderTemplate(args.template, args.data);
  const result = await runCodexExec(prompt, args);

  return { prompt, ...result };
};
