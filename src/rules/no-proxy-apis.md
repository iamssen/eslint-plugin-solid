# no-proxy-apis

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js의 Store API(`createStore` 등)는 깊은(deep) 반응성을 구현하기 위해 ES6 `Proxy` 객체를 내부적으로 사용합니다. 만약 Internet Explorer 11 등 `Proxy`를 지원하지 않는 구형 브라우저 환경을 타겟으로 하는 어플리케이션을 개발해야 할 경우, 해당 API들을 사용하면 런타임 오류가 발생하므로 이를 방지하고자 만들어졌습니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** Solid.js 2.0의 신호(Signal) 시스템이 근본적으로 개편되었더라도, 중첩된 객체를 다루는 Store 기능은 여전히 `Proxy` 객체를 바탕으로 동작하므로 구형 브라우저 제약은 동일하게 유지됩니다.

## 3. 그 외 규칙 이해를 위한 설명
현대의 대부분 웹 브라우저는 `Proxy`를 완벽하게 지원합니다. 따라서 타겟 브라우저 호환성 목록에 구형 브라우저가 포함되지 않는 현대적인 웹 어플리케이션 프로젝트에서는 이 규칙을 활성화할 필요가 거의 없습니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ IE11 등 Proxy 미지원 브라우저에서 런타임 오류를 유발하는 코드
import { createStore } from 'solid-js/store';

function App() {
  const [store, setStore] = createStore({ user: { name: "John" } });
  
  // 구형 브라우저에서는 Proxy 객체 생성이 실패합니다.
  return <div>{store.user.name}</div>;
}

// ✅ Proxy 대체재 (깊은 반응성이 필요 없다면 Signal 활용)
import { createSignal } from 'solid-js';

function App() {
  // Signal은 Proxy를 사용하지 않는 가장 원시적인 형태이므로 호환성이 더 높습니다.
  const [userName, setUserName] = createSignal("John");
  return <div>{userName()}</div>;
}
```
