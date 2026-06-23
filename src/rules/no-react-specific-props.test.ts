import rule from './no-react-specific-props.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-react-specific-props', rule);
const invalid = testInvalid('no-react-specific-props', rule);

describe('no-react-specific-props', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let el = <div>Hello world!</div>;`);
    });
    test('valid case 2', () => {
      valid(`let el = <div class="greeting">Hello world!</div>;`);
    });
    test('valid case 3', () => {
      valid(`let el = <div class={"greeting"}>Hello world!</div>;`);
    });
    test('valid case 4', () => {
      valid(
        `let el = <div many other attributes class="greeting">Hello world!</div>;`,
      );
    });
    test('valid case 5', () => {
      valid(`let el = <label for="id">Hello world!</label>;`);
    });
    test('valid case 6', () => {
      valid(`let el = <label for="id">Hello world!</label>`);
    });
    test('valid case 7', () => {
      valid(`let el = <label for={"id"}>Hello world!</label>`);
    });
    test('valid case 8', () => {
      valid(
        `let el = <label many other attributes for="id">Hello world!</label>`,
      );
    });
    test('valid case 9', () => {
      valid(`let el = <PascalComponent class="greeting" for="id" />`);
    });
    test('valid case 10', () => {
      valid(`let el = <PascalComponent key={item.id} />`);
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let el = <div className="greeting">Hello world!</div>`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <div class="greeting">Hello world!</div>`,
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `let el = <div className={"greeting"}>Hello world!</div>`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <div class={"greeting"}>Hello world!</div>`,
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `let el = <div className="greeting" />`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <div class="greeting" />`,
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let el = <div many other attributes className="greeting">Hello world!</div>`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <div many other attributes class="greeting">Hello world!</div>`,
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `let el = <PascalComponent className="greeting">Hello world!</PascalComponent>`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <PascalComponent class="greeting">Hello world!</PascalComponent>`,
      });
    });
    test('invalid case 6', () => {
      invalid({
        code: `let el = <label htmlFor="id">Hello world!</label>`,
        errors: [{ messageId: 'prefer', data: { from: 'htmlFor', to: 'for' } }],
        output: `let el = <label for="id">Hello world!</label>`,
      });
    });
    test('invalid case 7', () => {
      invalid({
        code: `let el = <label htmlFor={"id"}>Hello world!</label>`,
        errors: [{ messageId: 'prefer', data: { from: 'htmlFor', to: 'for' } }],
        output: `let el = <label for={"id"}>Hello world!</label>`,
      });
    });
    test('invalid case 8', () => {
      invalid({
        code: `let el = <label many other attributes htmlFor="id">Hello world!</label>`,
        errors: [{ messageId: 'prefer', data: { from: 'htmlFor', to: 'for' } }],
        output: `let el = <label many other attributes for="id">Hello world!</label>`,
      });
    });
    test('invalid case 9', () => {
      invalid({
        code: `let el = <PascalComponent htmlFor="id">Hello world!</PascalComponent>`,
        errors: [{ messageId: 'prefer', data: { from: 'htmlFor', to: 'for' } }],
        output: `let el = <PascalComponent for="id">Hello world!</PascalComponent>`,
      });
    });
    test('invalid case 10', () => {
      invalid({
        code: `let el = <div key={item.id} />`,
        errors: [{ messageId: 'noUselessKey' }],
        output: `let el = <div  />`,
      });
    });
  });
});
