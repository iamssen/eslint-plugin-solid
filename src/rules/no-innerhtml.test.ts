import rule from './no-innerhtml.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('no-innerhtml', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'no-innerhtml',
        rule,
        `let el = <div prop1 prop2={2}>Hello world!</div>`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'no-innerhtml',
        rule,
        `let el = <Box prop1 prop2={2}>Hello world!</Box>`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'no-innerhtml',
        rule,
        `let el = <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>" />`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'no-innerhtml',
        rule,
        `let el = <div prop1 prop2={2} innerHTML={"<p>Hello</p>" + "<p>world!</p>"} />`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'no-innerhtml',
        rule,
        `let el = <div prop1 prop2={2} innerHTML="<p>Hello</p><p>world!</p>"></div>`,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('no-innerhtml', rule, {
        code: `let el = <div prop1 prop2={2} innerHTML="<p>Hello</><p>world!</p>" />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('invalid case 2', () => {
      testInvalid('no-innerhtml', rule, {
        code: `let el = <div innerHTML={"<p>Hello</p><p>world!</p>"} />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('invalid case 3', () => {
      testInvalid('no-innerhtml', rule, {
        code: `let el = <div prop1 prop2={2} innerHTML={"<p>Hello</p>" + "<p>world!</p>"} />`,
        options: [{ allowStatic: false }],
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('invalid case 4', () => {
      testInvalid('no-innerhtml', rule, {
        code: `let el = <div prop1 prop2={2} innerHTML={Math.random()} />`,
        errors: [{ messageId: 'dangerous' }],
      });
    });
    test('invalid case 5', () => {
      testInvalid('no-innerhtml', rule, {
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
      testInvalid('no-innerhtml', rule, {
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
      testInvalid('no-innerhtml', rule, {
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
      testInvalid('no-innerhtml', rule, {
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
      testInvalid('no-innerhtml', rule, {
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
      testInvalid('no-innerhtml', rule, {
        code: `let el = <div dangerouslySetInnerHTML={{ __html: "<p>Hello</p><p>world!</p>" }} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
        output: `let el = <div innerHTML={"<p>Hello</p><p>world!</p>"} />`,
      });
    });
    test('invalid case 11', () => {
      testInvalid('no-innerhtml', rule, {
        code: `let el = <div dangerouslySetInnerHTML={foo} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
      });
    });
    test('invalid case 12', () => {
      testInvalid('no-innerhtml', rule, {
        code: `let el = <div dangerouslySetInnerHTML={{}} />`,
        errors: [{ messageId: 'dangerouslySetInnerHTML' }],
      });
    });
  });
});
