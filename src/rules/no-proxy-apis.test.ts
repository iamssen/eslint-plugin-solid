import rule from './no-proxy-apis.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-proxy-apis', rule);
const invalid = testInvalid('no-proxy-apis', rule);

describe('no-proxy-apis', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let merged = mergeProps({}, props);`);
    });
    test('valid case 2', () => {
      valid(`const obj = {}; let merged = mergeProps(obj, props);`);
    });
    test('valid case 3', () => {
      valid(`let obj = {}; let merged = mergeProps(obj, props);`);
    });
    test('valid case 4', () => {
      valid(`let merged = mergeProps({ get asdf() { signal() } }, props);`);
    });
    test('valid case 5', () => {
      valid(`let el = <div {...{ asdf: 'asdf' }} />`);
    });
    test('valid case 6', () => {
      valid(`let el = <div {...asdf} />`);
    });
    test('valid case 7', () => {
      valid(`let obj = { Proxy: 1 }`);
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let proxy = new Proxy(asdf, {});`,
        errors: [{ messageId: 'proxyLiteral' }],
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `let proxy = Proxy.revocable(asdf, {});`,
        errors: [{ messageId: 'proxyLiteral' }],
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `import {} from 'solid-js/store';`,
        errors: [{ messageId: 'noStore' }],
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let el = <div {...maybeSignal()} />`,
        errors: [{ messageId: 'spreadCall' }],
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `let el = <div {...{ ...maybeSignal() }} />`,
        errors: [{ messageId: 'spreadCall' }],
      });
    });
    test('invalid case 6', () => {
      invalid({
        code: `let el = <div {...maybeProps.foo} />`,
        errors: [{ messageId: 'spreadMember' }],
      });
    });
    test('invalid case 7', () => {
      invalid({
        code: `let el = <div {...{ ...maybeProps.foo }} />`,
        errors: [{ messageId: 'spreadMember' }],
      });
    });
    test('invalid case 8', () => {
      invalid({
        code: `let merged = mergeProps(maybeSignal)`,
        errors: [{ messageId: 'mergeProps' }],
      });
    });
    test('invalid case 9', () => {
      invalid({
        code: `let func = () => ({}); let merged = mergeProps(func, props)`,
        errors: [{ messageId: 'mergeProps' }],
      });
    });
  });
});
