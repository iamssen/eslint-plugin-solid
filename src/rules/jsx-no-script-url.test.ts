import rule from './jsx-no-script-url.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('jsx-no-script-url', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'jsx-no-script-url',
        rule,
        `let el = <a href="https://example.com" />`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'jsx-no-script-url',
        rule,
        `let el = <Link to="https://example.com" />`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'jsx-no-script-url',
        rule,
        `let el = <Foo bar="https://example.com" />`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'jsx-no-script-url',
        rule,
        `const link = "https://example.com";
    let el = <a href={link} />`,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('jsx-no-script-url', rule, {
        code: `let el = <a href="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 2', () => {
      testInvalid('jsx-no-script-url', rule, {
        code: `let el = <Link to="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 3', () => {
      testInvalid('jsx-no-script-url', rule, {
        code: `let el = <Foo bar="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 4', () => {
      testInvalid('jsx-no-script-url', rule, {
        code: `const link = "javascript:alert('hacked!')";
    let el = <a href={link} />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 5', () => {
      testInvalid('jsx-no-script-url', rule, {
        code: `const link = "\\tj\\na\\tv\\na\\ts\\nc\\tr\\ni\\tpt:alert('hacked!')";
    let el = <a href={link} />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 6', () => {
      testInvalid('jsx-no-script-url', rule, {
        code: `const link = "javascrip" + "t:alert('hacked!')";
    let el = <a href={link} />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
  });
});
