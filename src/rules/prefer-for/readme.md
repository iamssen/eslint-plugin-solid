# prefer-for

JSX 안에서 배열의 `.map()`으로 목록을 렌더링하는 대신 Solid의 `<For>` 또는 `<Index>`를 사용하도록 안내합니다. Solid의 제어 흐름 컴포넌트는 목록 업데이트에 맞는 세밀한 반응성 모델을 제공합니다.

## 왜 `.map()`과 다를까?

React에서는 render 때마다 `items.map(...)`이 새 element tree를 만들고 React reconciler가 이를 비교합니다. Solid의 JSX는 컴파일되어 DOM 연산과 reactive computation으로 분해되므로, 일반 `.map()`은 배열 변경 시 목록 생성 로직을 다시 평가하는 형태가 됩니다. `<For>`는 배열의 항목을 추적하고 항목 단위로 DOM을 재사용하는 Solid 전용 control-flow primitive입니다.

```tsx
import { For } from 'solid-js';

<For each={props.items}>{(item) => <li>{item.name}</li>}</For>
```

콜백에서 항목을 사용하면 `<For>`로, 항목을 사용하지 않고 인덱스 기반 렌더링이 적합하면 `<For>` 또는 `<Index>`를 선택하라는 메시지가 표시될 수 있습니다. 이 규칙은 모든 JavaScript `.map()`을 금지하지 않고 JSX 자식으로 사용되는 목록 패턴을 대상으로 합니다.

객체 배열처럼 항목의 identity를 기준으로 렌더링하려면 보통 `<For>`를 사용합니다. 위치가 유지되고 각 위치의 값만 바뀌는 배열을 인덱스 중심으로 렌더링하려면 `<Index>`가 더 적합할 수 있습니다. 이 규칙은 자료 구조의 의도까지 알 수 없으므로 최종 선택은 개발자가 해야 합니다.

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

callback이 item을 전혀 사용하지 않으면 `<For>`와 `<Index>` 중 어느 것이 맞는지 rule이 결정할 수 없습니다.

```tsx
// invalid: rule은 “<For> 또는 <Index>를 사용”하라고 안내
{props.slots.map(() => <Skeleton />)}
```

객체 item의 identity를 유지하면서 렌더링하면 보통 `<For>`를 선택합니다. 배열의 각 **위치**가 고정돼 있고 그 위치의 값만 바뀌는 UI라면 `<Index>`가 더 맞을 수 있습니다. 자동 수정은 callback body를 보존하므로 React의 `key={...}`가 남아 있다면 `no-react-specific-props`도 함께 확인하세요.
