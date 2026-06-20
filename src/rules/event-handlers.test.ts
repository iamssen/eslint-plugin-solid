import rule from './event-handlers.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('event-handlers', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'event-handlers',
        rule,
        `const onfoo = () => 42;
    let el = <div onClick={onfoo} />;`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'event-handlers',
        rule,
        `const string = 'string' + some_func();
    let el = <div onLy={string} />`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'event-handlers',
        rule,
        `function Component(props) {
      return <div onClick={props.onClick} />;
    }`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'event-handlers',
        rule,
        `function Component(props) {
      return <div onFoo={props.onFoo} />;
    }`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'event-handlers',
        rule,
        `let el = <div attr:only={() => {}} />;`,
      );
    });
    test('valid case 6', () => {
      testValid('event-handlers', rule, `let el = <div onLy={() => {}} />;`);
    });
    test('valid case 7', () => {
      testValid('event-handlers', rule, `let el = <div on:ly={() => {}} />;`);
    });
    test('valid case 8', () => {
      testValid('event-handlers', rule, `let el = <foo.bar only="true" />;`);
    });
    test('valid case 9', () => {
      testValid(
        'event-handlers',
        rule,
        `let el = <div onDblClick={() => {}} />;`,
      );
    });
    test('valid case 10', () => {
      testValid(
        'event-handlers',
        rule,
        `const onClick = () => 42;
    let el = <div {...{ onClick }} />;`,
      );
    });
    test('valid case 11', () => {
      testValid('event-handlers', rule, {
        code: `let el = <div onclick={onclick} />`,
        options: [{ ignoreCase: true }],
      });
    });
    test('valid case 12', () => {
      testValid('event-handlers', rule, {
        code: `let el = <div only={only} />`,
        options: [{ ignoreCase: true }],
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('event-handlers', rule, {
        code: `let el = <div only />`,
        errors: [
          {
            messageId: 'detected-attr', // has priority over "naming"/"capitalization"
            data: { name: 'only', staticValue: true },
          },
        ],
      });
    });
    test('invalid case 2', () => {
      testInvalid('event-handlers', rule, {
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
    test('invalid case 3', () => {
      testInvalid('event-handlers', rule, {
        code: `let el = <div onclick={() => {}} />`,
        errors: [{ messageId: 'capitalization' }],
        output: `let el = <div onClick={() => {}} />`,
      });
    });
    test('invalid case 4', () => {
      testInvalid('event-handlers', rule, {
        code: `let el = <div onClIcK={() => {}} />`,
        errors: [{ messageId: 'capitalization' }],
        output: `let el = <div onClick={() => {}} />`,
      });
    });
    test('invalid case 5', () => {
      testInvalid('event-handlers', rule, {
        code: `let el = <div oncLICK={() => {}} />`,
        errors: [{ messageId: 'capitalization' }],
        output: `let el = <div onClick={() => {}} />`,
      });
    });
    test('invalid case 6', () => {
      testInvalid('event-handlers', rule, {
        code: `let el = <div onLy />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: true },
          },
        ],
      });
    });
    test('invalid case 7', () => {
      testInvalid('event-handlers', rule, {
        code: `let el = <div onLy="string" />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: 'string' },
          },
        ],
      });
    });
    test('invalid case 8', () => {
      testInvalid('event-handlers', rule, {
        code: `let el = <div onLy={5} />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: 5 },
          },
        ],
      });
    });
    test('invalid case 9', () => {
      testInvalid('event-handlers', rule, {
        code: `let el = <div onLy={"string"} />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: 'string' },
          },
        ],
      });
    });
    test('invalid case 10', () => {
      testInvalid('event-handlers', rule, {
        code: `
      const string = 'string';
      let el = <div onLy={string} />`,
        errors: [
          {
            messageId: 'detected-attr',
            data: { name: 'onLy', staticValue: 'string' },
          },
        ],
      });
    });
    test('invalid case 11', () => {
      testInvalid('event-handlers', rule, {
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
    test('invalid case 12', () => {
      testInvalid('event-handlers', rule, {
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
    test('invalid case 13', () => {
      testInvalid('event-handlers', rule, {
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
    test('invalid case 14', () => {
      testInvalid('event-handlers', rule, {
        code: `const handleClick = () => 42;
      let el = <div {...{ onClick: handleClick, foo }} />;`,
        options: [{ warnOnSpread: true }],
        errors: [{ messageId: 'spread-handler', data: { name: 'onClick' } }],
        output: `const handleClick = () => 42;
      let el = <div {...{  foo }} onClick={handleClick} />;`,
      });
    });
    test('invalid case 15', () => {
      testInvalid('event-handlers', rule, {
        code: `const handleClick = () => 42;
      let el = <div {...{ foo, onClick: handleClick, }} />;`,
        options: [{ warnOnSpread: true }],
        errors: [{ messageId: 'spread-handler', data: { name: 'onClick' } }],
        output: `const handleClick = () => 42;
      let el = <div {...{ foo,  }} onClick={handleClick} />;`,
      });
    });
    test('invalid case 16', () => {
      testInvalid('event-handlers', rule, {
        code: `const handleClick = () => 42;
      let el = <div {...{ onClick: handleClick }} />;`,
        options: [{ warnOnSpread: true }],
        errors: [{ messageId: 'spread-handler', data: { name: 'onClick' } }],
        output: `const handleClick = () => 42;
      let el = <div  onClick={handleClick} />;`,
      });
    });
  });
});
