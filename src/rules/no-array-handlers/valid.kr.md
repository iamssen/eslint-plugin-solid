# no-array-handlers 런타임 검증

[English](./valid.md)

아래 Playwright fixture는 Solid 2가 배열 event handler를 지원한다는 runtime 근거다.
prototype checkout 없이도 검증 내용을 확인할 수 있도록 전체 소스를 함께 기록한다.

## Fixture source: 일반 DOM event

`array-handler.tsx`의 내용:

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

`custom-event-handlers.tsx`의 내용:

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

## 관찰 결과

일반 DOM event에서는 tuple의 두 번째 항목이 handler의 첫 번째 인수로 전달됐다.
두 번 클릭하면 count가 `1`에서 `3`, 다시 `5`가 됐다. `CustomEvent('custom')`을
dispatch하면 직접 handler의 count는 `1`, 배열 handler의 count는 `2`가 됐다.

`@solidjs/web`은 기본적으로 임의의 `onCustom` prop을 선언하지 않는다. 따라서
fixture의 declaration merging은 type-check만 가능하게 하며 runtime 동작에는 영향을
주지 않는다.

## Rule 결정

배열 handler는 Solid 2에서 유효하므로 이 rule은 `recommended`에서 `off`다.
이 rule은 선택적인 팀 스타일 규칙이다. 제거된 `on:` 및 `oncapture:` namespace는
이 rule이 아니라 `no-unknown-namespaces`가 진단한다.
