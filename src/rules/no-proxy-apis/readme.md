# no-proxy-apis

[한국어](./readme.kr.md)

Report API uses that require or can create an ES6 Proxy. Enable this rule only
for applications that must run in Proxy-constrained environments.

## Where Solid uses Proxy

Signals use accessor/setter pairs, but `createStore` and dynamic `merge` sources
can use Proxy internally. Proxy is convenient for deep property tracking but
may be unsuitable for unsupported environments, serialization, or external
library boundaries. This rule is for projects that deliberately choose that
constraint.

Solid 2 store setters receive a draft that is used only during the setter call;
it is not the externally mutable `createMutable` model. The rule allows the
recommended `setStore((draft) => { ... })` shape. It does not prove that
`createStore` itself avoids Proxy, so a strictly Proxy-free environment should
use signals and explicit value updates instead.

The rule covers `new Proxy`, `Proxy.revocable`, dynamic function/props sources
for `merge`, and JSX spreads of calls or member access.

```tsx
// reported
const proxy = new Proxy(value, handler);
<div {...getProps()} />;
```

## Examples

Proxy itself is invalid.

```ts
// invalid
const observable = new Proxy(target, handler);
const { proxy, revoke } = Proxy.revocable(target, handler);
```

Signals are not Proxy primitives and are valid for this rule.

```ts
// valid
import { createSignal } from 'solid-js';
const [count, setCount] = createSignal(0);
```

The rule is conservative when a JSX spread may be dynamic props.

```tsx
// invalid: results may be Proxy or dynamic props
<Button {...getButtonProps()} />
<Button {...props.button} />

// valid: static object literal
<Button {...{ disabled: true }} />
```

The same applies to dynamic functions or props passed to `merge`.

```ts
// invalid
merge(getDefaults, props);
```

The rule does not detect the execution environment. Disable it when stores are
appropriate for a project; if Proxy absence is a requirement, redesign with
signals and explicit prop passing. See [runtime validation](./valid.md).
