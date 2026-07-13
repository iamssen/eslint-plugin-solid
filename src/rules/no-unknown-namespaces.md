# no-unknown-namespaces

JSX namespace prop의 오타와 Solid가 특별히 처리하는 namespace의 잘못된 사용을 검사합니다. `attr:`, `class:`, `style:`, `use:`, `prop:`, `on:`, `oncapture:` 등 Solid가 인식하는 형태를 기준으로 합니다.

## namespace는 단순한 이름 규칙이 아니다

`on:click`은 일반 prop 이름에 콜론을 넣은 것이 아니라 native listener를 선택하는 compiler/runtime 지시입니다. `attr:value`는 attribute 쓰기를, `prop:value`는 DOM property 쓰기를, `class:active`는 class token 토글을, `use:directive`는 directive 함수를 연결합니다. 따라서 `bind:` 같은 다른 프레임워크의 namespace를 섞으면 문법은 파싱되더라도 Solid에서 기대한 동작이 되지 않습니다.

```tsx
// 잘못된 예
<div atrr:id="main" />
<input bind:value={value} />

// namespace가 필요 없으면 일반 prop을 사용
<div id="main" />
```

컴포넌트에 `attr:` 또는 알 수 없는 namespace를 사용한 경우에는 namespace를 제거하는 수정 제안이 제공될 수 있습니다. 프로젝트 고유 namespace는 `{ allowedNamespaces: ['my'] }`로 허용합니다. namespace의 실제 의미와 지원 여부는 Solid JSX 컴파일러 설정도 함께 확인해야 합니다.

## 예제로 보는 동작

Solid가 의미를 아는 namespace는 valid입니다.

```tsx
// 모두 valid
<input attr:aria-label="검색" />
<div class:active={selected()} />
<div style:width="10rem" />
<button on:click={save} />
<div use:focusTrap />
```

다른 프레임워크의 namespace를 가져오거나 오타를 내면 invalid입니다.

```tsx
// invalid: `attr:`의 오타
<div atrr:id="main" />

// invalid: Svelte식 namespace는 Solid directive가 아님
<input bind:value={value} />
```

`class:`와 `style:`의 값은 boolean toggle이 아니라 CSS 값을 직접 넣는 namespace입니다. 따라서 아래는 invalid이며, 일반 `style` object를 사용해야 합니다.

```tsx
// invalid
<div class:mt-4 />

// valid
<div class="mt-4" />
```

프로젝트가 별도 JSX transform을 통해 `foo:bar`를 지원한다면 `{ allowedNamespaces: ['foo'] }`로 허용할 수 있습니다. component에 `attr:label`을 쓴 경우 rule은 `<Widget label="..." />` suggestion을 낼 수 있지만, component API에 맞는지 확인해야 합니다.
