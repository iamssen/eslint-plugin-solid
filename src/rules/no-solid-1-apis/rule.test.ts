import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('no-solid-1-apis', rule);
const invalid = testInvalid('no-solid-1-apis', rule);

describe('no-solid-1-apis', () => {
  describe('valid', () => {
    test('allows current Solid 2 APIs', () => {
      valid(`
        import { createContext, createEffect, For, Loading } from 'solid-js';
        const Context = createContext();
        createEffect(() => {});
        const App = () => <Context value="value"><For each={[]} /><Loading /></Context>;
      `);
    });

    test('does not confuse a shadowed import binding', () => {
      valid(`
        import { batch } from 'solid-js';
        function run(batch) { batch(); }
        run(() => {});
      `);
    });
  });

  describe('invalid', () => {
    test('reports direct imports and aliases when used', () => {
      invalid({
        code: `
          import { createResource as resource, Index as LegacyIndex } from 'solid-js';
          resource();
          const App = () => <LegacyIndex each={[]} />;
        `,
        errors: [
          {
            messageId: 'removedApi',
            data: {
              api: 'createResource',
              replacement: 'Use an explicit async data flow with Loading or Errored',
            },
          },
          {
            messageId: 'removedApi',
            data: {
              api: 'Index',
              replacement:
                'Use <For keyed={false}> when position-based list rendering is needed',
            },
          },
        ],
      });
    });

    test('reports namespace calls and JSX components', () => {
      invalid({
        code: `
          import * as Solid from 'solid-js';
          Solid.batch(() => {});
          const App = () => <Solid.Suspense />;
        `,
        errors: [
          {
            messageId: 'removedApi',
            data: {
              api: 'batch',
              replacement:
                'Updates are automatically batched; use flush only when necessary',
            },
          },
          {
            messageId: 'removedApi',
            data: {
              api: 'Suspense',
              replacement: 'Use Loading for a loading boundary',
            },
          },
        ],
      });
    });

    test('reports the removed Context.Provider syntax', () => {
      invalid({
        code: `
          import { createContext as makeContext } from 'solid-js';
          const Context = makeContext();
          const App = () => <Context.Provider value="value" />;
        `,
        errors: [{ messageId: 'contextProvider' }],
      });
    });

    test('reports removed store APIs', () => {
      invalid({
        code: `
          import { createMutable as mutable } from 'solid-js/store';
          mutable({ count: 0 });
        `,
        errors: [
          {
            messageId: 'removedApi',
            data: {
              api: 'createMutable',
              replacement: 'Use createStore and update it through its draft setter',
            },
          },
        ],
      });
    });

    test('reports removed lifecycle and tracking helpers', () => {
      invalid({
        code: `
          import { createReactive, onMount } from 'solid-js';
          const track = createReactive();
          onMount(() => track(() => {}));
        `,
        errors: [
          {
            messageId: 'removedApi',
            data: {
              api: 'createReactive',
              replacement:
                'Use createReaction when an explicit tracking callback is needed',
            },
          },
          {
            messageId: 'removedApi',
            data: {
              api: 'onMount',
              replacement: 'Use onSettled for work that runs after the DOM settles',
            },
          },
        ],
      });
    });
  });
});
