# no-array-handlers

[English](./readme.md)

Solid 이벤트 핸들러의 배열 구문을 선택적으로 금지합니다. Solid 2.0은 `<button onClick={[handler, value]} />`와 custom event의 같은 형태를 지원합니다. 이 rule은 해당 구문을 쓰지 않기로 한 팀에서만 켜는 스타일 정책이며, recommended 설정에서는 꺼져 있습니다.

Solid의 배열 handler는 React의 `onClick={(event) => handler(value, event)}`를 단순히 다른 문법으로 쓴 것이 아닙니다. Solid의 JSX runtime이 배열의 첫 항목을 handler로, 나머지 값을 handler 호출 시 인자로 전달하도록 해 closure 생성을 피하는 Solid 전용 문법입니다. 이 rule을 활성화하면 그러한 프로젝트 정책을 일관되게 적용할 수 있습니다.

```tsx
// Solid 2.0에서 지원하지만, 이 규칙을 활성화한 프로젝트에서는 invalid
<button onClick={[handleClick, id]} />

// 일반적인 대안
<button onClick={(event) => handleClick(id, event)} />
```

이 규칙은 배열의 실제 타입 안전성을 판정하지 않고, 이벤트 속성 또는 이벤트 핸들러로 식별되는 위치의 배열 표현식을 검사합니다.

## 예제로 보는 동작

Solid 배열 handler 문법은 Solid 2.0에서 유효하지만, 이 rule을 활성화하면 invalid입니다.

```tsx
// invalid: Solid는 지원하지만 이 프로젝트는 금지
<button onClick={[save, id]}>저장</button>
<button onCustom={[track, 'opened']} />
<button onclick={[save, id]} />
```

동일한 동작을 일반 함수 handler로 쓰면 valid입니다.

```tsx
// valid
<button onClick={(event) => save(id, event)}>저장</button>
<button onCustom={(event) => track('opened', event)} />
```

배열을 변수에 넣어도 피할 수 없습니다.

```tsx
const handler = [save, id];
<button onClick={handler} />; // invalid
```

반대로 event prop이 아닌 일반 prop의 배열은 검사 대상이 아닙니다. 이 rule은 배열 첫 항목의 타입이나 handler가 실제로 동작하는지를 분석하지 않고, DOM element의 `on*` prop에 배열 문법이 쓰였는지만 검사합니다. `on:`과 `oncapture:` namespace는 Solid 2.0에서 제거되었으며 `no-unknown-namespaces`가 진단합니다.

runtime 검증에서 standard event와 native custom event의 배열 handler는 모두 동작했다. 구체적인 근거는 [event-handlers/valid.md](../event-handlers/valid.md)를 참고하세요.
