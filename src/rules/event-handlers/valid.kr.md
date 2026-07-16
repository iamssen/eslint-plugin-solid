# event-handlers 런타임 검증

[English](./valid.md)

아래 전체 Playwright fixture는 이 rule이 사용하는 Solid 2 event 동작의 runtime
근거다. prototype checkout 없이도 관찰을 확인할 수 있도록 소스를 함께 기록한다.

## Fixture source: 배열 handler

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

## Fixture source: `on*` attribute

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

## 관찰 결과와 rule 결정

배열 handler는 `1`을 `3`, 다시 `5`로 바꿨다. `on*` fixture는
`data-control="enabled"`, `oncustomattribute="attribute-value"`,
`oncustomnumber="1"`, 존재하는 `oncustomboolean=""`를 관찰했다. HTML은
attribute 이름을 소문자로 정규화하므로 정규화 뒤 충돌하는 `onLy` 같은 이름은
의도적으로 사용하지 않았다. custom event는 직접·배열 handler의 count를 각각
`1`, `2`로 바꿨고, spread handler는 count를 `0`에서 `1`, `2`로 바꿨다.

`event-handlers`는 이 형태들을 report하거나 spread를 펼치면 안 된다. `on*`
값에 제거된 Solid 1 `attr:` namespace를 요구해서도 안 되며, 이전
`detected-attr` 분기와 suggestion은 제거한다. 국소 declaration merging은 임의의
custom prop을 type-check하기 위한 것일 뿐 runtime 동작이나 ESLint 진단과 무관하다.
