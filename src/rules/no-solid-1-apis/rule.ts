import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESLint, TSESTree as T } from '@typescript-eslint/utils';
import { findVariable } from '../../compat.js';

const createRule = ESLintUtils.RuleCreator.withoutDocs;

const removedApis = new Map<string, string>([
  ['createResource', 'Use an explicit async data flow with Loading or Errored'],
  ['Suspense', 'Use Loading for a loading boundary'],
  ['SuspenseList', 'Use Reveal to coordinate loading boundaries'],
  ['ErrorBoundary', 'Use Errored for an error boundary'],
  ['useTransition', 'Use isPending or optimistic state instead'],
  ['startTransition', 'Use isPending or optimistic state instead'],
  ['batch', 'Updates are automatically batched; use flush only when necessary'],
  ['on', 'Split the effect into the dependencies it reads'],
  ['onMount', 'Use onSettled for work that runs after the DOM settles'],
  ['createComputed', 'Use createMemo, createEffect, or a signal as appropriate'],
  ['createReactive', 'Use createReaction when an explicit tracking callback is needed'],
  ['createMutable', 'Use createStore and update it through its draft setter'],
  ['modifyMutable', 'Use a createStore draft setter'],
  ['from', 'Adapt the source with an explicit effect or async iterator'],
  ['observable', 'Expose an explicit adapter instead of an Observable helper'],
  ['createDeferred', 'Model deferred async state explicitly'],
  ['Index', 'Use <For keyed={false}> when position-based list rendering is needed'],
  ['indexArray', 'Use mapArray for imperative position-based mapping'],
]);

const solidSources = new Set(['solid-js', 'solid-js/store']);

type MessageIds = 'removedApi' | 'contextProvider';

function getJSXMemberName(node: T.JSXMemberExpression): {
  object: T.JSXIdentifier;
  property: T.JSXIdentifier;
} | null {
  if (
    node.object.type !== 'JSXIdentifier' ||
    node.property.type !== 'JSXIdentifier'
  ) {
    return null;
  }
  return { object: node.object, property: node.property };
}

export default createRule<[], MessageIds>({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow APIs removed from Solid 2.',
      url: 'https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-solid-1-apis/readme.md',
    },
    schema: [],
    messages: {
      removedApi: "Solid 1.x '{{api}}' is removed in Solid 2. {{replacement}}.",
      contextProvider:
        'Solid 1.x Context.Provider is removed in Solid 2. Render <Context value={...}> instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const namedImports = new Map<TSESLint.Scope.Variable, string>();
    const namespaceImports = new Set<TSESLint.Scope.Variable>();
    const contexts = new Set<TSESLint.Scope.Variable>();

    const variableFor = (node: T.Identifier | T.JSXIdentifier) =>
      findVariable(context, node as unknown as T.Identifier);

    const getImportedApi = (node: T.Expression | T.Super) => {
      if (node.type === 'Identifier') {
        const variable = variableFor(node);
        return variable ? namedImports.get(variable) : undefined;
      }
      if (
        node.type === 'MemberExpression' &&
        !node.computed &&
        node.object.type === 'Identifier' &&
        node.property.type === 'Identifier' &&
        namespaceImports.has(variableFor(node.object)!)
      ) {
        return node.property.name;
      }
      return undefined;
    };

    const reportRemovedApi = (node: T.Node, api: string) => {
      const replacement = removedApis.get(api);
      if (!replacement) return;
      context.report({
        node,
        messageId: 'removedApi',
        data: { api, replacement },
      });
    };

    return {
      ImportDeclaration(node) {
        if (
          typeof node.source.value !== 'string' ||
          !solidSources.has(node.source.value)
        ) {
          return;
        }

        for (const specifier of node.specifiers) {
          const variable = variableFor(specifier.local);
          if (!variable) continue;

          if (specifier.type === 'ImportNamespaceSpecifier') {
            namespaceImports.add(variable);
          } else if (specifier.type === 'ImportSpecifier') {
            namedImports.set(
              variable,
              specifier.imported.type === 'Identifier'
                ? specifier.imported.name
                : specifier.imported.value,
            );
          }
        }
      },
      VariableDeclarator(node) {
        if (
          node.id.type !== 'Identifier' ||
          node.init?.type !== 'CallExpression'
        ) {
          return;
        }
        if (getImportedApi(node.init.callee) === 'createContext') {
          const variable = variableFor(node.id);
          if (variable) contexts.add(variable);
        }
      },
      CallExpression(node) {
        const api = getImportedApi(node.callee);
        if (api) reportRemovedApi(node.callee, api);
      },
      JSXOpeningElement(node) {
        if (node.name.type === 'JSXIdentifier') {
          const variable = variableFor(node.name);
          const api = variable ? namedImports.get(variable) : undefined;
          if (api) reportRemovedApi(node.name, api);
          return;
        }
        if (node.name.type !== 'JSXMemberExpression') return;

        const member = getJSXMemberName(node.name);
        if (!member) return;

        const objectVariable = variableFor(member.object);
        if (objectVariable && namespaceImports.has(objectVariable)) {
          reportRemovedApi(node.name, member.property.name);
        } else if (
          objectVariable &&
          contexts.has(objectVariable) &&
          member.property.name === 'Provider'
        ) {
          context.report({ node: node.name, messageId: 'contextProvider' });
        }
      },
    };
  },
});
