# reactivity 런타임 검증

[English](./valid.md)

아래 전체 Playwright fixture는 이 rule의 tracked scope, effect callback, setter
report에 대한 runtime 근거다.

## Fixture source: batching과 `flush()`

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

## Fixture source: compute/apply effect

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

## Fixture source: `merge`와 `omit`

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

## 관찰 결과와 rule 결정

`flush()` 없이 immediate read는 `0`, microtask read는 `1`이었다.
`setCount(2); flush()` 뒤 같은 handler의 read는 `2`였다. 따라서 microtask
read는 dependency를 수집하는 tracked scope가 아닌 실행 시점 작업이며, Solid 1
`batch()`를 동기 tracked scope로 모델링하지 않는다.

compute/apply effect는 `undefined->0`, 이어서 `0->1`을 기록했다. deferred
effect는 `not run`, 이어서 `1`을 기록했고 memo는 `0`에서 `2`가 됐다.
dependency는 compute callback만 수집하므로 setter write는 그 안에서 report하고,
apply callback의 read·write·cleanup return은 허용한다.

`onSettled`는 mount 뒤 `settled`, unmount 뒤 `settled,cleanup`을 기록했다.
따라서 callback은 execution-time read와 cleanup을 허용하는 called-function scope다.
`merge` source는 JSX가 `props.label`을 소비할 때 `override()`를 lazy하게
읽어 표시를 `provided`에서 `undefined`로 바꿨다. 따라서 `merge`/`omit`
결과를 reactive prop으로 추적한다. `no-destructure`와 마찬가지로 default prop
rewrite는 이 `undefined` 의미를 바꾸므로 report-only다.
