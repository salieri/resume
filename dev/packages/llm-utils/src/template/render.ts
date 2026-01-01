import fs from 'node:fs/promises';

import Handlebars from 'handlebars';

import type { PromptTemplateSource } from './types';

const loadTemplateContent = async (source: PromptTemplateSource) => {
  if ('template' in source) {
    return source.template;
  }

  return fs.readFile(source.templatePath, 'utf8');
};

/**
 * Render a Handlebars template with the provided data.
 */
export const renderTemplate = async (source: PromptTemplateSource, data: Record<string, unknown>) => {
  const templateContent = await loadTemplateContent(source);
  const compiled = Handlebars.compile(templateContent, { noEscape: true });

  return compiled(data);
};
