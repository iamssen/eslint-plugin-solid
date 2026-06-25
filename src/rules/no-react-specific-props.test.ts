import rule from './no-react-specific-props.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-react-specific-props', rule);
const invalid = testInvalid('no-react-specific-props', rule);

describe('no-react-specific-props', () => {
  describe('valid', () => {
    test('standard JSX elements are valid', () => {
      valid(`let el = <div>Hello world!</div>;`);
    });
    test('class prop is valid', () => {
      valid(`let el = <div class="greeting">Hello world!</div>;`);
    });
    test('class prop with expression is valid', () => {
      valid(`let el = <div class={"greeting"}>Hello world!</div>;`);
    });
    test('class prop alongside other attributes is valid', () => {
      valid(
        `let el = <div many other attributes class="greeting">Hello world!</div>;`,
      );
    });
    test('for prop is valid', () => {
      valid(`let el = <label for="id">Hello world!</label>;`);
    });
    test('for prop without trailing semicolon is valid', () => {
      valid(`let el = <label for="id">Hello world!</label>`);
    });
    test('for prop with expression is valid', () => {
      valid(`let el = <label for={"id"}>Hello world!</label>`);
    });
    test('for prop alongside other attributes is valid', () => {
      valid(
        `let el = <label many other attributes for="id">Hello world!</label>`,
      );
    });
    test('class and for props on custom components are valid', () => {
      valid(`let el = <PascalComponent class="greeting" for="id" />`);
    });
    test('key prop on custom components is valid', () => {
      valid(`let el = <PascalComponent key={item.id} />`);
    });
  });
  describe('invalid', () => {
    test('detects className prop and suggests class', () => {
      invalid({
        code: `let el = <div className="greeting">Hello world!</div>`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <div class="greeting">Hello world!</div>`,
      });
    });
    test('detects className prop with expression and suggests class', () => {
      invalid({
        code: `let el = <div className={"greeting"}>Hello world!</div>`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <div class={"greeting"}>Hello world!</div>`,
      });
    });
    test('detects className prop on self-closing element', () => {
      invalid({
        code: `let el = <div className="greeting" />`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <div class="greeting" />`,
      });
    });
    test('detects className prop alongside other attributes', () => {
      invalid({
        code: `let el = <div many other attributes className="greeting">Hello world!</div>`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <div many other attributes class="greeting">Hello world!</div>`,
      });
    });
    test('detects className prop on custom components', () => {
      invalid({
        code: `let el = <PascalComponent className="greeting">Hello world!</PascalComponent>`,
        errors: [
          { messageId: 'prefer', data: { from: 'className', to: 'class' } },
        ],
        output: `let el = <PascalComponent class="greeting">Hello world!</PascalComponent>`,
      });
    });
    test('detects htmlFor prop and suggests for', () => {
      invalid({
        code: `let el = <label htmlFor="id">Hello world!</label>`,
        errors: [{ messageId: 'prefer', data: { from: 'htmlFor', to: 'for' } }],
        output: `let el = <label for="id">Hello world!</label>`,
      });
    });
    test('detects htmlFor prop with expression and suggests for', () => {
      invalid({
        code: `let el = <label htmlFor={"id"}>Hello world!</label>`,
        errors: [{ messageId: 'prefer', data: { from: 'htmlFor', to: 'for' } }],
        output: `let el = <label for={"id"}>Hello world!</label>`,
      });
    });
    test('detects htmlFor prop alongside other attributes', () => {
      invalid({
        code: `let el = <label many other attributes htmlFor="id">Hello world!</label>`,
        errors: [{ messageId: 'prefer', data: { from: 'htmlFor', to: 'for' } }],
        output: `let el = <label many other attributes for="id">Hello world!</label>`,
      });
    });
    test('detects htmlFor prop on custom components', () => {
      invalid({
        code: `let el = <PascalComponent htmlFor="id">Hello world!</PascalComponent>`,
        errors: [{ messageId: 'prefer', data: { from: 'htmlFor', to: 'for' } }],
        output: `let el = <PascalComponent for="id">Hello world!</PascalComponent>`,
      });
    });
    test('detects key prop on native elements', () => {
      invalid({
        code: `let el = <div key={item.id} />`,
        errors: [{ messageId: 'noUselessKey' }],
        output: `let el = <div  />`,
      });
    });
  });
});
