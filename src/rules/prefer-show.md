# prefer-show

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
React에서는 `{condition() && <div/>}` 형태의 논리 AND 연산자를 통한 조건부 렌더링이 일반적입니다. 그러나 Solid.js에서 이 패턴을 사용하면 조건이 토글될 때마다 DOM 노드를 매번 새로 렌더링하고 메모리에 할당할 위험이 있습니다. Solid.js의 `<Show when={condition()}>` 컴포넌트는 조건부 렌더링에 특화되어 내부적으로 렌더링 트리를 캐싱하고 최적화하므로 이를 사용하는 것을 권장합니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 논리 연산자를 직접 사용하는 것보다 프레임워크가 제공하는 제어 흐름(Control Flow) 컴포넌트를 사용하는 것이 항상 더 빠르고 안전합니다.

## 3. 그 외 규칙 이해를 위한 설명
`<Show>` 컴포넌트를 사용하면 조건이 거짓(false)일 때 보여줄 UI를 삼항 연산자 대신 `fallback={<FallbackUI />}` 속성으로 명확하고 선언적으로 정의할 수 있어 코드의 가독성이 크게 향상됩니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 지양하는 예시 (논리 연산자 및 삼항 연산자)
// 조건이 바뀔 때마다 DOM이 완전히 소멸하고 재생성됩니다.
function UserProfile(props) {
  return (
    <div>
      {props.isLoggedIn && <Dashboard />}
      {!props.isLoggedIn && <LoginForm />}
    </div>
  );
}

// ✅ 권장하는 예시 (<Show> 컴포넌트 사용)
// 내부적으로 노드를 효율적으로 재사용하고 렌더링합니다.
import { Show } from 'solid-js';

function UserProfile(props) {
  return (
    <Show when={props.isLoggedIn} fallback={<LoginForm />}>
      <Dashboard />
    </Show>
  );
}
```
