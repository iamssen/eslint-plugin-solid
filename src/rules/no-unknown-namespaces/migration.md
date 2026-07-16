# no-unknown-namespaces Solid 2 migration notes

[한국어](./migration.kr.md)

## Purpose and scope

This document records why `no-unknown-namespaces` changed from a Solid 1.x
"allowed Solid namespace" check into a Solid 2 check for removed and unknown
JSX namespaces.

The evidence is the DOM section and quick removal mapping in the repository's
[Solid 2 beta migration guide](../../../docs/Solid2-beta-Migration-Guide.md).
It specifies the removal of `use:`, `attr:`, `bool:`, `on:`, and `oncapture:`,
and states that `class:` and `style:` are no longer special JSX syntax.

## Decision to retain the rule

The rule remains enabled. A removed namespace is not guaranteed to surface as a
compiler error, and an unintended attribute can remain in DOM JSX. The rule
therefore catches both unfinished Solid 1.x migrations and typos or syntax from
another framework. Its public name and `recommended` error level remain
unchanged.

## Namespace decisions

| Namespace | Solid 2 decision | Rule behavior | Replacement direction | Autofix |
| --- | --- | --- | --- | --- |
| `use:` | removed | `legacy` error | `ref={directive(options)}` factory | none |
| `attr:` | removed | `legacy` error | ordinary HTML attribute | none |
| `bool:` | removed | `legacy` error | ordinary boolean attribute | none |
| `on:` | removed | `legacy` error | camel-cased handler such as `onClick` | none |
| `oncapture:` | removed | `legacy` error | `ref` plus `addEventListener` | none |
| `class:` | special syntax removed | `legacy` error | object/array `class` value | none |
| `style:` | special syntax removed | `legacy` error | object `style` value | none |
| `xmlns:`, `xlink:` | retained | allowed | SVG/XML namespaces | n/a |
| configured namespace | retained | allow with `allowedNamespaces` | project JSX transform | n/a |
| `prop:` | supported | allow on native/custom elements | direct writable DOM property | n/a |

## Why there is no automatic fix

Removing or renaming a namespace alone often does not produce safe Solid 2
code. A `use:` directive must be redesigned into configuration and element
application stages; event names and capture listener ownership need decisions;
and `class:`/`style:` values may need combining with existing values. The rule
therefore gives a stable migration message rather than a fixer or suggestion it
cannot prove preserves meaning.

## Components and `prop:`

An unknown namespace on an uppercase component continues to report that it has
no effect and offers removal of the namespace. A removed Solid namespace takes
priority even on a component, because its migration issue is more important.

Solid 2 JSX types define `prop:*` as a direct write to a writable native or
custom-element property, for example `element.myProp = true`. The rule allows
it by default but retains the component error because namespace props on a
component have no such DOM effect.

## Related follow-up work

- `event-handlers` removes obsolete `attr:on...` fixes and documents `onClick`
  and ref listeners.
- `no-array-handlers` removes `on:`-specific handling.
- `jsx-no-undef` replaces `use:` identifier analysis with ref-factory analysis.
- `reactivity` separates ref-factory configuration from application scope.
