import rule from './rule.js';
import { testValid, testInvalid } from '../ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('jsx-no-duplicate-props', rule);
const invalid = testInvalid('jsx-no-duplicate-props', rule);

describe('jsx-no-duplicate-props', () => {
  describe('valid', () => {
    test('different props on a JSX element are valid', () => {
      valid(`let el = <div a="a" b="b" />`);
    });
    test('spreading different props is valid', () => {
      valid(`let el = <div a="a" {...{ b: "b" }} />`);
    });
    test('spreading different props with string keys is valid', () => {
      valid(`let el = <div a="a" {...{ "b": "b" }} />`);
    });
    test('props with same name but different cases are valid', () => {
      valid(`let el = <div a="a" A="A" />`);
    });
    test('spreading props with same name but different cases is valid', () => {
      valid(`let el = <div a="a" {...{ A: "A" }} />`);
    });
    test('a single class prop is valid', () => {
      valid(`let el = <div class="blue" />`);
    });
    test('a single children prop is valid', () => {
      valid(`let el = <div children={<div />} />`);
    });
    test('standard JSX children are valid', () => {
      valid(`let el = <div><div /></div>`);
    });
  });
  describe('invalid', () => {
    test('detects duplicate props on a JSX element', () => {
      invalid({
        code: `let el = <div a="a" a="aaaa" />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('detects duplicate props when one is spread', () => {
      invalid({
        code: `let el = <div a="a" {...{a: "aaaa" }} />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('detects duplicate props when the first is spread', () => {
      invalid({
        code: `let el = <div {...{a: "aaaa" }} a="a" />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('detects duplicate props when one is spread with a string key', () => {
      invalid({
        code: `let el = <div a="a" {...{ "a": "aaaa" }} />`,
        errors: [{ messageId: 'noDuplicateProps' }],
      });
    });
    test('detects duplicate class props on a JSX element', () => {
      invalid({
        code: `let el = <div class="blue" class="green" />`,
        errors: [{ messageId: 'noDuplicateClass' }],
      });
    });
    test('detects duplicate class props when one is spread', () => {
      invalid({
        code: `let el = <div class="blue" {...{ class: "green" }} />`,
        errors: [{ messageId: 'noDuplicateClass' }],
      });
    });
    test('detects conflicts between children prop and JSX children', () => {
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
    test('detects conflicts between innerHTML and textContent props', () => {
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
