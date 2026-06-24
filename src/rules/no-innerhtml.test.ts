import { describe, test } from 'vitest';
import rule from './no-innerhtml.js';
import { testInvalid, testValid } from './ruleTester.js';

const valid = testValid('no-innerhtml', rule);
const invalid = testInvalid('no-innerhtml', rule);

describe('no-innerhtml', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let el = <div prop1 prop2={2}>Hello world!</div>`);
    });
    test('valid case 2', () => {
      valid(`let el = <Box prop1 prop2={2}>Hello world!</Box>`);
    });
    test('valid case 3', () => {
      valid(
        `let el = <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>" />`,
      );
    });
    test('valid case 4', () => {
      valid(
        `let el = <div prop1 prop2={2} innerHTML={"<p>Hello</p>" + "<p>world!</p>"} />`,
      );
    });
    test('valid case 5', () => {
      valid(
        `let el = <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>"></div>`,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let el = <div prop1 prop2={2} innerHTML="<p>Hello</><p>world!</p>" />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `let el = <div innerHTML={"<p>Hello</p><p>world!</p>"} />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `let el = <div prop1 prop2={2} innerHTML={"<p>Hello</p>" + "<p>world!</p>"} />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let el = <div prop1 prop2={2} innerHTML={Math.random()} />`,
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('invalid case 5', () => {
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
    test('invalid case 6', () => {
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
    test('invalid case 7', () => {
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
    test('invalid case 8', () => {
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
    test('invalid case 9', () => {
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
    test('invalid case 10', () => {
      invalid({
        code: `let el = <div dangerouslySetInnerHTML={{ __html: "<p>Hello</p><p>world!</p>" }} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
        output: `let el = <div innerHTML={"<p>Hello</p><p>world!</p>"} />`,
      });
    });
    test('invalid case 11', () => {
      invalid({
        code: `let el = <div dangerouslySetInnerHTML={foo} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
      });
    });
    test('invalid case 12', () => {
      invalid({
        code: `let el = <div dangerouslySetInnerHTML={{}} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
      });
    });
  });
});
