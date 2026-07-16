# jsx-no-undef

[한국어](./readme.kr.md)

Disallow undefined JSX component references. The rule can add imports for a
small configured set of known Solid components when that option is enabled.

## JSX name resolution

`<Button />` is a JSX expression referring to the JavaScript identifier
`Button`, not an HTML string. A missing import or misspelling can otherwise go
unnoticed until rendering.

```tsx
import { For } from 'solid-js';

<For each={items}>{(item) => <li>{item.name}</li>}</For>
```

An undefined uppercase component is an error. `typescriptEnabled` and
`allowGlobals` adjust TypeScript-only checking and global-scope allowance; the
rule does not replace full TypeScript checking or module resolution.

## Examples

```tsx
// invalid: Button is neither declared nor imported
<Button />

// valid
import { Button } from './Button';
<Button />
```

Solid control-flow components are ordinary identifiers and require imports.

```tsx
// invalid: For is missing
<For each={items}>{(item) => <li>{item}</li>}</For>

// valid
import { For } from 'solid-js';
<For each={items}>{(item) => <li>{item}</li>}</For>
```

## Solid 2 `ref` directive factories

```tsx
// The ref value is ordinary JavaScript.
import { clickOutside } from './directives';

<div ref={clickOutside(close)} />

const autofocus = (element) => element.focus();
const validate = () => (element) => element.checkValidity();
<input ref={[autofocus, validate()]} />
```

Solid 2 removed `use:` directives. A `ref={factory(options)}` expression is
ordinary JavaScript, so `factory` and `options` are handled by normal scope or
TypeScript diagnostics. `no-unknown-namespaces` reports the removed `use:`
namespace. With `allowGlobals: true`, global values are allowed. Suggestions to
add imports exist only for selected known Solid components; this rule does not
verify a path or TypeScript type.
