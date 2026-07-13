// @ts-check

import tseslint from 'typescript-eslint';
import globals from 'globals';
import solid from '../dist/index.js';

const recommendedConfig = solid.configs.recommended;

export default tseslint.config({
  files: ['{valid,invalid}/**/*.{js,jsx,ts,tsx}'],
  ...recommendedConfig,
  languageOptions: {
    ...recommendedConfig.languageOptions,
    globals: globals.browser,
    parser: tseslint.parser,
    parserOptions: {
      ...recommendedConfig.languageOptions.parserOptions,
      project: null,
    },
  },
});
