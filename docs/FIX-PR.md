## Automated CI Fixer

This repository includes an automated fixer that triggers when the `CI` workflow fails for a pull request. The fixer downloads the failed job log, reruns the failing command, asks `@openai/codex` for a patch, applies the patch, verifies the workspace, and proposes a fix PR targeting the original PR branch.

### Workflow trigger
- Workflow file: `.github/workflows/fix-pr.yml`
- Event: `workflow_run` on `CI` with `conclusion: failure`
- Scope: pull request runs only; forked PRs are skipped because the bot cannot push to forks.

### Script overview
- Entry point: `dev/packages/release-scripts/scripts/fix-pr/cli.ts`
- Prompt template: `dev/packages/release-scripts/scripts/fix-pr/prompt.md`
- Required secrets: `GITHUB_TOKEN` (read/write), `CODEX_API_KEY` (or `OPENAI_API_KEY`) for `@openai/codex`
- The script:
  1) Reads the workflow_run payload to find the failing job and associated PR.
  2) Fetches the failed job log and reruns the mapped command (`pnpm build`, `pnpm lint:ci`, `pnpm test:ci`).
  3) Builds a prompt from `prompt.md` and invokes `pnpm dlx @openai/codex` to request a patch.
  4) Applies the returned patch, creates a fix branch off the PR head, and runs `pnpm build`, `pnpm lint:ci`, and `pnpm test:ci`.
  5) Commits, pushes the branch, and opens a PR targeting the original PR branch. If no patch is produced or verification fails, the script exits with an error.

### Failure cases
- No PR in the workflow_run payload.
- The failing job is not found, or the `@openai/codex` call returns no patch.
- Verification commands fail after applying the patch.
- The bot cannot push to forked PR branches.
