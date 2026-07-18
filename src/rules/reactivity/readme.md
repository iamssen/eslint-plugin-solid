# reactivity

[한국어](./readme.kr.md)

Report incorrect use of signals, memos, props, and stores.

## Default configuration

This rule is enabled as a warning by `recommended`.

```js
'@ssen/solid/reactivity': 'warn'
```

## Options

`customReactiveFunctions` defaults to an empty array. Add function names that
should accept reactive values as tracked arguments; functions whose names begin
with `create` or `use` are already recognized.

```js
'@ssen/solid/reactivity': [
  'warn',
  { customReactiveFunctions: ['observeValue'] },
]
```

## Details

Report patterns that read signals, memos, props, or stores outside tracked
locations, or otherwise handle reactive values incorrectly. Solid records a
dependency when a reactive value is read; copying it into an ordinary variable
during component setup can freeze a value that later changes.

## Solid's execution model

React's dependency array declares which values to compare on a later render.
Solid instead registers a dependency at the moment a reactive value such as
`count()` or `props.value` is read by a running reactive computation. A JSX
expression or `createEffect` callback is tracked; a normal variable assignment
during component initialization is not.

```tsx
// Avoid: this snapshots props.value when the component runs.
const value = props.value;
return <div>{value}</div>;

// Preferred: JSX tracks the reactive prop read.
return <div>{props.value}</div>;
```

The rule handles writes, unnamed derived values, callback and async scopes, and
reads in JSX, expressions, and template literals. Register project primitives
that execute a callback reactively with
`{ customReactiveFunctions: ['customQuery'] }`.

Not every callback read is an error. An event handler, `setTimeout`, or
`queueMicrotask` callback may intentionally read the newest value at execution
time; it does not register a UI dependency. An async callback does not
automatically create a new tracked computation, so code that must update
reactively should read the dependency in an effect or update a separate reactive
value with a setter.

## Examples

The common mistake is storing a reactive prop in a normal variable during
component initialization.

```tsx
function Profile(props) {
  const name = props.name; // invalid: read only once
  return <h1>{name}</h1>;
}

function Profile(props) {
  return <h1>{props.name}</h1>; // valid: JSX tracks this read
}
```

Signal accessors follow the same rule.

```tsx
const [count, setCount] = createSignal(0);

const initial = count(); // invalid: ordinary snapshot
const doubled = createMemo(() => count() * 2); // valid: tracked memo
```

When a snapshot is deliberate, document it with `untrack`. Do not use that
snapshot for UI that should later update.

```tsx
const initial = untrack(() => count()); // valid intentional one-time read
```

An event handler reads the latest value when the event occurs and is valid.

```tsx
<button onClick={() => console.log(count())}>Current value</button>
```

Likewise, a microtask can inspect the value after Solid's batched update. It is
an execution-time read, not a dependency registration.

```tsx
setCount(1);
queueMicrotask(() => console.log(count())); // valid
```

Reading only across an async boundary does not register the effect dependency.

```ts
// invalid: count() is read inside the later callback
createEffect(() => {
  setTimeout(() => console.log(count()), 100);
});

// valid: the effect reads count() while collecting dependencies
createEffect(() => {
  const current = count();
  setTimeout(() => console.log(current), 100);
});
```

## Solid 2 effect phases and lifecycle

Solid 2 `createEffect` separates a dependency-collecting compute callback from
an apply callback (or `{ effect, error }` bundle). The compute callback must not
write a signal or store because that creates a circular update; the apply phase
may apply the result, call setters, or return cleanup.

```ts
// invalid: writes while computing dependencies
createEffect(
  () => {
    setCount(1);
    return count();
  },
  (value) => console.log(value),
);

// valid: apply the computed value separately
createEffect(
  () => count(),
  (value) => setDisplay(value),
);
```

For work that runs once after the component is reflected in the DOM, use
`onSettled` rather than removed `onMount`. Its callback may read at execution
time, perform async setter work, and return cleanup.

```ts
onSettled(() => {
  const onResize = () => measureLayout();
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
});
```

Solid 2 batches setters by microtask. Reading an accessor immediately after a
setter can observe the old value; use `flush()` only for an imperative boundary
that truly needs the new value synchronously, not the removed 1.x `batch`.

```ts
setFirstName('Ada');
setLastName('Lovelace');
// automatically reflected after the next microtask

flush(); // only for a rare synchronous imperative read
```

`merge` resolves a function source lazily when a merged prop is read. Reactive
reads in that source belong to the consuming tracked scope and are valid.

```tsx
const [override] = createSignal('provided');
const props = merge({ label: 'default' }, () => ({ label: override() }));
return <output>{props.label}</output>;
```

Custom primitives can be registered as tracked scopes:

```ts
// { customReactiveFunctions: ['createQuery'] }
createQuery(() => count()); // valid with the option
```

The rule intentionally permits event listeners, observers, and selected
`create*`/`use*` hooks. When addressing a report, first decide whether the
callback must **register** a dependency for UI updates or merely **read** the
latest value when it executes. `isPending(() => expression)` is treated as a
dependency-collecting compute callback. `<For>` callbacks follow the keyed-mode
contracts: default is `(item, indexAccessor)`, while `keyed={false}` is
`(itemAccessor, indexNumber)`.

```tsx
<For each={items()} keyed={false}>
  {(item, index) => <li>{index}: {item().name}</li>}
</For>
```

See [runtime validation](./valid.md) for the observed batching, effects,
lifecycle, and `merge`/`omit` behavior.
