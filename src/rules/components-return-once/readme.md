# components-return-once

[한국어](./readme.kr.md)

Disallow early and conditional returns from Solid components.

## Default configuration

This rule is enabled as a warning by `recommended`.

```js
'@ssen/solid/components-return-once': 'warn'
```

## Options

This rule has no options.

## Details

Disallow early and conditional returns from Solid components. Components run
once, so control flow that should react to changing state belongs in JSX, such
as `<Show>`, `<Switch>`, or a conditional expression inside the returned tree.

## How this differs from React

React calls a component function again after state changes, so a later render
can select a different `return`. Solid runs a component function once during
initialization and later updates only fine-grained computations such as signals
and JSX expressions. A component `return` is therefore not a reactive branch.

## Incorrect

```tsx
function Page(props) {
  if (props.loading) return <p>Loading</p>;
  return <p>{props.data}</p>;
}
```

## Preferred

```tsx
import { Show } from 'solid-js';

function Page(props) {
  return <Show when={!props.loading} fallback={<p>Loading</p>}><p>{props.data}</p></Show>;
}
```

The rule checks early returns and conditional final returns in functions it
recognizes as JSX-returning components. It can fix some conditional returns.
It does not prohibit early returns in every function: ordinary functions and
render-prop callbacks that do not return component JSX are not components.

## Examples

An early return from a component is invalid. If `loading` is initially true,
the following component never initializes the JSX expression for the result.

```tsx
function Page(props) {
  if (props.loading) return <p>Loading</p>; // invalid
  return <p>{props.data}</p>;
}
```

An ordinary function inside a component can return early because it can be
called repeatedly.

```tsx
function Page(props) {
  const describe = () => {
    if (props.loading) return 'Loading'; // valid
    return props.data;
  };

  return <p>{describe()}</p>;
}
```

A conditional final return is also invalid. The rule can rewrite this form to
`<Show>`.

```tsx
// before: invalid
return props.loading ? <Spinner /> : <Result />;

// an autofixable result
return <Show when={!props.loading} fallback={<Spinner />}><Result /></Show>;
```

`return condition && <Result />` can become `<Show when={condition}>`.
Nested ternaries can be rewritten with `<Switch>` and `<Match>`. If source code
does not reveal which branch should be the fallback, the rule preserves the
original expression inside a fragment instead of guessing its meaning.
