import rule from './no-proxy-apis.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('no-proxy-apis', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid('no-proxy-apis', rule, `let merged = mergeProps({}, props);`);
    });
    test('valid case 2', () => {
      testValid(
        'no-proxy-apis',
        rule,
        `const obj = {}; let merged = mergeProps(obj, props);`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'no-proxy-apis',
        rule,
        `let obj = {}; let merged = mergeProps(obj, props);`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'no-proxy-apis',
        rule,
        `let merged = mergeProps({ get asdf() { signal() } }, props);`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'no-proxy-apis',
        rule,
        `let el = <div {...{ asdf: 'asdf' }} />`,
      );
    });
    test('valid case 6', () => {
      testValid('no-proxy-apis', rule, `let el = <div {...asdf} />`);
    });
    test('valid case 7', () => {
      testValid('no-proxy-apis', rule, `let obj = { Proxy: 1 }`);
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `let proxy = new Proxy(asdf, {});`,
        errors: [{ messageId: 'proxyLiteral' }],
      });
    });
    test('invalid case 2', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `let proxy = Proxy.revocable(asdf, {});`,
        errors: [{ messageId: 'proxyLiteral' }],
      });
    });
    test('invalid case 3', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `import {} from 'solid-js/store';`,
        errors: [{ messageId: 'noStore' }],
      });
    });
    test('invalid case 4', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `let el = <div {...maybeSignal()} />`,
        errors: [{ messageId: 'spreadCall' }],
      });
    });
    test('invalid case 5', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `let el = <div {...{ ...maybeSignal() }} />`,
        errors: [{ messageId: 'spreadCall' }],
      });
    });
    test('invalid case 6', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `let el = <div {...maybeProps.foo} />`,
        errors: [{ messageId: 'spreadMember' }],
      });
    });
    test('invalid case 7', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `let el = <div {...{ ...maybeProps.foo }} />`,
        errors: [{ messageId: 'spreadMember' }],
      });
    });
    test('invalid case 8', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `let merged = mergeProps(maybeSignal)`,
        errors: [{ messageId: 'mergeProps' }],
      });
    });
    test('invalid case 9', () => {
      testInvalid('no-proxy-apis', rule, {
        code: `let func = () => ({}); let merged = mergeProps(func, props)`,
        errors: [{ messageId: 'mergeProps' }],
      });
    });
  });
});
