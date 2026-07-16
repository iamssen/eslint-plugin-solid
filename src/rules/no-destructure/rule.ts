import type { TSESTree as T, TSESLint } from '@typescript-eslint/utils';
import { ASTUtils, ESLintUtils } from '@typescript-eslint/utils';
import { getSourceCode } from '../../compat.js';
import type { FunctionNode } from '../../utils.js';

const createRule = ESLintUtils.RuleCreator.withoutDocs;
const { getStringIfConstant } = ASTUtils;

const getName = (node: T.Node): string | null => {
  switch (node.type) {
    case 'Literal': {
      return typeof node.value === 'string' ? node.value : null;
    }
    case 'Identifier': {
      return node.name;
    }
    case 'AssignmentPattern': {
      return getName(node.left);
    }
    default: {
      return getStringIfConstant(node);
    }
  }
};

interface PropertyInfo {
  real: T.Literal | T.Identifier | T.Expression;
  var: string;
  computed: boolean;
}

// Given ({ 'hello-world': helloWorld = 5 }), returns { real: Literal('hello-world'), var: 'helloWorld', computed: false, init: Literal(5) }
const getPropertyInfo = (prop: T.Property): PropertyInfo | null => {
  const valueName = getName(prop.value);
  return valueName !== null
    ? {
        real: prop.key,
        var: valueName,
        computed: prop.computed,
      }
    : null;
};

export default createRule({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow destructuring props. In Solid, props must be used with property accesses (`props.foo`) to preserve reactivity. This rule only tracks destructuring in the parameter list.',
      url: 'https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-destructure/readme.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noDestructure:
        "Destructuring component props breaks Solid's reactivity; use property access instead.",
      // noWriteToProps: "Component props are readonly, writing to props is not supported.",
    },
  },
  // defaultOptions: [],
  create(context) {
    const functionStack: Array<{
      /** switched to true by :exit if JSX is detected in the current function */
      hasJSX: boolean;
    }> = [];
    const currentFunction = () => {
      const fn = functionStack.at(-1);
      if (!fn) {
        throw new Error('functionStack is empty');
      }
      return fn;
    };
    const onFunctionEnter = () => {
      functionStack.push({ hasJSX: false });
    };
    const onFunctionExit = (node: FunctionNode) => {
      if (node.params.length === 1) {
        const props = node.params[0];
        if (
          props.type === 'ObjectPattern' &&
          currentFunction().hasJSX &&
          node.parent?.type !== 'JSXExpressionContainer' // "render props" aren't components
        ) {
          // Props are destructured in the function params, not the body. We actually don't
          // need to handle the case where props are destructured in the body, because that
          // will be a violation of "solid/reactivity".
          const hasDefault = props.properties.some(
            (property) =>
              property.type === 'Property' &&
              property.value.type === 'AssignmentPattern',
          );
          context.report({
            node: props,
            messageId: 'noDestructure',
            // `merge` lets an explicit `undefined` overwrite a default, unlike
            // parameter destructuring. Keep these reports unfixed rather than
            // changing the component's public prop semantics.
            fix: hasDefault
              ? undefined
              : (fixer) => fixDestructure(node, props, fixer),
          });
        }
      }

      // Pop on exit
      functionStack.pop();
    };

    function* fixDestructure(
      func: FunctionNode,
      props: T.ObjectPattern,
      fixer: TSESLint.RuleFixer,
    ): Generator<TSESLint.RuleFix> {
      const propsName = 'props';
      const properties = props.properties;

      const propertyInfo: Array<PropertyInfo> = [];
      let rest: T.RestElement | null = null;

      for (const property of properties) {
        if (property.type === 'RestElement') {
          rest = property;
        } else {
          const info = getPropertyInfo(property);
          if (info === null) {
            continue;
          }
          propertyInfo.push(info);
        }
      }

      // Replace destructured props with a `props` identifier (`_props` with rest params).
      const origProps = rest ? '_' + propsName : propsName;
      if (props.typeAnnotation) {
        // in `{ prop1, prop2 }: Props`, leave `: Props` alone
        const range = [props.range[0], props.typeAnnotation.range[0]] as const;
        yield fixer.replaceTextRange(range, origProps);
      } else {
        yield fixer.replaceText(props, origProps);
      }

      const sourceCode = getSourceCode(context);

      const omitCall = () => {
        if (propertyInfo.length === 0) {
          return `omit(${propsName})`;
        }

        const keys = propertyInfo
          .map((info) =>
            info.real.type === 'Identifier'
              ? JSON.stringify(info.real.name)
              : sourceCode.getText(info.real),
          )
          .join(', ');
        return `omit(${propsName}, ${keys})`;
      };

      let lineToInsert = '';
      if (rest) {
        lineToInsert += `  const ${propsName} = ${origProps};\n`;
      }
      if (rest) {
        const restName =
          (rest.argument.type === 'Identifier' && rest.argument.name) || 'rest';
        lineToInsert += `  const ${restName} = ${omitCall()};\n`;
      }

      if (lineToInsert) {
        const body = func.body;
        if (body.type === 'BlockStatement') {
          if (body.body.length > 0) {
            // Inject lines handling defaults/rest params before the first statement in the block.
            yield fixer.insertTextBefore(body.body[0], lineToInsert);
          }
          // with an empty block statement body, no need to inject code
        } else {
          // The function is an arrow function that implicitly returns an expression, possibly with wrapping parentheses.
          // These must be removed to convert the function body to a block statement for code injection.
          const maybeOpenParen = sourceCode.getTokenBefore(body);
          if (maybeOpenParen?.value === '(') {
            yield fixer.remove(maybeOpenParen);
          }
          const maybeCloseParen = sourceCode.getTokenAfter(body);
          if (maybeCloseParen?.value === ')') {
            yield fixer.remove(maybeCloseParen);
          }

          // Inject lines handling defaults/rest params
          yield fixer.insertTextBefore(body, `{\n${lineToInsert}  return (`);
          yield fixer.insertTextAfter(body, `);\n}`);
        }
      }

      const scope = sourceCode.scopeManager?.acquire(func);
      if (scope) {
        // iterate through destructured variables, associated with real node
        for (const info of propertyInfo) {
          const variable = scope.set.get(info.var);
          if (variable) {
            // replace all usages of the variable with props accesses
            for (const reference of variable.references) {
              if (!reference.isReadOnly()) {
                // FIXME Conflict with unicorn/prefer-continue
                // eslint-disable-next-line unicorn/no-break-in-nested-loop
                continue;
              }

              const access =
                info.real.type === 'Identifier' && !info.computed
                  ? `.${info.real.name}`
                  : `[${sourceCode.getText(info.real)}]`;
              yield fixer.replaceText(
                reference.identifier,
                `${propsName}${access}`,
              );
            }
          }
        }
      }
    }

    return {
      'FunctionDeclaration': onFunctionEnter,
      'FunctionExpression': onFunctionEnter,
      'ArrowFunctionExpression': onFunctionEnter,
      'FunctionDeclaration:exit': onFunctionExit,
      'FunctionExpression:exit': onFunctionExit,
      'ArrowFunctionExpression:exit': onFunctionExit,
      'JSXElement'() {
        if (functionStack.length > 0) {
          currentFunction().hasJSX = true;
        }
      },
      'JSXFragment'() {
        if (functionStack.length > 0) {
          currentFunction().hasJSX = true;
        }
      },
    };
  },
});
