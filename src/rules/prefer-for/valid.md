# Solid 2.0 `<For>` 런타임 검증 코드

이 문서는 `solidjs2-web-prototype/apps/app/runtime-checks/for-list.tsx`와
`index.spec.ts`에서 Playwright로 실제 실행해 확인한 Solid.js 2.0의 `<For>`
동작을 기록한다. `prefer-for` 규칙의 메시지, 문서, 자동 수정 범위를 정할 때
이 문서의 런타임 결과를 우선한다.

검증 명령은 다음과 같다.

```sh
npm run test:e2e
```

## `each={undefined}`는 빈 목록으로 렌더링

`each`에 `undefined`를 전달한 기본 `<For>`는 오류를 내지 않고 자식을 렌더링하지
않았다.

```tsx
const [items] = createSignal<readonly Item[]>();

<ul>
  <For each={items()}>{(item) => <li>{item.label}</li>}</For>
</ul>;
```

따라서 `items?.map((item) => <Row item={item} />)`을 기본 `<For>` 형태로
이전할 때 `items`가 아직 없는 상태 자체는 `<For each={items}>`로 처리할 수 있다.
다만 이 결과가 모든 optional-chain map 식의 자동 수정을 보장하지는 않는다. map의
receiver가 실제 배열인지, callback 외의 optional-chain 문맥이 있는지는 AST만으로
확인해야 한다.

## 기본 `<For>` child 인수

기본 `<For>`는 첫 번째 child 인수로 item **값**을, 두 번째 인수로 index
**accessor**를 전달했다.

```tsx
<For each={items()}>
  {(item, index) => (
    <li>
      {item.label}:{index()}
    </li>
  )}
</For>
```

Playwright 검증에서 두 항목은 각각 `첫 번째:0`, `두 번째:1`로 렌더링되었다.
그러므로 item 인수 하나만 쓰는 `array.map((item) => jsx)`는 기본 `<For>`로
자동 수정할 수 있다. 반면 JavaScript `map`의 두 번째 인수는 숫자지만 기본
`<For>`의 두 번째 인수는 accessor이므로 `(item, index) => ...`를 기계적으로
`<For>`로 바꾸면 `index` 사용을 `index()`로 함께 고쳐야 한다. 이 경우에는
자동 수정을 제공하지 않는다.

## `<For keyed={false}>` child 인수와 DOM 재사용

`keyed={false}`에서는 첫 번째 child 인수가 item **accessor**이고 두 번째 인수는
안정적인 숫자 index였다.

```tsx
<For each={slots()} keyed={false}>
  {(item, index) => <li>{index}:{item()}</li>}
</For>
```

첫 번째 위치의 값만 교체한 뒤에도 다음을 확인했다.

- 표시 텍스트가 `0:첫 번째 슬롯`에서 `0:교체된 첫 번째 슬롯`으로 바뀌었다.
- mount 시 부여한 `data-mount-id`가 그대로여서 해당 위치의 DOM node가 재사용됐다.

이는 제거된 `<Index>`의 대체가 `<For keyed={false}>`라는 migration guide의
설명과 일치한다. 다만 일반 `array.map((item, index) => ...)`의 `item`은 값이므로,
규칙이 단순히 `keyed={false}`를 자동 삽입하면 `item` 사용을 `item()`으로 바꿔야
한다. 자료 구조의 identity/position 의도와 callback 본문을 함께 분석하지 않는 한
`keyed={false}`를 자동 수정으로 선택해서는 안 된다.

## 아직 검증하지 않은 범위

다음은 현재 runtime fixture의 범위 밖이므로 `prefer-for` fixer를 넓히기 전에
별도로 확인한다.

- 인수가 없는 `array.map(() => jsx)`를 기본 `<For>`로 바꾸는 경우
- 배열의 삽입·삭제·재정렬 시 기본 `<For>`와 `keyed={false}`의 DOM identity 차이
- `keyed={(item) => key}` callback의 child 인수 형태

