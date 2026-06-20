import rule from './prefer-classlist.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('prefer-classlist', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div class="red">Hello, world!</div>`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div className="red">Hello, world!</div>`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div something={cn({ red: true })}>Hello, world!</div>`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div something={clsx({ red: true })}>Hello, world!</div>`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div something={classnames({ red: true })}>Hello, world!</div>`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div class={someOtherClassFunction({ red: true })}>Hello, world!</div>`,
      );
    });
    test('valid case 8', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div class={cn({ red: true }, condition && "yellow")}>Hello, world!</div>`,
      );
    });
    test('valid case 9', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div something={cn(condition && "yellow")}>Hello, world!</div>`,
      );
    });
    test('valid case 10', () => {
      testValid(
        'prefer-classlist',
        rule,
        `let el = <div class={clsx({ red: true })} classlist={{}}>Hello, world!</div>`,
      );
    });
    test('valid case 11', () => {
      testValid('prefer-classlist', rule, {
        code: `let el = <div class={clsx({ red: true })}>Hello, world!</div>`,
        options: [{ classnames: ['x', 'y', 'z'] }],
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('prefer-classlist', rule, {
        code: `let el = <div class={cn({ red: true })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 2', () => {
      testInvalid('prefer-classlist', rule, {
        code: `let el = <div class={clsx({ red: true })}>Hello, world!</div>`,
        errors: [
          { messageId: 'preferClasslist', data: { classnames: 'clsx' } },
        ],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 3', () => {
      testInvalid('prefer-classlist', rule, {
        code: `let el = <div class={classnames({ red: true })}>Hello, world!</div>`,
        errors: [
          { messageId: 'preferClasslist', data: { classnames: 'classnames' } },
        ],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 4', () => {
      testInvalid('prefer-classlist', rule, {
        code: `let el = <div class={x({ red: true })}>Hello, world!</div>`,
        options: [{ classnames: ['x', 'y', 'z'] }],
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'x' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 5', () => {
      testInvalid('prefer-classlist', rule, {
        code: `let el = <div className={cn({ red: true })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 6', () => {
      testInvalid('prefer-classlist', rule, {
        code: `let el = <div class={cn({ red: true, "mx-4": props.size > 2 })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true, "mx-4": props.size > 2 }}>Hello, world!</div>`,
      });
    });
  });
});
