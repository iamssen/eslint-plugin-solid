import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

// The bulk of the testing of this rule is done in eslint-plugin-react.
// These tests cover Solid-specific control-flow auto-imports and the Solid 2.0
// ref directive factory convention.
const valid = testValid('jsx-no-undef', rule);
const invalid = testInvalid('jsx-no-undef', rule);

describe('jsx-no-undef', () => {
  describe('valid', () => {
    test('allows defined ref directive factories and ref arrays', () => {
      valid(`
        const autofocus = (element) => element.focus();
        const tooltip = (options) => (element) => {
          element.title = options.content;
        };
        let el = <button ref={[autofocus, tooltip({ content: 'Save' })]} />;
      `);
    });
    describe(`},`, () => {
      test('component names are ignored when typescriptEnabled is true', () => {
        valid({
          code: `let el = <Component />`,
          options: [{ typescriptEnabled: true }],
        });
      });
    });
  });
  describe('invalid', () => {
    test('detects undefined components', () => {
      invalid({
        code: `let el = <Component />;`,
        errors: [{ messageId: 'undefined', data: { identifier: 'Component' } }],
      });
    });
    test('does not auto-import the removed Index component', () => {
      invalid({
        code: `let el = <Index each={items}>{item => item.name}</Index>;`,
        errors: [{ messageId: 'undefined', data: { identifier: 'Index' } }],
      });
    });
    describe(`auto imports`, () => {
      test('auto-imports Solid.js For component', () => {
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
      test('auto-imports Solid.js Show component', () => {
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
      test('auto-imports Solid.js Switch and Match components', () => {
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
      test('adds auto-import alongside existing default imports', () => {
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
      test('adds auto-import to existing Solid.js imports', () => {
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
      test('adds auto-import to existing Solid.js imports with multiple specifiers', () => {
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
      test('adds auto-import with multiple existing imports', () => {
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
      test('adds auto-import to existing Solid.js default and namespace imports', () => {
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
      test('adds auto-import to existing empty Solid.js imports', () => {
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
      test('adds auto-import while preserving comments on existing imports', () => {
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
      test('adds auto-import while preserving trailing comments', () => {
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
