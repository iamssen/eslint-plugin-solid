import { describe, test } from 'vitest';
import rule from './no-innerhtml.js';
import { testInvalid, testValid } from './ruleTester.js';

const valid = testValid('no-innerhtml', rule);
const invalid = testInvalid('no-innerhtml', rule);

describe('no-innerhtml', () => {
  describe('valid', () => {
    test('standard elements without innerHTML are valid', () => {
      valid(`let el = <div prop1 prop2={2}>Hello world!</div>`);
    });
    test('custom components without innerHTML are valid', () => {
      valid(`let el = <Box prop1 prop2={2}>Hello world!</Box>`);
    });
    test('innerHTML with string literal is valid', () => {
      valid(
        `let el = <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>" />`,
      );
    });
    test('innerHTML with concatenated string literal is valid', () => {
      valid(
        `let el = <div prop1 prop2={2} innerHTML={"<p>Hello</p>" + "<p>world!</p>"} />`,
      );
    });
    test('innerHTML with empty children is valid', () => {
      valid(
        `let el = <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>"></div>`,
      );
    });
  });
  describe('invalid', () => {
    test('detects malformed HTML in innerHTML string literal', () => {
      invalid({
        code: `let el = <div prop1 prop2={2} innerHTML="<p>Hello</><p>world!</p>" />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('detects malformed HTML in innerHTML JSX expression', () => {
      invalid({
        code: `let el = <div innerHTML={"<p>Hello</p><p>world!</p>"} />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('detects malformed HTML in innerHTML concatenated string', () => {
      invalid({
        code: `let el = <div prop1 prop2={2} innerHTML={"<p>Hello</p>" + "<p>world!</p>"} />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('detects non-string expression in innerHTML', () => {
      invalid({
        code: `let el = <div prop1 prop2={2} innerHTML={Math.random()} />`,
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('detects plain text in innerHTML and suggests innerText', () => {
      invalid({
        code: `let el = <div prop1 prop2={2} innerHTML="Hello world!" />`,
        errors: [
          {
            messageId: 'notHtml',
            suggestions: [
              {
                messageId: 'useInnerText',
                output: `let el = <div prop1 prop2={2} innerText="Hello world!" />`,
              },
            ],
          },
        ],
      });
    });
    test('detects conflict between innerHTML and JSX children', () => {
      invalid({
        code: `
          let el = (
            <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>">
              <p>Child element content</p>
            </div>
          );
        `,
        errors: [{ messageId: 'conflict' }],
      });
    });
    test('detects conflict between innerHTML and multiple JSX children', () => {
      invalid({
        code: `
          let el = (
            <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>">
              <p>Child element content 1</p>
              <p>Child element context 2</p>
            </div>
          );
        `,
        errors: [{ messageId: 'conflict' }],
      });
    });
    test('detects conflict between innerHTML and string literal child', () => {
      invalid({
        code: `
          let el = (
            <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>">
              {"Child text content"}
            </div>
          );
        `,
        errors: [{ messageId: 'conflict' }],
      });
    });
    test('detects conflict between innerHTML and expression child', () => {
      invalid({
        code: `
          let el = (
            <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>">
              {identifier}
            </div>
          );
        `,
        errors: [{ messageId: 'conflict' }],
      });
    });
    test('detects dangerouslySetInnerHTML and suggests innerHTML', () => {
      invalid({
        code: `let el = <div dangerouslySetInnerHTML={{ __html: "<p>Hello</p><p>world!</p>" }} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
        output: `let el = <div innerHTML={"<p>Hello</p><p>world!</p>"} />`,
      });
    });
    test('detects dangerouslySetInnerHTML with variable', () => {
      invalid({
        code: `let el = <div dangerouslySetInnerHTML={foo} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
      });
    });
    test('detects dangerouslySetInnerHTML with empty object', () => {
      invalid({
        code: `let el = <div dangerouslySetInnerHTML={{}} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
      });
    });
  });
});
