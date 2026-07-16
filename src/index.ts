import type { Linter } from 'eslint';
import { plugin } from './plugin.js';

const recommended = {
  plugins: {
    '@ssen/solid': plugin,
  },
  languageOptions: {
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    // identifier usage is important
    '@ssen/solid/jsx-no-duplicate-props': 'error',
    '@ssen/solid/jsx-no-undef': 'error',
    '@ssen/solid/no-unknown-namespaces': 'error',
    // security problems
    '@ssen/solid/no-innerhtml': 'error',
    '@ssen/solid/jsx-no-script-url': 'error',
    // reactivity
    '@ssen/solid/components-return-once': 'warn',
    '@ssen/solid/no-destructure': 'error',
    '@ssen/solid/prefer-for': 'error',
    '@ssen/solid/reactivity': 'warn',
    '@ssen/solid/event-handlers': 'warn',
    // these rules are mostly style suggestions
    '@ssen/solid/imports': 'warn',
    '@ssen/solid/style-prop': 'warn',
    '@ssen/solid/no-react-deps': 'warn',
    '@ssen/solid/no-react-specific-props': 'warn',
    '@ssen/solid/self-closing-comp': 'warn',
    '@ssen/solid/no-array-handlers': 'off',
    // handled by Solid compiler, opt-in style suggestion
    '@ssen/solid/prefer-show': 'off',
    // only necessary for resource-constrained environments
    '@ssen/solid/no-proxy-apis': 'off',
  },
} satisfies Linter.Config;

const solidPlugin = {
  ...plugin,
  configs: { recommended },
};

export default solidPlugin;
