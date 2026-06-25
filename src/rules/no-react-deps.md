# no-react-deps

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
React의 `useEffect` 훅은 함수가 다시 실행될 조건(의존성)을 배열(Dependency Array) 형태로 두 번째 인자에 명시해야 합니다. 그러나 Solid.js의 `createEffect`는 함수 내부에서 접근하는 반응형 상태(Signal)들을 자동으로 추적합니다. 여기에 React의 습관대로 의존성 배열을 넣게 되면 Solid에서는 무시되거나 원치 않는 동작(또는 타입 에러)을 유발하므로 이를 방지하기 위한 규칙입니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 자동 스코프 의존성 추적 시스템은 Solid.js의 가장 핵심적인 설계 철학이므로 변경되지 않습니다.

## 3. 그 외 규칙 이해를 위한 설명
Solid.js에서 특정 신호가 변경될 때만 이펙트가 동작하도록 명시적으로 분리(untrack 및 track 제어)하고 싶다면 의존성 배열 대신 `on`이라는 내장 유틸리티 함수를 사용해야 합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (React 스타일의 의존성 배열 사용)
import { createEffect, createSignal } from 'solid-js';

function App() {
  const [count, setCount] = createSignal(0);

  // Solid.js의 createEffect는 두 번째 인자로 의존성 배열을 받지 않습니다.
  createEffect(() => {
    console.log(count());
  }, [count]); // 린트 에러!
}

// ✅ 올바른 예시 (자동 추적)
function App() {
  const [count, setCount] = createSignal(0);

  // 내부에서 count()가 호출되었으므로 자동으로 의존성이 추적됩니다.
  createEffect(() => {
    console.log(count()); 
  }); 
}

// ✅ 올바른 예시 (명시적 추적이 필요한 경우 'on' 사용)
import { createEffect, createSignal, on } from 'solid-js';

function App() {
  const [count, setCount] = createSignal(0);
  const [text, setText] = createSignal("");

  // count가 변경될 때만 실행되며, text()의 변경은 무시(untrack)합니다.
  createEffect(on(count, (c) => {
    console.log("Count is", c, "Text is", text());
  }));
}
```
