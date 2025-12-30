import fs from 'node:fs/promises';

import { z } from 'zod';

const WorkflowRunPullRequest = z.object({
  number: z.number().describe('Pull request number'),
}).describe('Workflow run pull request');

const WorkflowRunHeadRepository = z.object({
  full_name: z.string().optional().describe('Head repository full name'),
}).describe('Workflow run head repository');

const WorkflowRunPayload = z.object({
  id: z.number().describe('Workflow run id'),
  html_url: z.string().optional().describe('Workflow run URL'),
  conclusion: z.string().optional().describe('Workflow run conclusion'),
  head_branch: z.string().optional().describe('Workflow run head branch'),
  head_sha: z.string().optional().describe('Workflow run head SHA'),
  event: z.string().optional().describe('Workflow run event type'),
  head_repository: WorkflowRunHeadRepository.optional().describe('Workflow run head repository'),
  pull_requests: z.array(WorkflowRunPullRequest).optional().describe('Workflow run pull requests'),
}).describe('Workflow run payload');

const WorkflowRunRepository = z.object({
  full_name: z.string().optional().describe('Repository full name'),
}).describe('Workflow run repository');

const WorkflowRunEvent = z.object({
  workflow_run: WorkflowRunPayload.describe('Workflow run'),
  repository: WorkflowRunRepository.optional().describe('Workflow run repository'),
}).describe('Workflow run event');

export type WorkflowRunEvent = z.infer<typeof WorkflowRunEvent>;

/**
 * Parses and validates a GitHub Actions workflow run event payload.
 */
export const parseEvent = async (eventPath: string): Promise<WorkflowRunEvent> => {
  if (!eventPath) {
    throw new Error('GitHub event path is required.');
  }

  const content = await fs.readFile(eventPath, 'utf8');

  let raw: unknown;

  try {
    raw = JSON.parse(content);
  } catch (error) {
    throw new Error(`Unable to parse workflow event JSON: ${String(error)}`);
  }

  const parsed = WorkflowRunEvent.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`Invalid workflow_run payload: ${parsed.error.message}`);
  }

  return parsed.data;
};
