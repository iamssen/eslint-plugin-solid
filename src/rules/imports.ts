import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree as T, TSESLint } from '@typescript-eslint/utils';
import { getSourceCode } from '../compat.js';
import { appendImports } from '../utils.js';

const createRule = ESLintUtils.RuleCreator.withoutDocs;

// Below: create maps of imports and types to designated import source.
// We could mess with `Object.keys(require("solid-js"))` to generate this, but requiring it from
// node activates the "node" export condition, which doesn't necessarily match what users will
// receive i.e. through bundlers. Instead, we're manually listing all of the public exports that
// should be imported from "solid-js", etc.
// ==============

type Source =
  | 'solid-js'
  | '@solidjs/web'
  | '@solidjs/web/jsx-runtime'
  | '@solidjs/web/jsx-dev-runtime'
  | '@solidjs/h'
  | '@solidjs/html'
  | '@solidjs/universal'
  | 'solid-js/web'
  | 'solid-js/store'
  | 'solid-js/h'
  | 'solid-js/html'
  | 'solid-js/universal'
  | 'solid-js/jsx-runtime'
  | 'solid-js/jsx-dev-runtime';

// Set up map of imports to module
const primitiveMap = new Map<string, Source>();
for (const primitive of [
  'createSignal',
  'createEffect',
  'createMemo',
  'onCleanup',
  'untrack',
  'createRoot',
  'getOwner',
  'runWithOwner',
  'mapArray',
  'createContext',
  'useContext',
  'children',
  'lazy',
  'createUniqueId',
  'createRenderEffect',
  'createReaction',
  'DEV',
  'For',
  'Show',
  'Switch',
  'Match',
  'merge',
  'omit',
  'onSettled',
  'flush',
  'createStore',
  'reconcile',
  'snapshot',
  'storePath',
  'createProjection',
  'Loading',
  'Errored',
  'Reveal',
  'Repeat',
  'action',
  'isPending',
  'latest',
  'refresh',
  'affects',
  'createOptimistic',
  'createOptimisticStore',
]) {
  primitiveMap.set(primitive, 'solid-js');
}
for (const primitive of [
  'Portal',
  'render',
  'hydrate',
  'renderToString',
  'renderToStream',
  'isServer',
  'renderToStringAsync',
  'generateHydrationScript',
  'HydrationScript',
  'Dynamic',
  'dynamic',
]) {
  primitiveMap.set(primitive, '@solidjs/web');
}

// Set up map of type imports to module
const typeMap = new Map<string, Source>();
for (const type of [
  'Signal',
  'Accessor',
  'Setter',
  'Component',
  'VoidProps',
  'VoidComponent',
  'ParentProps',
  'ParentComponent',
  'FlowProps',
  'FlowComponent',
  'ValidComponent',
  'Ref',
  'Context',
  'ResolvedChildren',
  'MatchProps',
  'Element',
  'Store',
]) {
  typeMap.set(type, 'solid-js');
}
for (const type of ['JSX', 'ComponentProps', 'MountableElement']) {
  typeMap.set(type, '@solidjs/web');
}

const sourceRedirectMap = new Map<Source, Source>([
  ['solid-js/h', '@solidjs/h'],
  ['solid-js/html', '@solidjs/html'],
  ['solid-js/universal', '@solidjs/universal'],
  ['solid-js/jsx-runtime', '@solidjs/web/jsx-runtime'],
  ['solid-js/jsx-dev-runtime', '@solidjs/web/jsx-dev-runtime'],
]);

const sourceRegex =
  /^(?:solid-js(?:\/(?:web|store|h|html|universal|jsx(?:-dev)?-runtime))?|@solidjs\/(?:web(?:\/jsx(?:-dev)?-runtime)?|h|html|universal))$/;
const isSource = (source: string): source is Source => sourceRegex.test(source);

export default createRule({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent Solid 2.0 import sources.',
      url: 'https://github.com/solidjs-community/eslint-plugin-solid/blob/main/packages/eslint-plugin-solid/docs/imports.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      'prefer-source': 'Prefer importing {{name}} from "{{source}}".',
      'prefer-module-source': 'Prefer importing from "{{source}}".',
    },
  },
  // defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (!isSource(source)) return;

        const redirectedSource = sourceRedirectMap.get(source);
        if (redirectedSource) {
          context.report({
            node: node.source,
            messageId: 'prefer-module-source',
            data: { source: redirectedSource },
            fix(fixer) {
              return fixer.replaceText(
                node.source,
                JSON.stringify(redirectedSource),
              );
            },
          });
          return;
        }

        const misplacedSpecifiers = node.specifiers.flatMap((specifier) => {
          if (specifier.type !== 'ImportSpecifier') return [];

          const isType =
            specifier.importKind === 'type' || node.importKind === 'type';
          const map = isType ? typeMap : primitiveMap;
          const importedName =
            specifier.imported.type === 'Identifier'
              ? specifier.imported.name
              : specifier.imported.value;
          const correctSource = map.get(importedName);
          return correctSource != null && correctSource !== source
            ? [{ specifier, importedName, correctSource, isType }]
            : [];
        });

        const canFixDeclaration =
          misplacedSpecifiers.length === node.specifiers.length &&
          new Set(misplacedSpecifiers.map(({ correctSource }) => correctSource))
            .size === 1;

        for (const [index, misplaced] of misplacedSpecifiers.entries()) {
          const { specifier, importedName, correctSource, isType } = misplaced;
          if (correctSource != null && correctSource !== source) {
            context.report({
              node: specifier,
              messageId: 'prefer-source',
              data: {
                name: importedName,
                source: correctSource,
              },
              fix:
                index === 0 && canFixDeclaration
                  ? (fixer) => {
                      const sourceCode = getSourceCode(context);
                      const program: T.Program = sourceCode.ast;
                      const correctDeclaration = program.body.find(
                        (node) =>
                          node.type === 'ImportDeclaration' &&
                          node.source.value === correctSource &&
                          node.importKind === (isType ? 'type' : 'value'),
                      ) as T.ImportDeclaration | undefined;

                      if (correctDeclaration) {
                        return [
                          fixer.remove(node),
                          appendImports(
                            fixer,
                            sourceCode,
                            correctDeclaration,
                            misplacedSpecifiers.map(({ specifier }) =>
                              sourceCode.getText(specifier),
                            ),
                          ),
                        ].filter(Boolean) as Array<TSESLint.RuleFix>;
                      }

                      return fixer.replaceText(
                        node.source,
                        JSON.stringify(correctSource),
                      );
                    }
                  : undefined,
            });
          }
        }
      },
    };
  },
});
