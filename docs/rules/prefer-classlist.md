# prefer-classlist

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

React 생태계에서는 여러 개의 동적인 클래스명(Class name)을 조합할 때 `clsx`나 `classnames`와 같은 외부 라이브러리를 사용하는 것이 일반적입니다.

하지만 **Solid.js는 프레임워크 내부에 `classList`라는 강력한 내장 기능(디렉티브)을 기본으로 제공합니다.** `classList`는 객체 형태로 클래스명과 불리언(Boolean) 값을 받아, 값이 `true`일 때만 해당 클래스를 DOM 요소에 추가해 줍니다. 

외부 라이브러리(`clsx` 등)를 가져와 사용할 경우 자바스크립트 엔진이 매번 문자열을 새로 조합해야 하는 연산 비용이 발생합니다. 반면, Solid.js의 내장 `classList`는 컴파일 타임에 최적화되어 브라우저 DOM API(`element.classList.toggle`)를 직접 조작하므로 런타임 성능이 훨씬 뛰어납니다.

이 규칙은 성능 저하와 불필요한 번들 크기 증가를 막기 위해, 외부 유틸리티 함수 대신 Solid.js의 `classList` 사용을 권장하고 자동으로 변환해 주기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

Solid.js 2.0에서는 `classList` 속성이 일반 `class` 속성과 병합되어 하나의 기능으로 합쳐질 예정(또는 1.x 후반 도입)이므로, `<div class={{ red: true }} />` 형태로 사용이 가능해질 수 있습니다. 하지만 어떤 속성명을 쓰든 "외부 함수 호출 대신 내장된 객체 맵핑 방식을 사용하라"는 최적화 원칙은 변하지 않습니다. 이 규칙은 향후 2.0의 문법에 맞게 자연스럽게 `class`를 사용하도록 자동 업데이트될 수 있습니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (외부 라이브러리 사용)

아래 코드들은 `clsx`, `classnames`, `cn` 등의 외부 함수를 호출하여 문자열을 반환한 뒤 `class` 속성에 넣고 있습니다.

```jsx
// ❌ 외부 라이브러리(clsx)를 사용하여 문자열 조합
import clsx from "clsx";

function Button(props) {
  return <div class={clsx({ active: props.isActive, disabled: props.isDisabled })} />;
}
```

### 🟢 올바른 사용 예 (내장 classList 사용)

Solid.js가 기본 제공하는 `classList` 속성을 사용하면 라이브러리 없이도 동일한 기능을 훨씬 빠르고 깔끔하게 작성할 수 있습니다.

```jsx
// 🟢 Solid.js의 내장 classList 사용
function Button(props) {
  return <div classList={{ active: props.isActive, disabled: props.isDisabled }} />;
}
```

### 자동 수정 (Auto-fix) 작동 방식

이 규칙은 ESLint `--fix` 옵션을 통해 `clsx(...)`, `classnames(...)`, `cn(...)` 등의 호출을 찾아내어, 이를 자동으로 `classList={{...}}` 형태로 변경해 줍니다.
