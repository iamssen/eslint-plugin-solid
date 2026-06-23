import rule from './prefer-classlist.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('prefer-classlist', rule);
const invalid = testInvalid('prefer-classlist', rule);

describe('prefer-classlist', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let el = <div classlist={{ red: true }}>Hello, world!</div>`);
    });
    test('valid case 2', () => {
      valid(`let el = <div class="red">Hello, world!</div>`);
    });
    test('valid case 3', () => {
      valid(`let el = <div className="red">Hello, world!</div>`);
    });
    test('valid case 4', () => {
      valid(`let el = <div something={cn({ red: true })}>Hello, world!</div>`);
    });
    test('valid case 5', () => {
      valid(
        `let el = <div something={clsx({ red: true })}>Hello, world!</div>`,
      );
    });
    test('valid case 6', () => {
      valid(
        `let el = <div something={classnames({ red: true })}>Hello, world!</div>`,
      );
    });
    test('valid case 7', () => {
      valid(
        `let el = <div class={someOtherClassFunction({ red: true })}>Hello, world!</div>`,
      );
    });
    test('valid case 8', () => {
      valid(
        `let el = <div class={cn({ red: true }, condition && "yellow")}>Hello, world!</div>`,
      );
    });
    test('valid case 9', () => {
      valid(
        `let el = <div something={cn(condition && "yellow")}>Hello, world!</div>`,
      );
    });
    test('valid case 10', () => {
      valid(
        `let el = <div class={clsx({ red: true })} classlist={{}}>Hello, world!</div>`,
      );
    });
    test('valid case 11', () => {
      valid({
        code: `let el = <div class={clsx({ red: true })}>Hello, world!</div>`,
        options: [{ classnames: ['x', 'y', 'z'] }],
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let el = <div class={cn({ red: true })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `let el = <div class={clsx({ red: true })}>Hello, world!</div>`,
        errors: [
          { messageId: 'preferClasslist', data: { classnames: 'clsx' } },
        ],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `let el = <div class={classnames({ red: true })}>Hello, world!</div>`,
        errors: [
          { messageId: 'preferClasslist', data: { classnames: 'classnames' } },
        ],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let el = <div class={x({ red: true })}>Hello, world!</div>`,
        options: [{ classnames: ['x', 'y', 'z'] }],
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'x' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `let el = <div className={cn({ red: true })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('invalid case 6', () => {
      invalid({
        code: `let el = <div class={cn({ red: true, "mx-4": props.size > 2 })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true, "mx-4": props.size > 2 }}>Hello, world!</div>`,
      });
    });
  });
});
