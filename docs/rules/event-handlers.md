# event-handlers

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

Solid.js에서 일반적인 HTML 요소(`<div>`, `<button>` 등)에 이벤트 핸들러(예: `onClick`, `onInput`)를 부착할 때, 성능 최적화를 위해 이벤트 위임(Event Delegation)을 사용하며, **핸들러 함수는 요소가 생성될 때 정적으로 바인딩됩니다.**

만약 `onClick={props.onClick}`과 같이 `props`에서 핸들러를 동적으로 가져와 그대로 전달하면, 초기 렌더링 시점의 `props.onClick` 값만 바인딩됩니다. 이후에 부모 컴포넌트에서 `onClick` 프로퍼티를 다른 함수로 변경하더라도, 하위 컴포넌트의 이벤트 핸들러는 업데이트되지 않아 이전 함수가 계속 실행되는 버그가 발생할 수 있습니다.

이 규칙은 반응형 값을 가질 수 있는 이벤트 핸들러를 직접 전달하지 못하게 하고, 래퍼 함수(Wrapper Function)를 사용하여 핸들러가 항상 최신 값을 참조하도록 강제합니다.

## 2. Solid.js 2.0에서의 변경 여부

Solid.js 2.0에서도 이벤트 델리게이션과 성능 최적화 관련 철학은 유지되므로, 기본적으로 핸들러를 평가(Evaluation)하는 방식에 영향을 줄 수 있습니다. 하지만 Solid.js가 지속적으로 개선되면서 내부 바인딩 방식이 유연해지더라도, 래퍼 함수를 사용하는 패턴은 여전히 안전하고 예측 가능한 코드를 작성하는 모범 사례로 권장됩니다. 이 규칙의 기본 필요성은 유지될 것으로 예상됩니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (정적 바인딩 문제)

아래 코드에서 `<button>`의 `onClick`에 `props.handleClick`을 직접 전달합니다. 버튼이 렌더링될 시점의 `props.handleClick` 값으로 핸들러가 고정되어 버리므로, 부모에서 이 함수를 변경해도 반영되지 않습니다.

```jsx
// ❌ props의 핸들러를 직접 전달 (값이 고정될 수 있음)
function CustomButton(props) {
  return (
    <button onClick={props.handleClick}>
      Click Me
    </button>
  );
}
```

### 🟢 올바른 사용 예 (래퍼 함수 사용)

인라인 화살표 함수 등을 사용하여 핸들러를 감싸면(Wrap), 이벤트가 발생할 때마다 `props.handleClick`에 새롭게 접근(Evaluation)하게 되므로 항상 최신 함수가 호출됩니다.

```jsx
// 🟢 이벤트 발생 시점에 props.handleClick을 평가하므로 항상 최신 함수가 실행됨
function CustomButton(props) {
  return (
    <button onClick={(e) => props.handleClick(e)}>
      Click Me
    </button>
  );
}
```

### 시각적 요약

- **`onClick={props.fn}`**: 컴포넌트 생성 시점에 `props.fn`을 한 번 읽어서 버튼에 연결함. (이후 갱신 안됨)
- **`onClick={(e) => props.fn(e)}`**: 버튼에는 익명 함수가 연결됨. 사용자가 클릭하면 그 시점에 `props.fn`이 무엇인지 확인하고 호출함. (항상 최신 상태 참조)
