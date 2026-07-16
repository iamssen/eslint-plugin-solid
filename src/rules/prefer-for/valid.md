# `<For>` runtime validation

[한국어](./valid.kr.md)

This document records Solid 2 behavior observed by running Playwright against
`solidjs2-web-prototype/apps/app/runtime-checks/for-list.tsx` and
`index.spec.ts`. These runtime results take priority when defining
`prefer-for` messages, documentation, and fixer scope.

```sh
npm run test:e2e
```

## `each={undefined}` renders an empty list

A default `<For>` with `undefined` for `each` did not throw and rendered no
children.

```tsx
const [items] = createSignal<readonly Item[]>();

<ul>
  <For each={items()}>{(item) => <li>{item.label}</li>}</For>
</ul>;
```

Thus `items?.map((item) => <Row item={item} />)` can become the default
`<For each={items}>` form when `items` is temporarily absent. This does not by
itself make every optional-chain map safe to fix: the receiver must really be
an array and surrounding optional-chain context still requires AST analysis.

## Default `<For>` child arguments

Default `<For>` passed the item **value** first and an index **accessor**
second.

```tsx
<For each={items()}>
  {(item, index) => <li>{item.label}:{index()}</li>}
</For>
```

The two observed items rendered as `first:0` and `second:1`. A one-item
`array.map((item) => jsx)` callback can therefore be fixed to default `<For>`.
JavaScript `map` supplies a numeric second argument, however, so converting
`(item, index) => ...` mechanically would also require rewriting `index` to
`index()`. The rule deliberately provides no fix there.

## `<For keyed={false}>` arguments and DOM reuse

With `keyed={false}`, the first child argument was an item **accessor** and the
second was a stable numeric index.

```tsx
<For each={slots()} keyed={false}>
  {(item, index) => <li>{index}:{item()}</li>}
</For>
```

After replacing only the value at the first position, its displayed text changed
from `0:first slot` to `0:replaced first slot`, while its mount-time
`data-mount-id` stayed the same. The DOM node for that position was reused.
This matches the migration guide's `<For keyed={false}>` replacement for
removed `<Index>`. A standard map item is a value, though, so blindly adding
`keyed={false}` would also require changing every item use to `item()`. The
rule must not guess this mode or rewrite a multi-parameter callback.

## Not yet validated

Before widening the fixer, validate separately:

- a no-argument `array.map(() => jsx)` converted to default `<For>`;
- DOM identity during insertions, removals, and reordering for each mode; and
- child argument shapes for a `keyed={(item) => key}` callback.
