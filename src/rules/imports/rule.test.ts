import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('imports', rule);
const invalid = testInvalid('imports', rule);

describe('imports', () => {
  describe('valid', () => {
    test('imports Solid 2.0 core APIs from solid-js', () => {
      valid(
        `import { createSignal, createStore, merge, snapshot } from "solid-js";`,
      );
    });

    test('imports web renderer APIs from @solidjs/web', () => {
      valid(`import { dynamic, hydrate, render } from "@solidjs/web";`);
    });

    test('allows aliases and namespace imports', () => {
      valid(`
        import { merge as mergeProps } from "solid-js";
        import * as Solid from "solid-js";
        Solid.createSignal(0);
      `);
    });

    test('separates renderer-neutral and web JSX types', () => {
      valid(
        `
          import type { Component, Element, Store } from "solid-js";
          import type { ComponentProps, JSX } from "@solidjs/web";
        `,
        true,
      );
    });

    test('allows Solid 2.0 alternative renderer packages', () => {
      valid(`
        import h from "@solidjs/h";
        import html from "@solidjs/html";
        import { createRenderer } from "@solidjs/universal";
        void [h, html, createRenderer];
      `);
    });
  });

  describe('invalid', () => {
    test('moves core APIs out of the legacy web entry point', () => {
      invalid({
        code: `import { createEffect } from "solid-js/web";`,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createEffect', source: 'solid-js' },
          },
        ],
        output: `import { createEffect } from "solid-js";`,
      });
    });

    test('moves web renderer APIs to @solidjs/web', () => {
      invalid({
        code: `import { render } from "solid-js";`,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'render', source: '@solidjs/web' },
          },
        ],
        output: `import { render } from "@solidjs/web";`,
      });
    });

    test('moves store APIs out of the legacy store entry point', () => {
      invalid({
        code: `import { createStore, snapshot } from "solid-js/store";`,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createStore', source: 'solid-js' },
          },
          {
            messageId: 'prefer-source',
            data: { name: 'snapshot', source: 'solid-js' },
          },
        ],
        output: `import { createStore, snapshot } from "solid-js";`,
      });
    });

    test('merges migrated imports into an existing value import without an explicit importKind', () => {
      invalid({
        code: `
          import { createStore, snapshot } from "solid-js/store";
          import { createSignal } from "solid-js";
        `,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createStore', source: 'solid-js' },
          },
          {
            messageId: 'prefer-source',
            data: { name: 'snapshot', source: 'solid-js' },
          },
        ],
        output: `import { createSignal, createStore, snapshot } from "solid-js";`,
      });
    });

    test('reports mixed destinations without an unsafe partial fix', () => {
      invalid({
        code: `import { createEffect, render } from "solid-js/web";`,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createEffect', source: 'solid-js' },
          },
          {
            messageId: 'prefer-source',
            data: { name: 'render', source: '@solidjs/web' },
          },
        ],
        output: null,
      });
    });

    test('moves web JSX types to @solidjs/web', () => {
      invalid(
        {
          code: `import type { ComponentProps, JSX } from "solid-js";`,
          errors: [
            {
              messageId: 'prefer-source',
              data: { name: 'ComponentProps', source: '@solidjs/web' },
            },
            {
              messageId: 'prefer-source',
              data: { name: 'JSX', source: '@solidjs/web' },
            },
          ],
          output: `import type { ComponentProps, JSX } from "@solidjs/web";`,
        },
        true,
      );
    });

    test('moves renderer-neutral types to solid-js', () => {
      invalid(
        {
          code: `import type { Component, Element } from "@solidjs/web";`,
          errors: [
            {
              messageId: 'prefer-source',
              data: { name: 'Component', source: 'solid-js' },
            },
            {
              messageId: 'prefer-source',
              data: { name: 'Element', source: 'solid-js' },
            },
          ],
          output: `import type { Component, Element } from "solid-js";`,
        },
        true,
      );
    });

    test('moves the hyperscript package path', () => {
      invalid({
        code: `import h from "solid-js/h";`,
        errors: [
          {
            messageId: 'prefer-module-source',
            data: { source: '@solidjs/h' },
          },
        ],
        output: `import h from "@solidjs/h";`,
      });
    });

    test('moves the HTML tagged-template package path', () => {
      invalid({
        code: `import html from "solid-js/html";`,
        errors: [
          {
            messageId: 'prefer-module-source',
            data: { source: '@solidjs/html' },
          },
        ],
        output: `import html from "@solidjs/html";`,
      });
    });

    test('moves the universal renderer package path', () => {
      invalid({
        code: `import { createRenderer } from "solid-js/universal";`,
        errors: [
          {
            messageId: 'prefer-module-source',
            data: { source: '@solidjs/universal' },
          },
        ],
        output: `import { createRenderer } from "@solidjs/universal";`,
      });
    });

    test('moves the web JSX runtime package path', () => {
      invalid({
        code: `import { jsx } from "solid-js/jsx-runtime";`,
        errors: [
          {
            messageId: 'prefer-module-source',
            data: { source: '@solidjs/web/jsx-runtime' },
          },
        ],
        output: `import { jsx } from "@solidjs/web/jsx-runtime";`,
      });
    });
  });
});
