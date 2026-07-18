# prefer-show

[English](./readme.md)

조건부 JSX에는 Solid의 `<Show>`를 선호합니다.

## 기본 설정

이 rule은 `recommended`에서 비활성화되어 있습니다. 프로젝트가 논리 AND와 삼항 JSX
표현식보다 `<Show>`를 선호하는 경우 활성화합니다.

```js
'@ssen/solid/prefer-show': 'warn'
```

## 옵션

이 rule에는 옵션이 없습니다.

## 상세

JSX의 조건부 렌더링에 논리 AND(`&&`) 또는 삼항 연산자를 사용하는 대신 Solid의 `<Show>`를 사용하도록 안내합니다.

## Solid에서 조건부 JSX를 읽는 법

`<Show when={condition()}>`의 `when`은 반응형 값이고, 자식은 해당 조건에 따라 생성·폐기되는 control-flow 영역입니다. React의 조건부 render와 비슷한 결과를 만들지만, Solid에서는 컴포넌트 함수 전체가 다시 실행되는 것이 아니라 `<Show>`가 관리하는 부분만 반응합니다.

```tsx
import { Show } from 'solid-js';

<Show when={loggedIn()} fallback={<Login />}>
  <Dashboard />
</Show>
```

이 규칙은 조건부 JSX 표현식을 `<Show>`로 바꾸는 자동 수정을 제공할 수 있습니다. 모든 삼항 연산자가 대상은 아니며, JSX 안의 조건부 렌더링 패턴만 검사합니다. `<Show>`가 항상 더 빠르다고 단정하기보다는, Solid의 명시적인 제어 흐름과 fallback 표현을 사용하려는 스타일 규칙으로 이해해야 합니다.

단순한 boolean 표시나 값이 이미 DOM expression으로 충분한 경우에는 `&&`가 유효한 Solid 코드일 수 있습니다. 이 rule을 활성화한 프로젝트에서는 조건 분기와 fallback의 수명주기를 명시적으로 드러내기 위해 `<Show>`를 일관되게 선택합니다.

## 예제로 보는 동작

JSX child에서 `&&`로 component를 표시하는 패턴은 invalid입니다.

```tsx
// invalid
<main>{props.signedIn && <Dashboard />}</main>

// autofix 후: valid
<main><Show when={props.signedIn}><Dashboard /></Show></main>
```

fallback이 있는 삼항식도 `<Show>`로 바꿉니다.

```tsx
// invalid
{props.loading ? <Spinner /> : <Results />}

// autofix 후: valid
<Show when={!props.loading} fallback={<Spinner />}><Results /></Show>
```

반면 JSX 렌더링이 아닌 일반 조건식은 valid입니다.

```ts
// valid: 일반 값 계산
const label = props.signedIn ? '로그아웃' : '로그인';
```

두 branch 중 어느 것이 주 UI이고 어느 것이 fallback인지 알 수 없는 대칭적인 삼항식은 rule이 임의로 결정하지 않습니다. 이때 자동 수정은 fragment 안에 원래 식을 넣어, 컴포넌트의 `return`이 아니라 JSX reactive expression으로만 옮길 수 있습니다.
