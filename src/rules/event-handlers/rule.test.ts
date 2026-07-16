import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

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
    test('on* string, number, and boolean attributes are valid', () => {
      valid(`
        let el = <div
          onCustomAttribute="attribute-value"
          onCustomNumber={1}
          onCustomBoolean={true}
        />;
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
    test('custom camelCase event names are valid on DOM elements', () => {
      valid(`let el = <div onLy={() => {}} />;`);
    });
    test('native custom event handlers and array handlers are valid', () => {
      valid(`
        const increment = (amount) => amount;
        let el = <button
          onCustom={() => {}}
          onCustomArray={[increment, 2]}
          onClick={[increment, 2]}
        />;
      `);
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
    test('spreading event handlers with other props is valid', () => {
      valid(`
        const onClick = () => 42;
        let el = <div {...{ onClick, title: "spread props" }} />;
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
  });
});
