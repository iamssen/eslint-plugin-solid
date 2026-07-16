import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree as T } from '@typescript-eslint/utils';
import { isDOMElementName } from '../../utils.js';

const createRule = ESLintUtils.RuleCreator.withoutDocs;

// Solid 2 @solidjs/web JSX types expose `prop:*` for writable native and
// custom-element properties. Components remain invalid below because props
// namespaces have no runtime meaning there.
const supportedNamespaces = ['prop'];
const otherNamespaces = new Set(['xmlns', 'xlink']);

const removedNamespaces = new Map([
  ['use', 'Use a ref directive factory such as ref={tooltip(options)} instead'],
  [
    'attr',
    'Use the corresponding standard HTML attribute instead (for example, aria-label={label})',
  ],
  [
    'bool',
    'Use the corresponding standard boolean attribute instead (for example, disabled={isDisabled()})',
  ],
  ['on', 'Use a camelCase handler such as onClick={handler} instead'],
  [
    'oncapture',
    'Use ref with addEventListener when native listener options such as capture are required',
  ],
  ['class', 'Use the class prop with an object or array value instead'],
  ['style', 'Use the style prop with an object value instead'],
]);

type MessageIds = 'unknown' | 'legacy' | 'component' | 'component-suggest';
type Options = [{ allowedNamespaces?: Array<string> }?];

export default createRule<Options, MessageIds>({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow unsupported and removed JSX namespace attributes.',
      url: 'https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-unknown-namespaces/readme.md',
    },
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          allowedNamespaces: {
            description: 'an array of additional namespace names to allow',
            type: 'array',
            items: {
              type: 'string',
            },
            // default: [],
            minItems: 1,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{}],
    messages: {
      'unknown': `'{{namespace}}:' is not a supported JSX namespace (${supportedNamespaces
        .map((n) => `'${n}:'`)
        .join(', ')}).`,
      'legacy': "'{{namespace}}:' was removed in Solid 2.0. {{replacement}}.",
      'component': 'Namespaced props have no effect on components.',
      'component-suggest': 'Replace {{namespace}}:{{name}} with {{name}}.',
    },
  },
  // defaultOptions: [],
  create(context) {
    const explicitlyAllowedNamespaces: string[] | undefined =
      context.options?.[0]?.allowedNamespaces;
    return {
      'JSXAttribute > JSXNamespacedName': (node: T.JSXNamespacedName) => {
        const openingElement = node.parent!.parent as T.JSXOpeningElement;
        const namespace = node.namespace.name;
        const replacement = removedNamespaces.get(namespace);

        if (replacement) {
          context.report({
            node,
            messageId: 'legacy',
            data: { namespace, replacement },
          });
          return;
        }

        if (
          openingElement.name.type === 'JSXIdentifier' &&
          !isDOMElementName(openingElement.name.name)
        ) {
          // no namespaces on Solid component elements
          context.report({
            node,
            messageId: 'component',
            suggest: [
              {
                messageId: 'component-suggest',
                data: { namespace: node.namespace.name, name: node.name.name },
                fix: (fixer) => fixer.replaceText(node, node.name.name),
              },
            ],
          });
          return;
        }

        if (
          !(
            supportedNamespaces.includes(namespace) ||
            otherNamespaces.has(namespace) ||
            explicitlyAllowedNamespaces?.includes(namespace)
          )
        ) {
          context.report({
            node,
            messageId: 'unknown',
            data: { namespace },
          });
        }
      },
    };
  },
});
