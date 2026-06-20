import rule from './no-unknown-namespaces.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('no-unknown-namespaces', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'no-unknown-namespaces',
        rule,
        `let el = <div on:click={null} />;`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'no-unknown-namespaces',
        rule,
        `let el = <div on:focus={null} />;`,
      );
    });
    test('valid case 3', () => {
      testValid('no-unknown-namespaces', rule, `let el = <div on:quux />;`);
    });
    test('valid case 4', () => {
      testValid(
        'no-unknown-namespaces',
        rule,
        `let el = <div oncapture:click={null} />;`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'no-unknown-namespaces',
        rule,
        `let el = <div oncapture:focus={null} />;`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'no-unknown-namespaces',
        rule,
        `let el = <div use:X={null} />;`,
      );
    });
    test('valid case 7', () => {
      testValid('no-unknown-namespaces', rule, `let el = <div use:X />;`);
    });
    test('valid case 8', () => {
      testValid(
        'no-unknown-namespaces',
        rule,
        `let el = <div prop:scrollTop="0px" />;`,
      );
    });
    test('valid case 9', () => {
      testValid(
        'no-unknown-namespaces',
        rule,
        `let el = <div attr:title="title" />;`,
      );
    });
    test('valid case 10', () => {
      testValid(
        'no-unknown-namespaces',
        rule,
        `let el = <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>`,
      );
    });
    test('valid case 11', () => {
      testValid('no-unknown-namespaces', rule, {
        options: [{ allowedNamespaces: ['foo'] }],
        code: `let el = <bar foo="http://www.w3.org/2000/svg" version="1.1" foo:bar="http://www.w3.org/1999/xlink" />`,
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('no-unknown-namespaces', rule, {
        code: `let el = <div foo:boo={null} />`,
        errors: [{ messageId: 'unknown', data: { namespace: 'foo' } }],
      });
    });
    test('invalid case 2', () => {
      testInvalid('no-unknown-namespaces', rule, {
        code: `let el = <div bar:car={null} />`,
        errors: [{ messageId: 'unknown', data: { namespace: 'bar' } }],
      });
    });
    test('invalid case 3', () => {
      testInvalid('no-unknown-namespaces', rule, {
        code: `let el = <div style:width="100%" />`,
        errors: [{ messageId: 'style', data: { namespace: 'style' } }],
      });
    });
    test('invalid case 4', () => {
      testInvalid('no-unknown-namespaces', rule, {
        code: `let el = <div style:width={0} />`,
        errors: [{ messageId: 'style', data: { namespace: 'style' } }],
      });
    });
    test('invalid case 5', () => {
      testInvalid('no-unknown-namespaces', rule, {
        code: `let el = <div class:mt-10={true} />`,
        errors: [{ messageId: 'style', data: { namespace: 'class' } }],
      });
    });
    test('invalid case 6', () => {
      testInvalid('no-unknown-namespaces', rule, {
        code: `let el = <div class:mt-10 />`,
        errors: [{ messageId: 'style', data: { namespace: 'class' } }],
      });
    });
    test('invalid case 7', () => {
      testInvalid('no-unknown-namespaces', rule, {
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
    test('invalid case 8', () => {
      testInvalid('no-unknown-namespaces', rule, {
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
