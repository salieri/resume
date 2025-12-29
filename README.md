> ## Why Is This Project So Complex?
> This resume has been written as a demo you can use to evaluate my technical skills.
> It showcases how I would architect, build, and deploy a modern web application using a variety of technologies and best practices.
>
> For example:
> * Technology stack selection
> * Templating
> * Infrastructure and platform
> * Middleware and backend
> * AI/LLM/agentic/automation
> * Frontend and user experience

## Architecture
* Scalable monorepo model
  * PNPM workspace
  * Terraform and GitHub Actions for IaC and CI/CD
* [Templates](./dev/templates) for apps and packages
* Shared [build configuration](./dev/config) and [ESLint configuration](./dev/packages/eslint-config/eslintrc.esm.mjs)

## AI, ML, LLM, Agentic
* Site is translated to multiple languages using LLM over OpenRouter
  * [Prompt](./dev/apps/resume/scripts/translation/prompt.md)
  * [Translation script](./dev/apps/resume/scripts/translation/translate.ts)
* Release notes are generated using LLM
  * [Prompt](./dev/packages/release-scripts/scripts/release-notes/prompt.md)
  * [Release notes script](./dev/packages/release-scripts/scripts/release-notes/summarize-release.ts)
  * [GitHub Action](./.github/workflows/create-release.yml)
* PRs with build/lint/test failures are automatically fixed with Codex
  * [Prompt](./dev/packages/release-scripts/scripts/fix-pr/prompt.md)
  * [GitHub Action](./.github/workflows/fix-pr.yml)
* [AGENTS.md](./AGENTS.md)

## Platform & Infrastructure
* Deploys to Cloudflare Pages
* [Infrastructure as Code](./ops/infra) with Terraform
* [CI/CD](./.github) with GitHub Actions

## Middleware & Backend

## Frontend
* React with Mantine
* Vite
* TypeScript
* Featuring:
  * Responsive design for mobile and desktop
  * `@media print` styles for convenient printing
  * PDF generation
  * I18N and A11Y
  * Dark/light mode

## Code Quality
* Complex [ESLint configuration](./dev/packages/eslint-config/eslintrc.esm.mjs)
* Stylelint for CSS
* `tflint` for Terraform
* I18next linter for translation keys
* Code coverage with `vitest`
* Test coverage reports with `codecov`
* GitHub Copilot reviews

## Getting Started
```bash
# Install dependencies
brew bundle

# (You will likely need to re-open your shell now)

# Install and use Node.js 24
nvm use 24
corepack enable pnpm

# Install NPM dependencies and build all packages
pnpm install
pnpm build

# Run the resume app
cd dev/apps/resume && pnpm dev
```

## Building & Deploying
```bash
cd dev/apps/resume

# Collect all keys for translation
pnpm i18n:extract

# Translate to all languages
OPENROUTER_API_KEY="sk-or-v1-..." \
  pnpm i18n:translate

# Generate a PDF version of the resume
pnpm generate:pdf

# Build for production
pnpm --workspace-root build

# Deploy to CloudFlare Pages
CLOUDFLARE_API_TOKEN="..." CLOUDFLARE_ACCOUNT_ID="..." \
  wrangler pages deploy ./dist/client --project-name resume --branch main
```

### Environment Variables

| **Name**                        | **Scope**  | **Description**                                    |
|---------------------------------|------------|----------------------------------------------------|
| `OPENROUTER_API_KEY`            | build      | API key for OpenRouter to use LLM for translations |
| `AWS_ENDPOINT_URL_S3`           | terraform  | Endpoint URL for Cloudflare R2 bucket              |
| `AWS_ACCESS_KEY_ID`             | terraform  | Access key ID for Cloudflare R2 bucket             |
| `AWS_SECRET_ACCESS_KEY`         | terraform  | Secret access key for Cloudflare R2 bucket         |
| `CLOUDFLARE_API_TOKEN`          | deployment | Cloudflare API token                               |
| `CLOUDFLARE_ACCOUNT_ID`         | deployment | Cloudflare account ID                              |
| `CODECOV_TOKEN`                 | ci         | Token for Codecov coverage uploads                 |
| `OPENAI_API_KEY`                | ci         | Fallback API key for automated PR fixes            |

## Infrastructure

### Authn/z
#### Terraform Cloudflare API Token
The Terraform setup relies on a Cloudflare API token with the following permissions:

* Account – Cloudflare Pages:Edit, Workers R2 Storage:Edit
* Zone - Zone:Read, DNS:Edit

#### Terraform Cloudflare R2 Access Token
The Terraform setup requires an access key ID and secret access key for Cloudflare R2. These can be generated in the Cloudflare dashboard under "R2" -> "Access Keys".

* R2 Bucket Scoped Token

#### Wrangler Cloudflare API Token
The Wrangler CLI requires a Cloudflare API token with the following permissions:

* Account - Cloudflare Pages:Edit

#### OpenRouter API Key
An OpenRouter API key is required for the translation functionality. You can obtain an API key at [OpenRouter](https://openrouter.ai/settings/keys).

#### OpenAI API Key
An OpenAI API key is required for the automated PR fixing functionality. You can obtain an API key at [OpenAI](https://platform.openai.com/account/api-keys).
