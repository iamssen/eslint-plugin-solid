import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree as T } from '@typescript-eslint/utils';
import {
  isFunctionNode,
  isPropsByName,
  trace,
  trackImports,
} from '../../utils.js';

const createRule = ESLintUtils.RuleCreator.withoutDocs;

export default createRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        "Disallow usage of APIs that use ES6 Proxies, only to target environments that don't support them.",
      url: 'https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-proxy-apis/readme.md',
    },
    schema: [],
    messages: {
      spreadCall:
        'Using a function call in JSX spread makes Solid use Proxies, which are incompatible with your target environment.',
      spreadMember:
        'Using a property access in JSX spread makes Solid use Proxies, which are incompatible with your target environment.',
      proxyLiteral: 'Proxies are incompatible with your target environment.',
      merge:
        'If you pass a function or Proxy source to `merge`, it can create a Proxy, which is incompatible with your target environment.',
    },
  },
  // defaultOptions: [],
  create(context) {
    const { matchImport, handleImportDeclaration } = trackImports();

    return {
      ImportDeclaration: handleImportDeclaration,
      'JSXSpreadAttribute MemberExpression'(node: T.MemberExpression) {
        context.report({ node, messageId: 'spreadMember' });
      },
      'JSXSpreadAttribute CallExpression'(node: T.CallExpression) {
        context.report({ node, messageId: 'spreadCall' });
      },
      'CallExpression'(node) {
        if (node.callee.type === 'Identifier') {
          if (matchImport('merge', node.callee.name)) {
            const badArgs = node.arguments.filter((arg) => {
              if (arg.type === 'SpreadElement') return true;
              const traced = trace(arg, context);
              return (
                (traced.type === 'Identifier' && !isPropsByName(traced.name)) ||
                isFunctionNode(traced)
              );
            });
            for (const badArg of badArgs) {
              context.report({
                node: badArg,
                messageId: 'merge',
              });
            }
          }
        } else if (node.callee.type === 'MemberExpression') {
          if (
            node.callee.object.type === 'Identifier' &&
            node.callee.object.name === 'Proxy' &&
            node.callee.property.type === 'Identifier' &&
            node.callee.property.name === 'revocable'
          ) {
            context.report({
              node,
              messageId: 'proxyLiteral',
            });
          }
        }
      },
      'NewExpression'(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'Proxy') {
          context.report({ node, messageId: 'proxyLiteral' });
        }
      },
    };
  },
});
