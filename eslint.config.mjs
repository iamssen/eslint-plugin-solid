import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import { importX } from 'eslint-plugin-import-x';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import path from 'node:path';
import tseslint from 'typescript-eslint';

const tsconfigPath = path.resolve('tsconfig.json');

export default [
  {
    ignores: [
      '**/dist/',
      '**/dist.*',
      '**/.tsup/',
      '**/eslint.config.*',
      'cases/',
      'vitest.*.mjs',
      'rollup.config.mjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: tsconfigPath,
      },
      globals: globals.node,
    },
    plugins: {
      'import-x': importX,
      unicorn,
    },
    rules: {
      ...unicorn.configs.recommended.rules,

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/no-lonely-if': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prefer-type-error': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/name-replacements': 'off',
      'unicorn/consistent-boolean-name': 'off',

      // TODO: re-enable in the future
      'unicorn/no-useless-recursion': 'off',
      'unicorn/consistent-class-member-order': 'off',

      // FIXME: this rule breaks TypeScript's type narrowing
      'unicorn/prefer-includes-over-repeated-comparisons': 'off',

      'prefer-const': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-shadow': 'off',
      'no-extra-boolean-cast': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
    },
  },
  {
    files: ['src/rules/*/rule.ts'],
    ignores: ['**/*.test.ts'],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      'eslint-plugin': eslintPlugin,
    },
    rules: {
      ...eslintPlugin.configs.recommended.rules,
      'eslint-plugin/meta-property-ordering': 'error',
      'eslint-plugin/report-message-format': ['error', "^[A-Z\\{'].*\\.$"],
      'eslint-plugin/test-case-property-ordering': 'error',
      'eslint-plugin/require-meta-docs-description': [
        'error',
        { pattern: '^(Enforce|Require|Disallow)' },
      ],
      // Rule files now share the basename `rule.ts`; the rule name is encoded by
      // their parent directory, which this ESLint rule cannot interpolate.
      'eslint-plugin/require-meta-docs-url': 'error',
    },
  },
  {
    files: ['src/**/*.test.ts'],
    rules: {
      'unicorn/no-incorrect-template-string-interpolation': 'off',
    },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.{js,jsx,mjs,cjs}'],
    rules: tseslint.configs.disableTypeChecked.rules,
  },
];
