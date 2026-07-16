# no-react-specific-props

React에서 사용하는 JSX prop 이름을 Solid/DOM 이름으로 바꾸도록 검사합니다.

## React JSX와 Solid JSX의 차이

React DOM renderer는 `className`, `htmlFor`, `key`처럼 React가 특별히 해석하는 prop을 사용합니다. Solid는 가능한 한 실제 DOM property/attribute와 Solid runtime의 이름을 직접 사용합니다. React 코드를 그대로 옮기면 브라우저가 알아듣지 못하는 이름이 남거나, Solid에서 아무 의미 없는 `key`가 생길 수 있습니다.

```tsx
// 잘못된 예
<div className="box" />
<label htmlFor="name" />
<div key={item.id} />

// 권장
<div class="box" />
<label for="name" />
```

구현상 `className`은 `class`, `htmlFor`는 `for`로 수정하며, DOM 요소뿐 아니라 컴포넌트 JSX에도 적용됩니다. `key`는 Solid의 일반 DOM/컴포넌트 prop이 아닌 경우 제거 대상으로 취급될 수 있으므로 목록 렌더링에서는 `<For>`의 item/index 모델을 사용합니다.

## 예제로 보는 동작

React에서 쓰던 prop 이름은 DOM/Solid 이름으로 바꿉니다. 값이 문자열이든 expression이든 이름이 `className`/`htmlFor`이면 invalid입니다.

```tsx
// invalid
<div className={isActive() ? 'active' : ''} />
<label htmlFor="email">이메일</label>

// autofix 후: valid
<div class={isActive() ? 'active' : ''} />
<label for="email">이메일</label>
```

이 rule은 DOM element뿐 아니라 component에 전달하는 React식 prop도 바꿉니다.

```tsx
// invalid → <Field class="wide" />
<Field className="wide" />
```

React에서 list reconciliation을 위해 쓰던 `key`도 일반 JSX element에서는 invalid로 보고 제거할 수 있습니다.

```tsx
// invalid → <li>{item.name}</li>
<li key={item.id}>{item.name}</li>
```

다만 component가 `key`라는 자체 API를 실제로 받는 경우에는 이 자동 수정을 적용하기 전에 확인해야 합니다. Solid 목록 렌더링의 identity는 보통 `<For>` 또는 `<Index>` 선택으로 표현합니다.
