import { testValid, testInvalid } from './ruleTester.js';
import rule from './style-prop.js';
import { describe, test } from 'vitest';

const valid = testValid('style-prop', rule);
const invalid = testInvalid('style-prop', rule);

describe('style-prop', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let el = <div style={{ color: 'red' }}>Hello, world!</div>`);
    });
    test('valid case 2', () => {
      valid(
        `let el = <div style={{ color: 'red', 'background-color': 'green' }}>Hello, world!</div>`,
      );
    });
    test('valid case 3', () => {
      valid(
        `let el = <div style={{ color: "red", "background-color": "green" }}>Hello, world!</div>`,
      );
    });
    test('valid case 4', () => {
      valid(
        `let el = <div style={{ "-webkit-align-content": "center" }}>Hello, world!</div>`,
      );
    });
    test('valid case 5', () => {
      valid(
        `let el = <div style={{ "font-size": "10px" }}>Hello, world!</div>`,
      );
    });
    test('valid case 6', () => {
      valid(`let el = <div style={{ "font-size": "0" }}>Hello, world!</div>`);
    });
    test('valid case 7', () => {
      valid(`let el = <div style={{ "font-size": 0 }}>Hello, world!</div>`);
    });
    test('valid case 8', () => {
      valid(`let el = <div STYLE={{ fontSize: 10 }}>Hello, world!</div>`);
    });
    test('valid case 9', () => {
      valid(`let el = <div style={{ "flex-grow": 1 }}>Hello, world!</div>`);
    });
    test('valid case 10', () => {
      valid(
        `let el = <div style={{ "--custom-width": 1 }}>Hello, world!</div>`,
      );
    });
    test('valid case 11', () => {
      valid({
        code: `let el = <div style="color: red;" />`,
        options: [{ allowString: true }],
      });
    });
    test('valid case 12', () => {
      valid({
        code: `let el = <div style={\`color: \${themeColor};\`} />`,
        options: [{ allowString: true }],
      });
    });
    test('valid case 13', () => {
      valid({
        code: `let el = <div css={{ color: 'red' }}>Hello, world</div>`,
        options: [{ styleProps: ['style', 'css'] }],
      });
    });
    test('valid case 14', () => {
      valid({
        code: `let el = <div style={{ fontSize: 10 }}>Hello, world!</div>`,
        options: [{ styleProps: ['css'] }],
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
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
    test('invalid case 2', () => {
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
    test('invalid case 3', () => {
      invalid({
        code: `let el = <div style={{ "-webkitAlignContent": "center" }}>Hello, world!</div>`,
        errors: [{ messageId: 'kebabStyleProp' }],
        output: `let el = <div style={{ "-webkit-align-content": "center" }}>Hello, world!</div>`,
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let el = <div style={{ COLOR: '10px' }}>Hello, world!</div>`,
        errors: [{ messageId: 'invalidStyleProp', data: { name: 'COLOR' } }],
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `let el = <div style={{ unknownStyleProp: '10px' }}>Hello, world!</div>`,
        errors: [
          { messageId: 'invalidStyleProp', data: { name: 'unknownStyleProp' } },
        ],
      });
    });
    test('invalid case 6', () => {
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
    test('invalid case 7', () => {
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
    test('invalid case 8', () => {
      invalid({
        code: `let el = <div style="font-size: 10px;">Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
        output: `let el = <div style={{"font-size":"10px"}}>Hello, world!</div>`,
      });
    });
    test('invalid case 9', () => {
      invalid({
        code: `let el = <div style={"font-size: 10px;"}>Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
        output: `let el = <div style={{"font-size":"10px"}}>Hello, world!</div>`,
      });
    });
    test('invalid case 10', () => {
      invalid({
        code: `let el = <div style="font-size: 10px; missing-value: ;">Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
        output: `let el = <div style={{"font-size":"10px"}}>Hello, world!</div>`,
      });
    });
    test('invalid case 11', () => {
      invalid({
        code: `let el = <div style="Super invalid CSS! Not CSS at all!">Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
      });
    });
    test('invalid case 12', () => {
      invalid({
        code: `let el = <div style={\`font-size: 10px;\`}>Hello, world!</div>`,
        errors: [{ messageId: 'stringStyle' }],
      });
    });
    test('invalid case 13', () => {
      invalid({
        code: `let el = <div style={{ 'font-size': 10 }}>Hello, world!</div>`,
        errors: [{ messageId: 'numericStyleValue' }],
      });
    });
    test('invalid case 14', () => {
      invalid({
        code: `let el = <div style={{ 'margin-top': -10 }}>Hello, world!</div>`,
        errors: [{ messageId: 'numericStyleValue' }],
      });
    });
  });
});
