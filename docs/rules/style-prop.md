# style-prop

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

React 개발자들은 `style` 속성에 객체를 전달할 때, 자바스크립트 DOM 스타일 객체 방식인 카멜 케이스(camelCase)를 사용하는 것에 익숙합니다. (예: `backgroundColor: "red"`) 
또한 단위를 생략하고 숫자만 적으면 React가 자동으로 `px` 등의 단위를 붙여주기도 합니다. (예: `fontSize: 10`)

하지만 **Solid.js는 가능한 한 브라우저의 기본 표준(DOM API)에 가깝게 동작하도록 설계되었습니다.** 
Solid.js에서 `style` 속성에 객체를 전달할 때는 브라우저의 CSS 속성명인 케밥 케이스(kebab-case)를 사용해야 합니다. (예: `"background-color": "red"`) 또한 `px`과 같은 단위가 필요한 속성에는 반드시 숫자 대신 문자열로 단위를 명시해야 정상적으로 렌더링됩니다.

이 규칙(`style-prop`)은 개발자가 React의 방식(카멜 케이스, 단위 생략)이나 잘못된 CSS 문자열을 사용하는 실수를 방지하고, Solid.js가 요구하는 올바른 표준 CSS 속성명 및 객체 리터럴 구문을 사용하도록 검사하기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

웹 표준에 가깝게 동작하는 것은 Solid.js의 정체성이며, Solid.js 2.0에서도 CSS 속성 바인딩 방식은 유지될 것입니다. 따라서 객체를 다룰 때 케밥 케이스를 강제하고 정확한 단위를 기입하도록 안내하는 이 규칙은 여전히 매우 중요합니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (React 방식 및 문자열 오용)

아래 코드들은 카멜 케이스를 사용하거나, 단위가 생략된 숫자를 넣거나, 구문이 파싱하기 힘든 긴 문자열 리터럴을 쓴 경우입니다.

```jsx
// ❌ 1. 카멜 케이스(camelCase) 사용
let el1 = <div style={{ backgroundColor: 'red' }} />;

// ❌ 2. 단위 생략 (px 등이 필요함)
let el2 = <div style={{ "font-size": 10 }} />;

// ❌ 3. 문자열 리터럴 사용 (객체 권장)
// (개발팀 설정에 따라 허용할 수도 있으나, 기본적으로 객체 사용을 권장함)
let el3 = <div style="font-size: 10px; color: red;" />;
```

### 🟢 올바른 사용 예 (케밥 케이스 및 단위 명시 객체)

CSS 명세서에 나와 있는 본래의 속성 이름표기법(kebab-case)을 사용하고, 단위가 필요한 경우 정확하게 기입합니다.

```jsx
// 🟢 1. 케밥 케이스(kebab-case) 사용
let el1 = <div style={{ "background-color": 'red' }} />;

// 🟢 2. 단위 명시
let el2 = <div style={{ "font-size": "10px" }} />;

// 🟢 CSS 변수도 완벽하게 지원됨
let el3 = <div style={{ "--my-custom-color": "blue" }} />;
```

### 자동 수정 (Auto-fix) 작동 방식

ESLint의 `--fix` 옵션을 활성화하면 린터가 아래와 같은 수정 작업을 자동으로 수행해 줍니다:
- `backgroundColor: "red"`를 찾아 `"background-color": "red"`로 바꿔줍니다.
- 문자열로 적힌 `style="color: red;"`를 분석하여 객체 리터럴 `style={{ "color": "red" }}` 형태로 예쁘게 변환해 줍니다.
