# no-array-handlers runtime validation

[한국어](./valid.kr.md)

Playwright fixtures `array-handler.tsx` and `custom-event-handlers.tsx` in
`solidjs2-web-prototype/apps/app/runtime-checks` confirm that Solid 2 supports
array event handlers.

```tsx
<button onClick={[increment, 2]}>{count()}</button>
<button onCustom={[incrementCustom, 2]} />
```

For normal DOM events, the second tuple value is passed as the handler's first
argument. The fixture changed a count from `1` to `3` and then `5` after two
clicks. A native custom event also accepted both a direct handler and an array
handler.

`@solidjs/web` does not declare arbitrary `onCustom` props by default, so the
fixture uses declaration merging only for its checked elements. That TypeScript
detail does not change the observed runtime behavior.

Because the syntax is valid in Solid 2, this rule is off in `recommended` and
remains an opt-in team style rule. Removed `on:` and `oncapture:` namespaces
are diagnosed by `no-unknown-namespaces`, not by this rule.
