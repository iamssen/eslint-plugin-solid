# jsx-uses-vars

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

ESLint의 내장 규칙 중 `no-unused-vars`는 "선언만 하고 한 번도 사용하지 않은 변수"를 에러로 처리하여 불필요한 코드를 정리하게 도와줍니다. 

하지만 JSX 구문 안에서 컴포넌트를 사용할 때는 문제가 발생합니다. 예를 들어 `import MyComponent from './MyComponent';` 로 가져온 뒤 JSX에서 `<MyComponent />`로 사용하면, 일반적인 자바스크립트 파서 입장에서는 이 변수가 직접적으로 '호출'되거나 '참조'된 것으로 인식하지 못할 수 있습니다. 그 결과, 버젓이 JSX에서 쓰고 있는데도 `no-unused-vars` 규칙이 "이 변수는 사용되지 않았다"며 에러를 뱉어내는 억울한 상황이 발생합니다.

`jsx-uses-vars` 규칙은 ESLint에게 "JSX 템플릿 내부에서 태그로 사용된 변수들(예: `MyComponent`)은 실제로 사용되고 있는 변수니까 무시하지 말아 달라"고 알려주어, `no-unused-vars` 규칙이 오작동하지 않게 바로잡는 역할을 합니다.

## 2. Solid.js 2.0에서의 변경 여부

이 규칙은 린터(Linter) 환경과 JSX AST(추상 구문 트리) 파싱에 연관된 보조 규칙입니다. Solid.js 2.0이 출시되더라도 우리가 JSX 구문을 사용하여 컴포넌트를 선언하고 렌더링하는 방식은 변하지 않으므로, 이 규칙 역시 그대로 유지되고 동일하게 작동합니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ⚠️ 이 규칙이 없다면 생기는 문제

만약 `jsx-uses-vars` 규칙이 활성화되어 있지 않다면, 아래 코드의 `Button` 변수에 대해 `no-unused-vars` 에러가 발생합니다.

```jsx
// Button을 import 함
import Button from "./Button";

function App() {
  // 실제로는 JSX 안에서 사용 중임!
  // 하지만 eslint 내장 규칙은 "Button이 선언되었지만 값을 읽은 적 없음" 이라고 판단함.
  return <Button>클릭하세요</Button>;
}
```

### 🟢 규칙 활성화 후 올바른 작동

`jsx-uses-vars` 규칙을 켜두면, `<Button>` 구문을 읽으면서 변수 `Button`이 사용되었다고 ESLint에게 마킹해 줍니다. 따라서 `no-unused-vars` 에러가 사라집니다.

```jsx
// 🟢 Button이 JSX에서 사용되었음을 올바르게 인식함 (에러 없음)
import Button from "./Button";

function App() {
  return <Button>클릭하세요</Button>;
}
```

### 참고 사항

이 규칙은 스스로 코드를 검사해서 직접적인 오류를 내뿜기보다는, 주로 ESLint의 다른 내장 규칙(`no-unused-vars`)과 협동하여 올바른 분석을 할 수 있도록 백그라운드에서 돕는 플러그인 성격을 가집니다.
