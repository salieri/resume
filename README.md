## Why is this project so unnecessarily complex?
This project is my calling card. It demonstrates my ability to architect and implement a sophisticated software system that spans multiple domains and technologies.

For example:
* Technology stack selection
* Templating
* Infrastructure and platform
* Middleware and backend
* AI/LLM
* Frontend and user experience

## Architecture
* Scalable monorepo model
  * PNPM workspace
  * Terraform and GitHub Actions for IaC and CI/CD
* Templates
  * NestJS
  * React
  * React-Router
  * React package
  * NodeJS package
* Shared [build configuration](./dev/config) and [ESLint configuration](./dev/packages/eslint-config/eslintrc.esm.mjs)

## AI/ML/LLM
* Site is translated to multiple languages using LLM over OpenRouter
  * [Prompt](./dev/apps/resume/scripts/translation/prompt.md)
  * [Translation script](./dev/apps/resume/scripts/translation/translate.ts)

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
OPENROUTER_API_KEY="sk-or-v1-..." pnpm i18n:translate

# Generate a PDF version of the resume
pnpm generate:pdf

# Build for production
pnpm --workspace-root build

# Deploy to CloudFlare Pages
wrangler pages deploy ./dist/client --project-name=your-project-name --branch=main
```

## Environment Variables

| **Name**                | **Scope** | **Description**                                    |
|-------------------------|-----------|----------------------------------------------------|
| `OPENROUTER_API_KEY`    | build     | API key for OpenRouter to use LLM for translations |
| `AWS_ENDPOINT_URL_S3`   | terraform | Endpoint URL for S3-compatible storage             |
| `AWS_ACCESS_KEY_ID`     | terraform | Access key ID for S3-compatible storage            |
| `AWS_SECRET_ACCESS_KEY` | terraform | Secret access key for S3-compatible storage        |

