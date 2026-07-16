import rule from './rule.js';
import { testValid, testInvalid } from '../ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-proxy-apis', rule);
const invalid = testInvalid('no-proxy-apis', rule);

describe('no-proxy-apis', () => {
  describe('valid', () => {
    test('using merge with empty object is valid', () => {
      valid(`let merged = merge({}, props);`);
    });
    test('using merge with variable object is valid', () => {
      valid(`const obj = {}; let merged = merge(obj, props);`);
    });
    test('using merge with let variable object is valid', () => {
      valid(`let obj = {}; let merged = merge(obj, props);`);
    });
    test('using merge with getter is valid', () => {
      valid(`let merged = merge({ get asdf() { signal() } }, props);`);
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
    test('detects merge with single argument', () => {
      invalid({
        code: `import { merge } from 'solid-js'; let merged = merge(maybeSignal)`,
        errors: [{ messageId: 'merge' }],
      });
    });
    test('detects merge with function argument', () => {
      invalid({
        code: `import { merge } from 'solid-js'; let func = () => ({}); let merged = merge(func, props)`,
        errors: [{ messageId: 'merge' }],
      });
    });
  });
});
