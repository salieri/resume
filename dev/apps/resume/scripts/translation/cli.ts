/* eslint-disable no-console,unicorn/no-process-exit */
import fs from 'node:fs/promises';
import path from 'node:path';

import { OpenRouter } from '@openrouter/sdk';
import { Option, program } from 'commander';
import _ from 'lodash';
import { serializeError } from 'serialize-error';

import { languageCodes } from '@/i18n/i18n';

import { translate } from './translate';
import { TranslateParams } from './types';

interface TranslateCliArgs {
  temperature: number;
  frequencyPenalty: number;
  presencePenalty: number;
  language: string[];
  sourceLanguage: string;
  model: string;
  output: string;
  outputFilePattern: string;
  input: string;
  promptTemplate: string;
  apiKey: string;
}

program
  .name('i18n-translate')
  .description('Translate i18n JSON files using OpenRouter')
  .addOption(new Option('--frequency-penalty <source>', 'Frequency penalty').default(0).argParser(Number.parseFloat))
  .addOption(new Option('--presence-penalty <source>', 'Presence penalty').default(0).argParser(Number.parseFloat))
  .addOption(new Option('--temperature <source>', 'Temperature').default(0.2).argParser(Number.parseFloat))
  .option('--api-key <key>', 'OpenRouter API Key', process.env.OPENROUTER_API_KEY || '')
  .option('--input <json_file>', 'Input file', './src/i18n/locales/en/translation.json')
  .addOption(new Option('--language <languages...>', 'Target languages').default(['all']).choices(['all', ...languageCodes]).makeOptionMandatory(true))
  .option('--model <model>', 'Model to use', 'openai/gpt-5.2') // 'anthropic/claude-opus-4.5')
  .option('--output <dir_path>', 'Output Path', './src/i18n/locales')
  .option('--output-file-pattern <pattern>', 'Output file pattern', '{{LANGUAGE}}/translation.json')
  .option('--prompt-template <file>', 'Prompt template file', './scripts/translation/prompt.md')
  .addOption(new Option('--sourceLanguage <language>', 'Source language').default('en').choices(languageCodes).makeOptionMandatory(true))
  .action(async (opts: TranslateCliArgs) => {
    const openRouter = new OpenRouter({ apiKey: opts.apiKey });
    const promptTemplate = await fs.readFile(opts.promptTemplate, 'utf8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputData = JSON.parse(await fs.readFile(opts.input, 'utf8'));
    const targetLanguages = opts.language.includes('all') ? languageCodes.filter((l) => l !== opts.sourceLanguage) : opts.language;

    await fs.mkdir(opts.output, { recursive: true });

    await Promise.all(targetLanguages.map(async (targetLanguage) => {
      try {
        const params = TranslateParams.parse({
          sourceLanguage: opts.sourceLanguage,
          targetLanguage,
          promptTemplate,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          inputData,
          openRouter,
          modelParams: _.pick(opts, ['temperature', 'frequencyPenalty', 'presencePenalty', 'model']),
        });

        const translatedJson = await translate(params);
        const outputFilePath = path.join(opts.output, opts.outputFilePattern.replace('{{LANGUAGE}}', targetLanguage));

        await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
        await fs.writeFile(outputFilePath, JSON.stringify(translatedJson, null, 2), 'utf8');

        console.info('✅ Translated to:', targetLanguage, '->', outputFilePath);
      } catch (error) {
        console.info('❌ Failed to translate to:', targetLanguage);
        throw error;
      }
    }));
  });

try {
  await program.parseAsync();
} catch (error) {
  console.error('❌ Error during translation:', serializeError(error));
  process.exit(1);
}
