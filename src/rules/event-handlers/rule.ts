import type { TSESTree as T } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import { isDOMElementName } from '../../utils.js';

const createRule = ESLintUtils.RuleCreator.withoutDocs;

const COMMON_EVENTS = [
  'onAnimationEnd',
  'onAnimationIteration',
  'onAnimationStart',
  'onBeforeInput',
  'onBlur',
  'onChange',
  'onClick',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDblClick',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onError',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onGotPointerCapture',
  'onInput',
  'onInvalid',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoad',
  'onLostPointerCapture',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onPaste',
  'onPointerCancel',
  'onPointerDown',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerMove',
  'onPointerOut',
  'onPointerOver',
  'onPointerUp',
  'onReset',
  'onScroll',
  'onSelect',
  'onSubmit',
  'onToggle',
  'onTouchCancel',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',
  'onTransitionEnd',
  'onWheel',
] as const;
type CommonEvent = (typeof COMMON_EVENTS)[number];

const COMMON_EVENTS_MAP = new Map<string, CommonEvent>(
  (function* () {
    for (const event of COMMON_EVENTS) {
      yield [event.toLowerCase(), event] as const;
    }
  })(),
);

const NONSTANDARD_EVENTS_MAP = {
  ondoubleclick: 'onDblClick',
};

const isCommonHandlerName = (
  lowercaseHandlerName: string,
): lowercaseHandlerName is Lowercase<CommonEvent> =>
  COMMON_EVENTS_MAP.has(lowercaseHandlerName);
const getCommonEventHandlerName = (
  lowercaseHandlerName: Lowercase<CommonEvent>,
): CommonEvent => COMMON_EVENTS_MAP.get(lowercaseHandlerName)!;

const isNonstandardEventName = (
  lowercaseEventName: string,
): lowercaseEventName is keyof typeof NONSTANDARD_EVENTS_MAP =>
  Object.hasOwn(NONSTANDARD_EVENTS_MAP, lowercaseEventName);
const getStandardEventHandlerName = (
  lowercaseEventName: keyof typeof NONSTANDARD_EVENTS_MAP,
) => NONSTANDARD_EVENTS_MAP[lowercaseEventName];

type MessageIds = 'capitalization' | 'nonstandard';
type Options = [{ ignoreCase?: boolean }?];

export default createRule<Options, MessageIds>({
  meta: {
    type: 'problem',
    docs: {
      description:
        "Enforce naming DOM element event handlers consistently and prevent Solid's analysis from misunderstanding whether a prop should be an event handler.",
      url: 'https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/event-handlers/readme.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreCase: {
            type: 'boolean',
            description:
              "if true, don't warn on ambiguously named event handlers like `onclick` or `onchange`",
            // default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ ignoreCase: false }],
    messages: {
      capitalization:
        'The {{name}} prop should be renamed to {{fixedName}} for readability.',
      nonstandard:
        "The {{name}} prop should be renamed to {{fixedName}}, because it's not a standard event handler.",
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

        if (node.name.type === 'JSXNamespacedName') {
          return; // bail early on attr:, on:, oncapture:, etc. props
        }

        // string name of the name node
        const { name } = node.name;

        if (!/^on[a-zA-Z]/.test(name)) {
          return; // bail if Solid doesn't consider the prop name an event handler
        }

        if (!context.options[0]?.ignoreCase) {
          const lowercaseHandlerName = name.toLowerCase();
          if (isNonstandardEventName(lowercaseHandlerName)) {
            const fixedName = getStandardEventHandlerName(lowercaseHandlerName);
            context.report({
              node: node.name,
              messageId: 'nonstandard',
              data: { name, fixedName },
              fix: (fixer) => fixer.replaceText(node.name, fixedName),
            });
          } else if (isCommonHandlerName(lowercaseHandlerName)) {
            const fixedName = getCommonEventHandlerName(lowercaseHandlerName);
            if (fixedName !== name) {
              // For common DOM event names, we know the user intended the prop to be an event handler.
              // Fix it to have an uppercase third letter and be properly camel-cased.
              context.report({
                node: node.name,
                messageId: 'capitalization',
                data: { name, fixedName },
                fix: (fixer) => fixer.replaceText(node.name, fixedName),
              });
            }
          }
        }
      },
    };
  },
});
