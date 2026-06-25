# self-closing-comp

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
자식 요소(Children)를 가지지 않는 컴포넌트나 태그를 렌더링할 때 `<Component></Component>` 형태로 작성하면 불필요하게 코드가 길어지고 가독성이 떨어집니다. 대신 `<Component />`와 같이 자체적으로 닫는 태그(Self-closing tag)를 사용하도록 유도하여 코드 스타일을 깔끔하게 유지하기 위함입니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 이는 Solid.js의 기능이라기보다는 일반적인 JSX 및 XML 문법의 컨벤션(Convention)에 해당하는 규칙입니다.

## 3. 그 외 규칙 이해를 위한 설명
ESLint의 기존 React 플러그인(`react/self-closing-comp`)이나 다른 린터(Prettier 등)가 기본적으로 권장하는 코드 스타일과 완벽히 동일한 룰이며, 프로젝트 내 코드의 일관성을 맞추는 데 기여합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 지양하는 예시 (자식이 없는데 태그를 닫음)
function App() {
  return (
    <div>
      <Header></Header>
      <div class="empty-box"></div>
    </div>
  );
}

// ✅ 권장하는 예시 (Self-closing 태그 사용)
function App() {
  return (
    <div>
      <Header />
      <div class="empty-box" />
    </div>
  );
}
```
