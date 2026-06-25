# jsx-no-duplicate-props

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
동일한 JSX 요소에 같은 이름의 속성(Prop)을 두 번 이상 선언하는 실수를 방지하기 위해 존재합니다. 중복 선언된 경우 뒤에 선언된 속성이 앞의 속성을 조용히 덮어쓰게 되어 의도치 않은 버그를 유발할 수 있습니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 이는 프레임워크의 동작 방식보다는 JSX 구문 자체의 일반적이고 논리적인 오류를 잡아내기 위한 규칙입니다.

## 3. 그 외 규칙 이해를 위한 설명
ESLint의 기본 React 플러그인에 존재하는 `react/jsx-no-duplicate-props` 규칙과 동일한 목적과 동작 원리를 가집니다. Solid.js JSX 컴파일러에서도 동일하게 속성 덮어쓰기가 발생하므로 유효합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (같은 속성이 두 번 선언됨)
<div class="primary" class="secondary" /> 
// 실제로는 class="secondary" 만 적용됩니다.

<MyComponent data={dataA} data={dataB} />
// 의도치 않게 dataB가 dataA를 덮어씁니다.

// ✅ 올바른 예시
<div class="primary secondary" /> 

<MyComponent data={dataA} />
```
