# no-array-handlers

[한국어](./readme.kr.md)

Optionally disallow Solid array event handlers.

## Default configuration

This rule is disabled by `recommended`. Enable it only when the project chooses
not to use Solid array event handlers.

```js
'@ssen/solid/no-array-handlers': 'error'
```

## Options

This rule has no options.

## Details

Optionally disallow Solid array event handlers. Solid 2 supports
`<button onClick={[handler, value]} />` and the same form for custom events.
Enable this rule only for a team that chooses not to use that syntax; it is off
in `recommended`.

An array handler is not merely React's `onClick={(event) => handler(value,
event)}` written differently. Solid's JSX runtime uses the first array item as
the handler and passes the remaining values as handler arguments, avoiding a
closure. Enabling this rule enforces a project style choice about that Solid
specific feature.

```tsx
// supported by Solid 2, but invalid when this rule is enabled
<button onClick={[handleClick, id]} />

// ordinary alternative
<button onClick={(event) => handleClick(id, event)} />
```

The rule does not determine whether the array is type-safe. It reports an array
expression used in an event attribute or a recognized event-handler location.

## Examples

The syntax is valid in Solid 2 but invalid under this opt-in rule.

```tsx
<button onClick={[save, id]}>Save</button>
<button onCustom={[track, 'opened']} />
<button onclick={[save, id]} />
```

An ordinary function handler is valid.

```tsx
<button onClick={(event) => save(id, event)}>Save</button>
<button onCustom={(event) => track('opened', event)} />
```

Putting the array in a variable does not avoid the report.

```tsx
const handler = [save, id];
<button onClick={handler} />; // invalid
```

Arrays for non-event props are outside the rule. It does not analyze the first
item's type or whether a handler will run; it only recognizes array-handler
syntax on DOM `on*` props. Removed `on:` and `oncapture:` namespaces are
reported by `no-unknown-namespaces`. Runtime checks confirmed array handlers
for standard and native custom events; see [runtime validation](./valid.md).
