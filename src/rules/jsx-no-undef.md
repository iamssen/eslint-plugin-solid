# jsx-no-undef

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
JSX 내부에서 사용된 컴포넌트(`HelloWorld`)나 변수 등이 스코프 내에 선언되지 않았을 때(Undefined) 미리 경고나 오류를 발생시켜 런타임 에러를 방지합니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** JavaScript/JSX 문법 검사의 기본 요소입니다.

## 3. 그 외 규칙 이해를 위한 설명
Solid.js에서는 특별하게 커스텀 지시자(Directives)를 사용할 수 있습니다(`use:directiveName`). 이 규칙은 단순히 태그 이름뿐만 아니라, 이러한 지시자에 바인딩된 변수가 스코프 내에 올바르게 정의되어 있는지도 함께 파악하고 검사합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (선언되지 않은 컴포넌트와 지시자 사용)
function App() {
  // MyComponent 가 import 되거나 선언되지 않았습니다.
  // clickOutside 함수도 정의되지 않았습니다.
  return <MyComponent use:clickOutside={() => {}} />; 
}

// ✅ 올바른 예시
import MyComponent from './MyComponent';
import { clickOutside } from './directives';

function App() {
  return <MyComponent use:clickOutside={() => {}} />;
}
```
