# `<For>` 런타임 검증

[English](./valid.md)

다음 전체 Playwright fixture는 `prefer-for`의 메시지와 fixer 범위에 사용하는
Solid 2 `<For>` 동작을 기록한다.

## Fixture source

```tsx
import type { Element } from 'solid-js';
import { createSignal, For } from 'solid-js';

type Item = {
  id: string;
  label: string;
};

const loadedItems: readonly Item[] = [
  { id: 'first', label: '첫 번째' },
  { id: 'second', label: '두 번째' },
];

export function ForList(): Element {
  const [items, setItems] = createSignal<readonly Item[]>();
  const [slots, setSlots] = createSignal<readonly string[]>([
    '첫 번째 슬롯',
    '두 번째 슬롯',
  ]);
  let nextMountId = 0;

  const markSlotMount = (element: HTMLLIElement) => {
    element.dataset.mountId = String(nextMountId++);
  };

  return (
    <section>
      <h2>For keyed modes</h2>
      <p>
        기본 For는 item 값과 index accessor를, keyed=false는 item accessor와
        숫자 index를 전달합니다.
      </p>

      <button
        type="button"
        data-testid="for-load-items-button"
        onClick={() => setItems(loadedItems)}
      >
        기본 For 항목 불러오기
      </button>
      <ul data-testid="for-default-list">
        <For each={items()}>
          {(item, index) => (
            <li data-testid={`for-default-item-${item.id}`}>
              {item.label}:{index()}
            </li>
          )}
        </For>
      </ul>

      <button
        type="button"
        data-testid="for-replace-first-slot-button"
        onClick={() =>
          setSlots((current) =>
            current.map((slot, index) =>
              index === 0 ? '교체된 첫 번째 슬롯' : slot,
            ),
          )
        }
      >
        첫 번째 위치의 값 교체
      </button>
      <ul data-testid="for-keyed-false-list">
        <For each={slots()} keyed={false}>
          {(item, index) => (
            <li
              data-testid={`for-keyed-false-slot-${index}`}
              ref={markSlotMount}
            >
              {index}:{item()}
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}
```

## 관찰 결과

`each={undefined}`는 목록 항목을 렌더링하지 않았고 throw하지 않았다. items를
불러온 뒤 기본 `<For>`는 `첫 번째:0`, `두 번째:1`을 렌더링했다. 즉 child는
item 값과 index accessor를 받는다. `keyed={false}`에서 위치 0을 바꾸면 텍스트는
`0:첫 번째 슬롯`에서 `0:교체된 첫 번째 슬롯`으로 바뀌었지만 `data-mount-id`는
유지됐다. 이 mode의 child는 item accessor와 숫자 index를 받는다.

## Rule 결정

인수가 하나인 `array.map((item) => jsx)`만 기본 `<For>`로 고칠 수 있다. 두
인수 map은 `index()` 변경이 필요하고 `keyed={false}`는 `item()` 변경이
필요하므로 기계적으로 fix하지 않는다. fixer를 넓히기 전에는 인수 없는 map, 목록
삽입·삭제·재정렬, keyed callback 인수 형태를 검증한다.
