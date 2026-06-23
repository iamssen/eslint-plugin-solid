import rule from './prefer-show.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('prefer-show', rule);
const invalid = testInvalid('prefer-show', rule);

describe('prefer-show', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(
        `function Component(props) {
      return <Show when={props.cond}>Content</Show>;
    }`,
      );
    });
    test('valid case 2', () => {
      valid(
        `function Component(props) {
      return <Show when={props.cond} fallback="Fallback">Content</Show>;
    }`,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `
      function Component(props) {
        return <div>{props.cond && <span>Content</span>}</div>;
      }`,
        errors: [{ messageId: 'preferShowAnd' }],
        output: `
      function Component(props) {
        return <div><Show when={props.cond}><span>Content</span></Show></div>;
      }`,
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `
      function Component(props) {
        return <>{props.cond && <span>Content</span>}</>;
      }`,
        errors: [{ messageId: 'preferShowAnd' }],
        output: `
      function Component(props) {
        return <><Show when={props.cond}><span>Content</span></Show></>;
      }`,
      });
    });
    test('invalid case 3', () => {
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
      }`,
        errors: [{ messageId: 'preferShowTernary' }],
        output: `
      function Component(props) {
        return (
          <div>
            <Show when={props.cond} fallback={<span>Fallback</span>}><span>Content</span></Show>
          </div>
        );
      }`,
      });
    });
    describe(`Check that it also works with control flow function children`, () => {
      test('invalid case 4', () => {
        invalid({
          code: `
      function Component(props) {
        return (
          <For each={props.someList}>
            {(listItem) => listItem.cond && <span>Content</span>}
          </For>
        );
      }`,
          errors: [{ messageId: 'preferShowAnd' }],
          output: `
      function Component(props) {
        return (
          <For each={props.someList}>
            {(listItem) => <Show when={listItem.cond}><span>Content</span></Show>}
          </For>
        );
      }`,
        });
      });
      test('invalid case 5', () => {
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
      }`,
          errors: [{ messageId: 'preferShowTernary' }],
          output: `
      function Component(props) {
        return (
          <For each={props.someList}>
            {(listItem) => (<Show when={listItem.cond} fallback={<span>Fallback</span>}><span>Content</span></Show>)}
          </For>
        );
      }`,
        });
      });
    });
  });
});
