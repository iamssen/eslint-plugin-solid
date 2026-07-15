# event-handlers

Solid 2.0 DOM event handler의 표준 이름과 대소문자를 검사합니다. 이 규칙은 event처럼 보이는 모든 `on*` prop을 event handler로 단정하지 않습니다.

## 검사 대상

표준 DOM 이벤트명의 잘못된 casing과 별칭은 자동 수정합니다.

```tsx
// invalid → onClick
<button onclick={save} />

// invalid → onDblClick
<button onDoubleClick={open} />

// valid
<button onClick={save} />
<button onDblClick={open} />
```

`ignoreCase: true` 옵션을 사용하면 이러한 casing 검사를 끌 수 있습니다.

## Solid 2.0에서 허용하는 형태

일반 attribute는 `on`으로 시작해도 attribute로 렌더링될 수 있습니다. 문자열·숫자·boolean 값을 `attr:on...`으로 바꾸라는 제안은 하지 않습니다. `attr:`는 Solid 2.0에서 제거된 문법입니다.

```tsx
// 모두 valid
<div
  onCustomAttribute="attribute-value"
  onCustomNumber={1}
  onCustomBoolean={true}
/>
```

native custom event와 배열 handler도 지원합니다.

```tsx
// valid
<button onCustom={handleCustom} />
<button onClick={[increment, 2]} />
<button onCustom={[increment, 2]} />
```

event handler를 JSX spread로 전달하는 것도 Solid 2에서 정상 동작합니다.

```tsx
// valid
<button {...{ onClick: save }} />
```

`on:`과 `oncapture:`는 Solid 2.0에서 제거되었습니다. 이 규칙은 namespace migration을 중복 보고하지 않으며, 제거 문법은 `no-unknown-namespaces`가 진단합니다. 일반 delegated event에는 `onClick`을, native listener 옵션이 필요하면 `ref`와 `addEventListener`를 사용하세요.

```tsx
const listen = (type, handler, options) => (element) =>
  element.addEventListener(type, handler, options);

<button ref={listen('click', save, { capture: true })} />;
```

검증 근거와 Solid 1.x 동작에서 바뀐 항목은 [event-handlers-migration.md](./event-handlers-migration.md)에 기록합니다.
