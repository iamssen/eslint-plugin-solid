import typescriptEslintParser from '@typescript-eslint/parser';
import solid from '../dist/index.js';

export default [
  {
    files: ['{valid,invalid}/**/*.{js,jsx,ts,tsx}'],
    ...solid.configs.recommended,
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
