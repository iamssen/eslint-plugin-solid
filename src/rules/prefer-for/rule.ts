import { ASTUtils, ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree as T } from '@typescript-eslint/utils';
import { isFunctionNode, isJSXElementOrFragment } from '../../utils.js';

const createRule = ESLintUtils.RuleCreator.withoutDocs;
const { getPropertyName } = ASTUtils;

export default createRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        "Enforce using Solid's `<For />` component for mapping an array to JSX elements.",
      url: 'https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/prefer-for/readme.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferFor:
        "Use Solid's `<For />` component for reactive list rendering.",
      preferForNeedsManualMigration:
        "Use Solid's `<For />` component and choose a keyed mode that preserves this callback's parameter semantics.",
    },
  },
  // defaultOptions: [],
  create(context) {
    const reportPreferFor = (
      node: T.CallExpression,
      expression: T.CallExpression | T.ChainExpression,
    ) => {
      const jsxExpressionContainerNode =
        expression.parent as T.JSXExpressionContainer;
      const arrayNode = (node.callee as T.MemberExpression).object;
      const mapFnNode = node.arguments[0];
      context.report({
        node,
        messageId: 'preferFor',
        fix: (fixer) => {
          const beforeArray: [number, number] = [
            jsxExpressionContainerNode.range[0],
            arrayNode.range[0],
          ];
          const betweenArrayAndMapFn: [number, number] = [
            arrayNode.range[1],
            mapFnNode.range[0],
          ];
          const afterMapFn: [number, number] = [
            mapFnNode.range[1],
            jsxExpressionContainerNode.range[1],
          ];
          // We can insert the <For /> component
          return [
            fixer.replaceTextRange(beforeArray, '<For each={'),
            fixer.replaceTextRange(betweenArrayAndMapFn, '}>{'),
            fixer.replaceTextRange(afterMapFn, '}</For>'),
          ];
        },
      });
    };

    return {
      CallExpression(node) {
        const callOrChain =
          node.parent?.type === 'ChainExpression' ? node.parent : node;
        if (
          callOrChain.parent?.type === 'JSXExpressionContainer' &&
          isJSXElementOrFragment(callOrChain.parent.parent)
        ) {
          // check for Array.prototype.map in JSX
          if (
            node.callee.type === 'MemberExpression' &&
            getPropertyName(node.callee) === 'map' &&
            node.arguments.length === 1 && // passing thisArg to Array.prototype.map is rare, deopt in that case
            isFunctionNode(node.arguments[0])
          ) {
            const mapFnNode = node.arguments[0];
            if (
              mapFnNode.params.length === 1 &&
              mapFnNode.params[0].type !== 'RestElement'
            ) {
              // A single item parameter has the same value semantics as the
              // default <For> child callback.
              // The returned JSX, if it's coming from React, will have an unnecessary `key` prop to be removed in
              // the useless-keys rule.
              reportPreferFor(node, callOrChain);
            } else {
              // `map` and <For> use different callback parameter shapes when
              // an index or keyed={false} is involved. Do not guess a mode or
              // rewrite identifier uses such as `index` to `index()`.
              context.report({
                node,
                messageId: 'preferForNeedsManualMigration',
              });
            }
          }
        }
      },
    };
  },
});
