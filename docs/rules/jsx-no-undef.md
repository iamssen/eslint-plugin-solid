# jsx-no-undef

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

JSX에서 `<MyComponent />`와 같이 대문자로 시작하는 커스텀 컴포넌트를 렌더링하려면, 해당 컴포넌트가 현재 스코프 내에 정의되어 있거나 `import` 되어 있어야 합니다. 

만약 스코프에 선언되지 않은 이름으로 컴포넌트를 호출하려고 하면 자바스크립트 런타임에서 `ReferenceError`가 발생하여 애플리케이션의 화면이 그려지지 않고 멈춰버리게 됩니다. 

이 규칙은 런타임 에러가 발생하기 전에, 코드 작성 시점에서 개발자에게 정의되지 않은(Undefined) 컴포넌트나 변수가 JSX 템플릿 안에서 사용되었음을 미리 알려주기 위해 존재합니다. (이 규칙은 React의 `react/jsx-no-undef` 규칙과 완전히 동일한 목적을 가집니다.)

## 2. Solid.js 2.0에서의 변경 여부

변수나 컴포넌트가 선언되어 있는지를 확인하는 것은 자바스크립트 언어의 기본적인 스코프 원칙에 해당합니다. 
그러므로 이 규칙은 프레임워크의 변경이나 Solid.js 2.0의 반응성 모델 변화에 영향을 받지 않으며, 동일하게 필수적으로 적용됩니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (정의되지 않은 컴포넌트 사용)

아래 코드에서 `Header`와 `Footer` 컴포넌트를 JSX 내에서 사용하고 있지만, 파일 상단에서 이를 `import`하거나 선언한 적이 없습니다. 코드를 실행하면 `ReferenceError: Header is not defined`가 발생합니다.

```jsx
// ❌ Header와 Footer가 정의되지 않음
function App() {
  return (
    <div>
      <Header />
      <main>콘텐츠</main>
      <Footer />
    </div>
  );
}
```

### 🟢 올바른 사용 예 (컴포넌트를 명시적으로 선언)

모든 커스텀 컴포넌트는 사용하기 전에 반드시 가져오기(import) 또는 파일 내부 선언이 선행되어야 합니다. 또한, 소문자로 시작하는 네이티브 HTML 태그(`<div>`, `<span>` 등)는 이 규칙에 위배되지 않습니다.

```jsx
// 🟢 사용할 컴포넌트를 import 함
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <div>
      {/* 이제 스코프 안에 존재하므로 에러가 발생하지 않음 */}
      <Header />
      <main>콘텐츠</main>
      <Footer />
    </div>
  );
}
```
