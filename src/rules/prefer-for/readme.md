# prefer-for

[한국어](./readme.kr.md)

Prefer Solid's `<For>` to array `.map()` in JSX.

## Default configuration

This rule is enabled as an error by `recommended`.

```js
'@ssen/solid/prefer-for': 'error'
```

## Options

This rule has no options.

## Details

Prefer Solid's `<For>` to an array `.map()` that renders a list directly in JSX.
Solid's control-flow component has a list-oriented reactive update model.

## Why it differs from `.map()`

React creates a new element tree for `items.map(...)` during each render and
then reconciles it. Solid compiles JSX into DOM operations and reactive
computations, so a plain `.map()` re-evaluates list creation when the array
changes. `<For>` tracks list items and reuses DOM at item granularity.

```tsx
import { For } from 'solid-js';

<For each={props.items}>{(item) => <li>{item.name}</li>}</For>
```

Solid 2 removed `<Index>`. Use default `<For>` when object/item identity
matters, and `<For keyed={false}>` when positions stay stable while their values
change. The rule cannot infer that data-structure intent, so the keyed mode is
the author's choice.

## Examples

A JSX `.map()` used to create a list is invalid.

```tsx
// invalid
<ul>{props.todos.map((todo) => <li>{todo.title}</li>)}</ul>

// valid after autofix
<ul><For each={props.todos}>{(todo) => <li>{todo.title}</li>}</For></ul>
```

Ordinary data transformation outside JSX is valid.

```ts
const titles = props.todos.map((todo) => todo.title.toUpperCase());
```

## Callback arguments and fixer boundary

Default `<For>` passes an item value and an index accessor:

```tsx
<For each={props.todos}>
  {(todo, index) => <li>{index()}: {todo.title}</li>}
</For>
```

`keyed={false}` passes an item accessor and a numeric index instead:

```tsx
<For each={props.slots} keyed={false}>
  {(slot, index) => <li>{index}: {slot()}</li>}
</For>
```

The rule automatically fixes only `.map((item) => jsx)`. JavaScript `map`'s
second parameter is a number, while default `<For>`'s is an accessor; in the
other keyed mode the item becomes an accessor too. Callbacks with no parameter
or two or more parameters are reported without a fix.

```tsx
// invalid: choose index() or keyed={false} and item() deliberately
{props.todos.map((todo, index) => <li>{index}: {todo.title}</li>)}
```

A one-parameter optional-chain map such as `items?.map((item) => jsx)` can be
fixed to `<For each={items}>`: `<For>` renders `undefined` as an empty list.
The receiver and optional-chain context must still be safe for the AST fixer.
The callback body is preserved, so also review a remaining React `key` with
`no-react-specific-props`. See [runtime validation](./valid.md).
