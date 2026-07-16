# style-prop

[English](./readme.md)

JSX의 `style` 객체에서 CSS 속성명을 검증하고 kebab-case를 사용하도록 하며, 길이·퍼센트 계열 속성의 숫자 값을 문자열 단위로 작성하도록 안내합니다.

## React의 style 객체와 다른 점

React의 DOM style API는 JavaScript 속성명(`fontSize`)과 숫자 값(`fontSize: 12`)을 CSS로 변환하는 규칙을 제공합니다. Solid의 style 객체는 DOM의 style declaration에 직접 적용되는 모델에 가깝기 때문에 CSS 속성명인 `font-size`와 명시적 단위 문자열을 쓰는 편이 안전합니다. 특히 이 rule은 숫자에 `px`를 자동으로 붙인다고 가정하지 않습니다.

```tsx
// 잘못된 예
<div style={{ fontSize: 12, backgroundColor: 'red' }} />

// 권장
<div style={{ 'font-size': '12px', 'background-color': 'red' }} />
```

Solid의 style 객체에서는 CSS 속성명을 `font-size`처럼 작성합니다. 숫자 값은 이 규칙이 대상으로 삼는 `width`, `height`, `margin`, `padding`, `border-width`, `font-size` 계열에서 0이 아닌 경우 보고되며, Solid가 모든 값에 자동으로 `px`를 붙인다는 의미는 아닙니다. CSS custom property(`--name`)는 허용됩니다.

기본적으로 문자열 style을 객체로 바꾸도록 안내합니다. `{ allowString: true }`로 이를 허용할 수 있으며, `{ styleProps: ['style', 'css'] }`처럼 검사할 JSX prop 이름을 확장할 수 있습니다.

모든 CSS property와 모든 단위를 완전하게 검증하는 rule은 아닙니다. 현재 구현은 `known-css-properties` 목록과 일부 length/percentage property를 기준으로 하며, custom property는 별도로 허용합니다.

## 예제로 보는 동작

React style object 습관으로 camelCase property를 쓰면 invalid입니다. CSS 이름과 단위를 그대로 씁니다.

```tsx
// invalid
<div style={{ fontSize: 12, backgroundColor: 'red' }} />

// property autofix 후, 단위까지 보완한 valid 코드
<div style={{ 'font-size': '12px', 'background-color': 'red' }} />
```

모든 숫자에 단위가 필요한 것은 아닙니다. `0`, unitless property, custom property는 valid입니다.

```tsx
// 모두 valid
<div style={{ 'font-size': 0 }} />
<div style={{ 'flex-grow': 1 }} />
<div style={{ '--accent-hue': 220 }} />
```

문자열 style은 기본 설정에서 invalid이며, 파싱 가능하면 object literal로 자동 수정합니다.

```tsx
// invalid → <div style={{ "font-size": "10px" }} />
<div style="font-size: 10px" />
```

CSS 문자열을 의도적으로 유지해야 한다면 옵션을 사용합니다.

```tsx
// { allowString: true }이면 valid
<div style={`color: ${themeColor};`} />
```

`styleProps`는 검사할 prop 이름을 정합니다. 예를 들어 `{ styleProps: ['style', 'css'] }`에서는 `<div css={{ fontSize: '10px' }} />`도 invalid입니다. 반대로 `styleProps: ['css']`이면 `style` prop은 이 rule이 검사하지 않습니다. 변수에 담긴 동적 style object 내부까지 추적하지는 않습니다.
