# reactivity runtime validation

[한국어](./valid.kr.md)

This document records the Solid 2 reactive model verified by running Playwright
against `solidjs2-web-prototype/apps/app/runtime-checks` and `index.spec.ts`.
When changing `reactivity` tracked scopes, effect callbacks, or setter reports,
these runtime observations take priority.

## Microtask batching and `flush()`

In `batching.tsx`, reading an accessor immediately after a setter returned the
previous value, `0`; after the next microtask it returned `1`. After
`setCount(2)` followed by `flush()`, a read in the same handler returned `2`.

The same fixture reads `count()` from a `queueMicrotask` callback after the
setter. That callback observed the updated value and is an execution-time read,
not a dependency-collecting reactive scope.

Solid 1 `batch()` is therefore not modeled as a synchronous tracked scope. Let
ordinary writes use automatic batching, and use `flush()` only when imperative
code really needs an immediate read. `no-solid-1-apis` reports removed `batch`.

## `createEffect` compute/apply and `defer`

In `effects.tsx`, `createEffect(() => count(), apply)` first displayed
`undefined->0`, then `0->1` after incrementing `count`. A `defer: true` effect
initially displayed `not run` and displayed `1` only after the count changed.
The same fixture's `createMemo(() => count() * 2, { lazy: false })` changed
from `0` to `2`.

Only the compute callback collects dependencies, so the rule reports setter
writes there. The apply callback may read, write through setters, and return
cleanup. This evidence is shared with `no-react-deps` effect initial-value and
defer documentation.

## `onSettled` lifecycle

`on-settled.tsx` recorded `settled` after mount and `settled,cleanup` after a
child unmounted through the cleanup returned from the callback. `onSettled` is
therefore treated as a called-function scope that permits execution-time reads
and cleanup. Removed `onMount` is diagnosed by `no-solid-1-apis`.

## `merge` and `omit`

In `merge-omit.tsx`, a `merge(defaults, source)` source of
`{ label: undefined }` did not retain the default: `label` became `undefined`.
`omit(props, 'label')` retained the other property, and `omit(props)` retained
all props.

The source reads `override()` lazily when `props.label` is consumed in JSX, and
the fixture changed the rendered label from `provided` to `undefined`. Its
function source must therefore be accepted as part of the consuming tracked
scope.

The rule therefore tracks `merge` and `omit` results as reactive props. Since
rewriting default-prop destructuring to `merge(defaults, props)` can change the
meaning of `undefined`, `no-destructure` reports that case without an autofix.
