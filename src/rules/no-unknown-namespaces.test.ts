import rule from './no-unknown-namespaces.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-unknown-namespaces', rule);
const invalid = testInvalid('no-unknown-namespaces', rule);

describe('no-unknown-namespaces', () => {
  describe('valid', () => {
    test('standard on: namespace is valid', () => {
      valid(`let el = <div on:click={null} />;`);
    });
    test('standard on: namespace with different event is valid', () => {
      valid(`let el = <div on:focus={null} />;`);
    });
    test('standard on: namespace without value is valid', () => {
      valid(`let el = <div on:quux />;`);
    });
    test('standard oncapture: namespace is valid', () => {
      valid(`let el = <div oncapture:click={null} />;`);
    });
    test('standard oncapture: namespace with different event is valid', () => {
      valid(`let el = <div oncapture:focus={null} />;`);
    });
    test('standard use: namespace is valid', () => {
      valid(`let el = <div use:X={null} />;`);
    });
    test('standard use: namespace without value is valid', () => {
      valid(`let el = <div use:X />;`);
    });
    test('standard prop: namespace is valid', () => {
      valid(`let el = <div prop:scrollTop="0px" />;`);
    });
    test('standard attr: namespace is valid', () => {
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
    test('detects attr: namespace on custom component', () => {
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
