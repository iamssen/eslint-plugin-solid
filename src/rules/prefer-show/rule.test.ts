import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('prefer-show', rule);
const invalid = testInvalid('prefer-show', rule);

describe('prefer-show', () => {
  describe('valid', () => {
    test('using Show component is valid', () => {
      valid(`
        function Component(props) {
          return <Show when={props.cond}>Content</Show>;
        }
      `);
    });
    test('using Show component with fallback is valid', () => {
      valid(`
        function Component(props) {
          return <Show when={props.cond} fallback="Fallback">Content</Show>;
        }
      `);
    });
  });
  describe('invalid', () => {
    test('detects logical AND expression in JSX and suggests Show', () => {
      invalid({
        code: `
          function Component(props) {
            return <div>{props.cond && <span>Content</span>}</div>;
          }
        `,
        errors: [{ messageId: 'preferShowAnd' }],
        output: `
          function Component(props) {
            return <div><Show when={props.cond}><span>Content</span></Show></div>;
          }
        `,
      });
    });
    test('detects logical AND expression in Fragment and suggests Show', () => {
      invalid({
        code: `
          function Component(props) {
            return <>{props.cond && <span>Content</span>}</>;
          }
        `,
        errors: [{ messageId: 'preferShowAnd' }],
        output: `
          function Component(props) {
            return <><Show when={props.cond}><span>Content</span></Show></>;
          }
        `,
      });
    });
    test('detects ternary expression in JSX and suggests Show with fallback', () => {
      invalid({
        code: `
          function Component(props) {
            return (
              <div>
                {props.cond ? (
                  <span>Content</span> 
                ) : (
                  <span>Fallback</span>
                )}
              </div>
            );
          }
        `,
        errors: [{ messageId: 'preferShowTernary' }],
        output: `
          function Component(props) {
            return (
              <div>
                <Show when={props.cond} fallback={<span>Fallback</span>}><span>Content</span></Show>
              </div>
            );
          }
        `,
      });
    });
    describe(`Check that it also works with control flow function children`, () => {
      test('detects logical AND expression in control flow function children', () => {
        invalid({
          code: `
            function Component(props) {
              return (
                <For each={props.someList}>
                  {(listItem) => listItem.cond && <span>Content</span>}
                </For>
              );
            }
          `,
          errors: [{ messageId: 'preferShowAnd' }],
          output: `
            function Component(props) {
              return (
                <For each={props.someList}>
                  {(listItem) => <Show when={listItem.cond}><span>Content</span></Show>}
                </For>
              );
            }
          `,
        });
      });
      test('detects ternary expression in control flow function children', () => {
        invalid({
          code: `
            function Component(props) {
              return (
                <For each={props.someList}>
                  {(listItem) => (listItem.cond ? (
                    <span>Content</span> 
                  ) : (
                    <span>Fallback</span>
                  ))}
                </For>
              );
            }
          `,
          errors: [{ messageId: 'preferShowTernary' }],
          output: `
            function Component(props) {
              return (
                <For each={props.someList}>
                  {(listItem) => (<Show when={listItem.cond} fallback={<span>Fallback</span>}><span>Content</span></Show>)}
                </For>
              );
            }
          `,
        });
      });
    });
  });
});
