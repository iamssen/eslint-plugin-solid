import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('no-unknown-namespaces', rule);
const invalid = testInvalid('no-unknown-namespaces', rule);

const legacyReplacement = {
  use: 'Use a ref directive factory such as ref={tooltip(options)} instead',
  attr: 'Use the corresponding standard HTML attribute instead (for example, aria-label={label})',
  bool: 'Use the corresponding standard boolean attribute instead (for example, disabled={isDisabled()})',
  on: 'Use a camelCase handler such as onClick={handler} instead',
  oncapture:
    'Use ref with addEventListener when native listener options such as capture are required',
  class: 'Use the class prop with an object or array value instead',
  style: 'Use the style prop with an object value instead',
};

describe('no-unknown-namespaces', () => {
  describe('valid', () => {
    test('allows the supported prop: namespace on native elements', () => {
      valid(`let el = <div prop:scrollTop="0px" />;`);
    });

    test('allows SVG/XML namespaces', () => {
      valid(
        `let el = <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" />;`,
      );
    });

    test('allows namespaces configured by the user', () => {
      valid({
        options: [{ allowedNamespaces: ['foo'] }],
        code: `let el = <bar foo="http://www.w3.org/2000/svg" version="1.1" foo:bar="http://www.w3.org/1999/xlink" />;`,
      });
    });
  });

  describe('invalid', () => {
    test('detects the removed use: directive namespace', () => {
      invalid({
        code: `let el = <div use:tooltip={{ content: "Save" }} />;`,
        errors: [
          {
            messageId: 'legacy',
            data: { namespace: 'use', replacement: legacyReplacement.use },
          },
        ],
      });
    });

    test('detects the removed attr: namespace', () => {
      invalid({
        code: `let el = <div attr:aria-label="Save" />;`,
        errors: [
          {
            messageId: 'legacy',
            data: { namespace: 'attr', replacement: legacyReplacement.attr },
          },
        ],
      });
    });

    test('detects the removed bool: namespace', () => {
      invalid({
        code: `let el = <button bool:disabled={true} />;`,
        errors: [
          {
            messageId: 'legacy',
            data: { namespace: 'bool', replacement: legacyReplacement.bool },
          },
        ],
      });
    });

    test('detects the removed on: namespace', () => {
      invalid({
        code: `let el = <button on:click={handleClick} />;`,
        errors: [
          {
            messageId: 'legacy',
            data: { namespace: 'on', replacement: legacyReplacement.on },
          },
        ],
      });
    });

    test('detects the removed oncapture: namespace', () => {
      invalid({
        code: `let el = <button oncapture:click={handleClick} />;`,
        errors: [
          {
            messageId: 'legacy',
            data: {
              namespace: 'oncapture',
              replacement: legacyReplacement.oncapture,
            },
          },
        ],
      });
    });

    test('detects the removed class: namespace', () => {
      invalid({
        code: `let el = <div class:active={isActive()} />;`,
        errors: [
          {
            messageId: 'legacy',
            data: {
              namespace: 'class',
              replacement: legacyReplacement.class,
            },
          },
        ],
      });
    });

    test('detects the removed style: namespace', () => {
      invalid({
        code: `let el = <div style:width="100%" />;`,
        errors: [
          {
            messageId: 'legacy',
            data: {
              namespace: 'style',
              replacement: legacyReplacement.style,
            },
          },
        ],
      });
    });

    test('reports removed namespaces on components with the migration message', () => {
      invalid({
        code: `let el = <Box attr:label="Save" />;`,
        errors: [
          {
            messageId: 'legacy',
            data: { namespace: 'attr', replacement: legacyReplacement.attr },
          },
        ],
      });
    });

    test('detects unknown namespaces', () => {
      invalid({
        code: `let el = <div foo:bar={null} />;`,
        errors: [{ messageId: 'unknown', data: { namespace: 'foo' } }],
      });
    });

    test('suggests removing an unknown namespace from a component prop', () => {
      invalid({
        code: `let el = <Box foo:label="Save" />;`,
        errors: [
          {
            messageId: 'component',
            suggestions: [
              {
                messageId: 'component-suggest',
                data: { namespace: 'foo', name: 'label' },
                output: `let el = <Box label="Save" />;`,
              },
            ],
          },
        ],
      });
    });
  });
});
