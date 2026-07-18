# no-destructure

[한국어](./readme.kr.md)

Disallow destructuring reactive Solid props.

## Default configuration

This rule is enabled as an error by `recommended`.

```js
'@ssen/solid/no-destructure': 'error'
```

## Options

This rule has no options.

## Details

Disallow destructuring reactive Solid props. Direct destructuring reads values
once and loses the property access that Solid uses for tracking.

## How this differs from React

In React, `({ title })` naturally reads a new props object on every render.
Solid props are reactive objects whose property access reflects parent changes.
`const { title } = props` invokes the getter once and stores an ordinary value,
so later JSX reads no longer connect to the parent dependency.

```tsx
// incorrect
const Component = ({ title }) => <h1>{title}</h1>;

// preferred
const Component = (props) => <h1>{props.title}</h1>;
```

Use `omit` when props must be separated. The rule mainly fixes component prop
destructuring that returns JSX. Parameter defaults are report-only: JavaScript
defaults have explicit `undefined` semantics, while Solid 2 `merge` treats
`undefined` as an override.

Destructuring is not always syntactically forbidden. An accessor passed as a
prop or a value that does not need tracking may require separate judgment, but
direct property access is the safe default for component props.

## Examples

React-style component parameter destructuring is invalid because it turns a
reactive getter into an ordinary value.

```tsx
// invalid
const Title = ({ text }) => <h1>{text}</h1>;

// valid
const Title = (props) => <h1>{props.text}</h1>;
```

Aliases, defaults, and rest props are checked for the same reason. The rule
fixes to prop access where possible.

```tsx
// invalid and report-only
const Card = ({ title: heading = 'Untitled' }) => <article>{heading}</article>;
```

`merge({ title: 'Untitled' }, props)` would not turn `title={undefined}` into
`'Untitled'`, so it is not a safe fix. Complex rest-prop fixes should be
reviewed. Object destructuring in a non-component function remains valid.

```ts
// valid: an ordinary object, not Solid props
function formatUser({ name }: { name: string }) {
  return name.toUpperCase();
}
```

To pass remaining props, use `const rest = omit(props, 'title')`. In Solid 2,
`omit` returns one rest-props object rather than the tuple returned by Solid 1
`splitProps`. See [runtime validation](./valid.md).
