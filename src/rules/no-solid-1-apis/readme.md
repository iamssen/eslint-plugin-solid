# no-solid-1-apis

[한국어](./readme.kr.md)

Disallow APIs removed from Solid 2.

## Default configuration

This rule is enabled as a warning by `recommended`.

```js
'@ssen/solid/no-solid-1-apis': 'warn'
```

## Options

This rule has no options.

## Details

Disallow Solid 1 APIs removed in Solid 2. The rule resolves named imports,
aliases, namespace imports, and `Context.Provider` created by `createContext`.

It reports without autofixing because replacement choices depend on data flow
and UI structure. A mechanical rename would not be safe.

## Removed APIs and migration directions

| Solid 1 API | Solid 2 direction |
| --- | --- |
| `createResource`, `<Suspense>`, `<SuspenseList>` | `Loading`, `Reveal`, and explicit async state |
| `<ErrorBoundary>` | `<Errored>` |
| `useTransition`, `startTransition` | `isPending` or optimistic state |
| `batch` | Default microtask batching; use `flush()` only at a necessary imperative boundary |
| `on`, `createComputed` | Effects, memos, or signals that directly read dependencies |
| `onMount` | `onSettled` for work after the DOM settles |
| `createReactive` | `createReaction` for an explicit tracking callback |
| `createMutable`, `modifyMutable` | A `createStore` draft setter |
| `from`, `observable`, `createDeferred` | Effects, async iterators, or explicit deferred state |
| `<Index>`, `indexArray` | `<For keyed={false}>`, `mapArray` |
| `<Context.Provider>` | `<Context value={...}>` |

## Examples

```tsx
// invalid
import { batch, createContext } from 'solid-js';

const Context = createContext();
batch(() => setCount(1));
const App = () => <Context.Provider value="value" />;
```

```tsx
// valid
import { createContext, flush } from 'solid-js';

const Context = createContext();
setCount(1);
flush(); // only at an imperative boundary that requires an immediate read
const App = () => <Context value="value" />;
```

Choose the replacement from the table based on the component's data flow and UI
lifetime. The rule intentionally leaves that migration decision to the author.
