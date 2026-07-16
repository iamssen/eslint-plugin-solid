# no-array-handlers

Solid 이벤트 핸들러의 배열 구문을 금지합니다. Solid는 `<button onClick={[handler, value]} />`를 지원하며 불필요한 클로저를 줄일 수 있지만, 이 규칙은 해당 구문이 타입 안전하지 않거나 팀 코드에서 혼동을 일으키는 경우 사용합니다.

Solid의 배열 handler는 React의 `onClick={(event) => handler(value, event)}`를 단순히 다른 문법으로 쓴 것이 아닙니다. Solid의 JSX runtime이 배열의 첫 항목을 handler로, 나머지 값을 handler 호출 시 인자로 전달하도록 해 closure 생성을 피하는 최적화 문법입니다. 그만큼 Solid 전용이고, 일반적인 JSX 타입 도구나 팀 구성원에게는 덜 익숙할 수 있습니다.

```tsx
// 이 규칙에 걸리는 형태
<button onClick={[handleClick, id]} />

// 일반적인 대안
<button onClick={(event) => handleClick(id, event)} />
```

이 규칙은 배열의 실제 타입 안전성을 판정하지 않고, 이벤트 속성 또는 이벤트 핸들러로 식별되는 위치의 배열 표현식을 검사합니다.

## 예제로 보는 동작

Solid 배열 handler 문법 자체가 이 rule에서는 invalid입니다.

```tsx
// invalid: Solid는 지원하지만 이 프로젝트는 금지
<button onClick={[save, id]}>저장</button>
<div on:click={[track, 'opened']} />
<button onclick={[save, id]} />
```

동일한 동작을 일반 함수 handler로 쓰면 valid입니다.

```tsx
// valid
<button onClick={(event) => save(id, event)}>저장</button>
<div on:click={(event) => track('opened', event)} />
```

배열을 변수에 넣어도 피할 수 없습니다.

```tsx
const handler = [save, id];
<button onClick={handler} />; // invalid
```

반대로 event prop이 아닌 일반 prop의 배열은 검사 대상이 아닙니다. 이 rule은 배열 첫 항목의 타입이나 handler가 실제로 동작하는지를 분석하지 않고, event handler 위치에 배열 문법이 쓰였는지만 검사합니다.
