# event-handlers runtime validation

[한국어](./valid.kr.md)

Playwright runtime checks in `solidjs2-web-prototype/apps/app/runtime-checks`
confirm the Solid 2 event behavior used by this rule.

## Array handlers on ordinary HTML elements

An array handler `[handler, value]` continues to work on ordinary HTML
elements. Clicking the following button passed `2` as the first argument to
`increment`, increasing the count by two.

```tsx
<button type="button" onClick={[increment, 2]}>
  {count()}
</button>
```

`event-handlers` must not report array handlers as errors. The same fact is
also relevant to the Solid 2 policy of `no-array-handlers`.

## String `on*` attributes

`onCustomAttribute="attribute-value"` renders as an ordinary HTML attribute.
The HTML DOM normalizes attribute names to lowercase, so
`getAttribute('oncustomattribute')` returned `"attribute-value"`.

```tsx
<div data-control="enabled" onCustomAttribute="attribute-value" />;

element.getAttribute('data-control'); // "enabled"
element.getAttribute('oncustomattribute'); // "attribute-value"
```

The fixture does not use names such as `onLy` that normalize to another
attribute name (`only` in this case). It checked string, number, and boolean
values together and observed:

```json
{
  "dataControl": "enabled",
  "onCustomAttribute": "attribute-value",
  "onCustomNumber": "1",
  "onCustomBoolean": {
    "present": true,
    "value": ""
  }
}
```

The rule must not require `attr:on...` for these values. `attr:` was removed in
Solid 2, so the former `detected-attr` branch and suggestion were removed.

## Native custom event handlers

Both `onCustom` and `onCustom={[handler, 2]}` work on an ordinary HTML button.
When an `onClick` handler dispatched `CustomEvent('custom')`, the direct
handler incremented by one and the array handler incremented by two.

```tsx
<button onCustom={incrementDirect} onClick={dispatchCustom} />
<button onCustom={[incrementArray, 2]} onClick={dispatchCustom} />
```

Custom event props need local declaration merging in the prototype because
`@solidjs/web` does not declare arbitrary names. That type limitation is
separate from the checked runtime behavior, and the ESLint rule neither
diagnoses nor works around it.

## Spread event handlers

An event handler passed through a spread object also works. Clicking the button
incremented the count by one.

```tsx
const handlers = {
  onClick: () => setCount((count) => count + 1),
};

<button type="button" {...handlers}>
  spread handler
</button>;
```

A Solid 2-only plugin must not report a spread handler as an error or provide a
fixer that expands it into JSX attributes. The former `warnOnSpread` option was
for Solid 1 compatibility and is removed or deprecated.
