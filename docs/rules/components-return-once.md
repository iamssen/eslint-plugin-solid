# components-return-once

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

React와 같은 프레임워크에서는 상태가 변경될 때마다 컴포넌트 함수 전체가 여러 번 재실행(Re-render)됩니다. 반면, **Solid.js에서 컴포넌트 함수는 수명 주기 동안 단 한 번만 실행됩니다.** 컴포넌트는 단지 초기 상태를 설정하고 리액티브 그래프(Reactive Graph)를 구성하는 역할을 할 뿐입니다.

이러한 차이 때문에, React에서 자주 사용하는 패턴인 **"조건부 조기 반환(Early Return)"**을 Solid.js에서 사용하면 문제가 발생합니다. 함수가 일찍 반환되어 버리면 그 아래에 선언된 훅(`createEffect`, `createSignal` 등)이나 JSX 요소들이 아예 생성되지 못하며, 나중에 상태가 변경되더라도 컴포넌트 함수가 다시 실행되지 않으므로 UI가 갱신되지 않습니다.

이 규칙은 컴포넌트 함수 내에서 조건부로 분기하여 `return` 하는 것을 금지하고, Solid.js의 제어 흐름 컴포넌트(`<Show>`, `<Switch>`, `<Match>` 등)를 사용하도록 유도합니다.

## 2. Solid.js 2.0에서의 변경 여부

**이 규칙은 Solid.js 2.0에서도 완전히 동일하게 유지됩니다.** 
Solid.js 2.0 역시 "컴포넌트는 한 번만 실행된다"는 핵심 설계 철학을 그대로 이어갑니다. 따라서 조기 반환(Early Return)을 사용하는 것은 여전히 동작하지 않는 안티 패턴입니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (조건부 조기 반환)

React 스타일의 조건부 반환입니다. `isLoading`이 `true`일 때 컴포넌트가 즉시 반환(return)되어 버리며, 나중에 `isLoading`이 `false`로 바뀌더라도 `UserProfile` 함수는 다시 실행되지 않기 때문에 실제 유저 데이터는 영원히 화면에 렌더링되지 않습니다.

```jsx
// ❌ Solid에서는 컴포넌트가 다시 실행되지 않음
function UserProfile(props) {
  if (props.isLoading) {
    return <div>Loading...</div>;
  }

  return <div>User: {props.user.name}</div>;
}
```

### 🟢 올바른 사용 예 (제어 흐름 컴포넌트 사용)

컴포넌트는 렌더링 트리를 모두 구성하여 한 번에 반환하고, 조건부 렌더링은 Solid.js에서 제공하는 `<Show>` 컴포넌트를 사용해 처리해야 합니다.

```jsx
// 🟢 <Show> 컴포넌트를 사용하여 조건부 렌더링 처리
import { Show } from "solid-js";

function UserProfile(props) {
  return (
    <Show 
      when={!props.isLoading} 
      fallback={<div>Loading...</div>}
    >
      <div>User: {props.user.name}</div>
    </Show>
  );
}
```

### 시각적 요약

- **React**: 상태 변경 ➡️ 컴포넌트 함수 전체 재실행 ➡️ 조건에 맞는 `return` 발생
- **Solid**: 상태 변경 ➡️ 컴포넌트 함수 **재실행 안 함** ➡️ 오직 바뀐 상태를 구독하고 있는 `<Show>`나 특정 JSX 내부만 업데이트
