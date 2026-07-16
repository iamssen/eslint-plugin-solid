import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('jsx-no-script-url', rule);
const invalid = testInvalid('jsx-no-script-url', rule);

describe('jsx-no-script-url', () => {
  describe('valid', () => {
    test('standard http URLs are valid', () => {
      valid(`let el = <a href="https://example.com" />`);
    });
    test('standard http URLs in custom components are valid', () => {
      valid(`let el = <Link to="https://example.com" />`);
    });
    test('standard http URLs in custom props are valid', () => {
      valid(`let el = <Foo bar="https://example.com" />`);
    });
    test('standard http URLs passed as variables are valid', () => {
      valid(`
        const link = "https://example.com";
        let el = <a href={link} />
      `);
    });
  });
  describe('invalid', () => {
    test('javascript: URLs in a tags are invalid', () => {
      invalid({
        code: `let el = <a href="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('javascript: URLs in Link components are invalid', () => {
      invalid({
        code: `let el = <Link to="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('javascript: URLs in custom props are invalid', () => {
      invalid({
        code: `let el = <Foo bar="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('javascript: URLs passed as variables are invalid', () => {
      invalid({
        code: `
          const link = "javascript:alert('hacked!')";
          let el = <a href={link} />
        `,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('javascript: URLs with tab and newline characters are invalid', () => {
      invalid({
        code: String.raw`
          const link = "\tj\na\tv\na\ts\nc\tr\ni\tpt:alert('hacked!')";
          let el = <a href={link} />
        `,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('javascript: URLs constructed from concatenated strings are invalid', () => {
      invalid({
        code: `
          const link = "javascrip" + "t:alert('hacked!')";
          let el = <a href={link} />
        `,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
  });
});
