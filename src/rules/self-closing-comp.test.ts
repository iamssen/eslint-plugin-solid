import { describe, test } from 'vitest';
import { testInvalid, testValid } from './ruleTester.js';
import rule from './self-closing-comp.js';

const valid = testValid('self-closing-comp', rule);
const invalid = testInvalid('self-closing-comp', rule);

describe('self-closing-comp', () => {
  describe('valid', () => {
    test('self-closing custom component is valid', () => {
      valid(`let el = <Component name="Foo" />;`);
    });
    test('self-closing compound custom component is valid', () => {
      valid(`let el = <Compound.Component name="Foo" />;`);
    });
    test('custom component with self-closing child is valid', () => {
      valid(`let el = <Component><img src="picture.png" /></Component>;`);
    });
    test('compound custom component with self-closing child is valid', () => {
      valid(
        `let el = <Compound.Component><img src="picture.png" /></Compound.Component>;`,
      );
    });
    test('custom component with self-closing custom component child is valid', () => {
      valid(`
        let el = <Component>
          <Component name="Foo" />
        </Component>;
      `);
    });
    test('compound custom component with self-closing compound custom component child is valid', () => {
      valid(`
        let el = <Compound.Component>
          <Compound.Component />
        </Compound.Component>
      `);
    });
    test('custom component with space child is valid', () => {
      valid(`let el = <Component name="Foo"> </Component>;`);
    });
    test('compound custom component with space child is valid', () => {
      valid(`let el = <Compound.Component name="Foo"> </Compound.Component>;`);
    });
    test('custom component with multiple spaces child is valid', () => {
      valid(`let el = <Component name="Foo">            </Component>;`);
    });
    test('native element with html entity child is valid', () => {
      valid(`let el = <div>&nbsp;</div>`);
    });
    test('native element with JSX expression child is valid', () => {
      valid(`let el = <div>{' '}</div>`);
    });
    test('empty div is valid when html option is none', () => {
      valid({
        code: `let el = <div></div>;`,
        options: [{ html: 'none' }],
      });
    });
    test('empty img is valid when html option is none', () => {
      valid({
        code: `let el = <img></img>;`,
        options: [{ html: 'none' }],
      });
    });
    test('empty div is valid when html option is void', () => {
      valid({
        code: `let el = <div></div>;`,
        options: [{ html: 'void' }],
      });
    });
    test('empty div with line breaks is valid when html option is none', () => {
      valid({
        code: `
          let el = (
            <div>
            </div>
          )
        `,
        options: [{ html: 'none' }],
      });
    });
    test('empty custom component is valid when component option is none', () => {
      valid({
        code: `let el = <Component></Component>`,
        options: [{ component: 'none' }],
      });
    });
  });
  describe('invalid', () => {
    test('detects empty div and suggests self-closing', () => {
      invalid({
        code: `let el = <div></div>;`,
        errors: [{ messageId: 'selfClose' }],
        output: `let el = <div />;`,
      });
    });
    test('detects empty img and suggests self-closing', () => {
      invalid({
        code: `let el = <img></img>;`,
        errors: [{ messageId: 'selfClose' }],
        output: `let el = <img />;`,
      });
    });
    test('detects self-closing div and suggests closing tag when html option is void', () => {
      invalid({
        code: `let el = <div/>;`,
        options: [{ html: 'void' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <div></div>;`,
      });
    });
    test('detects self-closing div with space and suggests closing tag when html option is void', () => {
      invalid({
        code: `let el = <div />;`,
        options: [{ html: 'void' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <div></div>;`,
      });
    });
    test('detects self-closing img and suggests closing tag when html option is none', () => {
      invalid({
        code: `let el = <img/>;`,
        options: [{ html: 'none' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <img></img>;`,
      });
    });
    test('detects self-closing img with space and suggests closing tag when html option is none', () => {
      invalid({
        code: `let el = <img />;`,
        options: [{ html: 'none' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <img></img>;`,
      });
    });
    test('detects empty div with line breaks and suggests self-closing', () => {
      invalid({
        code: `
          let el = (
            <div>
            </div>
          )
        `,
        errors: [{ messageId: 'selfClose' }],
        output: `
          let el = (
            <div />
          )
        `,
      });
    });
    test('detects empty custom component with line breaks and suggests self-closing', () => {
      invalid({
        code: `
          let el = (
            <Component>
            </Component>
          )
        `,
        errors: [{ messageId: 'selfClose' }],
        output: `
          let el = (
            <Component />
          )
        `,
      });
    });
    test('detects self-closing custom component and suggests closing tag when component option is none', () => {
      invalid({
        code: `let el = <Component />;`,
        options: [{ component: 'none' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <Component></Component>;`,
      });
    });
  });
});
