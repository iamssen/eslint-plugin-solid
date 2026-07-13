# event-handlers

DOM 이벤트 핸들러 이름을 Solid의 규칙에 맞게 작성하고, 이벤트처럼 보이지만 문자열/숫자 속성으로 정적으로 처리될 수 있는 JSX 속성을 발견합니다.

## Solid의 이벤트 모델

Solid의 `onClick`은 React처럼 컴포넌트가 매번 다시 렌더링될 때 이벤트 함수를 교체하는 방식이 아닙니다. 지원되는 이벤트는 document-level delegation을 사용하고, `on:click`은 요소에 직접 listener를 연결하는 native 이벤트입니다. 둘은 대소문자 규칙과 동작 특성이 다르므로 구분해서 사용해야 합니다.

기본적으로 `onclick` 같은 이름은 `onClick`으로, `onDoubleClick`은 Solid의 표준 이름인 `onDblClick`으로 수정할 수 있습니다. 의도적으로 속성을 지정하려면 `attr:onclick`처럼 명시합니다. `on:click`은 네이티브 이벤트 리스너를 의미하므로 이 규칙의 일반 이름 검사를 우회합니다.

```tsx
<button onClick={handleClick}>확인</button>
<div on:customEvent={handleCustomEvent} />
<div attr:onclick="문자열 속성" />
```

옵션은 `{ ignoreCase: true }`로 모호한 소문자 이벤트 이름 검사를 끄고, `{ warnOnSpread: true }`로 이벤트 핸들러를 JSX spread로 전달하는 패턴을 추가 검사합니다. `warnOnSpread`는 Solid 1.6 미만 호환을 위한 옵션입니다.

`<div onClick="text" />`처럼 `on`으로 시작하지만 값이 문자열 또는 숫자로 정적으로 평가되는 경우, Solid 컴파일러가 이를 listener가 아닌 attribute로 처리할 수 있습니다. 이벤트가 아니라 의도적인 attribute라면 `attr:` namespace로 의도를 표현하세요.

## 예제로 보는 동작

표준 delegated 이벤트는 Solid가 정한 이름을 사용합니다. 아래의 `onclick`과 React/DOM에서 흔한 `onDoubleClick`은 invalid이고 자동 수정됩니다.

```tsx
// invalid → <button onClick={save} />
<button onclick={save} />

// invalid → <button onDblClick={open} />
<button onDoubleClick={open} />

// valid
<button onClick={save} />
<button onDblClick={open} />
```

사용자 정의 event를 요소에 직접 연결할 때는 `on:`을 사용합니다. 일반 prop 이름을 의도했다면 `attr:`로 구분합니다.

```tsx
// valid: custom native event listener
<my-element on:ready={onReady} />

// valid: listener가 아니라 attribute임을 명시
<div attr:onclick="legacy-value" />
```

다음은 이름과 값의 의도가 충돌하는 경우입니다. `onLy`는 listener처럼 보이지만 값이 문자열이므로 Solid가 attribute로 처리할 수 있어 invalid입니다.

```tsx
const label = 'text';
<div onLy={label} />; // invalid
<div attr:onLy={label} />; // valid: attribute 의도
<div onLy={handleLy} />; // valid: custom handler 의도
```

`<div only={fn} />`처럼 소문자 이름은 event인지 attribute인지 알 수 없어 두 suggestion을 제공합니다: `<div onLy={fn} />` 또는 `<div attr:only={fn} />`. `ignoreCase: true`를 설정하면 `onclick` 같은 대소문자 검사를 끌 수 있습니다. `warnOnSpread: true`에서는 `{...{ onClick }}`도 invalid이며 `<div onClick={onClick} />`로 옮기도록 수정합니다.
