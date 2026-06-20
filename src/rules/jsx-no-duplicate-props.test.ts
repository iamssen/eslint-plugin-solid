import rule from './jsx-no-duplicate-props.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('jsx-no-duplicate-props', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid('jsx-no-duplicate-props', rule, `let el = <div a="a" b="b" />`);
    });
    test('valid case 2', () => {
      testValid(
        'jsx-no-duplicate-props',
        rule,
        `let el = <div a="a" {...{ b: "b" }} />`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'jsx-no-duplicate-props',
        rule,
        `let el = <div a="a" {...{ "b": "b" }} />`,
      );
    });
    test('valid case 4', () => {
      testValid('jsx-no-duplicate-props', rule, `let el = <div a="a" A="A" />`);
    });
    test('valid case 5', () => {
      testValid(
        'jsx-no-duplicate-props',
        rule,
        `let el = <div a="a" {...{ A: "A" }} />`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'jsx-no-duplicate-props',
        rule,
        `let el = <div class="blue" />`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'jsx-no-duplicate-props',
        rule,
        `let el = <div children={<div />} />`,
      );
    });
    test('valid case 8', () => {
      testValid('jsx-no-duplicate-props', rule, `let el = <div><div /></div>`);
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('jsx-no-duplicate-props', rule, {
        code: `let el = <div a="a" a="aaaa" />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('invalid case 2', () => {
      testInvalid('jsx-no-duplicate-props', rule, {
        code: `let el = <div a="a" {...{a: "aaaa" }} />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('invalid case 3', () => {
      testInvalid('jsx-no-duplicate-props', rule, {
        code: `let el = <div {...{a: "aaaa" }} a="a" />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('invalid case 4', () => {
      testInvalid('jsx-no-duplicate-props', rule, {
        code: `let el = <div a="a" {...{ "a": "aaaa" }} />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('invalid case 5', () => {
      testInvalid('jsx-no-duplicate-props', rule, {
        code: `let el = <div class="blue" class="green" />`,
        errors: [{ messageId: 'noDuplicateClass' }],
      });
    });
    test('invalid case 6', () => {
      testInvalid('jsx-no-duplicate-props', rule, {
        code: `let el = <div class="blue" {...{ class: "green" }} />`,
        errors: [{ messageId: 'noDuplicateClass' }],
      });
    });
    test('invalid case 7', () => {
      testInvalid('jsx-no-duplicate-props', rule, {
        code: `let el = <div children={<div />}><div /></div>`,
        errors: [
          {
            messageId: 'noDuplicateChildren',
            data: {
              used: '`props.children`, JSX children',
            },
          },
        ],
      });
    });
    test('invalid case 8', () => {
      testInvalid('jsx-no-duplicate-props', rule, {
        code: `let el = <div innerHTML="<p></p>" textContent="howdy!" />`,
        errors: [
          {
            messageId: 'noDuplicateChildren',
            data: { used: '`props.innerHTML`, `props.textContent`' },
          },
        ],
      });
    });
  });
});
