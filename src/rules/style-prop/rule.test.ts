import { testValid, testInvalid } from '../ruleTester.js';
import rule from './rule.js';
import { describe, test } from 'vitest';

const valid = testValid('style-prop', rule);
const invalid = testInvalid('style-prop', rule);

describe('style-prop', () => {
  describe('valid', () => {
    test('style prop with object literal is valid', () => {
      valid(`let el = <div style={{ color: 'red' }}>Hello, world!</div>`);
    });
    test('style prop with object literal containing kebab-case properties is valid', () => {
      valid(
        `let el = <div style={{ color: 'red', 'background-color': 'green' }}>Hello, world!</div>`,
      );
    });
    test('style prop with object literal containing kebab-case properties in double quotes is valid', () => {
      valid(
        `let el = <div style={{ color: "red", "background-color": "green" }}>Hello, world!</div>`,
      );
    });
    test('style prop with vendor prefix property is valid', () => {
      valid(
        `let el = <div style={{ "-webkit-align-content": "center" }}>Hello, world!</div>`,
      );
    });
    test('style prop with font-size property is valid', () => {
      valid(
        `let el = <div style={{ "font-size": "10px" }}>Hello, world!</div>`,
      );
    });
    test('style prop with font-size property value 0 is valid', () => {
      valid(`let el = <div style={{ "font-size": "0" }}>Hello, world!</div>`);
    });
    test('style prop with font-size property numeric value 0 is valid', () => {
      valid(`let el = <div style={{ "font-size": 0 }}>Hello, world!</div>`);
    });
    test('style prop is case-sensitive, ignores uppercase STYLE prop', () => {
      valid(`let el = <div STYLE={{ fontSize: 10 }}>Hello, world!</div>`);
    });
    test('style prop with flex-grow property numeric value is valid', () => {
      valid(`let el = <div style={{ "flex-grow": 1 }}>Hello, world!</div>`);
    });
    test('style prop with custom css variable is valid', () => {
      valid(
        `let el = <div style={{ "--custom-width": 1 }}>Hello, world!</div>`,
      );
    });
    test('style prop with string literal is valid when allowString is true', () => {
      valid({
        code: `let el = <div style="color: red;" />`,
        options: [{ allowString: true }],
      });
    });
    test('style prop with template literal is valid when allowString is true', () => {
      valid({
        code: `let el = <div style={\`color: \${themeColor};\`} />`,
        options: [{ allowString: true }],
      });
    });
    test('css prop with object literal is valid when styleProps includes css', () => {
      valid({
        code: `let el = <div css={{ color: 'red' }}>Hello, world</div>`,
        options: [{ styleProps: ['style', 'css'] }],
      });
    });
    test('style prop is ignored when styleProps only includes css', () => {
      valid({
        code: `let el = <div style={{ fontSize: 10 }}>Hello, world!</div>`,
        options: [{ styleProps: ['css'] }],
      });
    });
  });
  describe('invalid', () => {
    test('detects camelCase style property and suggests kebab-case', () => {
      invalid({
        code: `let el = <div style={{ fontSize: '10px' }}>Hello, world!</div>`,
        errors: [
          {
            messageId: 'kebabStyleProp',
            data: { name: 'fontSize', kebabName: 'font-size' },
          },
        ],
        output: `let el = <div style={{ "font-size": '10px' }}>Hello, world!</div>`,
      });
    });
    test('detects backgroundColor property and suggests background-color', () => {
      invalid({
        code: `let el = <div style={{ backgroundColor: 'red' }}>Hello, world!</div>`,
        errors: [
          {
            messageId: 'kebabStyleProp',
            data: { name: 'backgroundColor', kebabName: 'background-color' },
          },
        ],
        output: `let el = <div style={{ "background-color": 'red' }}>Hello, world!</div>`,
      });
    });
    test('detects camelCase vendor prefix property and suggests kebab-case', () => {
      invalid({
        code: `let el = <div style={{ "-webkitAlignContent": "center" }}>Hello, world!</div>`,
        errors: [{ messageId: 'kebabStyleProp' }],
        output: `let el = <div style={{ "-webkit-align-content": "center" }}>Hello, world!</div>`,
      });
    });
    test('detects uppercase style property', () => {
      invalid({
        code: `let el = <div style={{ COLOR: '10px' }}>Hello, world!</div>`,
        errors: [{ messageId: 'invalidStyleProp', data: { name: 'COLOR' } }],
      });
    });
    test('detects unknown style property', () => {
      invalid({
        code: `let el = <div style={{ unknownStyleProp: '10px' }}>Hello, world!</div>`,
        errors: [
          { messageId: 'invalidStyleProp', data: { name: 'unknownStyleProp' } },
        ],
      });
    });
    test('detects camelCase css property and suggests kebab-case', () => {
      invalid({
        code: `let el = <div css={{ fontSize: '10px' }}>Hello, world!</div>`,
        options: [{ styleProps: ['style', 'css'] }],
        errors: [
          {
            messageId: 'kebabStyleProp',
            data: { name: 'fontSize', kebabName: 'font-size' },
          },
        ],
        output: `let el = <div css={{ "font-size": '10px' }}>Hello, world!</div>`,
      });
    });
    test('detects camelCase css property when styleProps only includes css', () => {
      invalid({
        code: `let el = <div css={{ fontSize: '10px' }}>Hello, world!</div>`,
        options: [{ styleProps: ['css'] }],
        errors: [
          {
            messageId: 'kebabStyleProp',
            data: { name: 'fontSize', kebabName: 'font-size' },
          },
        ],
        output: `let el = <div css={{ "font-size": '10px' }}>Hello, world!</div>`,
      });
    });
    test('detects style prop with string literal and suggests object literal', () => {
      invalid({
        code: `let el = <div style="font-size: 10px;">Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
        output: `let el = <div style={{"font-size":"10px"}}>Hello, world!</div>`,
      });
    });
    test('detects style prop with JSX string literal and suggests object literal', () => {
      invalid({
        code: `let el = <div style={"font-size: 10px;"}>Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
        output: `let el = <div style={{"font-size":"10px"}}>Hello, world!</div>`,
      });
    });
    test('detects style prop with string literal containing missing value and suggests object literal', () => {
      invalid({
        code: `let el = <div style="font-size: 10px; missing-value: ;">Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
        output: `let el = <div style={{"font-size":"10px"}}>Hello, world!</div>`,
      });
    });
    test('detects style prop with invalid CSS string literal', () => {
      invalid({
        code: `let el = <div style="Super invalid CSS! Not CSS at all!">Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
      });
    });
    test('detects style prop with template literal and suggests object literal', () => {
      invalid({
        code: `let el = <div style={\`font-size: 10px;\`}>Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
      });
    });
    test('detects style prop with numeric value needing unit', () => {
      invalid({
        code: `let el = <div style={{ 'font-size': 10 }}>Hello, world!</div>`,
        errors: [{ messageId: 'numericStyleValue' }],
      });
    });
    test('detects style prop with negative numeric value needing unit', () => {
      invalid({
        code: `let el = <div style={{ 'margin-top': -10 }}>Hello, world!</div>`,
        errors: [{ messageId: 'numericStyleValue' }],
      });
    });
  });
});
