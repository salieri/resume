import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Option, program } from 'commander';
import { serializeError } from 'serialize-error';

import { createScriptLogger } from '../shared/logger';

import { runReleaseNotes } from './release-notes-service';
import type { ReleaseNotesCliArgs } from './release-notes-service';

const DEFAULT_PROMPT_TEMPLATE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'prompt.md.hbs',
);

const logger = createScriptLogger('release-notes');

try {
  program
    .name('release-notes')
    .description('Summarize changes between two release tags')
    .requiredOption('--current-tag <tag>', 'Current release tag to summarize')
    .addOption(new Option('--previous-tag <tag>', 'Previous release tag to compare against'))
    .option('--prompt-template <file>', 'Prompt template file', DEFAULT_PROMPT_TEMPLATE)
    .option('--model <model>', 'Model to use for summarization', 'openai/gpt-5.2')
    .option('--api-key <key>', 'OpenRouter API Key', process.env.OPENROUTER_API_KEY || '')
    .option('--github-token <token>', 'GitHub token for PR context', process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '')
    .option(
      '--github-repository <repo>',
      'GitHub repository in owner/repo format',
      process.env.GITHUB_REPOSITORY || '',
    )
    .option('--output <file>', 'Optional output file')
    .option('--dry-run', 'Print the prompt instead of calling the LLM', false)
    .action(async (opts: ReleaseNotesCliArgs) => {
      await runReleaseNotes(opts);
    });

  await program.parseAsync();
} catch (error) {
  logger.error('release-notes.error', { error: serializeError(error) });
  process.exitCode = 1;
}
