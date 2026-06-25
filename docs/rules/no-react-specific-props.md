# no-react-specific-props

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

React는 가상 DOM(Virtual DOM)을 사용하며, 브라우저의 DOM 속성(DOM Property) 이름을 기반으로 JSX 속성 이름을 카멜 케이스(camelCase)로 강제합니다. 대표적인 예가 `class` 대신 사용하는 `className`, `for` 대신 사용하는 `htmlFor`입니다.

반면, **Solid.js는 실제 DOM과 거의 1:1로 매칭되는 방식을 사용하기 때문에 표준 웹 HTML 속성을 그대로 사용합니다.** 따라서 `className`이 아닌 표준 `class`를, `htmlFor`가 아닌 표준 `for`를 사용해야 합니다.

React 환경에 익숙한 개발자가 Solid.js를 사용할 때, 무의식적으로 React 전용 속성을 적어버리는 실수가 잦습니다. 이 경우 UI가 의도한 대로 렌더링되지 않으며, 스타일이 깨지거나 폼 요소가 제대로 동작하지 않게 됩니다.

이 규칙은 React 전용 속성명(`className`, `htmlFor` 등)이 발견되면 이를 즉시 표준 HTML 속성명(`class`, `for` 등)으로 고쳐주기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

표준 HTML 속성을 따른다는 것은 Solid.js의 기본 철학이므로, Solid.js 2.0에서도 이 규칙은 동일하게 유지되며 매우 중요하게 사용됩니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (React 속성 사용)

아래 코드에서는 React에서 쓰이던 `className`과 `htmlFor`를 사용했습니다. Solid.js는 이를 일반적인 사용자 정의 속성으로 취급할 뿐, 실제 스타일을 입히거나 label을 연결해주지 못합니다.

```jsx
// ❌ React 방식의 속성 사용
function MyForm() {
  return (
    <div className="container">
      <label htmlFor="username">Username</label>
      <input id="username" />
    </div>
  );
}
```

### 🟢 올바른 사용 예 (표준 HTML 속성 사용)

항상 우리가 아는 웹 표준 마크업과 동일하게 작성해야 합니다.

```jsx
// 🟢 표준 HTML 속성 사용
function MyForm() {
  return (
    <div class="container">
      <label for="username">Username</label>
      <input id="username" />
    </div>
  );
}
```

### 자동 수정 (Auto-fix) 작동 방식

이 규칙은 ESLint의 `--fix` 옵션을 활성화하면 아래와 같이 자동으로 속성명을 올바르게 변환해 줍니다.
- `className` ➡️ `class`
- `htmlFor` ➡️ `for` 

> 💡 **참고**: 카멜 케이스로 된 SVG 속성이나 일반 DOM 속성들의 경우 Solid.js에서 허용하는 것들도 많으므로, 이 규칙은 주로 가장 헷갈리기 쉬운 `className`과 `htmlFor` 등의 핵심적인 React 전용 속성들에 초점을 맞춥니다.
