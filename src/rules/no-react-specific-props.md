# no-react-specific-props

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
React는 DOM 표준과 다르게 `class` 대신 `className`을, `for` 대신 `htmlFor`를 사용하는 등 특수한 속성 이름들을 강제합니다. 하지만 Solid.js는 브라우저 DOM 표준을 그대로 따른다는 철학을 가지고 있어, React 방식의 속성을 사용하지 못하게 하고 표준 속성(`class`, `for` 등)을 사용하도록 유도합니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 브라우저의 네이티브 DOM 속성과 가능한 일치시킨다는 원칙은 Solid.js 전 버전에 걸쳐 동일하게 유지됩니다.

## 3. 그 외 규칙 이해를 위한 설명
이 규칙은 기존에 React 프로젝트에 익숙한 개발자가 Solid.js로 넘어왔을 때 습관적으로 발생시키는 오타나 잘못된 속성 매핑을 가장 빠르고 직관적으로 교정해 주는 역할을 합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (React 스타일의 속성)
function MyForm() {
  return (
    <div className="form-group">
      <label htmlFor="username">Username</label>
      <input id="username" type="text" />
    </div>
  );
}

// ✅ 올바른 예시 (DOM 표준 속성 사용)
function MyForm() {
  return (
    <div class="form-group">
      <label for="username">Username</label>
      <input id="username" type="text" />
    </div>
  );
}
```
