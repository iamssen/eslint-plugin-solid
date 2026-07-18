# no-unknown-namespaces

[한국어](./readme.kr.md)

Report JSX namespace attributes unsupported or removed in Solid 2.

## Default configuration

This rule is enabled as an error by `recommended`.

```js
'@ssen/solid/no-unknown-namespaces': 'error'
```

## Options

`allowedNamespaces` defaults to an empty array. Add one or more namespace names
to allow them in addition to the built-in `prop:` namespace.

```js
'@ssen/solid/no-unknown-namespaces': [
  'error',
  { allowedNamespaces: ['vendor'] },
]
```

## Details

Report JSX namespace attributes that Solid 2 no longer supports or does not
recognize. The rule prevents removed Solid 1.x syntax from remaining as an
unintended attribute and catches namespace typos.

## Removed Solid namespaces

Solid 2 removed `use:`, `attr:`, `bool:`, `on:`, `oncapture:`, `class:`, and
`style:` from its public JSX model. Each receives migration guidance, but no
automatic fix: the safe replacement depends on context.

```tsx
// invalid: use: directive
<button use:tooltip={{ content: 'Save' }} />

// use a ref directive factory
<button ref={tooltip({ content: 'Save' })} />

// invalid: delegated-event namespace
<button on:click={save} />

// use an ordinary Solid event handler
<button onClick={save} />
```

Use `ref` and `addEventListener` when a native listener needs options such as
capture.

```tsx
const listen = (type, handler, options) => (element) =>
  element.addEventListener(type, handler, options);

<button ref={listen('click', save, { capture: true })} />;
```

Replace `attr:` and `bool:` with ordinary HTML attributes; combine `class:` or
`style:` values into object or array values for `class` and `style`.

```tsx
// invalid
<div attr:aria-label="Search" class:active={selected()} style:width="10rem" />

// valid
<div
  aria-label="Search"
  class={{ active: selected() }}
  style={{ width: '10rem' }}
/>
```

## Allowed namespaces

`xmlns:` and `xlink:` remain valid for SVG/XML. Projects using a separate JSX
transform can add a namespace through `allowedNamespaces`.

```js
{
  '@ssen/solid/no-unknown-namespaces': ['error', {
    allowedNamespaces: ['foo']
  }]
}
```

`prop:` is allowed for direct assignment to a writable native or custom-element
DOM property.

```tsx
<div prop:scrollTop={0} />
<my-widget prop:open={true} />
```

The `@solidjs/web` JSX types expose only writable element properties through
`prop:*`. Prefer an ordinary attribute when it suffices. Namespace props on a
component, including `prop:`, have no effect and are reported. An unknown
namespace on a component offers a suggestion to remove the namespace; a removed
Solid namespace instead reports the migration error first. See the detailed
[migration notes](./migration.md).
