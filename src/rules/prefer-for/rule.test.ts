import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('prefer-for', rule);
const invalid = testInvalid('prefer-for', rule);

describe('prefer-for', () => {
  describe('valid', () => {
    test('using For component is valid', () => {
      valid(
        `let Component = (props) => <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;`,
      );
    });
    test('using For keyed=false with an item accessor is valid', () => {
      valid(
        `let Component = (props) => <ol><For each={props.data} keyed={false}>{(item, index) => <li>{index}: {item().text}</li>}</For></ol>;`,
      );
    });
    test('using map outside JSX is valid', () => {
      valid(`let abc = x.map(y => y + z);`);
    });
    test('using map inside component body is valid', () => {
      valid(
        `let Component = (props) => {
      let abc = x.map(y => y + z);
      return <div>Hello, world!</div>;
    }`,
      );
    });
  });
  describe('invalid', () => {
    describe(`fixes to add <For />, which can be auto-imported in jsx-no-undef`, () => {
      test('detects array map in JSX and suggests For component', () => {
        invalid({
          code: `let Component = (props) => <ol>{props.data.map(d => <li>{d.text}</li>)}</ol>;`,
          errors: [{ messageId: 'preferFor' }],
          output: `let Component = (props) => <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;`,
        });
      });
      test('detects array map in Fragment and suggests For component', () => {
        invalid({
          code: `let Component = (props) => <>{props.data.map(d => <li>{d.text}</li>)}</>;`,
          errors: [{ messageId: 'preferFor' }],
          output: `let Component = (props) => <><For each={props.data}>{d => <li>{d.text}</li>}</For></>;`,
        });
      });
      test('detects array map with key and suggests For component without key', () => {
        invalid({
          code: `let Component = (props) => <ol>{props.data.map(d => <li key={d.id}>{d.text}</li>)}</ol>;`,
          errors: [{ messageId: 'preferFor' }],
          output: `let Component = (props) => <ol><For each={props.data}>{d => <li key={d.id}>{d.text}</li>}</For></ol>;`,
        });
      });
      test('detects array map in block body component', () => {
        invalid({
          code: `
            function Component(props) {
              return <ol>{props.data.map(d => <li>{d.text}</li>)}</ol>;
            }
          `,
          errors: [{ messageId: 'preferFor' }],
          output: `
            function Component(props) {
              return <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;
            }
          `,
        });
      });
      test('detects optional chaining array map in JSX', () => {
        invalid(
          {
            code: `
            function Component(props) {
              return <ol>{props.data?.map(d => <li>{d.text}</li>)}</ol>;
            }
          `,
            errors: [{ messageId: 'preferFor' }],
            output: `
              function Component(props) {
                return <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;
              }
            `,
          },
          true,
        );
      });
    });
    describe(`deopts`, () => {
      test('detects array map with empty callback arguments', () => {
        invalid({
          code: `let Component = (props) => <ol>{props.data.map(() => <li />)}</ol>;`,
          errors: [{ messageId: 'preferForNeedsManualMigration' }],
        });
      });
      test('does not rewrite a map callback with an index parameter', () => {
        invalid({
          code: `let Component = (props) => <ol>{props.data.map((item, index) => <li>{index}: {item.text}</li>)}</ol>;`,
          errors: [{ messageId: 'preferForNeedsManualMigration' }],
        });
      });
      test('detects array map with rest operator in callback', () => {
        invalid({
          code: `let Component = (props) => <ol>{props.data.map((...args) => <li>{args[0].text}</li>)}</ol>;`,
          errors: [{ messageId: 'preferForNeedsManualMigration' }],
        });
      });
    });
  });
});
