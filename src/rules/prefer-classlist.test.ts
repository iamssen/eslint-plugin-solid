import rule from './prefer-classlist.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('prefer-classlist', rule);
const invalid = testInvalid('prefer-classlist', rule);

describe('prefer-classlist', () => {
  describe('valid', () => {
    test('classlist prop is valid', () => {
      valid(`let el = <div classlist={{ red: true }}>Hello, world!</div>`);
    });
    test('class prop with string literal is valid', () => {
      valid(`let el = <div class="red">Hello, world!</div>`);
    });
    test('className prop with string literal is valid', () => {
      valid(`let el = <div className="red">Hello, world!</div>`);
    });
    test('cn function used in custom prop is valid', () => {
      valid(`let el = <div something={cn({ red: true })}>Hello, world!</div>`);
    });
    test('clsx function used in custom prop is valid', () => {
      valid(
        `let el = <div something={clsx({ red: true })}>Hello, world!</div>`,
      );
    });
    test('classnames function used in custom prop is valid', () => {
      valid(
        `let el = <div something={classnames({ red: true })}>Hello, world!</div>`,
      );
    });
    test('other function used in class prop is valid', () => {
      valid(
        `let el = <div class={someOtherClassFunction({ red: true })}>Hello, world!</div>`,
      );
    });
    test('cn function with multiple arguments in class prop is valid', () => {
      valid(
        `let el = <div class={cn({ red: true }, condition && "yellow")}>Hello, world!</div>`,
      );
    });
    test('cn function with conditional in custom prop is valid', () => {
      valid(
        `let el = <div something={cn(condition && "yellow")}>Hello, world!</div>`,
      );
    });
    test('clsx function in class prop alongside classlist is valid', () => {
      valid(
        `let el = <div class={clsx({ red: true })} classlist={{}}>Hello, world!</div>`,
      );
    });
    test('clsx function in class prop is valid when not in options', () => {
      valid({
        code: `let el = <div class={clsx({ red: true })}>Hello, world!</div>`,
        options: [{ classnames: ['x', 'y', 'z'] }],
      });
    });
  });
  describe('invalid', () => {
    test('detects cn function in class prop and suggests classlist', () => {
      invalid({
        code: `let el = <div class={cn({ red: true })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('detects clsx function in class prop and suggests classlist', () => {
      invalid({
        code: `let el = <div class={clsx({ red: true })}>Hello, world!</div>`,
        errors: [
          { messageId: 'preferClasslist', data: { classnames: 'clsx' } },
        ],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('detects classnames function in class prop and suggests classlist', () => {
      invalid({
        code: `let el = <div class={classnames({ red: true })}>Hello, world!</div>`,
        errors: [
          { messageId: 'preferClasslist', data: { classnames: 'classnames' } },
        ],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('detects custom function from options in class prop', () => {
      invalid({
        code: `let el = <div class={x({ red: true })}>Hello, world!</div>`,
        options: [{ classnames: ['x', 'y', 'z'] }],
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'x' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('detects cn function in className prop', () => {
      invalid({
        code: `let el = <div className={cn({ red: true })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true }}>Hello, world!</div>`,
      });
    });
    test('detects cn function with multiple arguments and suggests classlist', () => {
      invalid({
        code: `let el = <div class={cn({ red: true, "mx-4": props.size > 2 })}>Hello, world!</div>`,
        errors: [{ messageId: 'preferClasslist', data: { classnames: 'cn' } }],
        output: `let el = <div classlist={{ red: true, "mx-4": props.size > 2 }}>Hello, world!</div>`,
      });
    });
  });
});
