# no-react-deps runtime validation

[한국어](./valid.kr.md)

`solidjs2-web-prototype/apps/app/runtime-checks/effects.tsx` and its
Playwright `index.spec.ts` verify Solid 2 compute/apply effects and `defer`.

```tsx
createEffect(() => count(), apply);
createEffect(count, applyAfterChange, { defer: true });
```

The first effect recorded `undefined->0` initially and `0->1` after an
update. The deferred effect did not run initially, then recorded `1` after the
count changed.

This rule continues to report React-style dependency arrays, while allowing
the Solid 2 compute/apply signature and `{ defer: true }` options. A definite
primitive initial value is diagnosed separately because it conflicts with a
removed Solid 1 overload.
