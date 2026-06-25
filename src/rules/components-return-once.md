# components-return-once

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js의 컴포넌트는 상태(State)와 효과(Effect)를 설정하기 위해 단 한 번만 실행되는 설정(setup) 함수입니다. React와 같이 매번 리렌더링되는 방식이 아니므로, 컴포넌트 내에서 조건에 따라 `return`을 일찍 여러 번 수행하는 방식(Early Return)을 사용하면 함수 실행이 중단되어 의도한 대로 반응성(Reactivity)이 제대로 동작하지 않게 됩니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** Solid.js 2.0에서도 컴포넌트가 단 한 번만 실행된다는 핵심 철학은 동일합니다. 렌더링 최적화 및 DOM 업데이트는 컴포넌트 재실행이 아닌 JSX 내부의 반응성 시스템을 통해 이루어집니다.

## 3. 그 외 규칙 이해를 위한 설명
조건부 렌더링이 필요할 때는 컴포넌트 자체를 일찍 반환(return)하는 대신, JSX 내부에서 `<Show>`, `<Switch>` 등의 제어 흐름(Control Flow) 컴포넌트를 활용하여 렌더링 트리를 구성해야 합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (Early return)
// 컴포넌트가 최초 1회 실행될 때 isLoading이 true라면, 
// 밑에 있는 JSX는 아예 평가조차 되지 않으며 이후 상태가 변해도 업데이트되지 않습니다.
function MyComponent(props) {
  if (props.isLoading) {
    return <div>Loading...</div>; 
  }
  return <div>{props.data}</div>;
}

// ✅ 올바른 예시 (<Show> 컴포넌트 사용)
import { Show } from 'solid-js';

function MyComponent(props) {
  // 컴포넌트는 단 한 번만 실행되며, 
  // Show 컴포넌트 내부에서 props.isLoading 의 변화를 추적하여 화면을 업데이트합니다.
  return (
    <Show when={!props.isLoading} fallback={<div>Loading...</div>}>
      <div>{props.data}</div>
    </Show>
  );
}
```
