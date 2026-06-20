import rule from './imports.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('imports', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'imports',
        rule,
        `import { createSignal, mergeProps as merge } from "solid-js";`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'imports',
        rule,
        `import { createSignal, mergeProps as merge } from 'solid-js';`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'imports',
        rule,
        `import { render, hydrate } from "solid-js/web";`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'imports',
        rule,
        `import { createStore, produce } from "solid-js/store";`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'imports',
        rule,
        `import { createSignal } from "solid-js";
    import { render } from "solid-js/web";
    import { something } from "somewhere/else";
    import { createStore } from "solid-js/store";`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'imports',
        rule,
        `import * as Solid from "solid-js"; Solid.render();`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'imports',
        rule,
        `import type { Component, JSX } from "solid-js";
import type { Store } from "solid-js/store";`,
        true,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('imports', rule, {
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
      testInvalid('imports', rule, {
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
      testInvalid(
        'imports',
        rule,
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
      testInvalid('imports', rule, {
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
      testInvalid('imports', rule, {
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
        testInvalid('imports', rule, {
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
        testInvalid('imports', rule, {
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
