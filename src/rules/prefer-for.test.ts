import rule from './prefer-for.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('prefer-for', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'prefer-for',
        rule,
        `let Component = (props) => <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;`,
      );
    });
    test('valid case 2', () => {
      testValid('prefer-for', rule, `let abc = x.map(y => y + z);`);
    });
    test('valid case 3', () => {
      testValid(
        'prefer-for',
        rule,
        `let Component = (props) => {
      let abc = x.map(y => y + z);
      return <div>Hello, world!</div>;
    }`,
      );
    });
  });
  describe('invalid', () => {
    describe(`fixes to add <For />, which can be auto-imported in jsx-no-undef`, () => {
      test('invalid case 1', () => {
        testInvalid('prefer-for', rule, {
          code: `let Component = (props) => <ol>{props.data.map(d => <li>{d.text}</li>)}</ol>;`,
          errors: [{ messageId: 'preferFor' }],
          output: `let Component = (props) => <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;`,
        });
      });
      test('invalid case 2', () => {
        testInvalid('prefer-for', rule, {
          code: `let Component = (props) => <>{props.data.map(d => <li>{d.text}</li>)}</>;`,
          errors: [{ messageId: 'preferFor' }],
          output: `let Component = (props) => <><For each={props.data}>{d => <li>{d.text}</li>}</For></>;`,
        });
      });
      test('invalid case 3', () => {
        testInvalid('prefer-for', rule, {
          code: `let Component = (props) => <ol>{props.data.map(d => <li key={d.id}>{d.text}</li>)}</ol>;`,
          errors: [{ messageId: 'preferFor' }],
          output: `let Component = (props) => <ol><For each={props.data}>{d => <li key={d.id}>{d.text}</li>}</For></ol>;`,
        });
      });
      test('invalid case 4', () => {
        testInvalid('prefer-for', rule, {
          code: `
      function Component(props) {
        return <ol>{props.data.map(d => <li>{d.text}</li>)}</ol>;
      }`,
          errors: [{ messageId: 'preferFor' }],
          output: `
      function Component(props) {
        return <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;
      }`,
        });
      });
      test('invalid case 5', () => {
        testInvalid(
          'prefer-for',
          rule,
          {
            code: `
      function Component(props) {
        return <ol>{props.data?.map(d => <li>{d.text}</li>)}</ol>;
      }`,
            errors: [{ messageId: 'preferFor' }],
            output: `
      function Component(props) {
        return <ol>{<For each={props.data}>{d => <li>{d.text}</li>}</For>}</ol>;
      }`,
          },
          true,
        );
      });
    });
    describe(`deopts`, () => {
      test('invalid case 6', () => {
        testInvalid('prefer-for', rule, {
          code: `let Component = (props) => <ol>{props.data.map(() => <li />)}</ol>;`,
          errors: [{ messageId: 'preferForOrIndex' }],
        });
      });
      test('invalid case 7', () => {
        testInvalid('prefer-for', rule, {
          code: `let Component = (props) => <ol>{props.data.map((...args) => <li>{args[0].text}</li>)}</ol>;`,
          errors: [{ messageId: 'preferForOrIndex' }],
        });
      });
    });
  });
});
