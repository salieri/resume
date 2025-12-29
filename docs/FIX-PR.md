## Automated CI Fixer

This repository includes an automated fixer that triggers when the `CI` workflow fails for a pull request. The fixer downloads the failed job log, selects the mapped command for the failed job, asks `@openai/codex` for a patch, applies the patch, verifies the workspace, and proposes a fix PR targeting the original PR branch. It also publishes a `fix-pr` check run and uploads artifacts from the run.

### Workflow trigger
- Workflow file: `.github/workflows/fix-pr.yml`
- Event: `workflow_run` on `CI` with type `completed`, filtered to `conclusion: failure`
- Scope: pull request runs only (`workflow_run.event == pull_request`); forked PRs are skipped because the bot cannot push to forks.

### Script overview
- Entry point: `dev/packages/release-scripts/scripts/fix-pr/cli.ts`
- Prompt template: `dev/packages/release-scripts/scripts/fix-pr/prompt.md`
- Required secrets: `GITHUB_TOKEN` (read/write), `OPENAI_API_KEY` (or `CODEX_API_KEY`) for `@openai/codex`
- The script:
  1) Reads the workflow_run payload to find the failing job, the associated PR, and the repository.
  2) Fetches the failed job log, trims it to the last 400 lines, and maps the job name to a command (`pnpm build`, `pnpm lint:ci`, `pnpm test:ci`).
  3) Builds a prompt from `prompt.md`, writes `prompt.md` and `context.json` into the artifact directory, and invokes the local `codex` CLI (default model `gpt-5.1-codex`).
  4) Applies the returned patch, creates a fix branch off the PR head, and runs `pnpm build`, `pnpm lint:ci`, and `pnpm test:ci` in sequence.
  5) Commits, pushes the branch, opens a PR targeting the original PR branch, and comments the link back on the original PR. If no patch is produced or verification fails, the script exits with an error.
  6) Enforces a maximum nesting depth (5) for chained fix PRs and skips if the PR is already too deep.

### Failure cases
- No PR in the workflow_run payload.
- The failing job is not found, or the `@openai/codex` call returns no patch.
- The run is for a forked PR or exceeds the fix-PR nesting limit.
- Verification commands fail after applying the patch.
- The bot cannot push to the PR branch or create the fix PR.
