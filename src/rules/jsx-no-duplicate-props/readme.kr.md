# jsx-no-duplicate-props

[English](./readme.md)

같은 JSX prop을 두 번 전달하지 않도록 검사합니다.

## 기본 설정

이 rule은 `recommended`에서 error로 활성화됩니다.

```js
'@ssen/solid/jsx-no-duplicate-props': 'error'
```

## 옵션

`ignoreCase`의 기본값은 `false`입니다. `true`로 설정하면 대소문자만 다른 prop
이름도 중복으로 취급합니다.

```js
'@ssen/solid/jsx-no-duplicate-props': ['error', { ignoreCase: true }]
```

## 상세

하나의 JSX 요소에 같은 prop을 두 번 전달하지 않도록 검사합니다. 명시적 속성과 정적으로 분석 가능한 spread 속성 사이의 중복도 검사하며, `children`, `class`, `className`, `innerHTML`, `textContent`처럼 함께 사용할 때 충돌하기 쉬운 속성도 별도로 다룹니다.

## Solid에서 spread 순서가 중요한 이유

Solid JSX에서는 props가 단순한 HTML attribute 목록이 아닙니다. 컴포넌트 props, DOM property, directive가 함께 전달되고, spread와 명시적 prop의 순서가 결과에 영향을 줄 수 있습니다. 같은 이름을 반복하면 “뒤의 값이 이긴다”는 의도에 기대게 되어 refactoring 시 버그가 생기기 쉽습니다.

```tsx
// 잘못된 예
<div class="a" class="b" />
<div {...{ class: 'a' }} class="b" />

// 권장
<div class="a b" />
```

동적으로 계산되는 spread의 모든 키를 알 수 없는 경우까지 추측하지는 않습니다.

## 예제로 보는 동작

같은 prop을 두 번 전달하면 어느 값이 최종적으로 쓰이는지 순서에 의존하므로 invalid입니다.

```tsx
// invalid
<Button size="small" size="large" />

// valid
<Button size="large" />
```

spread object의 key를 코드에서 알 수 있는 경우에도 중복을 찾습니다.

```tsx
// invalid: spread 안에 class가 있다는 것을 알 수 있음
<div class="card" {...{ class: 'selected' }} />

// valid: 어떤 key가 들어오는지 rule이 알 수 없음
<div class="card" {...props} />
```

children은 prop으로 전달하거나 JSX child로 전달해야 합니다. 둘을 동시에 쓰면 무엇을 보여줄지 모호하므로 invalid입니다.

```tsx
// invalid
<Panel children={<Header />}><Body /></Panel>

// valid
<Panel><Header /></Panel>
```

같은 이유로 `innerHTML`과 `textContent`를 함께 쓰는 것도 invalid입니다. `ignoreCase` 옵션을 켜면 `foo`와 `FOO`를 같은 이름으로 취급하도록 설정할 수 있습니다.
