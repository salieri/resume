export type PromptTemplateSource
  = | { template: string; templatePath?: never }
    | { templatePath: string; template?: never };
