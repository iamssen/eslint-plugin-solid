# reactivity runtime validation

[한국어](./valid.kr.md)

The complete Playwright fixtures below are the runtime evidence for this
rule's tracked scopes, effect callbacks, and setter reports.

## Fixture source: batching and `flush()`

```tsx
import type { Element } from 'solid-js';
import { createSignal, flush } from 'solid-js';

export function Batching(): Element {
  const [count, setCount] = createSignal(0);
  const [immediate, setImmediate] = createSignal('not run');
  const [microtask, setMicrotask] = createSignal('not run');
  const [afterFlush, setAfterFlush] = createSignal('not run');

  const updateWithoutFlush = () => {
    setCount(1);
    setImmediate(String(count()));
    queueMicrotask(() => setMicrotask(String(count())));
  };

  const updateWithFlush = () => {
    setCount(2);
    flush();
    setAfterFlush(String(count()));
  };

  return (
    <section>
      <h2>microtask batching</h2>
      <button
        type="button"
        data-testid="batch-update-button"
        onClick={updateWithoutFlush}
      >
        update
      </button>
      <button
        type="button"
        data-testid="batch-flush-button"
        onClick={updateWithFlush}
      >
        update and flush
      </button>
      <output data-testid="batch-immediate-result">{immediate()}</output>
      <output data-testid="batch-microtask-result">{microtask()}</output>
      <output data-testid="batch-flush-result">{afterFlush()}</output>
    </section>
  );
}
```

## Fixture source: compute/apply effects

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

## Fixture source: `onSettled`

```tsx
import type { Element } from 'solid-js';
import { createSignal, onSettled, Show } from 'solid-js';

type SettledChildProps = {
  onCleanup: () => void;
  onSettled: () => void;
};

function SettledChild(props: SettledChildProps): Element {
  onSettled(() => {
    props.onSettled();
    return props.onCleanup;
  });

  return <span>mounted</span>;
}

export function OnSettled(): Element {
  const [visible, setVisible] = createSignal(true);
  const [events, setEvents] = createSignal<string[]>([]);
  const record = (event: string) => setEvents((current) => [...current, event]);

  return (
    <section>
      <h2>onSettled lifecycle</h2>
      <button
        type="button"
        data-testid="on-settled-unmount-button"
        onClick={() => setVisible(false)}
      >
        unmount
      </button>
      <Show when={visible()}>
        <SettledChild
          onSettled={() => record('settled')}
          onCleanup={() => record('cleanup')}
        />
      </Show>
      <output data-testid="on-settled-events">{events().join(',')}</output>
    </section>
  );
}
```

## Fixture source: `merge` and `omit`

```tsx
import type { Element } from 'solid-js';
import { createSignal, merge, omit } from 'solid-js';

export function MergeOmit(): Element {
  const [override, setOverride] = createSignal<string | undefined>('provided');
  const props = merge({ label: 'default', retained: 'yes' }, () => ({
    label: override(),
  }));
  const rest = omit(props, 'label');
  const allProps = omit(props);

  return (
    <section>
      <h2>merge and omit</h2>
      <button
        type="button"
        data-testid="merge-set-undefined-button"
        onClick={() => setOverride(undefined)}
      >
        set undefined
      </button>
      <output data-testid="merge-label-result">
        {props.label ?? 'undefined'}
      </output>
      <output data-testid="omit-retained-result">{rest.retained}</output>
      <output data-testid="omit-all-label-result">
        {allProps.label ?? 'undefined'}
      </output>
    </section>
  );
}
```

## Observations and rule decision

Without `flush()`, the immediate read was `0` and the microtask read was `1`.
After `setCount(2); flush()`, the same-handler read was `2`. A microtask read
is therefore execution-time work, not a dependency-collecting tracked scope;
Solid 1 `batch()` is not modeled as a synchronous tracked scope.

The compute/apply effect recorded `undefined->0` then `0->1`; the deferred
effect recorded `not run` then `1`; the memo changed from `0` to `2`. Only the
compute callback collects dependencies, so the rule reports setter writes there
but allows reads, writes, and cleanup returns in the apply callback.

`onSettled` produced `settled` after mount and `settled,cleanup` after unmount,
so its callback is a called-function scope permitting execution-time reads and
cleanup. The `merge` source read `override()` lazily when JSX consumed
`props.label`, changing the display from `provided` to `undefined`; the rule
therefore tracks `merge`/`omit` results as reactive props. As in
`no-destructure`, a default-prop rewrite remains report-only because it would
change this `undefined` behavior.
