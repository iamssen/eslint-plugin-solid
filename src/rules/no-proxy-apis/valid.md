# no-proxy-apis runtime validation

[한국어](./valid.kr.md)

The Solid 2 prototype runs `store-draft.tsx` and `merge-omit.tsx` through
Playwright. This rule conservatively identifies APIs that can create a Proxy;
it does not prove that an application is entirely Proxy-free.

## Store draft setters

```tsx
setState((draft) => {
  draft.count++;
  draft.item = 'updated';
});
```

The checked UI changed from `0:first` to `1:updated`. A draft only exists
during the setter callback, so the rule does not report this Solid 2 pattern.
It is not the same model as externally mutable `createMutable` state.

## `merge` sources

Function and already-proxied sources passed to `merge` may create a Proxy, so
the rule reports them conservatively. The fixture confirms reactive
`merge`/`omit` behavior but does not establish that stores or merges are safe
in environments where Proxy support is forbidden. Use signals and explicit
value updates for that requirement.
