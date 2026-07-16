# event-handlers runtime validation

[한국어](./valid.kr.md)

The complete Playwright fixtures below are the runtime evidence for the Solid 2
event behavior used by this rule. The source is included so the observations do
not depend on the prototype checkout.

## Fixture source: array handler

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

## Fixture source: `on*` attributes

```tsx
import type { Element } from 'solid-js';
import { createSignal } from 'solid-js';

declare module '@solidjs/web' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface HTMLAttributes<T> {
      onCustomAttribute?: T extends HTMLDivElement ? string : never;
      onCustomNumber?: T extends HTMLDivElement ? number : never;
      onCustomBoolean?: T extends HTMLDivElement ? boolean : never;
    }
  }
}

const expectedAttributes = {
  dataControl: 'enabled',
  onCustomAttribute: 'attribute-value',
  onCustomNumber: '1',
  onCustomBoolean: {
    present: true,
    value: '',
  },
};
const expectedJson = JSON.stringify(expectedAttributes, null, 2);

export function OnAttributes(): Element {
  const [actualJson, setActualJson] = createSignal<string>();
  const [matchesExpected, setMatchesExpected] = createSignal<boolean>();

  const inspectAttributes = (element: HTMLDivElement) => {
    const actualAttributes = {
      // eslint-disable-next-line unicorn/prefer-dom-node-dataset
      dataControl: element.getAttribute('data-control'),
      onCustomAttribute: element.getAttribute('oncustomattribute'),
      onCustomNumber: element.getAttribute('oncustomnumber'),
      onCustomBoolean: {
        present: element.hasAttribute('oncustomboolean'),
        value: element.getAttribute('oncustomboolean'),
      },
    };
    const json = JSON.stringify(actualAttributes, null, 2);

    setActualJson(json);
    setMatchesExpected(json === expectedJson);
  };

  return (
    <section>
      <h2>on* 문자열 attribute</h2>
      <p>
        검사 버튼을 누르면 실제 DOM attribute를 JSON으로 표시하고 기대값과
        비교합니다.
      </p>
      <h3>기대 JSON</h3>
      <pre>{expectedJson}</pre>
      <div
        data-testid="on-attributes-target"
        data-control="enabled"
        onCustomAttribute="attribute-value"
        onCustomNumber={1}
        onCustomBoolean={true}
      />
      <button
        type="button"
        data-testid="on-attributes-inspect-button"
        onClick={(event) =>
          inspectAttributes(
            event.currentTarget.previousElementSibling as HTMLDivElement,
          )
        }
      >
        attribute 검사
      </button>
      {actualJson() && (
        <>
          <h3>실제 JSON</h3>
          <pre>{actualJson()}</pre>
          <output data-testid="on-attributes-result">
            {matchesExpected() ? '기대값과 일치' : '기대값과 불일치'}
          </output>
        </>
      )}
    </section>
  );
}
```

## Fixture source: native custom event

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

## Fixture source: spread handler

```tsx
import type { Element } from 'solid-js';
import { createSignal } from 'solid-js';

export function SpreadEventHandler(): Element {
  const [count, setCount] = createSignal(0);
  const handlers = {
    onClick: () => setCount((previous) => previous + 1),
  };

  return (
    <section>
      <h2>spread event handler</h2>
      <p>
        버튼을 클릭할 때마다 spread된 `onClick` handler가 실행되어 카운터가 1씩
        증가해야 합니다.
      </p>
      <button
        type="button"
        data-testid="spread-event-handler-button"
        {...handlers}
      >
        spread handler: {count()}
      </button>
    </section>
  );
}
```

## Observations and rule decision

The array handler changed `1` to `3` and then `5`. The `on*` fixture observed
`data-control="enabled"`, `oncustomattribute="attribute-value"`,
`oncustomnumber="1"`, and a present `oncustomboolean=""`; HTML lowercases
attribute names. It intentionally avoids names such as `onLy`, which collide
after normalization. The custom event changed direct and array counts to `1`
and `2`, and the spread handler changed its count from `0` to `1` to `2`.

`event-handlers` must not report any of these forms or expand a spread. It must
not require the removed Solid 1 `attr:` namespace for `on*` values; the former
`detected-attr` branch and suggestion are removed. The local declaration
merging only makes arbitrary custom props type-check and is unrelated to the
runtime behavior or ESLint diagnostics.
