import { describe, test } from 'vitest';
import rule from './jsx-no-undef.js';
import { testInvalid, testValid } from './ruleTester.js';

// The bulk of the testing of this rule is done in eslint-plugin-react,
// so we just test the custom directives part of it here.
const valid = testValid('jsx-no-undef', rule);
const invalid = testInvalid('jsx-no-undef', rule);

describe('jsx-no-undef', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let X; let el = <div use:X={{}} />;`);
    });
    test('valid case 2', () => {
      valid(`(X => <div use:X={{}} />)()`);
    });
    test('valid case 3', () => {
      valid(`let X; let el = <div use:X />`);
    });
    test('valid case 4', () => {
      valid(`let X, el = <div use:X />`);
    });
    test('valid case 5', () => {
      valid(`let Component, X = <Component use:X />`);
    });
    describe(`},`, () => {
      test('valid case 6', () => {
        valid({
          code: `let el = <Component />`,
          options: [{ typescriptEnabled: true }],
        });
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let el = <Component />;`,
        errors: [{ messageId: 'undefined', data: { identifier: 'Component' } }],
      });
    });
    describe(`custom directives`, () => {
      test('invalid case 2', () => {
        invalid({
          code: `let el = <div use:X />;`,
          errors: [
            {
              messageId: 'customDirectiveUndefined',
              data: { identifier: 'X' },
            },
          ],
        });
      });
      test('invalid case 3', () => {
        invalid({
          code: `let el = <div use:X />;`,
          options: [{ typescriptEnabled: true }],
          errors: [
            {
              messageId: 'customDirectiveUndefined',
              data: { identifier: 'X' },
            },
          ],
        });
      });
      test('invalid case 4', () => {
        invalid({
          code: `let el = <div use:X={{}} />;`,
          errors: [
            {
              messageId: 'customDirectiveUndefined',
              data: { identifier: 'X' },
            },
          ],
        });
      });
    });
    describe(`},`, () => {
      test('invalid case 5', () => {
        invalid({
          code: `let el = <div use:X />;`,
          options: [{ allowGlobals: true }],
          errors: [
            {
              messageId: 'customDirectiveUndefined',
              data: { identifier: 'X' },
            },
          ],
        });
      });
    });
    describe(`auto imports`, () => {
      test('invalid case 6', () => {
        invalid({
          code: `let el = <For each={items}>{item => item.name}</For>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
            import { For } from "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
        });
      });
      test('invalid case 7', () => {
        invalid({
          code: `let el = <Show when={item}>{item => item.name}</Show>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'Show'", source: 'solid-js' },
            },
          ],
          output: `
            import { Show } from "solid-js";
            let el = <Show when={item}>{item => item.name}</Show>
          `,
        });
      });
      test('invalid case 8', () => {
        invalid({
          code: `
            render(
              <Switch fallback={<div>Not Found</div>}>
                <Match when={state.route === "home"} />
              </Switch>
            )
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'Switch' and 'Match'", source: 'solid-js' },
            },
          ],
          output: `
            import { Switch, Match } from "solid-js";

            render(
              <Switch fallback={<div>Not Found</div>}>
                <Match when={state.route === "home"} />
              </Switch>
            )
          `,
        });
      });
      test('invalid case 9', () => {
        invalid({
          code: `
            import X from "x";
            let el = <For each={items}>{item => item.name}</For>
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
            import { For } from "solid-js";
            import X from "x";
            let el = <For each={items}>{item => item.name}</For>
          `,
        });
      });
      test('invalid case 10', () => {
        invalid({
          code: `
            import { Show } from "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
            import { Show, For } from "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
        });
      });
      test('invalid case 11', () => {
        invalid({
          code: `
            import { For, Switch } from "solid-js";
            render(
              <Switch fallback={<div>Not Found</div>}>
                <Match when={state.route === "home"} />
              </Switch>
            )
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'Match'", source: 'solid-js' },
            },
          ],
          output: `
            import { For, Switch, Match } from "solid-js";
            render(
              <Switch fallback={<div>Not Found</div>}>
                <Match when={state.route === "home"} />
              </Switch>
            )
          `,
        });
      });
      test('invalid case 12', () => {
        invalid({
          code: `
            import X from "x";
            import { Show } from "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
            import X from "x";
            import { Show, For } from "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
        });
      });
      test('invalid case 13', () => {
        invalid({
          code: `
            import X from "x";
            import Solid from "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
            import X from "x";
            import Solid, { For } from "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
        });
      });
      test('invalid case 14', () => {
        invalid({
          code: `
            import X from "x";
            import "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
            import X from "x";
            import { For } from "solid-js";
            let el = <For each={items}>{item => item.name}</For>
          `,
        });
      });
      test('invalid case 15', () => {
        invalid({
          code: `
            // attached comment
            import X from "x";
            let el = <For each={items}>{item => item.name}</For>
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
            import { For } from "solid-js";
            // attached comment
            import X from "x";
            let el = <For each={items}>{item => item.name}</For>
          `,
        });
      });
      test('invalid case 16', () => {
        invalid({
          code: `
            import X from "x"; // attached comment
            let el = <For each={items}>{item => item.name}</For>
          `,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
            import { For } from "solid-js";
            import X from "x"; // attached comment
            let el = <For each={items}>{item => item.name}</For>
          `,
        });
      });
    });
  });
});
