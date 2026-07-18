# self-closing-comp

[한국어](./readme.kr.md)

Require self-closing syntax for JSX elements without children.

## Default configuration

This rule is enabled as a warning by `recommended`.

```js
'@ssen/solid/self-closing-comp': 'warn'
```

## Options

`component` defaults to `'all'` and accepts `'all'` or `'none'`.
`html` defaults to `'all'` and accepts `'all'`, `'void'`, or `'none'`.

```js
'@ssen/solid/self-closing-comp': [
  'warn',
  { component: 'all', html: 'void' },
]
```

## Details

Require self-closing syntax for JSX elements without children, and optionally
limit self-closing syntax for native HTML elements.

`<Component />` and `<Component></Component>` have the same empty-child
structure in JSX. This is a layout rule: it makes an empty component or element
explicit and keeps formatter and review style consistent; it does not change
the runtime model. The `html` option distinguishes HTML void and non-void
elements.

```tsx
// preferred with the default options
<Header />
<div />
```

The defaults are `{ component: 'all', html: 'all' }`.
`component: 'none'` requires opening and closing component tags.
`html: 'void'` permits self-closing only for HTML void elements such as `img`,
`input`, and `br`; `html: 'none'` forbids it for native elements. Empty and
whitespace-only elements are fixable.

## Examples

With the defaults, JSX elements without children must be self-closing.

```tsx
// invalid; fixed to <Avatar />
<Avatar></Avatar>

// invalid; fixed to <div />
<div></div>
```

Invisible-looking but real children are not empty.

```tsx
// all valid
<div>{' '}</div>
<div>&nbsp;</div>
<Card><Avatar /></Card>
```

HTML and component behavior are configured independently. With
`{ html: 'void' }`, only void HTML elements may self-close.

```tsx
// invalid with { html: 'void' }; fixed to <div></div>
<div />

// valid
<img />
```

With `{ component: 'none' }`, `<Avatar />` is invalid and
`<Avatar></Avatar>` is required. An element containing only multi-line
whitespace is considered empty, while an expression or HTML entity is a real
child.
