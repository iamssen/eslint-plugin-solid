# prefer-show

[한국어](./readme.kr.md)

Prefer Solid's `<Show>` to logical-AND (`&&`) or ternary conditional rendering
in JSX.

## Reading conditional JSX in Solid

`<Show when={condition()}>` makes its children a control-flow region that is
created and disposed with its reactive condition. The output resembles React
conditional rendering, but Solid does not re-run the entire component function:
the `<Show>`-owned region is what reacts.

```tsx
import { Show } from 'solid-js';

<Show when={loggedIn()} fallback={<Login />}>
  <Dashboard />
</Show>
```

The rule can fix JSX conditional-rendering patterns to `<Show>`, not every
ternary expression. Treat it as a style rule for explicit Solid control flow
and fallback lifetime, not as a claim that `<Show>` is always faster. A simple
boolean display may be valid Solid code with `&&`; projects enabling this rule
choose `<Show>` for consistency.

## Examples

A logical-AND component child is invalid.

```tsx
// invalid
<main>{props.signedIn && <Dashboard />}</main>

// valid after autofix
<main><Show when={props.signedIn}><Dashboard /></Show></main>
```

A ternary with a fallback can become `<Show>` too.

```tsx
// invalid
{props.loading ? <Spinner /> : <Results />}

// valid after autofix
<Show when={!props.loading} fallback={<Spinner />}><Results /></Show>
```

An ordinary non-JSX conditional is outside the rule.

```ts
const label = props.signedIn ? 'Sign out' : 'Sign in';
```

For a symmetric ternary where neither branch is clearly the main UI, the rule
does not arbitrarily choose a branch as `fallback`. A fix can only move the
original expression into a fragment as a JSX reactive expression, not change a
component `return` boundary.
