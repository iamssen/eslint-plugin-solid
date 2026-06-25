# style-prop

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js는 엘리먼트의 `style` 속성에 문자열 형태(`<div style="color: red; margin: 10px;" />`)와 객체 형태(`<div style={{ color: "red", margin: "10px" }} />`)를 모두 유연하게 지원합니다. 그러나 여러 명의 개발자가 협업하는 프로젝트에서 스타일 지정 방식이 혼용되면 혼란을 초래할 수 있으므로, 팀 컨벤션에 따라 둘 중 하나의 특정한 형태로 일관되게 작성하도록 강제하기 위해 사용됩니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 스타일 주입 기능은 DOM 조작 유틸리티의 기본 기능으로 동일하게 제공됩니다.

## 3. 그 외 규칙 이해를 위한 설명
객체(Object) 형태로 스타일을 주입할 경우, CSS 변수(Custom Properties)를 사용할 때는 `{'--my-var': '10px'}` 처럼 문자열 키로 감싸주어야 합니다. 일반적인 CSS 속성의 경우 케밥 케이스(kebab-case) 대신 자바스크립트의 카멜 케이스(camelCase, 예: `backgroundColor`) 사용도 지원되어 편리합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ⚠️ 문자열 스타일 방식 (선택적 컨벤션)
<div style="background-color: blue; padding: 10px;" />

// ✅ 객체 스타일 방식 (권장 및 일반적인 컨벤션)
<div style={{
  "background-color": "blue", // 케밥 케이스
  padding: "10px",
  backgroundColor: "blue"     // 카멜 케이스(지원됨)
}} />

// CSS 변수를 동적으로 주입할 때는 객체 형태가 가장 유용합니다.
<div style={{
  "--dynamic-theme-color": props.themeColor
}} />
```
