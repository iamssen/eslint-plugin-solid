import rule from './jsx-no-undef.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

// The bulk of the testing of this rule is done in eslint-plugin-react,
// so we just test the custom directives part of it here.
describe('jsx-no-undef', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid('jsx-no-undef', rule, `let X; let el = <div use:X={{}} />;`);
    });
    test('valid case 2', () => {
      testValid('jsx-no-undef', rule, `(X => <div use:X={{}} />)()`);
    });
    test('valid case 3', () => {
      testValid('jsx-no-undef', rule, `let X; let el = <div use:X />`);
    });
    test('valid case 4', () => {
      testValid('jsx-no-undef', rule, `let X, el = <div use:X />`);
    });
    test('valid case 5', () => {
      testValid('jsx-no-undef', rule, `let Component, X = <Component use:X />`);
    });
    describe(`},`, () => {
      test('valid case 6', () => {
        testValid('jsx-no-undef', rule, {
          code: `let el = <Component />`,
          options: [{ typescriptEnabled: true }],
        });
      });
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('jsx-no-undef', rule, {
        code: `let el = <Component />;`,
        errors: [{ messageId: 'undefined', data: { identifier: 'Component' } }],
      });
    });
    describe(`custom directives`, () => {
      test('invalid case 2', () => {
        testInvalid('jsx-no-undef', rule, {
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
        testInvalid('jsx-no-undef', rule, {
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
        testInvalid('jsx-no-undef', rule, {
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
        testInvalid('jsx-no-undef', rule, {
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
        testInvalid('jsx-no-undef', rule, {
          code: `let el = <For each={items}>{item => item.name}</For>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `import { For } from "solid-js";\nlet el = <For each={items}>{item => item.name}</For>`,
        });
      });
      test('invalid case 7', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `let el = <Show when={item}>{item => item.name}</Show>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'Show'", source: 'solid-js' },
            },
          ],
          output: `import { Show } from "solid-js";\nlet el = <Show when={item}>{item => item.name}</Show>`,
        });
      });
      test('invalid case 8', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
render(
  <Switch fallback={<div>Not Found</div>}>
    <Match when={state.route === "home"} />
  </Switch>
)`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'Switch' and 'Match'", source: 'solid-js' },
            },
          ],
          output: `import { Switch, Match } from "solid-js";

render(
  <Switch fallback={<div>Not Found</div>}>
    <Match when={state.route === "home"} />
  </Switch>
)`,
        });
      });
      test('invalid case 9', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
import X from "x";
let el = <For each={items}>{item => item.name}</For>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
import { For } from "solid-js";\nimport X from "x";
let el = <For each={items}>{item => item.name}</For>`,
        });
      });
      test('invalid case 10', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
import { Show } from "solid-js";
let el = <For each={items}>{item => item.name}</For>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
import { Show, For } from "solid-js";
let el = <For each={items}>{item => item.name}</For>`,
        });
      });
      test('invalid case 11', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
import { For, Switch } from "solid-js";
render(
  <Switch fallback={<div>Not Found</div>}>
    <Match when={state.route === "home"} />
  </Switch>
)`,
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
)`,
        });
      });
      test('invalid case 12', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
import X from "x";
import { Show } from "solid-js";
let el = <For each={items}>{item => item.name}</For>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
import X from "x";
import { Show, For } from "solid-js";
let el = <For each={items}>{item => item.name}</For>`,
        });
      });
      test('invalid case 13', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
import X from "x";
import Solid from "solid-js";
let el = <For each={items}>{item => item.name}</For>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
import X from "x";
import Solid, { For } from "solid-js";
let el = <For each={items}>{item => item.name}</For>`,
        });
      });
      test('invalid case 14', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
import X from "x";
import "solid-js";
let el = <For each={items}>{item => item.name}</For>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
import X from "x";
import { For } from "solid-js";
let el = <For each={items}>{item => item.name}</For>`,
        });
      });
      test('invalid case 15', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
// attached comment
import X from "x";
let el = <For each={items}>{item => item.name}</For>`,
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
let el = <For each={items}>{item => item.name}</For>`,
        });
      });
      test('invalid case 16', () => {
        testInvalid('jsx-no-undef', rule, {
          code: `
import X from "x"; // attached comment
let el = <For each={items}>{item => item.name}</For>`,
          errors: [
            {
              messageId: 'autoImport',
              data: { imports: "'For'", source: 'solid-js' },
            },
          ],
          output: `
import { For } from "solid-js";
import X from "x"; // attached comment
let el = <For each={items}>{item => item.name}</For>`,
        });
      });
    });
  });
});
