## Project Overview
* **Monorepo**: This is a pnpm workspace monorepo
  * All source code is located in `dev/`.
* **Primary Language**: TypeScript
* **Package Manager**: pnpm (always use `pnpm`, never `npm` or `yarn`)
* **Node Version**: 24

## Essential Commands
| Task | Command                          |
|------|----------------------------------|
| Install dependencies | `pnpm install`                   |
| Build all packages | `pnpm build`                     |
| Run tests | `pnpm test:ci`                   |
| Lint | `pnpm lint`                      |
| Lint with auto-fix | `pnpm lint:fix`                  |

Running the `pnpm lint:fix`, `pnpm build`, and `pnmpm test:ci` commands in a specific package directory (e.g., `cd dev/packages/release-scripts/ && pnpm lint:fix`) is significantly faster than running it from the workspace root.

## Repository Structure
```
.
├── dev/
│   ├── apps/              # Deployable applications (web apps, services)
│   ├── config/            # Shared build and tooling configurations (e.g. TypeScript config)
│   ├── packages/          # Shared libraries and internal packages
│   ├── templates/         # Starter templates for new packages/apps
│   └── AGENTS.md
└── pnpm-workspace.yaml
```

## TypeScript

### Code Structure
* Keep code modular and organized by separating different concerns into distinct files and directories.
* Keep files under 300 lines. If a file exceeds this, split it into logical submodules.
* Keep functions under 20 statements. Extract helper functions for complex logic.
* VERY IMPORTANT: Write reusable code! Avoid duplicating logic; instead, create utility functions or modules that can be reused across the codebase.
* Name files using `kebab-case`.
* Prefer to put types in a separate `types.ts` file when they are used in multiple places.
* When a file exports a single class, function, or React component, name the file the same as the exported entity using `kebab-case`. For example, a React component named `UserProfile` should be in a file named `user-profile.tsx`.
* If you have multiple files related to a specific feature, create a directory for that feature and place all related files – including source code, tests, CSS, resources, etc. – within it. For example, a `user-profile` directory could contain `user-profile.tsx`, `types.ts`, and `utils.ts`.

### Type Assertions
* When data is received from an external source, such as JSON from an API, read from a file, or parsed with `JSON.parse()`, do not simply assert the data type using the `as` keyword.
* Instead, use `zod` schemas to validate and parse the data, ensuring it conforms to the expected structure and types.
* This approach helps catch errors early and prevents runtime issues caused by unexpected data formats.
* When creating a `zod` schema, name both the constant and its type using the `PascalCase` convention without a `Schema` suffix. For example, for user data, name the schema `User` and the type `User`.

### Lint Errors
* Try `pnpm lint:fix` first to automatically resolve linting issues.
* Running the `lint:fix` command in a specific package directory (e.g., `cd dev/packages/release-scripts/ && pnpm lint:fix`) is faster than running from the workspace root.

### Common Modules
Do not reinvent the wheel. Use these common modules for their respective purposes:

* Use `commander` for all CLI applications.
* Use `mantine` for all React components.
* Use `zod` for all data validation and parsing.
* Use `react-router` for all routing in React applications.
* Use `i18next` for all internationalization (i18n) needs.
* Use `vitest` for all testing.
* Use `date-fns` for date manipulation.
* Use `lodash` for utility functions.
* Use `type-fest` for advanced TypeScript types.
* Use `modern-async` for async utility functions.

### React Components
* When creating React components, prefer functional components with hooks over class components.
* Write Storybook stories for all reusable components to document their usage and variations.
* Story files should be named `component-name.stories.tsx` and colocated with the component.

### Testing
* Write unit tests for all functions, classes, and React components.
* Aim for at least 90% code coverage.
* Use `vitest` for testing.
* IMPORTANT: Write reusable, generalized tests that can be easily refactored in the future.
* Avoid hardcoding specific values; instead, use test data generators or factories to create test cases.
* Name test files `component-name.test.ts` or `component-name.test.tsx` and colocate them with the source files.

### Translations
* All language in the React apps must be wrapped into `i18next` translation functions with keys, `t('key')` or `<Trans i18nKey='key'>`.
* Do not use root level keys like `title` or `description`. Instead, use namespaced keys that reflect the component or feature they belong to, e.g., `execsum.title` or `execsum.description`.

### Templates
* There are various templates available in `dev/templates/` for different use cases.
* When starting a new package, service, or an app, always use one of these templates to ensure consistency and best practices

### Imports and Exports
* Prefer named exports over default exports for better tree-shaking and clarity.
* Prefer relative imports within the same package (e.g., `./utils` or `../components/Button`) and absolute imports for cross-package imports (e.g., `@myorg/utils`).
* Use `~` for root-level imports within a package (e.g., `~/components/Button`). Prefer this form over long relative paths like `../../../components/Button`.

### Zod Schema Conventions
```typescript
// ✅ Correct: Schema and type share the same name
import { z } from 'zod';

const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.coerce.date(),
});

type User = z.infer<typeof User>;

// ❌ Incorrect: Don't use "Schema" suffix
const UserSchema = z.object({ ... });  // Avoid this
type UserType = z.infer<typeof UserSchema>;  // Avoid this
```

### NPM Dependencies
* Before adding a new dependency, check if an existing common module serves the purpose.
* When selecting a new dependency, consider:
  * Popularity and community support (ideally 10K+ downloads per week)
  * Maintenance and update frequency (ideally updated within the last 6 months)
  * Compatibility with existing technologies in the codebase (ideally no brand-new conventions, major breaking changes, or new paradigms)
  * Licensing (ideally MIT or Apache 2.0 license, no known vulnerabilities; no GPL)
  * Security (ideally no known vulnerabilities; check with `pnpm audit`)

### Do NOT
* **Do not** use `any` type; use `unknown` and narrow appropriately.
* **Do not** use `npm` or `yarn`; always use `pnpm`.
* **Do not** create new packages without using a template from `dev/templates/`.
* **Do not** add dependencies without checking existing common modules first.
* **Do not** write tests with hardcoded magic values; use factories or constants.
* **Do not** skip lint and tests before completing a task.
* **Do not** use `@ts-ignore` or `@ts-expect-error`. If you encounter a TypeScript error, resolve it properly or ask user for help.
* **Do not** disable ESLint rules. If a rule is impossible to satisfy, check with user for guidance.
* **Do not** commit `.env` files or secrets; use `.env.example` for templates.
* **Do not** use synchronous file operations (`fs.readFileSync`) in application code; use async versions.
* **Do not** catch errors silently; always log or rethrow with context.
* **Do not** leave `console.log` debugging statements in production code.

## CSS
* Use `postcss` for styling.

## Git Conventions
* Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
* Keep commits atomic and focused on a single change.
* Write descriptive commit messages explaining *why*, not just *what*.


## Troubleshooting
### Common Issues
| Symptom | Solution |
|---------|----------|
| `Module not found` errors after adding a package | Run `pnpm install` from workspace root |
| Type errors in a dependency | Run `pnpm build` in the dependency package first |
| Stale build artifacts | Delete `dist/` folders: `pnpm -r exec rm -rf dist` |
| Lock file conflicts | Delete `node_modules` and `pnpm-lock.yaml`, then `pnpm install` |
| Port already in use | Kill the process or use a different port via env variable |

### Build Order
When making cross-package changes, build dependencies before dependents by running `pnpm build` from workspace root.

## Pre-Completion Checklist
Before marking any task as complete, verify:

- [ ] `pnpm lint:fix` passes with no errors
- [ ] `pnpm build` succeeds (run in affected packages)
- [ ] `pnpm test:ci` passes (or scoped tests for affected packages)
- [ ] No `any` types introduced
- [ ] New code has corresponding unit tests
- [ ] New dependencies are justified and documented
- [ ] Commit messages follow conventional commit format


