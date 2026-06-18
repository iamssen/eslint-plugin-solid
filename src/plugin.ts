import componentsReturnOnce from './rules/components-return-once.js';
import eventHandlers from './rules/event-handlers.js';
import imports from './rules/imports.js';
import jsxNoDuplicateProps from './rules/jsx-no-duplicate-props.js';
import jsxNoScriptUrl from './rules/jsx-no-script-url.js';
import jsxNoUndef from './rules/jsx-no-undef.js';
import jsxUsesVars from './rules/jsx-uses-vars.js';
import noArrayHandlers from './rules/no-array-handlers.js';
import noDestructure from './rules/no-destructure.js';
import noInnerHTML from './rules/no-innerhtml.js';
import noProxyApis from './rules/no-proxy-apis.js';
import noReactDeps from './rules/no-react-deps.js';
import noReactSpecificProps from './rules/no-react-specific-props.js';
import noUnknownNamespaces from './rules/no-unknown-namespaces.js';
import preferClasslist from './rules/prefer-classlist.js';
import preferFor from './rules/prefer-for.js';
import preferShow from './rules/prefer-show.js';
import reactivity from './rules/reactivity.js';
import selfClosingComp from './rules/self-closing-comp.js';
import styleProp from './rules/style-prop.js';
// import validateJsxNesting from "./rules/validate-jsx-nesting";

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
  'jsx-uses-vars': jsxUsesVars,
  'no-destructure': noDestructure,
  'no-innerhtml': noInnerHTML,
  'no-proxy-apis': noProxyApis,
  'no-react-deps': noReactDeps,
  'no-react-specific-props': noReactSpecificProps,
  'no-unknown-namespaces': noUnknownNamespaces,
  'prefer-classlist': preferClasslist,
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
  rules: allRules,
  configs: undefined as Record<string, unknown> | undefined,
};
