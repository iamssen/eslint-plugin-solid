# prefer-for

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
React에서는 배열을 렌더링할 때 JavaScript의 기본 배열 메서드인 `Array.prototype.map`을 주로 사용합니다. 하지만 Solid.js에서 `.map`을 사용하면 배열 상태가 변경될 때마다 맵핑된 컴포넌트 전체가 매번 다시 생성되고 파괴되는 비효율적인 렌더링이 발생합니다. 이를 피하기 위해 변경된 항목만 지능적으로 추가/삭제하는 제어 흐름(Control Flow) 컴포넌트인 `<For>`의 사용을 강제합니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** Solid.js의 배열 렌더링 최적화는 컴파일러와 `<For>`, `<Index>` 등의 컴포넌트에 의존하며, 이는 2.0에서도 핵심적인 최적화 기법입니다.

## 3. 그 외 규칙 이해를 위한 설명
만약 배열의 데이터가 객체의 참조(Reference)가 아닌 원시 값(Primitive Value)들로 구성되어 있거나 인덱스를 기준으로 컴포넌트를 재사용해야 한다면, `<For>` 대신 `<Index>` 컴포넌트 사용을 고려해야 합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (배열이 바뀔 때마다 모든 li가 파괴되고 다시 생성됨)
function TodoList(props) {
  return (
    <ul>
      {props.todos.map((todo) => (
        <li>{todo.text}</li>
      ))}
    </ul>
  );
}

// ✅ 올바른 예시 (<For> 컴포넌트를 사용하여 변경된 DOM 요소만 재조정됨)
import { For } from 'solid-js';

function TodoList(props) {
  return (
    <ul>
      <For each={props.todos}>
        {(todo, index) => <li>{todo.text}</li>}
      </For>
    </ul>
  );
}
```
