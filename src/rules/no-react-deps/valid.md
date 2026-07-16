# no-react-deps runtime validation

[한국어](./valid.kr.md)

This complete Playwright fixture establishes Solid 2 compute/apply effects and
`defer` behavior.

## Fixture source

```tsx
import type { Element } from 'solid-js';
import { createEffect, createMemo, createSignal } from 'solid-js';

export function Effects(): Element {
  const [count, setCount] = createSignal(0);
  const [effectResult, setEffectResult] = createSignal('pending');
  const [deferredResult, setDeferredResult] = createSignal('not run');
  const doubled = createMemo(() => count() * 2, { lazy: false });

  createEffect(
    () => count(),
    (value, previous) => {
      setEffectResult(`${previous ?? 'undefined'}->${value}`);
    },
  );

  createEffect(
    count,
    (value) => {
      setDeferredResult(String(value));
    },
    { defer: true },
  );

  return (
    <section>
      <h2>separated effects and memos</h2>
      <button
        type="button"
        data-testid="effects-increment-button"
        onClick={() => setCount((value) => value + 1)}
      >
        increment
      </button>
      <output data-testid="effects-apply-result">{effectResult()}</output>
      <output data-testid="effects-defer-result">{deferredResult()}</output>
      <output data-testid="effects-memo-result">{doubled()}</output>
    </section>
  );
}
```

## Observations and rule decision

The compute/apply effect displayed `undefined->0` initially and `0->1` after
an update. The deferred effect displayed `not run` initially and `1` only after
the count changed; the memo changed from `0` to `2`.

This rule continues to report React-style dependency arrays while allowing the
Solid 2 compute/apply signature and `{ defer: true }`. A definite primitive
initial value is diagnosed separately because it conflicts with a removed
Solid 1 overload.
