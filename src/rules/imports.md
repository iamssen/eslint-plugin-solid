# imports

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js의 훅 및 API 이름은 React와 매우 유사한 경우가 있습니다(예: `useContext`, `createEffect`, `children` 등). 이로 인해 개발자가 자동 완성(Auto-import)을 사용할 때 실수로 `solid-js`가 아닌 `react` 패키지에서 함수를 임포트하는 실수를 흔히 저지릅니다. 이를 린트 단계에서 방지하기 위한 규칙입니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 여전히 다른 라이브러리의 잘못된 import를 방지하여 런타임 에러를 막아야 합니다.

## 3. 그 외 규칙 이해를 위한 설명
이 규칙은 특히 기존 React 프로젝트를 Solid.js로 마이그레이션하거나, 두 프레임워크를 경험한 개발자가 혼동하여 발생하는 치명적인 런타임 버그를 예방하는 데 매우 효과적입니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (React에서 훅을 가져옴)
import { useState, useEffect } from 'react'; // Solid 컴포넌트에서는 동작하지 않음!

function MyComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => { /* ... */ }, [count]);
}

// ✅ 올바른 예시 (Solid.js에서 API를 가져옴)
import { createSignal, createEffect } from 'solid-js';

function MyComponent() {
  const [count, setCount] = createSignal(0);
  createEffect(() => { console.log(count()); });
}
```
