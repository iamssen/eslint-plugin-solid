# event-handlers

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js는 DOM 이벤트를 바인딩할 때 `on` 으로 시작하는 속성을 이벤트 핸들러로 인식합니다. 하지만 표준 이벤트인지 일반 속성(Attribute)인지 구분하기 위해 카멜 케이스(예: `onClick`) 사용을 권장(표준 DOM 이벤트의 경우)하며, 모호한 소문자 네이밍(`onclick`) 사용 시 경고를 냅니다. 이 규칙은 Solid가 이벤트 핸들러를 속성(Attribute)으로 오해하는 것을 방지하고 일관된 네이밍 컨벤션을 유지하기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** JSX상에서 이벤트를 바인딩하는 구문(Syntax)과 네이밍 규칙(카멜 케이스 기반의 표준 이벤트 처리 등)은 유지됩니다.

## 3. 그 외 규칙 이해를 위한 설명
Solid는 `onclick` 같이 소문자로 작성된 속성이 있을 때, 이것이 의도적인 HTML 속성인지 아니면 이벤트 핸들러인지 헷갈릴 수 있습니다. 따라서 이벤트 핸들러라면 `onClick`으로 명확히 표기하고, 만약 정말로 HTML 속성으로 넣고 싶다면 `attr:onclick` 네임스페이스를 사용해야 합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (모호한 소문자 이벤트 네이밍)
<button onclick={handleClick}>Click me</button> // 린터 경고 발생!

// ✅ 올바른 예시 (표준 이벤트는 카멜 케이스 사용)
<button onClick={handleClick}>Click me</button>

// ✅ 올바른 예시 (의도적으로 속성으로 넣고 싶은 경우 attr: 네임스페이스 사용)
<button attr:onclick="alert('hello')">Click me</button>
```
