# no-react-specific-props

[한국어](./readme.kr.md)

Report React JSX prop names that should use Solid or DOM names instead.

## React JSX and Solid JSX

React's DOM renderer gives props such as `className`, `htmlFor`, and `key`
special meanings. Solid generally uses the actual DOM property or attribute
name and its own runtime conventions. Copying React code unchanged can leave a
browser-unknown name or a `key` with no Solid meaning.

```tsx
// invalid
<div className="box" />
<label htmlFor="name" />
<div key={item.id} />

// preferred
<div class="box" />
<label for="name" />
```

The implementation fixes `className` to `class` and `htmlFor` to `for`, both
on DOM elements and component JSX. A `key` on an ordinary JSX element may be
removed. For list rendering, use `<For>` and choose its identity mode instead.

## Examples

The React names are invalid regardless of whether their value is a string or
an expression.

```tsx
// invalid
<div className={isActive() ? 'active' : ''} />
<label htmlFor="email">Email</label>

// valid after autofix
<div class={isActive() ? 'active' : ''} />
<label for="email">Email</label>
```

The rule applies to component props as well.

```tsx
// invalid; fixed to <Field class="wide" />
<Field className="wide" />
```

A React reconciliation `key` can be removed from a regular JSX element.

```tsx
// invalid; fixed to <li>{item.name}</li>
<li key={item.id}>{item.name}</li>
```

Before accepting that fix on a component, verify that `key` is not its own API.
In Solid 2, list identity is generally expressed with `<For>` or
`<For keyed={false}>`, depending on whether item or position identity is
intended.
