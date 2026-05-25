import { plugin } from "./plugin.js";
import recommendedConfig from "./configs/recommended.js";
import typescriptConfig from "./configs/typescript.js";

export const configs = {
  recommended: {
    plugins: ["solid"],
    env: {
      browser: true,
      es6: true,
    },
    parserOptions: recommendedConfig.languageOptions.parserOptions,
    rules: recommendedConfig.rules,
  },
  typescript: {
    plugins: ["solid"],
    env: {
      browser: true,
      es6: true,
    },
    parserOptions: {
      sourceType: "module",
    },
    rules: typescriptConfig.rules,
  },
  "flat/recommended": recommendedConfig,
  "flat/typescript": typescriptConfig,
};
export const rules = plugin.rules;

const pluginLegacy = {
  configs,
  rules,
};

export default pluginLegacy;
