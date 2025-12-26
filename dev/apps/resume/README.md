# React Router App Template
Simple React Router application template using Vite, Mantine, React Router, and Storybook.

Based on:
* [mantinedev/vite-template](https://github.com/mantinedev/vite-template) with adjustments for Faust's ESLint config; and
* [remix-run/react-router-templates](https://github.com/remix-run/react-router-templates/tree/main/default)


## Setting up
```bash
pnpm i
npm install -g locize-cli
```

## Usage
```bash
# extract i18n keys
pnpm i18n:extract

# generate PDF resume
pnpm generate:pdf

# start the dev server
pnpm dev

# ESLint, stylelint, and i18n lint
pnpm lint

# build the app
pnpm build
```
