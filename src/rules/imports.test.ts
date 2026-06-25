import { describe, test } from 'vitest';
import rule from './imports.js';
import { testInvalid, testValid } from './ruleTester.js';

const valid = testValid('imports', rule);
const invalid = testInvalid('imports', rule);

describe('imports', () => {
  describe('valid', () => {
    test('importing Solid.js core APIs from solid-js is valid', () => {
      valid(`import { createSignal, mergeProps as merge } from "solid-js";`);
    });
    test('importing Solid.js core APIs using single quotes is valid', () => {
      valid(`import { createSignal, mergeProps as merge } from 'solid-js';`);
    });
    test('importing Solid.js web APIs from solid-js/web is valid', () => {
      valid(`import { render, hydrate } from "solid-js/web";`);
    });
    test('importing Solid.js store APIs from solid-js/store is valid', () => {
      valid(`import { createStore, produce } from "solid-js/store";`);
    });
    test('importing from various Solid.js modules correctly is valid', () => {
      valid(`
        import { createSignal } from "solid-js";
        import { render } from "solid-js/web";
        import { something } from "somewhere/else";
        import { createStore } from "solid-js/store";
      `);
    });
    test('namespace imports from solid-js are valid', () => {
      valid(`import * as Solid from "solid-js"; Solid.render();`);
    });
    test('importing types from solid-js modules is valid', () => {
      valid(
        `
        import type { Component, JSX } from "solid-js";
        import type { Store } from "solid-js/store";
      `,
        true,
      );
    });
  });
  describe('invalid', () => {
    test('detects core APIs incorrectly imported from solid-js/web', () => {
      invalid({
        code: `import { createEffect } from "solid-js/web";`,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createEffect', source: 'solid-js' },
          },
        ],
        output: `import { createEffect } from "solid-js";
`,
      });
    });
    test('merges incorrect core API imports with existing solid-js imports', () => {
      invalid({
        code: `
          import { createEffect } from "solid-js/web";
          import { createSignal } from "solid-js";
        `,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createEffect', source: 'solid-js' },
          },
        ],
        output: `
          import { createSignal, createEffect } from "solid-js";
        `,
      });
    });
    test('merges incorrect core type imports with existing solid-js imports', () => {
      invalid(
        {
          code: `
            import type { Component } from "solid-js/store";
            import { createSignal } from "solid-js";
            console.log('hi');
          `,
          errors: [
            {
              messageId: 'prefer-source',
              data: { name: 'Component', source: 'solid-js' },
            },
          ],
          output: `
            import { createSignal, Component } from "solid-js";
            console.log('hi');
          `,
        },
        true,
      );
    });
    test('merges incorrect core API imports with existing empty solid-js imports', () => {
      invalid({
        code: `
          import { createSignal } from "solid-js/web";
          import "solid-js";
        `,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createSignal', source: 'solid-js' },
          },
        ],
        output: `
          import { createSignal } from "solid-js";
        `,
      });
    });
    test('merges incorrect core API imports with existing empty specifier solid-js imports', () => {
      invalid({
        code: `
          import { createSignal } from "solid-js/web";
          import {} from "solid-js";
        `,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createSignal', source: 'solid-js' },
          },
        ],
        output: `
          import { createSignal } from "solid-js";
        `,
      });
    });
    describe(`Two-part fix, output here is first pass...`, () => {
      test('fixes multiple incorrect imports across different solid-js modules (pass 1)', () => {
        invalid({
          code: `
            import { createEffect } from "solid-js/web";
            import { render } from "solid-js";
          `,
          errors: [
            {
              messageId: 'prefer-source',
              data: { name: 'createEffect', source: 'solid-js' },
            },
            {
              messageId: 'prefer-source',
              data: { name: 'render', source: 'solid-js/web' },
            },
          ],
          output: `
            import { render, createEffect } from "solid-js";
          `,
        });
      });
    });
    describe(`...and output here is second pass`, () => {
      test('fixes multiple incorrect imports across different solid-js modules (pass 2)', () => {
        invalid({
          code: `import { render, createEffect } from "solid-js";`,
          errors: [
            {
              messageId: 'prefer-source',
              data: { name: 'render', source: 'solid-js/web' },
            },
          ],
          output: `
            import { render } from "solid-js/web";
            import { createEffect } from "solid-js";
          `,
        });
      });
    });
  });
});
