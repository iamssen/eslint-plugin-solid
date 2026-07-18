# no-proxy-apis

[English](./readme.md)

ES6 Proxy가 필요하거나 생성할 수 있는 API 사용을 보고합니다.

## 기본 설정

이 rule은 `recommended`에서 비활성화되어 있습니다. Proxy 제약이 있는 target
environment에서만 활성화합니다.

```js
'@ssen/solid/no-proxy-apis': 'error'
```

## 옵션

이 rule에는 옵션이 없습니다.

## 상세

Proxy가 필요한 Solid API와 일반 `Proxy` API를 사용하지 않도록 검사합니다. Proxy를 지원하지 않는 실행 환경이나 Proxy 기반 반응성을 피해야 하는 라이브러리 코드에서 사용할 수 있습니다.

## Solid에서 Proxy가 쓰이는 곳

Solid signal은 accessor/setter 쌍으로 동작하지만, `createStore`와 동적인 `merge` source는 내부적으로 Proxy를 사용할 수 있습니다. Proxy는 편리하게 깊은 property 접근을 추적하지만, 지원하지 않는 환경·직렬화·외부 라이브러리 경계에서 제약이 될 수 있습니다. 이 rule은 그런 설계 제약을 명시적으로 선택한 프로젝트를 위한 것입니다.

Solid 2의 store setter는 draft를 받아 그 안에서 변경합니다. draft는 setter 호출 동안만 쓰는 갱신용 값이며, `createMutable`처럼 component 밖에서 직접 변경하는 store proxy가 아닙니다. 이 rule은 권장되는 `setStore((draft) => { ... })` 형태를 보고하지 않습니다. 다만 이 rule이 `createStore` 자체의 runtime Proxy 사용 여부까지 보장하지는 않으므로, Proxy를 전혀 사용할 수 없는 환경이라면 store 대신 signal과 명시적 값 갱신을 선택해야 합니다.

검사 대상에는 `new Proxy`, `Proxy.revocable`, `merge`에 동적인 함수/props 전달, 함수 호출 또는 멤버 접근을 JSX spread하는 패턴이 포함됩니다.

```ts
// 보고되는 예
const proxy = new Proxy(value, handler);
<div {...getProps()} />;
```

모든 Solid 반응성 API를 금지하는 규칙은 아닙니다. 필요한 경우 signal, 명시적 속성 전달 등 Proxy를 사용하지 않는 설계를 고려합니다.

## 예제로 보는 동작

Proxy 자체는 invalid입니다.

```ts
// invalid
const observable = new Proxy(target, handler);
const { proxy, revoke } = Proxy.revocable(target, handler);
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

같은 이유로 동적 함수나 props를 `merge`에 전달하면 invalid입니다.

```ts
// invalid
merge(getDefaults, props);
```

이 rule은 실행 환경을 감지하지 않습니다. Store가 필요한 프로젝트에서는 rule을 끄는 편이 맞을 수 있고, Proxy 없는 환경이 요구 사항이라면 signal과 명시적 prop 전달로 설계를 바꿔야 합니다.
