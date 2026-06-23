import rule from './no-unknown-namespaces.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-unknown-namespaces', rule);
const invalid = testInvalid('no-unknown-namespaces', rule);

describe('no-unknown-namespaces', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let el = <div on:click={null} />;`);
    });
    test('valid case 2', () => {
      valid(`let el = <div on:focus={null} />;`);
    });
    test('valid case 3', () => {
      valid(`let el = <div on:quux />;`);
    });
    test('valid case 4', () => {
      valid(`let el = <div oncapture:click={null} />;`);
    });
    test('valid case 5', () => {
      valid(`let el = <div oncapture:focus={null} />;`);
    });
    test('valid case 6', () => {
      valid(`let el = <div use:X={null} />;`);
    });
    test('valid case 7', () => {
      valid(`let el = <div use:X />;`);
    });
    test('valid case 8', () => {
      valid(`let el = <div prop:scrollTop="0px" />;`);
    });
    test('valid case 9', () => {
      valid(`let el = <div attr:title="title" />;`);
    });
    test('valid case 10', () => {
      valid(
        `let el = <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>`,
      );
    });
    test('valid case 11', () => {
      valid({
        options: [{ allowedNamespaces: ['foo'] }],
        code: `let el = <bar foo="http://www.w3.org/2000/svg" version="1.1" foo:bar="http://www.w3.org/1999/xlink" />`,
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let el = <div foo:boo={null} />`,
        errors: [{ messageId: 'unknown', data: { namespace: 'foo' } }],
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `let el = <div bar:car={null} />`,
        errors: [{ messageId: 'unknown', data: { namespace: 'bar' } }],
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `let el = <div style:width="100%" />`,
        errors: [{ messageId: 'style', data: { namespace: 'style' } }],
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let el = <div style:width={0} />`,
        errors: [{ messageId: 'style', data: { namespace: 'style' } }],
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `let el = <div class:mt-10={true} />`,
        errors: [{ messageId: 'style', data: { namespace: 'class' } }],
      });
    });
    test('invalid case 6', () => {
      invalid({
        code: `let el = <div class:mt-10 />`,
        errors: [{ messageId: 'style', data: { namespace: 'class' } }],
      });
    });
    test('invalid case 7', () => {
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
    test('invalid case 8', () => {
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
