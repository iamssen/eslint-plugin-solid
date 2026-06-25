# no-destructure

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js 1.0에서 `props` 객체는 내부적으로 Getter를 통해 프로퍼티의 접근을 추적하여 반응성을 유지합니다. 만약 JavaScript의 구조 분해 할당(Destructuring)을 통해 `const { title } = props;` 처럼 사용하면, 할당 시점의 값이 정적으로 복사되면서 Getter가 소실되어 상태 변화를 추적(Track)하지 못하게 되기 때문에 이를 엄격히 금지합니다.

## 2. Solid.js 2.0에서의 변경 여부
**부분적 변경 가능성 존재.** Solid.js 2.0 생태계에서는 Babel 컴파일러 변환(Destructure Transform)을 활성화하여 구조 분해 할당을 사용해도 내부적으로 다시 접근자(Getter)로 컴파일되게 만들어 반응성을 잃지 않게 하는 기능이 도입되었습니다. 그러나 이 컴파일러 옵션을 사용하지 않는 기본(Core) 환경의 메커니즘은 여전히 동일하므로, 컴파일러 설정 여부에 따라 이 규칙의 적용이 달라질 수 있습니다.

## 3. 그 외 규칙 이해를 위한 설명
기본적으로 Solid.js에서는 `props.title`처럼 속성에 직접 접근하거나, 분리 또는 병합이 필요할 경우 반드시 내장 유틸리티 함수인 `splitProps`와 `mergeProps`를 사용해야 반응성이 끊어지지 않습니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (구조 분해 할당 시 반응성을 잃어버림)
function Greeting(props) {
  const { name } = props; // 여기서 name은 컴포넌트 마운트 시점의 문자열로 고정됨
  
  // props.name 이 밖에서 바뀌어도 화면은 업데이트되지 않습니다!
  return <div>Hello, {name}</div>; 
}

// ✅ 올바른 예시 1 (직접 접근)
function Greeting(props) {
  // props.name 에 접근하는 순간(Getter 호출) 변경을 추적하게 됩니다.
  return <div>Hello, {props.name}</div>; 
}

// ✅ 올바른 예시 2 (splitProps 유틸리티 사용)
import { splitProps } from 'solid-js';

function Greeting(props) {
  const [local, others] = splitProps(props, ["name"]);
  // local과 others 모두 반응성이 유지되는 프록시/접근자 객체입니다.
  return <div {...others}>Hello, {local.name}</div>;
}
```
