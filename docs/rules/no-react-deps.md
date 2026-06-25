# no-react-deps

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

React의 훅(Hook)인 `useEffect`, `useMemo`, `useCallback` 등은 개발자가 수동으로 의존성 배열(Dependency Array)을 두 번째 인자로 전달해야 합니다. 그래야 해당 값들이 변경될 때만 훅이 다시 실행됩니다.

반면, **Solid.js의 반응성 시스템은 의존성을 자동으로 추적합니다.** `createEffect`나 `createMemo` 내부에서 접근하는 신호(Signal)들은 자동으로 의존성으로 등록됩니다. 따라서 Solid.js에서는 의존성 배열을 매개변수로 넘길 필요가 전혀 없습니다.

React에서 Solid.js로 넘어온 많은 개발자들이 무심코 `createEffect`에 두 번째 인자로 의존성 배열(`[a, b]`)을 넘기는 실수를 범합니다. Solid.js는 이 두 번째 인자를 무시하거나 초기화 값으로 처리하므로 코드는 오류 없이 실행되지만, 개발자는 React처럼 동작할 것이라고 착각하여 예기치 않은 버그를 만들 수 있습니다. 

이 규칙은 개발자가 실수로 의존성 배열을 넣었을 때 이를 경고하고, 배열을 삭제하도록 유도하기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

자동 의존성 추적 모델은 Solid.js의 가장 근본적인 정체성입니다. Solid.js 2.0에서도 의존성 배열을 사용하지 않는 방식은 동일하게 유지되므로, 이 규칙은 버전과 무관하게 항상 필수적입니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (React 스타일의 의존성 배열 사용)

아래처럼 두 번째 인자로 배열을 넘겨주는 코드는 React에서는 맞지만, Solid.js에서는 잘못된 문법(의미 없는 코드)입니다.

```jsx
// ❌ 불필요한 의존성 배열을 추가한 경우
import { createEffect, createSignal } from "solid-js";

function Component() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    console.log("Count is", count());
  }, [count]); // <-- Solid에서는 쓸모없는 코드!
}
```

### 🟢 올바른 사용 예 (자동 추적 또는 `on` 헬퍼 사용)

Solid.js에서는 기본적으로 함수만 넘기면 알아서 추적됩니다. 만약 의존성을 수동으로 명시적으로 분리하거나 제어하고 싶다면, Solid.js가 제공하는 `on` 헬퍼 함수를 사용해야 합니다.

```jsx
// 🟢 자동으로 추적하게 둠 (가장 일반적인 방법)
createEffect(() => {
  console.log("Count is", count());
});

// 🟢 만약 특정 값의 변경에만 반응하게 하려면 'on' 헬퍼를 사용
import { createEffect, on } from "solid-js";

createEffect(
  on(count, (v) => {
    console.log("Count changed to", v);
  }, { defer: true })
);
```

### 시각적 요약

- **React (`useEffect`)**: "내가 어떤 값들을 감시할지 배열로 적어줄게."
- **Solid (`createEffect`)**: "알아서 다 감시할 테니까 배열은 지워줘!"
