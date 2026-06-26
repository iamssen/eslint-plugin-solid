import type { ESLint, Linter } from 'eslint';
import recommendedConfig from './configs/recommended.js';
import typescriptConfig from './configs/typescript.js';
import { plugin } from './plugin.js';

export const configs: Record<string, Linter.LegacyConfig | Linter.Config> = {
  'recommended': {
    plugins: ['@ssen/solid'],
    env: {
      browser: true,
      es6: true,
    },
    parserOptions: recommendedConfig.languageOptions.parserOptions,
    rules: recommendedConfig.rules,
  },
  'typescript': {
    plugins: ['@ssen/solid'],
    env: {
      browser: true,
      es6: true,
    },
    parserOptions: {
      sourceType: 'module',
    },
    rules: typescriptConfig.rules,
  },
  'flat/recommended': recommendedConfig,
  'flat/typescript': typescriptConfig,
};

export const rules: ESLint.Plugin['rules'] = plugin.rules;

const pluginLegacy = {
  configs,
  rules,
};

export default pluginLegacy;
