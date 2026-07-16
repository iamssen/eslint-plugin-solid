import componentsReturnOnce from './rules/components-return-once/rule.js';
import eventHandlers from './rules/event-handlers/rule.js';
import imports from './rules/imports/rule.js';
import jsxNoDuplicateProps from './rules/jsx-no-duplicate-props/rule.js';
import jsxNoScriptUrl from './rules/jsx-no-script-url/rule.js';
import jsxNoUndef from './rules/jsx-no-undef/rule.js';
import noArrayHandlers from './rules/no-array-handlers/rule.js';
import noDestructure from './rules/no-destructure/rule.js';
import noInnerHTML from './rules/no-innerhtml/rule.js';
import noProxyApis from './rules/no-proxy-apis/rule.js';
import noReactDeps from './rules/no-react-deps/rule.js';
import noReactSpecificProps from './rules/no-react-specific-props/rule.js';
import noUnknownNamespaces from './rules/no-unknown-namespaces/rule.js';
import preferFor from './rules/prefer-for/rule.js';
import preferShow from './rules/prefer-show/rule.js';
import reactivity from './rules/reactivity/rule.js';
import selfClosingComp from './rules/self-closing-comp/rule.js';
import styleProp from './rules/style-prop/rule.js';
// import validateJsxNesting from "./rules/validate-jsx-nesting";
import type { ESLint } from 'eslint';

import { createRequire } from 'node:module';

const requireModule = createRequire(import.meta.url);

const packageJson = requireModule('../package.json');

const { name, version } = packageJson;
const meta = { name, version };

const allRules = {
  'components-return-once': componentsReturnOnce,
  'event-handlers': eventHandlers,
  imports,
  'jsx-no-duplicate-props': jsxNoDuplicateProps,
  'jsx-no-undef': jsxNoUndef,
  'jsx-no-script-url': jsxNoScriptUrl,
  'no-destructure': noDestructure,
  'no-innerhtml': noInnerHTML,
  'no-proxy-apis': noProxyApis,
  'no-react-deps': noReactDeps,
  'no-react-specific-props': noReactSpecificProps,
  'no-unknown-namespaces': noUnknownNamespaces,
  'prefer-for': preferFor,
  'prefer-show': preferShow,
  reactivity,
  'self-closing-comp': selfClosingComp,
  'style-prop': styleProp,
  'no-array-handlers': noArrayHandlers,
  // "validate-jsx-nesting": validateJsxNesting
};

export const plugin = {
  meta,
  // NOTE: Rules are created via `@typescript-eslint/utils`'s `ESLintUtils.RuleCreator.withoutDocs`.
  // Type assertion (`as unknown`) is required due to a readonly array mismatch with the official ESLint types.
  rules: allRules as unknown as ESLint.Plugin['rules'],
  // configs: undefined as Record<string, ESLint.Plugin> | undefined,
} satisfies ESLint.Plugin;
