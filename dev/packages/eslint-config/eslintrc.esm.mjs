import { defineConfig } from "eslint/config";

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import promisePlugin from 'eslint-plugin-promise';
import noIndexImportPlugin from '@kubit-ui-web/eslint-plugin-no-index-import';
import vitestPlugin from 'eslint-plugin-vitest';
import validateFilenamePlugin from 'eslint-plugin-validate-filename';
import nPlugin from 'eslint-plugin-n';
import eslintReact from '@eslint-react/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import mantine from 'eslint-config-mantine';

export default (basePath) => defineConfig(
  {
    ignores: [
      // Ignore built files.
      'lib/**/*',
      'dist/**/*',
      'coverage/**/*',
      'docs/**/*',
      // Ignore configurations
      '*.js',
      '*.cjs',
      '*.mjs',
      // React router
      '.react-router/**/*'
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: basePath,
      },
    },
  },
  tseslint.configs.stylistic,
  mantine,
  eslintReact.configs['recommended-typescript'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.errors,
  importPlugin.flatConfigs.warnings,
  importPlugin.flatConfigs.typescript,
  unicorn.configs.recommended,
  promisePlugin.configs['flat/recommended'],
  {
    plugins: {
      "@kubit-ui-web/no-index-import": noIndexImportPlugin,
    },
    rules: {
      // prevent importing index files; this helps with avoiding circular dependencies
      '@kubit-ui-web/no-index-import/no-index-import': [
        'error',
      ],
    }
  },
  vitestPlugin.configs.recommended,
  nPlugin.configs['flat/recommended'],
  stylistic.configs['disable-legacy'],
  stylistic.configs['recommended'],
  {
    plugins: {
      'validate-filename': validateFilenamePlugin,
    },
    rules: {
      // Enforce kebab-case naming for files and directories
      'validate-filename/naming-rules': [
        'error',
        {
          rules: [
            {
              case: 'kebab',
              target: '**/*.ts',
              excludes: ['node_modules', 'dist', 'build']
            },
            {
              case: 'kebab',
              target: '**/src/**',
              excludes: ['node_modules', 'dist', 'build']
            }
          ]
        }
      ],
    }
  },
  {
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false } ],
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/member-delimiter-style': ['error', {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          },
          multilineDetection: 'brackets'
        }],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/padding-line-between-statements': ['error',
          { blankLine: "always", prev: "*", next: "block" },
          { blankLine: "always", prev: "*", next: "case" },
          { blankLine: "always", prev: "*", next: "class" },
          { blankLine: "always", prev: "class", next: "*" },
          { blankLine: "always", prev: "*", next: "default" },
          { blankLine: "always", prev: "*", next: "return" },
          { blankLine: "always", prev: "*", next: "if" },
          { blankLine: "always", prev: "if", next: "*" },
          { blankLine: "always", prev: "*", next: "switch" },
          { blankLine: "always", prev: "*", next: "try" },
          { blankLine: "always", prev: "*", next: "function" },
          { blankLine: "always", prev: "*", next: "block-like" },
          { blankLine: "always", prev: "block-like", next: "*" },

          { blankLine: "always", prev: "*", next: "multiline-const" },
          { blankLine: "always", prev: "multiline-const", next: "*" },
          { blankLine: "always", prev: "*", next: "multiline-expression" },
          { blankLine: "always", prev: "multiline-expression", next: "*" },
      ],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      '@stylistic/semi': ['error', 'always'],

      // force type imports where possible; this helps with avoiding circular dependencies
      // and reduces the amount of JS imported at production runtime
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/explicit-function-return-type': [
        'off',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
      ],

      '@typescript-eslint/no-shadow': 'error',
      // '@typescript-eslint/member-delimiter-style': ['error'],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': ['error'],
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/no-misused-promises': ['error'],
      '@typescript-eslint/no-non-null-assertion': ['error'],

      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          typedefs: false,
          ignoreTypeReferences: true,
        },
      ],

      '@typescript-eslint/no-unnecessary-type-assertion': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/require-await': ['error'],
      '@typescript-eslint/return-await': ['error', 'error-handling-correctness-only'],
      '@typescript-eslint/restrict-template-expressions': 'off',

      'camelcase': [
        'error',
        {
          properties: 'never',
          ignoreDestructuring: true,
          ignoreImports: true,
          allow: [],
        },
      ],

      'class-methods-use-this': 'off',
      'complexity': ['error', { max: 9 }],
      'curly': ['error', 'all'],
      'dot-notation': 'off',

      'import/consistent-type-specifier-style': [
        'error',
        'prefer-top-level'
      ],

      'import/extensions': 'off',
      'import/first': 'error',
      'import/namespace': 'off', // extremely slow for some reason
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/_test/**',
            '**/__tests?__/*.+(js|ts|tsx|jsx)',
            '**/*.+(test|spec).+(js|ts|tsx|jsx)',
            'tests?/**/*.+(js|ts|tsx|jsx)',
            'scripts/*.+(js|ts|tsx|jsx)',
            '.*.{js,cjs,mjs,ts,cts,mts}',
            '*.{config,setup}.{js,cjs,mjs,ts,cts,mts}',
          ],
        },
      ],

      'import/no-named-as-default': 'off',

      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'pathGroups': [
            {
              pattern: '@?(react|react-native)**',
              group: 'builtin',
              position: 'before',
            },
            {
              "pattern": "~/**",
              "group": "internal",
              "position": "after"
            },
          ],
          // 'pathGroupsExcludedImportTypes': ['react', 'react-native'],
          'named': true,
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],

      'import/prefer-default-export': 'off',

      'max-classes-per-file': 'off',
      'max-depth': ['error', { max: 4 }],
      'max-nested-callbacks': ['error', { max: 3 }],
      'max-params': ['error', { max: 4 }],
      'max-statements': ['error', { max: 20 }],

      'n/file-extension-in-import': 'off',
      'n/no-missing-import': 'off', // does not support the .ts/.js switch
      'n/no-process-exit': 'off',

      'no-console': 'error',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-empty-function': 'off',
      'no-return-await': 'off',
      'no-restricted-globals': 'off',
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
      'no-shadow': 'off', // managed with @typescript-eslint/no-shadow
      'no-unused-vars': 'off', // managed with @typescript-eslint/no-unused-vars
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off', // managed with @typescript-eslint/no-useless-constructor
      'no-void': 'off',
      'prefer-destructuring': 'off',
      'promise/always-return': 'off',
      'promise/no-promise-in-callback': 'off',
      'radix': 'off',

      'unicorn/custom-error-definition': 'error',
      'unicorn/error-message': 'error',
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/no-null': 'off',
      'unicorn/throw-new-error': 'error',
      'unicorn/prefer-module': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/switch-case-braces': 'off',
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    }
  },

  // less strict rules for tests
  {
    files: ['**/test/**', '**/*.test.ts', '**/*.spec.ts', '**/test-utils/**', '.storybook/**'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      'complexity': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/test/**', '**/*.test.ts', '**/*.test-d.ts', '**/*.spec.ts', '**/test-utils/**', '.storybook/**'] }],
      'max-depth': 'off',
      'max-lines': 'off',
      'max-nested-callbacks': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'vitest/expect-expect': 'error',
      'vitest/no-commented-out-tests': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/no-identical-title': 'error',
      'vitest/no-import-node-test': 'error',
      'vitest/require-local-test-context-for-concurrent-snapshots': 'error',
      'vitest/valid-describe-callback': 'error',
      'vitest/valid-expect': 'error',
      'vitest/valid-title': 'error',
    },
  },
);
