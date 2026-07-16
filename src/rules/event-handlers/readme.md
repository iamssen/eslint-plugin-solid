# event-handlers

[한국어](./readme.kr.md)

Enforce standard camel-cased DOM event-handler names on native elements.
Known misspellings and casing errors such as `onclick` and `onDoubleClick` are
fixed to `onClick` and `onDblClick`.

## What is checked

Incorrect casing and aliases for standard DOM event names are fixed
automatically.

```tsx
// invalid → onClick
<button onclick={save} />

// invalid → onDblClick
<button onDoubleClick={open} />

// valid
<button onClick={save} />
<button onDblClick={open} />
```

Use the `ignoreCase: true` option to turn off these casing checks.

## Forms allowed in Solid 2

An ordinary attribute may begin with `on`. The rule does not suggest rewriting
string, number, or boolean values to `attr:on...`, because `attr:` was removed
in Solid 2.

```tsx
// all valid
<div
  onCustomAttribute="attribute-value"
  onCustomNumber={1}
  onCustomBoolean={true}
/>
```

Native custom events and array handlers are supported as well.

```tsx
// valid
<button onCustom={handleCustom} />
<button onClick={[increment, 2]} />
<button onCustom={[increment, 2]} />
```

Passing an event handler through a JSX spread also works in Solid 2.

```tsx
// valid
<button {...{ onClick: save }} />
```

`on:` and `oncapture:` were removed in Solid 2. This rule does not duplicate
their namespace migration diagnostic; `no-unknown-namespaces` reports them.
Use a camel-cased handler such as `onClick` for delegated events. For native
listener options, use a `ref` and `addEventListener`.

```tsx
const listen = (type, handler, options) => (element) =>
  element.addEventListener(type, handler, options);

<button ref={listen('click', save, { capture: true })} />;
```

See [migration notes](./migration.md) for the Solid 1 behavior that changed and
[runtime validation](./valid.md) for the evidence.
