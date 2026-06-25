# jsx-uses-vars

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
일반적인 JavaScript ESLint 파서는 JSX 문법 내부에서만 사용된 컴포넌트나 변수를 코드 상에서 직접 호출하지 않았다고 판단하여 '사용되지 않은 변수(no-unused-vars)'로 오인할 수 있습니다. 이 규칙은 JSX에서 참조된 변수들이 사용 중임을 ESLint에 알려주어 억울한 경고나 자동 삭제 현상을 막아줍니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** ESLint의 내부 동작을 돕기 위한 플러그인 유틸리티성 규칙입니다.

## 3. 그 외 규칙 이해를 위한 설명
최신 버전의 ESLint 및 파서에서는 일부 자체적으로 JSX 참조를 추적하기도 하지만, Solid.js 특유의 문법(예: 지시자) 등을 완벽히 커버하기 위해 활성화해 두는 것이 좋습니다.

## 4. 예제 코드 및 시각적 설명

```javascript
import { createSignal } from 'solid-js';
import MyButton from './MyButton'; // JSX에서만 사용됨
import { myDirective } from './directives'; // JSX 지시자(use:)로만 사용됨

function App() {
  const [count, setCount] = createSignal(0);
  
  // 일반적인 ESLint 설정만 있다면 MyButton과 myDirective가 
  // JS 코드(논리 영역) 내에서 직접 호출되지 않았기 때문에 
  // "정의되었지만 사용되지 않음" 경고가 발생합니다.
  // jsx-uses-vars 규칙이 이를 "사용됨"으로 표시해줍니다.
  return (
    <MyButton use:myDirective>
      Clicks: {count()}
    </MyButton>
  );
}
```
