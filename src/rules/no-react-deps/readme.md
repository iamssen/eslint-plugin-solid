# no-react-deps

[한국어](./readme.kr.md)

Disallow React-style dependency arrays in Solid reactive primitives.

## Default configuration

This rule is enabled as a warning by `recommended`.

```js
'@ssen/solid/no-react-deps': 'warn'
```

## Options

This rule has no options.

## Details

Disallow React-style dependency arrays in Solid reactive primitives. Solid
tracks dependencies when an accessor or reactive property is read inside its
compute scope, rather than comparing an explicit array on a later render.

## How this differs from React dependency arrays

React uses `useEffect(fn, [a, b])` to choose when an effect runs on a later
render. Solid builds its dependency graph while a callback reads signals, props,
and stores. A dependency array is therefore usually a leftover migration
argument, not a Solid option.

```ts
// incorrect
createEffect(() => console.log(count()), [count]);

// preferred: automatic tracking
createEffect(() => console.log(count()));
```

Solid 2 separates effect computation from application.

```ts
createEffect(
  () => count(),
  (value) => console.log(value, other()),
);
```

The rule does not validate array contents; it tells users to remove an array
passed as the second argument. In Solid 2, the second `createEffect` argument
is an apply function and the second `createMemo` argument is options. Definite
legacy primitive initial values are also reported; `undefined` is equivalent to
omitting the argument and is allowed.

## Examples

```ts
// invalid
createEffect(() => console.log(count()), [count]);
createMemo(() => filter(items(), query()), [items, query]);

// valid after autofix
createEffect(() => console.log(count()));
createMemo(() => filter(items(), query()));
```

Use compute/apply form to track only a selected value and leave reads in apply
untracked. `{ defer: true }` skips the initial apply run.

```ts
// valid: only count participates in dependency tracking
createEffect(count, (value) => {
  console.log(value, debugLabel());
});

// valid: apply only after a later change
createEffect(count, (value) => {
  console.log('changed to', value);
}, { defer: true });
```

Whether the array contains accessors or accessor call results does not matter:
an array as the second argument of `createEffect(fn, [...])` is a React
dependency array. Arrays passed to unrelated functions are not reported. See
[runtime validation](./valid.md).
