import type { TSESLint } from "@typescript-eslint/utils";

import { plugin } from "../plugin.js";

const recommended = {
  plugins: {
    "@ssen/solid": plugin,
  },
  languageOptions: {
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    // identifier usage is important
    "@ssen/solid/jsx-no-duplicate-props": 2,
    "@ssen/solid/jsx-no-undef": 2,
    "@ssen/solid/jsx-uses-vars": 2,
    "@ssen/solid/no-unknown-namespaces": 2,
    // security problems
    "@ssen/solid/no-innerhtml": 2,
    "@ssen/solid/jsx-no-script-url": 2,
    // reactivity
    "@ssen/solid/components-return-once": 1,
    "@ssen/solid/no-destructure": 2,
    "@ssen/solid/prefer-for": 2,
    "@ssen/solid/reactivity": 1,
    "@ssen/solid/event-handlers": 1,
    // these rules are mostly style suggestions
    "@ssen/solid/imports": 1,
    "@ssen/solid/style-prop": 1,
    "@ssen/solid/no-react-deps": 1,
    "@ssen/solid/no-react-specific-props": 1,
    "@ssen/solid/self-closing-comp": 1,
    "@ssen/solid/no-array-handlers": 0,
    // handled by Solid compiler, opt-in style suggestion
    "@ssen/solid/prefer-show": 0,
    // only necessary for resource-constrained environments
    "@ssen/solid/no-proxy-apis": 0,
    // deprecated
    "@ssen/solid/prefer-classlist": 0,
  },
} satisfies TSESLint.FlatConfig.Config;

export default recommended;
