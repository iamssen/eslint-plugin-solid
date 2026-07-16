# no-array-handlers runtime validation

[한국어](./valid.kr.md)

The following Playwright fixtures establish that Solid 2 supports array event
handlers. Their full source is included so this document remains useful without
access to the prototype checkout.

## Fixture source: ordinary DOM event

`array-handler.tsx` was:

```tsx
import type { Element } from 'solid-js';
import { createSignal } from 'solid-js';

export function ArrayHandler(): Element {
  const [count, setCount] = createSignal(1);
  const increment = (i: number) => setCount((prev) => prev + i);

  return (
    <section>
      <h2>array event handler</h2>
      <p>클릭할 때마다 배열의 두 번째 값(2)만큼 카운터가 증가해야 합니다.</p>
      <button
        type="button"
        data-testid="array-handler-button"
        onClick={[increment, 2]}
      >
        {count()}
      </button>
    </section>
  );
}
```

## Fixture source: native custom event

`custom-event-handlers.tsx` was:

```tsx
import type { Element } from 'solid-js';
import { createSignal } from 'solid-js';

declare module '@solidjs/web' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface EventHandlersElement<T> {
      onCustom?: T extends HTMLButtonElement
        ? EventHandlerUnion<T, CustomEvent>
        : never;
    }
  }
}

const dispatchCustom = (element: HTMLButtonElement) =>
  element.dispatchEvent(new CustomEvent('custom'));

export function CustomEventHandlers(): Element {
  const [directCount, setDirectCount] = createSignal(0);
  const [arrayCount, setArrayCount] = createSignal(0);

  const incrementDirect = () => setDirectCount((count) => count + 1);
  const incrementArray = (amount: number) =>
    setArrayCount((count) => count + amount);

  return (
    <section>
      <h2>custom event handler</h2>
      <p>
        각 버튼을 클릭하면 `custom` event가 dispatch되고, 일반 handler는 1씩,
        배열 handler는 2씩 증가해야 합니다.
      </p>
      <button
        type="button"
        data-testid="custom-event-direct-button"
        onCustom={incrementDirect}
        onClick={(event) => dispatchCustom(event.currentTarget)}
      >
        일반 handler: {directCount()}
      </button>
      <button
        type="button"
        data-testid="custom-event-array-button"
        onCustom={[incrementArray, 2]}
        onClick={(event) => dispatchCustom(event.currentTarget)}
      >
        배열 handler: {arrayCount()}
      </button>
    </section>
  );
}
```

## Observations

For the ordinary event, the second tuple item was passed as the handler's first
argument: two clicks changed the count from `1` to `3` and then `5`. Dispatching
`CustomEvent('custom')` changed the direct-handler count to `1` and the
array-handler count to `2`.

The declaration merging is only needed because `@solidjs/web` does not declare
an arbitrary `onCustom` prop. It makes the fixture type-check and does not
affect its runtime behavior.

## Rule decision

Array handlers are valid in Solid 2, so this rule is off in `recommended` and
is only an opt-in team style rule. Removed `on:` and `oncapture:` namespaces
are diagnosed by `no-unknown-namespaces`, not by this rule.
