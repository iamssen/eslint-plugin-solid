import rule from './jsx-no-duplicate-props.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('jsx-no-duplicate-props', rule);
const invalid = testInvalid('jsx-no-duplicate-props', rule);

describe('jsx-no-duplicate-props', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let el = <div a="a" b="b" />`);
    });
    test('valid case 2', () => {
      valid(`let el = <div a="a" {...{ b: "b" }} />`);
    });
    test('valid case 3', () => {
      valid(`let el = <div a="a" {...{ "b": "b" }} />`);
    });
    test('valid case 4', () => {
      valid(`let el = <div a="a" A="A" />`);
    });
    test('valid case 5', () => {
      valid(`let el = <div a="a" {...{ A: "A" }} />`);
    });
    test('valid case 6', () => {
      valid(`let el = <div class="blue" />`);
    });
    test('valid case 7', () => {
      valid(`let el = <div children={<div />} />`);
    });
    test('valid case 8', () => {
      valid(`let el = <div><div /></div>`);
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let el = <div a="a" a="aaaa" />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `let el = <div a="a" {...{a: "aaaa" }} />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `let el = <div {...{a: "aaaa" }} a="a" />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let el = <div a="a" {...{ "a": "aaaa" }} />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `let el = <div class="blue" class="green" />`,
        errors: [{ messageId: 'noDuplicateClass' }],
      });
    });
    test('invalid case 6', () => {
      invalid({
        code: `let el = <div class="blue" {...{ class: "green" }} />`,
        errors: [{ messageId: 'noDuplicateClass' }],
      });
    });
    test('invalid case 7', () => {
      invalid({
        code: `let el = <div children={<div />}><div /></div>`,
        errors: [
          {
            messageId: 'noDuplicateChildren',
            data: {
              used: '`props.children`, JSX children',
            },
          },
        ],
      });
    });
    test('invalid case 8', () => {
      invalid({
        code: `let el = <div innerHTML="<p></p>" textContent="howdy!" />`,
        errors: [
          {
            messageId: 'noDuplicateChildren',
            data: { used: '`props.innerHTML`, `props.textContent`' },
          },
        ],
      });
    });
  });
});
