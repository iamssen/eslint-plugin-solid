# self-closing-comp

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

JSX 문법에서는 자식 요소(Children)가 없는 태그를 작성할 때 두 가지 방법을 사용할 수 있습니다.
1. 여는 태그와 닫는 태그를 분리하기: `<div className="box"></div>` 또는 `<MyComponent></MyComponent>`
2. 셀프 클로징(Self-closing) 태그 사용하기: `<div className="box" />` 또는 `<MyComponent />`

자식 요소가 없는 경우 닫는 태그를 따로 작성하는 것은 불필요하게 코드를 길어지게 만들고 가독성을 떨어뜨립니다. 특히 컴포넌트 기반 아키텍처에서는 수많은 컴포넌트가 중첩되어 렌더링되므로, 시각적 피로도를 줄이는 것이 중요합니다.

이 규칙은 내부에 자식 요소나 텍스트가 없는 컴포넌트 및 HTML 요소를 감지하고, 항상 간결한 셀프 클로징(`<... />`) 형태로 작성하도록 강제하여 코드의 일관성과 가독성을 높이기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

셀프 클로징 태그의 사용은 프레임워크의 구체적인 동작 방식이나 반응성 시스템(Reactivity)과는 무관한, JSX라는 문법 자체의 스타일링 규칙입니다. 
따라서 Solid.js 2.0에서도 이 규칙은 코드 품질을 위해 변경 없이 동일하게 적용됩니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (빈 닫는 태그 사용)

아래 코드들처럼 자식 요소가 없음에도 불구하고 여는 태그와 닫는 태그를 쌍으로 작성하면 이 규칙에 위배됩니다.

```jsx
// ❌ 불필요한 닫는 태그 사용 (HTML 요소)
function Profile() {
  return (
    <div class="profile-card">
      <img src="avatar.png"></img>
      <hr></hr>
    </div>
  );
}

// ❌ 불필요한 닫는 태그 사용 (커스텀 컴포넌트)
function App() {
  return <Header></Header>;
}
```

### 🟢 올바른 사용 예 (셀프 클로징 사용)

빈 요소는 슬래시(`/`)를 사용하여 닫아줍니다.

```jsx
// 🟢 깔끔한 셀프 클로징 사용
function Profile() {
  return (
    <div class="profile-card">
      <img src="avatar.png" />
      <hr />
    </div>
  );
}

// 🟢 커스텀 컴포넌트에도 적용
function App() {
  return <Header />;
}
```

### 자동 수정 (Auto-fix) 작동 방식

이 규칙은 ESLint의 `--fix` 옵션을 통해 빈 태그들을 자동으로 셀프 클로징 형태로 변환해 주므로, 개발자가 일일이 수정할 필요가 없습니다.
