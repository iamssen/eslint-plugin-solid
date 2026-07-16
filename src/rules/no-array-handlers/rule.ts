import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree as T } from '@typescript-eslint/utils';
import { isDOMElementName, trace } from '../../utils.js';

const createRule = ESLintUtils.RuleCreator.withoutDocs;

export default createRule({
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Solid array event handlers when enabled.',
      url: 'https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-array-handlers/readme.md',
    },
    schema: [],
    messages: {
      noArrayHandlers:
        'Array event handlers are disallowed by this rule.',
    },
  },
  // defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        const openingElement = node.parent as T.JSXOpeningElement;
        if (
          openingElement.name.type !== 'JSXIdentifier' ||
          !isDOMElementName(openingElement.name.name)
        ) {
          return; // bail if this is not a DOM/SVG element or web component
        }

        const isNormalEventHandler =
          node.name.type === 'JSXIdentifier' &&
          /^on[a-zA-Z]/.test(node.name.name);

        if (
          isNormalEventHandler &&
          node.value?.type === 'JSXExpressionContainer' &&
          trace(node.value.expression, context).type === 'ArrayExpression'
        ) {
          // Warn if passed an array
          context.report({
            node,
            messageId: 'noArrayHandlers',
          });
        }
      },
    };
  },
});
