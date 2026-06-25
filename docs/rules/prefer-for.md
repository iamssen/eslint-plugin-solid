# prefer-for

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

React에서는 배열을 렌더링할 때 자바스크립트의 표준 메서드인 `Array.prototype.map()`을 사용하여 JSX 요소 배열로 변환하는 것이 일반적입니다.

하지만 **Solid.js에서 JSX 내부의 `.map()`을 사용하면 심각한 성능 저하가 발생할 수 있습니다.** 
배열의 요소가 추가되거나 변경될 때마다 전체 `.map()` 함수가 다시 실행되어 DOM 요소들을 불필요하게 통째로 다시 생성하기 때문입니다.

이를 해결하기 위해 Solid.js는 `<For>`라는 내장 제어 흐름(Control Flow) 컴포넌트를 제공합니다. `<For>` 컴포넌트는 내부적으로 이전 배열과 새로운 배열을 비교(Diffing)하여, 변경되거나 추가된 요소의 DOM만 똑똑하게 업데이트(캐싱)합니다. 

이 규칙은 JSX 반환문 안에서 배열의 `.map()`을 사용하는 코드를 감지하고, 성능 낭비를 막기 위해 이를 `<For>` 컴포넌트로 교체하도록 유도하기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

목록 렌더링을 최적화하기 위해 `<For>`(또는 `<Index>`) 컴포넌트를 사용하는 것은 Solid.js의 가장 핵심적인 아키텍처 중 하나입니다. 이는 Solid.js 2.0에서도 전혀 변함이 없으며, 이 규칙은 여전히 가장 중요한 성능 최적화 가이드로 남을 것입니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (Array.map 사용)

아래 코드처럼 `{items.map(...)}`을 사용하면, `items` 배열에 항목이 하나라도 추가되거나 삭제될 때마다 5개의 `<li>`가 모두 파괴되고 다시 만들어집니다. (비효율적)

```jsx
// ❌ React 방식의 배열 렌더링 (Solid에서는 성능 저하 발생)
function TodoList(props) {
  return (
    <ul>
      {props.todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### 🟢 올바른 사용 예 (<For> 컴포넌트 사용)

`<For>` 컴포넌트를 사용하면 Solid.js가 배열의 참조를 영리하게 캐싱하여 렌더링을 최적화합니다. (또한 Solid에서는 `key` 속성을 적어줄 필요가 없습니다!)

```jsx
// 🟢 Solid.js의 최적화된 <For> 컴포넌트 사용
import { For } from "solid-js";

function TodoList(props) {
  return (
    <ul>
      <For each={props.todos}>
        {(todo) => <li>{todo.text}</li>}
      </For>
    </ul>
  );
}
```

### 자동 수정 (Auto-fix) 작동 방식

이 규칙은 JSX 트리 안에서 사용된 `.map()` 코드를 감지하면 자동으로 `<For>` 구문으로 코드를 교체(Auto-fix)해 주며, 불필요해진 `key={...}` 속성도 함께 제거해 줍니다.
