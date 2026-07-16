import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

// The bulk of the testing of this rule is done in eslint-plugin-react,
// so we just test the custom directives part of it here.
const valid = testValid('jsx-no-undef', rule);
const invalid = testInvalid('jsx-no-undef', rule);

describe('jsx-no-undef', () => {
  describe('valid', () => {
    // Solid 2.0에서 use: directive는 제거됐다. ref factory 검사로 대체할 때 다시 작성한다.
    test.skip('custom directives used as properties are valid', () => {
      valid(`let X; let el = <div use:X={{}} />;`);
    });
    // Solid 2.0에서 use: directive는 제거됐다. ref factory 검사로 대체할 때 다시 작성한다.
    test.skip('custom directives inside IIFE are valid', () => {
      valid(`(X => <div use:X={{}} />)()`);
    });
    // Solid 2.0에서 use: directive는 제거됐다. ref factory 검사로 대체할 때 다시 작성한다.
    test.skip('custom directives without values are valid', () => {
      valid(`let X; let el = <div use:X />`);
    });
    // Solid 2.0에서 use: directive는 제거됐다. ref factory 검사로 대체할 때 다시 작성한다.
    test.skip('custom directives defined in the same statement', () => {
      valid(`let X, el = <div use:X />`);
    });
    // Solid 2.0에서 use: directive는 제거됐다. ref factory 검사로 대체할 때 다시 작성한다.
    test.skip('components and custom directives defined together', () => {
      valid(`let Component, X = <Component use:X />`);
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
    // Solid 2.0에서 use: directive와 customDirectiveUndefined 메시지는 제거 대상이다.
    describe.skip(`custom directives`, () => {
      test('detects undefined custom directives', () => {
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
      test('detects undefined custom directives even when typescriptEnabled is true', () => {
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
      test('detects undefined custom directives with values', () => {
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
      // Solid 2.0에서 use: directive는 제거됐다.
      test.skip('detects undefined custom directives even when allowGlobals is true', () => {
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
