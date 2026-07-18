# prefer-for

[English](./readme.md)

JSX에서 배열 `.map()`보다 Solid의 `<For>`를 선호합니다.

## 기본 설정

이 rule은 `recommended`에서 error로 활성화됩니다.

```js
'@ssen/solid/prefer-for': 'error'
```

## 옵션

이 rule에는 옵션이 없습니다.

## 상세

JSX 안에서 배열의 `.map()`으로 목록을 렌더링하는 대신 Solid의 `<For>`를 사용하도록 안내합니다. Solid의 제어 흐름 컴포넌트는 목록 업데이트에 맞는 세밀한 반응성 모델을 제공합니다.

## 왜 `.map()`과 다를까?

React에서는 render 때마다 `items.map(...)`이 새 element tree를 만들고 React reconciler가 이를 비교합니다. Solid의 JSX는 컴파일되어 DOM 연산과 reactive computation으로 분해되므로, 일반 `.map()`은 배열 변경 시 목록 생성 로직을 다시 평가하는 형태가 됩니다. `<For>`는 배열의 항목을 추적하고 항목 단위로 DOM을 재사용하는 Solid 전용 control-flow primitive입니다.

```tsx
import { For } from 'solid-js';

<For each={props.items}>{(item) => <li>{item.name}</li>}</For>
```

Solid 2.0에서 `<Index>`는 제거되었습니다. 객체 배열처럼 항목의 identity를 기준으로 렌더링하려면 기본 `<For>`를 사용합니다. 위치가 유지되고 각 위치의 값만 바뀌는 배열에는 `<For keyed={false}>`를 사용합니다. 이 규칙은 자료 구조의 의도까지 알 수 없으므로 keyed mode의 최종 선택은 개발자가 해야 합니다.

## 예제로 보는 동작

JSX 안에서 목록을 만들기 위한 `.map()`은 invalid입니다.

```tsx
// invalid
<ul>{props.todos.map((todo) => <li>{todo.title}</li>)}</ul>

// autofix 후: valid
<ul><For each={props.todos}>{(todo) => <li>{todo.title}</li>}</For></ul>
```

이 rule은 `<For>`가 필요한 상황만 겨냥합니다. JSX 밖에서 데이터를 가공하는 일반 `.map()`은 valid입니다.

```ts
// valid: 렌더링이 아니라 데이터 변환
const titles = props.todos.map((todo) => todo.title.toUpperCase());
```

## callback 인수와 자동 수정 경계

기본 `<For>`는 item 값과 index accessor를 전달합니다.

```tsx
<For each={props.todos}>
  {(todo, index) => <li>{index()}: {todo.title}</li>}
</For>
```

`keyed={false}`는 item accessor와 숫자 index를 전달합니다. 이는 제거된 `<Index>`의 대체입니다.

```tsx
<For each={props.slots} keyed={false}>
  {(slot, index) => <li>{index}: {slot()}</li>}
</For>
```

그래서 이 rule은 item 인수가 하나인 `.map((item) => jsx)`만 기본 `<For>`로 자동 수정합니다. `map`의 두 번째 인수는 숫자지만 기본 `<For>`의 두 번째 인수는 accessor이고, `keyed={false}`에서는 첫 번째 인수까지 accessor가 됩니다. 인수가 없거나 두 개 이상인 callback은 자료 구조의 의도와 identifier 사용을 검토해야 하므로 오류만 보고하고 수정하지 않습니다.

```tsx
// invalid: index를 index()로 바꿀지, keyed={false}와 item()을 쓸지 검토 필요
{props.todos.map((todo, index) => <li>{index}: {todo.title}</li>)}
```

`items?.map((item) => jsx)`처럼 배열이 아직 없을 수 있는 한 인자 map도 `<For each={items}>`로 수정합니다. `<For>`는 `each={undefined}`를 빈 목록으로 렌더링합니다. 자동 수정은 callback body를 보존하므로 React의 `key={...}`가 남아 있다면 `no-react-specific-props`도 함께 확인하세요. 자세한 runtime 근거는 [valid.kr.md](./valid.kr.md)를 참고하세요.
