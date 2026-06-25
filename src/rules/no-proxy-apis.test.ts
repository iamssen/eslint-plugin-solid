import rule from './no-proxy-apis.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-proxy-apis', rule);
const invalid = testInvalid('no-proxy-apis', rule);

describe('no-proxy-apis', () => {
  describe('valid', () => {
    test('using mergeProps with empty object is valid', () => {
      valid(`let merged = mergeProps({}, props);`);
    });
    test('using mergeProps with variable object is valid', () => {
      valid(`const obj = {}; let merged = mergeProps(obj, props);`);
    });
    test('using mergeProps with let variable object is valid', () => {
      valid(`let obj = {}; let merged = mergeProps(obj, props);`);
    });
    test('using mergeProps with getter is valid', () => {
      valid(`let merged = mergeProps({ get asdf() { signal() } }, props);`);
    });
    test('spreading object literal is valid', () => {
      valid(`let el = <div {...{ asdf: 'asdf' }} />`);
    });
    test('spreading variable is valid', () => {
      valid(`let el = <div {...asdf} />`);
    });
    test('using property named Proxy is valid', () => {
      valid(`let obj = { Proxy: 1 }`);
    });
  });
  describe('invalid', () => {
    test('detects new Proxy instantiation', () => {
      invalid({
        code: `let proxy = new Proxy(asdf, {});`,
        errors: [{ messageId: 'proxyLiteral' }],
      });
    });
    test('detects Proxy.revocable call', () => {
      invalid({
        code: `let proxy = Proxy.revocable(asdf, {});`,
        errors: [{ messageId: 'proxyLiteral' }],
      });
    });
    test('detects import from solid-js/store', () => {
      invalid({
        code: `import {} from 'solid-js/store';`,
        errors: [{ messageId: 'noStore' }],
      });
    });
    test('detects spreading function call', () => {
      invalid({
        code: `let el = <div {...maybeSignal()} />`,
        errors: [{ messageId: 'spreadCall' }],
      });
    });
    test('detects spreading function call inside object literal', () => {
      invalid({
        code: `let el = <div {...{ ...maybeSignal() }} />`,
        errors: [{ messageId: 'spreadCall' }],
      });
    });
    test('detects spreading member expression', () => {
      invalid({
        code: `let el = <div {...maybeProps.foo} />`,
        errors: [{ messageId: 'spreadMember' }],
      });
    });
    test('detects spreading member expression inside object literal', () => {
      invalid({
        code: `let el = <div {...{ ...maybeProps.foo }} />`,
        errors: [{ messageId: 'spreadMember' }],
      });
    });
    test('detects mergeProps with single argument', () => {
      invalid({
        code: `let merged = mergeProps(maybeSignal)`,
        errors: [{ messageId: 'mergeProps' }],
      });
    });
    test('detects mergeProps with function argument', () => {
      invalid({
        code: `let func = () => ({}); let merged = mergeProps(func, props)`,
        errors: [{ messageId: 'mergeProps' }],
      });
    });
  });
});
