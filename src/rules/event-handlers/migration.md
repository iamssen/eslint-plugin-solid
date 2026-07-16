# event-handlers Solid 2 migration notes

[한국어](./migration.kr.md)

Solid 2 treats several former event-handler heuristics differently: arbitrary
`on*` values can be normal attributes, array handlers and spread handlers work,
and `attr:`, `on:`, and `oncapture:` namespaces are removed. The rule therefore
limits itself to safe casing and known-name fixes for standard DOM handlers.

## Evidence

The change is based on the following Solid 2 runtime checks:

- [runtime validation](./valid.md)
- array-handler, on-attributes, custom-event-handler, and spread-handler
  fixtures in `solidjs2-web-prototype/apps/app/runtime-checks`

They show that string, number, and boolean `on*` props become ordinary
attributes, and that native custom events, array handlers, and spread handlers
work.

## Changed rule role

The Solid 1 rule treated every prop beginning with `on` as an event handler and
suggested `attr:on...` for statically evaluated string and number values. That
assumption is invalid in Solid 2 because `attr:` was removed and ordinary `on*`
attributes are valid.

The rule is therefore limited to:

- standard DOM handler casing, for example `onclick` → `onClick`
- standard aliases, for example `onDoubleClick` → `onDblClick`

The following behavior was removed:

| Solid 1 rule behavior | Solid 2 decision | Reason |
| --- | --- | --- |
| `detected-attr` error | Removed | String, number, and boolean `on*` attributes are valid. |
| `attr:on...` suggestion | Removed | The `attr:` namespace was removed. |
| Handler/attribute dual suggestion for lowercase `on*` names | Removed | There is no longer an attribute namespace alternative, and arbitrary attributes would be false positives. |
| `warnOnSpread` option and fixer | Removed | JSX spread event handlers work. |

## Namespaces and capture listeners

This rule does not process `on:` or `oncapture:`. `no-unknown-namespaces`
reports them as removed Solid 2 syntax. Use camel-cased handlers for ordinary
events and configure native capture/options listeners from a `ref` callback
with `addEventListener`.

## Type declaration limitation

The default `@solidjs/web` JSX types do not declare native `onCustom` handlers
or the checked `onCustom*` attributes. The prototype uses conditional
declaration merging only for the required `<div>` and `<button>` props. This
local type workaround prevents fixture errors; it is separate from runtime
behavior and does not expand what this ESLint rule diagnoses.
