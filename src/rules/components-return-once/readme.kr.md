# components-return-once

[English](./readme.md)

Solid 컴포넌트의 조기·조건부 `return`을 금지합니다.

## 기본 설정

이 rule은 `recommended`에서 warning으로 활성화됩니다.

```js
'@ssen/solid/components-return-once': 'warn'
```

## 옵션

이 rule에는 옵션이 없습니다.

## 상세

Solid 컴포넌트 함수는 일반적으로 상태가 바뀔 때마다 다시 실행되지 않습니다. 컴포넌트 함수의 조건부/조기 `return`은 처음 평가된 경로 밖에 반응형 JSX를 둘 수 있으므로, 조건부 렌더링을 JSX 안에서 표현하도록 안내합니다.

## React와 다른 점

React에서는 state 변경이 컴포넌트 함수를 다시 호출하므로, 다음 렌더에서 다른 `return`을 선택할 수 있습니다. Solid에서는 컴포넌트 함수가 초기화 단계에서 한 번 실행되고, 이후에는 signal과 JSX 표현식 같은 세부 반응형 계산만 갱신됩니다. 따라서 `return` 자체를 반응형 분기처럼 생각하면 안 됩니다.

## 잘못된 예

```tsx
function Page(props) {
  if (props.loading) return <p>Loading</p>;
  return <p>{props.data}</p>;
}
```

## 권장 예

```tsx
import { Show } from 'solid-js';

function Page(props) {
  return <Show when={!props.loading} fallback={<p>Loading</p>}><p>{props.data}</p></Show>;
}
```

이 규칙은 JSX를 반환하는 컴포넌트로 판단되는 함수의 조기 반환과 마지막 반환식의 조건부 반환을 검사하며, 일부 조건부 반환에는 자동 수정이 제공됩니다.

단, 모든 함수의 조기 반환을 금지하는 규칙은 아닙니다. JSX를 반환하지 않는 일반 함수, render-prop 콜백 등은 컴포넌트로 판단하지 않습니다.

## 예제로 보는 동작

컴포넌트의 조기 반환은 invalid입니다. `loading`이 처음 `true`였다면 아래 컴포넌트는 `<p>결과</p>`를 만드는 JSX expression을 초기화하지 않습니다.

```tsx
function Page(props) {
  if (props.loading) return <p>불러오는 중</p>; // invalid
  return <p>{props.data}</p>;
}
```

반면 컴포넌트 안에 있는 **일반 함수**는 매번 호출될 수 있으므로 조기 반환해도 valid입니다.

```tsx
function Page(props) {
  const describe = () => {
    if (props.loading) return '불러오는 중'; // valid
    return props.data;
  };

  return <p>{describe()}</p>;
}
```

마지막 `return`의 조건식도 invalid입니다. rule은 다음처럼 `<Show>`로 고칠 수 있습니다.

```tsx
// before: invalid
return props.loading ? <Spinner /> : <Result />;

// after: autofix 가능한 형태
return <Show when={!props.loading} fallback={<Spinner />}><Result /></Show>;
```

`return condition && <Result />`도 `<Show when={condition}>`으로 바꿀 수 있습니다. 중첩 삼항식은 여러 조건을 표현하므로 `<Switch>`와 `<Match>`로 수정될 수 있습니다. 양쪽 branch 중 어느 쪽이 fallback인지 코드만으로 알 수 없으면, rule은 의미를 추측하지 않고 fragment 내부에 원래 식을 보존합니다.
