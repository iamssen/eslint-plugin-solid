# no-array-handlers

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js는 이벤트 핸들러에 배열을 전달하여 인자를 바인딩하는 문법(`onClick={[handler, data]}`)을 지원하여 성능을 최적화할 수 있도록 합니다. 하지만 TypeScript 환경에서는 이러한 배열 기반 핸들러가 타입 추론과 안정성을 완벽하게 보장하기 까다로운 한계가 있습니다. 타입 안정성을 최우선으로 하는 프로젝트에서 이를 지양하고자 할 때 이 규칙을 사용합니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 프레임워크 자체에서는 구문을 계속 유효하게 지원하지만, TypeScript에서의 한계로 인해 타입 검사 관점에서 사용하는 린트 룰입니다.

## 3. 그 외 규칙 이해를 위한 설명
성능 최적화가 극단적으로 필요한 상황이 아니라면, 가독성과 타입 체킹을 위해 화살표 함수(`onClick={() => handler(data)}`)나 클로저를 사용하는 것이 일반적으로 더 안전하고 권장되는 방식입니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 지양하는 예시 (배열 바인딩 구문 - 타입 추론이 어려울 수 있음)
function App() {
  const handleClick = (id, event) => console.log(id);
  const userId = 123;
  
  // 배열의 첫 요소는 핸들러 함수, 두 번째 요소는 바인딩할 데이터
  return <button onClick={[handleClick, userId]}>Click</button>;
}

// ✅ 권장하는 예시 (화살표 함수 - 타입 검사가 완벽하게 지원됨)
function App() {
  const handleClick = (id, event) => console.log(id);
  const userId = 123;
  
  return <button onClick={(e) => handleClick(userId, e)}>Click</button>;
}
```
