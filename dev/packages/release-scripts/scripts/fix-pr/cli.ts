import { program } from 'commander';
import { serializeError } from 'serialize-error';

import { createScriptLogger } from '../shared/logger';

import { runFixPr } from './fix-pr-service';
import type { FixPrCliOptions } from './types';

const logger = createScriptLogger('fix-pr');

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
      '--model <name>',
      'OpenAI model to be used',
      'gpt-5.1-codex',
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
    .option('--artifact-path <path>', 'Directory to which save artifact files', '/tmp/fix-pr-artifacts')
    .option(
      '--github-actions',
      'Set true when running inside GitHub Actions',
      process.env.GITHUB_ACTIONS === 'true',
    )
    .option('--dry-run', 'Print the Codex prompt without applying changes', false)
    .action(async (opts: FixPrCliOptions) => {
      await runFixPr(opts);
    });

  await program.parseAsync();
} catch (error) {
  logger.error('fix-pr.error', { error: serializeError(error) });
  process.exitCode = 1;
}
