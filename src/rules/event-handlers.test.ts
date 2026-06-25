import { describe, test } from 'vitest';
import rule from './event-handlers.js';
import { testInvalid, testValid } from './ruleTester.js';

const valid = testValid('event-handlers', rule);
const invalid = testInvalid('event-handlers', rule);

describe('event-handlers', () => {
  describe('valid', () => {
    test('lowercase event names are allowed for standard variables', () => {
      valid(`
        const onfoo = () => 42;
        let el = <div onClick={onfoo} />;
      `);
    });
    test('camelCase is allowed for non-event attributes', () => {
      valid(`
        const string = 'string' + some_func();
        let el = <div onLy={string} />
      `);
    });
    test('camelCase event handlers are valid when passed as props to components', () => {
      valid(`
        function Component(props) {
          return <div onClick={props.onClick} />;
        }
      `);
    });
    test('camelCase non-standard handlers are valid when passed as props to components', () => {
      valid(`
        function Component(props) {
          return <div onFoo={props.onFoo} />;
        }
      `);
    });
    test('using attr: namespace for lowercase event names is valid', () => {
      valid(`let el = <div attr:only={() => {}} />;`);
    });
    test('custom camelCase event names are valid on DOM elements', () => {
      valid(`let el = <div onLy={() => {}} />;`);
    });
    test('using on: namespace is valid for custom events', () => {
      valid(`let el = <div on:ly={() => {}} />;`);
    });
    test('custom events on web components are valid', () => {
      valid(`let el = <foo.bar only="true" />;`);
    });
    test('standard event handlers with correct camelCase are valid', () => {
      valid(`let el = <div onDblClick={() => {}} />;`);
    });
    test('spreading standard event handlers is valid', () => {
      valid(`
        const onClick = () => 42;
        let el = <div {...{ onClick }} />;
      `);
    });
    test('lowercase standard event names are valid when ignoreCase option is true', () => {
      valid({
        code: `let el = <div onclick={onclick} />`,
        options: [{ ignoreCase: true }],
      });
    });
    test('lowercase custom event names are valid when ignoreCase option is true', () => {
      valid({
        code: `let el = <div only={only} />`,
        options: [{ ignoreCase: true }],
      });
    });
  });
  describe('invalid', () => {
    test('detects custom event names passed as boolean attributes', () => {
      invalid({
        code: `let el = <div only />`,
        errors: [
          {
            messageId: 'detected-attr', // has priority over "naming"/"capitalization"
            data: { name: 'only', staticValue: true },
          },
        ],
      });
    });
    test('detects ambiguous lowercase custom event names', () => {
      invalid({
        code: `let el = <div only={() => {}} />`,
        errors: [
          {
            messageId: 'naming',
            suggestions: [
              {
                messageId: 'make-handler',
                data: { name: 'only', handlerName: 'onLy' },
                output: `let el = <div onLy={() => {}} />`,
              },
              {
                messageId: 'make-attr',
                data: { name: 'only', attrName: 'attr:only' },
                output: `let el = <div attr:only={() => {}} />`,
              },
            ],
          },
        ],
      });
    });
    test('detects lowercase standard event names and suggests camelCase', () => {
      invalid({
        code: `let el = <div onclick={() => {}} />`,
        errors: [{ messageId: 'capitalization' }],
        output: `let el = <div onClick={() => {}} />`,
      });
    });
    test('detects incorrectly capitalized standard event names', () => {
      invalid({
        code: `let el = <div onClIcK={() => {}} />`,
        errors: [{ messageId: 'capitalization' }],
        output: `let el = <div onClick={() => {}} />`,
      });
    });
    test('detects strangely capitalized standard event names', () => {
      invalid({
        code: `let el = <div oncLICK={() => {}} />`,
        errors: [{ messageId: 'capitalization' }],
        output: `let el = <div onClick={() => {}} />`,
      });
    });
    test('detects camelCase custom event names passed as boolean attributes', () => {
      invalid({
        code: `let el = <div onLy />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: true },
          },
        ],
      });
    });
    test('detects camelCase custom event names passed as string attributes', () => {
      invalid({
        code: `let el = <div onLy="string" />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: 'string' },
          },
        ],
      });
    });
    test('detects camelCase custom event names passed as number attributes', () => {
      invalid({
        code: `let el = <div onLy={5} />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: 5 },
          },
        ],
      });
    });
    test('detects camelCase custom event names passed as string expression attributes', () => {
      invalid({
        code: `let el = <div onLy={"string"} />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: 'string' },
          },
        ],
      });
    });
    test('detects camelCase custom event names bound to string variables', () => {
      invalid({
        code: `
          const string = 'string';
          let el = <div onLy={string} />
        `,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: 'string' },
          },
        ],
      });
    });
    test('detects non-standard camelCase aliases for standard events', () => {
      invalid({
        code: `let el = <div onDoubleClick={() => {}} />;`,
        errors: [
          {
            messageId: 'nonstandard',
            data: { name: 'onDoubleClick', fixedName: 'onDblClick' },
          },
        ],
        output: `let el = <div onDblClick={() => {}} />;`,
      });
    });
    test('detects non-standard lowercase aliases for standard events', () => {
      invalid({
        code: `let el = <div ondoubleclick={() => {}} />;`,
        errors: [
          {
            messageId: 'nonstandard',
            data: { name: 'ondoubleclick', fixedName: 'onDblClick' },
          },
        ],
        output: `let el = <div onDblClick={() => {}} />;`,
      });
    });
    test('detects lowercase non-standard aliases for standard events', () => {
      invalid({
        code: `let el = <div ondblclick={() => {}} />;`,
        errors: [
          {
            messageId: 'capitalization',
            data: { name: 'ondblclick', fixedName: 'onDblClick' },
          },
        ],
        output: `let el = <div onDblClick={() => {}} />;`,
      });
    });
    test('warns when standard event handlers are spread into DOM elements if warnOnSpread is true', () => {
      invalid({
        code: `
          const handleClick = () => 42;
          let el = <div {...{ onClick: handleClick, foo }} />;
        `,
        options: [{ warnOnSpread: true }],
        errors: [{ messageId: 'spread-handler', data: { name: 'onClick' } }],
        output: `
          const handleClick = () => 42;
          let el = <div {...{  foo }} onClick={handleClick} />;
        `,
      });
    });
    test('warns when standard event handlers are spread alongside other properties if warnOnSpread is true', () => {
      invalid({
        code: `
          const handleClick = () => 42;
          let el = <div {...{ foo, onClick: handleClick, }} />;
        `,
        options: [{ warnOnSpread: true }],
        errors: [{ messageId: 'spread-handler', data: { name: 'onClick' } }],
        output: `
          const handleClick = () => 42;
          let el = <div {...{ foo,  }} onClick={handleClick} />;
        `,
      });
    });
    test('warns when standard event handlers are the only properties spread if warnOnSpread is true', () => {
      invalid({
        code: `
          const handleClick = () => 42;
          let el = <div {...{ onClick: handleClick }} />;
        `,
        options: [{ warnOnSpread: true }],
        errors: [{ messageId: 'spread-handler', data: { name: 'onClick' } }],
        output: `
          const handleClick = () => 42;
          let el = <div  onClick={handleClick} />;
        `,
      });
    });
  });
});
