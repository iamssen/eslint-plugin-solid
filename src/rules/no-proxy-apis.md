# no-proxy-apis

Proxy가 필요한 Solid API와 일반 `Proxy` API를 사용하지 않도록 검사합니다. Proxy를 지원하지 않는 실행 환경이나 Proxy 기반 반응성을 피해야 하는 라이브러리 코드에서 사용할 수 있습니다.

## Solid에서 Proxy가 쓰이는 곳

Solid signal은 accessor/setter 쌍으로 동작하지만, `createStore`와 `mergeProps`는 객체 property 접근을 가로채기 위해 Proxy를 사용할 수 있습니다. Proxy는 편리하게 깊은 property 접근을 추적하지만, 지원하지 않는 환경·직렬화·외부 라이브러리 경계에서 제약이 될 수 있습니다. 이 rule은 그런 설계 제약을 명시적으로 선택한 프로젝트를 위한 것입니다.

검사 대상에는 `new Proxy`, `Proxy.revocable`, `solid-js/store` import, `mergeProps`에 동적인 함수/props 전달, 함수 호출 또는 멤버 접근을 JSX spread하는 패턴이 포함됩니다.

```ts
// 보고되는 예
const proxy = new Proxy(value, handler);
import { createStore } from 'solid-js/store';
<div {...getProps()} />;
```

모든 Solid 반응성 API를 금지하는 규칙은 아닙니다. 필요한 경우 signal, 명시적 속성 전달 등 Proxy를 사용하지 않는 설계를 고려합니다.

## 예제로 보는 동작

Proxy 자체와 Proxy를 필요로 하는 Store import는 invalid입니다.

```ts
// invalid
const observable = new Proxy(target, handler);
const { proxy, revoke } = Proxy.revocable(target, handler);
import { createStore } from 'solid-js/store';
```

signal은 Proxy와 다른 primitive이므로 이 rule에서는 valid입니다.

```ts
// valid
import { createSignal } from 'solid-js';
const [count, setCount] = createSignal(0);
```

JSX spread도 Proxy 여부를 알 수 없는 동적 결과에는 보수적으로 동작합니다.

```tsx
// invalid: 호출 결과가 Proxy/동적 props일 수 있음
<Button {...getButtonProps()} />
<Button {...props.button} />

// valid: 정적 object literal
<Button {...{ disabled: true }} />
```

같은 이유로 동적 함수나 props를 `mergeProps`에 전달하면 invalid입니다.

```ts
// invalid
mergeProps(getDefaults, props);
```

이 rule은 실행 환경을 감지하지 않습니다. Store가 필요한 프로젝트에서는 rule을 끄는 편이 맞을 수 있고, Proxy 없는 환경이 요구 사항이라면 signal과 명시적 prop 전달로 설계를 바꿔야 합니다.
