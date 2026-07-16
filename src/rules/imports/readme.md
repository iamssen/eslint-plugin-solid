# imports

[한국어](./readme.kr.md)

Enforce Solid 2 public API boundaries and safely fix imports whose destination
is unambiguous.

## Package boundaries

- `solid-js`: reactive primitives, control-flow components, store APIs, and
  renderer-neutral types.
- `@solidjs/web`: the DOM renderer and web JSX types.
- `@solidjs/h`, `@solidjs/html`, and `@solidjs/universal`: hyperscript, HTML
  template, and custom-renderer entry points.

Solid 1 paths `solid-js/web` and `solid-js/store` are migrated to
`@solidjs/web` and `solid-js`, respectively.

```ts
// incorrect
import { createStore } from 'solid-js/store';
import { render } from 'solid-js/web';

// preferred
import { createStore } from 'solid-js';
import { render } from '@solidjs/web';
```

## Type imports

Renderer-neutral types such as `Component`, `Element`, and `Store` belong in
`solid-js`. Web JSX types `JSX` and `ComponentProps` belong in `@solidjs/web`.

```ts
// valid
import type { Component, Element, Store } from 'solid-js';
import type { ComponentProps, JSX } from '@solidjs/web';
```

Web JSX projects must also set TypeScript's `jsxImportSource` to
`@solidjs/web`.

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@solidjs/web"
  }
}
```

## Autofix scope

The rule fixes only paths and names with a certain destination:

- known renderer exports from `solid-js/web` → `@solidjs/web`
- known store exports from `solid-js/store` → `solid-js`
- `solid-js/h`, `solid-js/html`, and `solid-js/universal` → their matching
  `@solidjs/*` packages
- `solid-js/jsx-runtime` and `solid-js/jsx-dev-runtime` → matching
  `@solidjs/web` runtime entry points

It does not rewrite removed or renamed Solid 1 APIs to an export that does not
exist. `createResource`, `mergeProps`, `splitProps`, and `Index`, for example,
are handled by the separate Solid 2 migration diagnostics.

If one declaration contains names with different destinations, the rule reports
all of them but does not apply a partial fix; splitting the declaration by
package is safer. Aliases and namespace imports from a correct source are
allowed because their actual uses cannot be inferred safely.
