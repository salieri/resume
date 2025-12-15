# Typescript Package Template
This is a template for creating a new Node.js package. It includes a basic setup for a TypeScript project.

See the [monorepo README.md](../../README.md) for information about how to configure a new NPM package with the build pipelines.

## Basic Usage Patterns
```bash
# build package
npm run build

# run tests
npm run test:ci

# lint
npm run lint:fix

# build docs
npm run docs
```

## Browser Compatibility
By default, this template outputs `es2023` compatible ESM code. It is not suitable for direct browser use.
