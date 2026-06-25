# prefer-show

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

React에서는 조건부 렌더링을 할 때 논리 연산자(`&&`)나 삼항 연산자(`? :`)를 사용하는 패턴이 흔히 쓰입니다.

하지만 **Solid.js에서 JSX 내부에 논리 연산자나 삼항 연산자를 사용하면 예상치 못한 불필요한 DOM 생성이나 렌더링 비효율이 발생할 수 있습니다.** 조건이 변경될 때마다 연산자 안의 표현식이 계속해서 재평가되기 때문입니다.

Solid.js는 이를 최적화하기 위해 `<Show>`라는 제어 흐름 컴포넌트를 제공합니다. `<Show>` 컴포넌트는 내부적으로 조건이 `true`에서 `false`로, 또는 그 반대로 바뀔 때만 DOM을 생성하거나 제거하도록 영리하게 최적화(Memoization)되어 있습니다.

이 규칙(`prefer-show`)은 JSX 반환문 안에서 쓰인 조건부 연산자(`&&`, `? :`)를 감지하고, 더 나은 성능과 가독성을 위해 `<Show>` 컴포넌트의 사용을 강제하기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

`<Show>` 컴포넌트를 이용한 조건부 렌더링은 Solid.js의 핵심 렌더링 최적화 기법 중 하나입니다. Solid.js 2.0에서도 이 철학은 변함없이 이어지므로 규칙의 필요성도 동일하게 유지됩니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (논리/삼항 연산자 사용)

아래 코드들은 React 개발자들에게는 익숙하지만, Solid.js에서는 렌더링 최적화가 완벽하게 적용되지 않을 수 있는 문법입니다.

```jsx
// ❌ 논리 연산자 (&&) 사용
function UserProfile(props) {
  return <div>{props.isLoggedIn && <span>환영합니다!</span>}</div>;
}

// ❌ 삼항 연산자 (? :) 사용
function UserProfile(props) {
  return (
    <div>
      {props.isLoggedIn ? <span>환영합니다!</span> : <span>로그인 해주세요</span>}
    </div>
  );
}
```

### 🟢 올바른 사용 예 (<Show> 컴포넌트 사용)

`<Show>` 컴포넌트를 사용하면 조건이 일치할 때만 자식 DOM 요소들을 생성 및 유지하므로 훨씬 효율적입니다.

```jsx
// 🟢 <Show> 컴포넌트 사용
import { Show } from "solid-js";

function UserProfile(props) {
  return (
    <div>
      <Show when={props.isLoggedIn}>
        <span>환영합니다!</span>
      </Show>
    </div>
  );
}

// 🟢 fallback을 활용한 삼항 연산자 대체
function UserProfile(props) {
  return (
    <div>
      <Show when={props.isLoggedIn} fallback={<span>로그인 해주세요</span>}>
        <span>환영합니다!</span>
      </Show>
    </div>
  );
}
```

### 자동 수정 (Auto-fix) 작동 방식

ESLint의 `--fix` 옵션을 통해 실행하면:
- `cond && <div/>` 형태는 `<Show when={cond}><div/></Show>`로 자동 변환됩니다.
- `cond ? <div/> : <span/>` 형태는 `<Show when={cond} fallback={<span/>}> <div/> </Show>`로 자동 변환됩니다.
