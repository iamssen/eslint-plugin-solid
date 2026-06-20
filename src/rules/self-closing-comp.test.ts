import { testValid, testInvalid } from './ruleTester.js';
import rule from './self-closing-comp.js';
import { describe, test } from 'vitest';

describe('self-closing-comp', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Component name="Foo" />;`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Compound.Component name="Foo" />;`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Component><img src="picture.png" /></Component>;`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Compound.Component><img src="picture.png" /></Compound.Component>;`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Component>
      <Component name="Foo" />
    </Component>;`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Compound.Component>
      <Compound.Component />
    </Compound.Component>`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Component name="Foo"> </Component>;`,
      );
    });
    test('valid case 8', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Compound.Component name="Foo"> </Compound.Component>;`,
      );
    });
    test('valid case 9', () => {
      testValid(
        'self-closing-comp',
        rule,
        `let el = <Component name="Foo">            </Component>;`,
      );
    });
    test('valid case 10', () => {
      testValid('self-closing-comp', rule, `let el = <div>&nbsp;</div>`);
    });
    test('valid case 11', () => {
      testValid('self-closing-comp', rule, `let el = <div>{' '}</div>`);
    });
    test('valid case 12', () => {
      testValid('self-closing-comp', rule, {
        code: `let el = <div></div>;`,
        options: [{ html: 'none' }],
      });
    });
    test('valid case 13', () => {
      testValid('self-closing-comp', rule, {
        code: `let el = <img></img>;`,
        options: [{ html: 'none' }],
      });
    });
    test('valid case 14', () => {
      testValid('self-closing-comp', rule, {
        code: `let el = <div></div>;`,
        options: [{ html: 'void' }],
      });
    });
    test('valid case 15', () => {
      testValid('self-closing-comp', rule, {
        code: `let el = (
        <div>
        </div>
      )`,
        options: [{ html: 'none' }],
      });
    });
    test('valid case 16', () => {
      testValid('self-closing-comp', rule, {
        code: `let el = <Component></Component>`,
        options: [{ component: 'none' }],
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = <div></div>;`,
        errors: [{ messageId: 'selfClose' }],
        output: `let el = <div />;`,
      });
    });
    test('invalid case 2', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = <img></img>;`,
        errors: [{ messageId: 'selfClose' }],
        output: `let el = <img />;`,
      });
    });
    test('invalid case 3', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = <div/>;`,
        options: [{ html: 'void' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <div></div>;`,
      });
    });
    test('invalid case 4', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = <div />;`,
        options: [{ html: 'void' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <div></div>;`,
      });
    });
    test('invalid case 5', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = <img/>;`,
        options: [{ html: 'none' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <img></img>;`,
      });
    });
    test('invalid case 6', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = <img />;`,
        options: [{ html: 'none' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <img></img>;`,
      });
    });
    test('invalid case 7', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = (
        <div>
        </div>
      );`,
        errors: [{ messageId: 'selfClose' }],
        output: `let el = (
        <div />
      );`,
      });
    });
    test('invalid case 8', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = (
        <Component>
        </Component>
      );`,
        errors: [{ messageId: 'selfClose' }],
        output: `let el = (
        <Component />
      );`,
      });
    });
    test('invalid case 9', () => {
      testInvalid('self-closing-comp', rule, {
        code: `let el = <Component />;`,
        options: [{ component: 'none' }],
        errors: [{ messageId: 'dontSelfClose' }],
        output: `let el = <Component></Component>;`,
      });
    });
  });
});
