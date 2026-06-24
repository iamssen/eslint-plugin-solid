import { describe, test } from 'vitest';
import rule from './jsx-no-script-url.js';
import { testInvalid, testValid } from './ruleTester.js';

const valid = testValid('jsx-no-script-url', rule);
const invalid = testInvalid('jsx-no-script-url', rule);

describe('jsx-no-script-url', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let el = <a href="https://example.com" />`);
    });
    test('valid case 2', () => {
      valid(`let el = <Link to="https://example.com" />`);
    });
    test('valid case 3', () => {
      valid(`let el = <Foo bar="https://example.com" />`);
    });
    test('valid case 4', () => {
      valid(`
        const link = "https://example.com";
        let el = <a href={link} />
      `);
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let el = <a href="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `let el = <Link to="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `let el = <Foo bar="javascript:alert('hacked!')" />`,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `
          const link = "javascript:alert('hacked!')";
          let el = <a href={link} />
        `,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: String.raw`
          const link = "\tj\na\tv\na\ts\nc\tr\ni\tpt:alert('hacked!')";
          let el = <a href={link} />
        `,
        errors: [{ messageId: 'noJSURL' }],
      });
    });
    test('invalid case 6', () => {
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
