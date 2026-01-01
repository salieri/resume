import type { PromptTemplateSource } from '../template/types';

export interface RunCodexExecArgs {
  apiKey: string;
  model: string;
  unsafeMode: boolean;
  cwd: string;
}

export interface RunCodexExecPromptArgs extends RunCodexExecArgs {
  template: PromptTemplateSource;
  data: Record<string, unknown>;
}
