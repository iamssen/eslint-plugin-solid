# no-destructure runtime validation

[한국어](./valid.kr.md)

`merge-omit.tsx` and Playwright `index.spec.ts` in the Solid 2 prototype
provide the runtime basis for the rest-prop fixer.

```tsx
const props = merge({ label: 'default', retained: 'yes' }, source);
const rest = omit(props, 'label');
const allProps = omit(props);
```

`omit(props, 'label')` retained the remaining keys, and `omit(props)` retained
all props. The fixer can therefore produce a separate
`omit(props, ...keys)` statement for rest destructuring.

When the source returned `{ label: undefined }`, `merge` produced
`undefined`, not the default. Rewriting default-value destructuring as
`merge(defaults, props)` would change this behavior, so that pattern remains
report-only.
