import rule from './no-unknown-namespaces.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-unknown-namespaces', rule);
const invalid = testInvalid('no-unknown-namespaces', rule);

describe('no-unknown-namespaces', () => {
  describe('valid', () => {
    // Solid 2.0에서 on:은 제거됐다. 일반 이벤트에는 onClick을 사용한다.
    test.skip('standard on: namespace is valid', () => {
      valid(`let el = <div on:click={null} />;`);
    });
    // Solid 2.0에서 on:은 제거됐다. 일반 이벤트에는 onClick을 사용한다.
    test.skip('standard on: namespace with different event is valid', () => {
      valid(`let el = <div on:focus={null} />;`);
    });
    // Solid 2.0에서 on:은 제거됐다. 일반 이벤트에는 onClick을 사용한다.
    test.skip('standard on: namespace without value is valid', () => {
      valid(`let el = <div on:quux />;`);
    });
    // Solid 2.0에서 oncapture:는 제거됐다. capture 옵션은 ref에서 addEventListener로 설정한다.
    test.skip('standard oncapture: namespace is valid', () => {
      valid(`let el = <div oncapture:click={null} />;`);
    });
    // Solid 2.0에서 oncapture:는 제거됐다. capture 옵션은 ref에서 addEventListener로 설정한다.
    test.skip('standard oncapture: namespace with different event is valid', () => {
      valid(`let el = <div oncapture:focus={null} />;`);
    });
    // Solid 2.0에서 use: directive는 제거됐다. ref directive factory로 다시 설계해야 한다.
    test.skip('standard use: namespace is valid', () => {
      valid(`let el = <div use:X={null} />;`);
    });
    // Solid 2.0에서 use: directive는 제거됐다. ref directive factory로 다시 설계해야 한다.
    test.skip('standard use: namespace without value is valid', () => {
      valid(`let el = <div use:X />;`);
    });
    // TODO(Solid 2): 가이드는 prop: namespace의 지원 여부를 명시하지 않는다.
    // @solidjs/web JSX 타입과 compiler 동작을 확인할 때까지 기존 사례를 유지한다.
    test('standard prop: namespace is valid', () => {
      valid(`let el = <div prop:scrollTop="0px" />;`);
    });
    // Solid 2.0에서 attr:은 제거됐다. 표준 attribute prop을 사용한다.
    test.skip('standard attr: namespace is valid', () => {
      valid(`let el = <div attr:title="title" />;`);
    });
    test('standard xmlns: namespace is valid', () => {
      valid(
        `let el = <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>`,
      );
    });
    test('custom namespace in allowedNamespaces is valid', () => {
      valid({
        options: [{ allowedNamespaces: ['foo'] }],
        code: `let el = <bar foo="http://www.w3.org/2000/svg" version="1.1" foo:bar="http://www.w3.org/1999/xlink" />`,
      });
    });
  });
  describe('invalid', () => {
    test('detects unknown namespace foo:', () => {
      invalid({
        code: `let el = <div foo:boo={null} />`,
        errors: [{ messageId: 'unknown', data: { namespace: 'foo' } }],
      });
    });
    test('detects unknown namespace bar:', () => {
      invalid({
        code: `let el = <div bar:car={null} />`,
        errors: [{ messageId: 'unknown', data: { namespace: 'bar' } }],
      });
    });
    test('detects style: namespace and suggests standard style prop', () => {
      invalid({
        code: `let el = <div style:width="100%" />`,
        errors: [{ messageId: 'style', data: { namespace: 'style' } }],
      });
    });
    test('detects style: namespace with expression', () => {
      invalid({
        code: `let el = <div style:width={0} />`,
        errors: [{ messageId: 'style', data: { namespace: 'style' } }],
      });
    });
    test('detects class: namespace and suggests standard class prop', () => {
      invalid({
        code: `let el = <div class:mt-10={true} />`,
        errors: [{ messageId: 'style', data: { namespace: 'class' } }],
      });
    });
    test('detects class: namespace without value', () => {
      invalid({
        code: `let el = <div class:mt-10 />`,
        errors: [{ messageId: 'style', data: { namespace: 'class' } }],
      });
    });
    // Solid 2.0에서 attr:은 제거됐다. 이 rule의 2.0 migration 진단으로 교체할 때 다시 활성화한다.
    test.skip('detects attr: namespace on custom component', () => {
      invalid({
        code: `let el = <Box attr:foo="bar" />`,
        errors: [
          {
            messageId: 'component',
            suggestions: [
              {
                messageId: 'component-suggest',
                data: { namespace: 'attr', name: 'foo' },
                output: `let el = <Box foo="bar" />`,
              },
            ],
          },
        ],
      });
    });
    test('detects unknown namespace on custom component', () => {
      invalid({
        code: `let el = <Box foo:boo={null} />`,
        errors: [
          {
            messageId: 'component',
            suggestions: [
              {
                messageId: 'component-suggest',
                data: { namespace: 'foo', name: 'boo' },
                output: `let el = <Box boo={null} />`,
              },
            ],
          },
        ],
      });
    });
  });
});
