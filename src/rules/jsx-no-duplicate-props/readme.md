# jsx-no-duplicate-props

[한국어](./readme.kr.md)

Disallow passing the same JSX prop more than once. Duplicate props make the
last-write behavior difficult to see and can conceal an unintended override.

## Why spread order matters in Solid

Solid JSX props are not merely an HTML attribute list: component props, DOM
properties, and directives can all be passed, and the order of explicit props
and spreads affects the result. Repeating a name relies on “the last value
wins” and is fragile during refactoring.

```tsx
// incorrect
<div class="a" class="b" />
<div {...{ class: 'a' }} class="b" />

// preferred
<div class="a b" />
```

The rule does not guess keys in a dynamically computed spread.

## Examples

```tsx
// invalid
<Button size="small" size="large" />

// valid
<Button size="large" />
```

It also finds duplicates in a statically known spread, but not an unknown one.

```tsx
// invalid: the spread is known to contain class
<div class="card" {...{ class: 'selected' }} />

// valid: keys are unknown
<div class="card" {...props} />
```

`children` must be passed as a prop or JSX children, not both. `innerHTML` and
`textContent` likewise conflict. The `ignoreCase` option treats names such as
`foo` and `FOO` as duplicates.

```tsx
// invalid
<Panel children={<Header />}><Body /></Panel>
<div innerHTML="<b>Notice</b>" textContent="Notice" />
```
