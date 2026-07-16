# Solid 2.0 event handler 검증 코드

이 문서는 `solidjs2-web-prototype/apps/app/valid`에서 실제 실행해 확인한 Solid.js 2.0 event handler 동작을 기록한다. `event-handlers` 규칙을 변경할 때 이 문서의 런타임 결과를 우선한다.

## 일반 HTML element의 배열 handler

일반 HTML element에서 `[handler, value]` 배열 handler는 계속 동작한다. 아래 버튼을 클릭하면 `increment`의 첫 번째 인수로 `2`가 전달되어 count가 2씩 증가한다.

```tsx
<button type="button" onClick={[increment, 2]}>
  {count()}
</button>
```

따라서 `event-handlers`는 배열 handler를 오류로 보고해서는 안 된다. 이 사실은 `no-array-handlers`의 Solid 2 전환에서도 반영해야 한다.

## `on*` 문자열 attribute

`onCustomAttribute="attribute-value"`는 일반 HTML attribute로 렌더링된다. HTML DOM은 attribute 이름을 소문자로 정규화하므로 다음 검증에서 `getAttribute('oncustomattribute')`는 `"attribute-value"`를 반환했다.

```tsx
<div data-control="enabled" onCustomAttribute="attribute-value" />;

element.getAttribute('data-control'); // "enabled"
element.getAttribute('oncustomattribute'); // "attribute-value"
```

`onLy`처럼 소문자로 정규화했을 때 다른 attribute와 같은 이름이 되는 사례는 검증에 사용하지 않는다. 예를 들어 `onLy`와 `only`는 HTML DOM에서 모두 `only`가 된다.

문자열·숫자·boolean 값을 함께 검사한 실제 JSON은 다음 기대값과 일치했다.

```json
{
  "dataControl": "enabled",
  "onCustomAttribute": "attribute-value",
  "onCustomNumber": "1",
  "onCustomBoolean": {
    "present": true,
    "value": ""
  }
}
```

따라서 문자열·숫자·boolean 값을 가진 `on*` prop을 `attr:on...`으로 바꾸도록 요구해서는 안 된다. `attr:`는 Solid 2에서 제거된 문법이다. `event-handlers`의 `detected-attr` 분기와 `attr:` suggestion은 제거한다.

## native custom event handler

일반 HTML button에서 `onCustom` handler와 배열 형태 `onCustom={[handler, 2]}` 모두 동작한다. 버튼의 `onClick`에서 `CustomEvent('custom')`를 dispatch했을 때 일반 handler는 1씩, 배열 handler는 2씩 카운터를 증가시켰다.

```tsx
<button onCustom={incrementDirect} onClick={dispatchCustom} />
<button onCustom={[incrementArray, 2]} onClick={dispatchCustom} />
```

현재 `@solidjs/web`의 기본 JSX 타입은 `onCustom`과 검증용 `onCustom*` attribute를 선언하지 않는다. prototype fixture는 `declare module '@solidjs/web'`의 조건부 declaration merging으로 `<div>`와 `<button>`에만 필요한 prop을 허용한다. 이는 fixture의 type error를 막기 위한 국소적인 보완이며, runtime에서 동작한다는 사실과 기본 타입 선언의 지원 범위는 별개다. ESLint rule은 이 type error를 대신 진단하지 않는다.

## spread event handler

spread object로 전달한 event handler도 동작한다. 아래 버튼을 클릭하면 `count`가 1씩 증가한다.

```tsx
const handlers = {
  onClick: () => setCount((count) => count + 1),
};

<button type="button" {...handlers}>
  spread handler
</button>;
```

Solid 2 전용 플러그인에서는 spread event handler를 오류로 보고하거나 JSX attribute로 풀어내는 fixer를 제공하면 안 된다. 기존 `warnOnSpread` 옵션은 Solid 1.x 호환성 목적이므로 제거 또는 deprecated 처리 대상이다.
