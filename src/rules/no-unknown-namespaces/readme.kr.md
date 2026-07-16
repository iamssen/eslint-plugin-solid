# no-unknown-namespaces

[English](./readme.md)

Solid 2.0에서 지원하지 않거나 제거된 JSX namespace attribute를 검사합니다. 이 규칙은 제거된 Solid 1.x namespace가 의도와 다르게 일반 attribute로 남는 것을 막고, JSX namespace의 오타도 찾습니다.

## 제거된 Solid namespace

`use:`, `attr:`, `bool:`, `on:`, `oncapture:`, `class:`, `style:`는 Solid 2.0 공개 JSX 모델에서 제거되었습니다. 이 규칙은 각각의 namespace에 맞는 migration 오류와 대체 방향을 보고하지만, 문맥에 따라 의미가 달라져 자동 수정은 하지 않습니다.

```tsx
// invalid: use: directive
<button use:tooltip={{ content: 'Save' }} />

// ref directive factory를 사용
<button ref={tooltip({ content: 'Save' })} />

// invalid: delegated event namespace
<button on:click={save} />

// 일반 Solid event handler를 사용
<button onClick={save} />
```

native listener의 `capture` 등 옵션이 필요하면 `ref`에서 `addEventListener`를 사용합니다.

```tsx
const listen = (type, handler, options) => (element) =>
  element.addEventListener(type, handler, options);

<button ref={listen('click', save, { capture: true })} />;
```

`attr:`/`bool:`는 일반 HTML attribute로, `class:`/`style:`는 객체·배열을 받는 `class`/`style` prop으로 바꿉니다.

```tsx
// invalid
<div attr:aria-label="검색" class:active={selected()} style:width="10rem" />

// valid
<div
  aria-label="검색"
  class={{ active: selected() }}
  style={{ width: '10rem' }}
/>
```

## 허용 namespace

SVG/XML의 `xmlns:`와 `xlink:`는 허용합니다. 별도 JSX transform이 필요한 프로젝트는 `allowedNamespaces` 옵션으로 namespace를 추가할 수 있습니다.

```js
{
  '@ssen/solid/no-unknown-namespaces': ['error', {
    allowedNamespaces: ['foo']
  }]
}
```

`prop:`은 native element와 custom element의 writable DOM property를 직접 설정할 때 허용합니다. 예를 들어 다음은 `element.scrollTop = 0`과 같은 property 설정입니다.

```tsx
<div prop:scrollTop={0} />
<my-widget prop:open={true} />
```

`@solidjs/web`의 JSX 타입은 element별 writable property만 `prop:*`로 노출합니다. 일반 attribute로 충분한 경우에는 standard attribute를 사용하고, component에 붙은 `prop:`은 다른 namespace prop과 마찬가지로 효과가 없으므로 이 rule이 진단합니다. 근거와 경계는 [migration.kr.md](./migration.kr.md)에 기록합니다.

컴포넌트에 붙은 알려지지 않은 namespace는 효과가 없으므로, namespace를 제거하는 suggestion을 제공합니다. 제거된 Solid namespace는 이 suggestion 대신 migration 오류를 우선 보고합니다.
