import rule from './imports.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('imports', rule);
const invalid = testInvalid('imports', rule);

describe('imports', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`import { createSignal, mergeProps as merge } from "solid-js";`);
    });
    test('valid case 2', () => {
      valid(`import { createSignal, mergeProps as merge } from 'solid-js';`);
    });
    test('valid case 3', () => {
      valid(`import { render, hydrate } from "solid-js/web";`);
    });
    test('valid case 4', () => {
      valid(`import { createStore, produce } from "solid-js/store";`);
    });
    test('valid case 5', () => {
      valid(
        `import { createSignal } from "solid-js";
    import { render } from "solid-js/web";
    import { something } from "somewhere/else";
    import { createStore } from "solid-js/store";`,
      );
    });
    test('valid case 6', () => {
      valid(`import * as Solid from "solid-js"; Solid.render();`);
    });
    test('valid case 7', () => {
      valid(
        `import type { Component, JSX } from "solid-js";
import type { Store } from "solid-js/store";`,
        true,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
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
    test('invalid case 2', () => {
      invalid({
        code: `import { createEffect } from "solid-js/web";
import { createSignal } from "solid-js";`,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createEffect', source: 'solid-js' },
          },
        ],
        output: `
import { createSignal, createEffect } from "solid-js";`,
      });
    });
    test('invalid case 3', () => {
      invalid(
        {
          code: `import type { Component } from "solid-js/store";
import { createSignal } from "solid-js";
console.log('hi');`,
          errors: [
            {
              messageId: 'prefer-source',
              data: { name: 'Component', source: 'solid-js' },
            },
          ],
          output: `
import { createSignal, Component } from "solid-js";
console.log('hi');`,
        },
        true,
      );
    });
    test('invalid case 4', () => {
      invalid({
        code: `import { createSignal } from "solid-js/web";
import "solid-js";`,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createSignal', source: 'solid-js' },
          },
        ],
        output: `
import { createSignal } from "solid-js";`,
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `import { createSignal } from "solid-js/web";
import {} from "solid-js";`,
        errors: [
          {
            messageId: 'prefer-source',
            data: { name: 'createSignal', source: 'solid-js' },
          },
        ],
        output: `
import { createSignal } from "solid-js";`,
      });
    });
    describe(`Two-part fix, output here is first pass...`, () => {
      test('invalid case 6', () => {
        invalid({
          code: `import { createEffect } from "solid-js/web";
import { render } from "solid-js";`,
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
import { render, createEffect } from "solid-js";`,
        });
      });
    });
    describe(`...and output here is second pass`, () => {
      test('invalid case 7', () => {
        invalid({
          code: `
import { render, createEffect } from "solid-js";`,
          errors: [
            {
              messageId: 'prefer-source',
              data: { name: 'render', source: 'solid-js/web' },
            },
          ],
          output: `
import { render } from "solid-js/web";
import {  createEffect } from "solid-js";`,
        });
      });
    });
  });
});
