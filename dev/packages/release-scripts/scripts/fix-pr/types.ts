export interface FailureContext {
  repo: { owner: string; repo: string };
  prNumber: number;
  prTitle: string;
  prBody: string;
  headBranch: string;
  baseBranch: string;
  workflowUrl?: string;
  jobName: string;
  failedCommand: string;
  logSnippet: string;
  artifactPath: string;
}

export interface FixPrCliOptions {
  dryRun: boolean;
  artifactPath: string;
  codexApiKey: string;
  model: string;
  githubToken: string;
  githubEventPath: string;
  githubRepository: string;
  githubActions: boolean;
}
