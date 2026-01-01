import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { renderTemplate } from './render';

const createTemplateData = () => ({
  NAME: 'Ada Lovelace',
  RAW_HTML: '<tag>',
  JSON_PAYLOAD: '{"a":1}',
});

const createTemplateContent = () => 'Hello {{NAME}} {{RAW_HTML}} {{JSON_PAYLOAD}}';

const createTempTemplateFile = async (content: string) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'llm-utils-'));
  const filePath = path.join(dir, 'prompt.md.hbs');

  await fs.writeFile(filePath, content, 'utf8');

  return filePath;
};

const clearTempTemplateFile = async (filePath: string) => {
  const dir = path.dirname(filePath);
  await fs.rm(dir, { recursive: true, force: true });
};

describe('renderTemplate', () => {
  it('renders a template string with data', async () => {
    const template = createTemplateContent();
    const result = await renderTemplate({ template }, createTemplateData());

    expect(result).toBe('Hello Ada Lovelace <tag> {"a":1}');
  });

  it('renders a template file with data', async () => {
    const templatePath = await createTempTemplateFile(createTemplateContent());
    const result = await renderTemplate({ templatePath }, createTemplateData());

    expect(result).toBe('Hello Ada Lovelace <tag> {"a":1}');

    await clearTempTemplateFile(templatePath);
  });
});
