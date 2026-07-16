# style-prop

[한국어](./readme.kr.md)

Validate CSS property names in JSX `style` objects, prefer kebab-case, and
require explicit string units for numeric length and percentage properties.

## Unlike React style objects

React's DOM style API translates JavaScript property names such as `fontSize`
and numeric values such as `fontSize: 12`. Solid style objects are closer to
direct DOM style declarations, so CSS names such as `font-size` and explicit
units are safer. The rule does not assume that a number receives `px`.

```tsx
// invalid
<div style={{ fontSize: 12, backgroundColor: 'red' }} />

// preferred
<div style={{ 'font-size': '12px', 'background-color': 'red' }} />
```

For the properties covered by the rule—such as `width`, `height`, `margin`,
`padding`, `border-width`, and `font-size`—a non-zero number is reported.
This does not claim that Solid adds `px` to every value. CSS custom properties
(`--name`) are valid.

By default, string styles are reported in favor of an object. Set
`{ allowString: true }` to allow them, and extend the prop names examined with
`{ styleProps: ['style', 'css'] }`. This is not a complete validator for every
CSS property or unit: it uses `known-css-properties` plus selected
length/percentage properties and intentionally allows custom properties.

## Examples

React-style camelCase property names are invalid; use the CSS name and add the
appropriate unit.

```tsx
// invalid
<div style={{ fontSize: 12, backgroundColor: 'red' }} />

// property autofix followed by a unit correction
<div style={{ 'font-size': '12px', 'background-color': 'red' }} />
```

Not every numeric value requires a unit. Zero, unitless properties, and custom
properties are valid.

```tsx
<div style={{ 'font-size': 0 }} />
<div style={{ 'flex-grow': 1 }} />
<div style={{ '--accent-hue': 220 }} />
```

A string style is invalid by default and is fixed to an object literal when it
can be parsed.

```tsx
// invalid; fixed to <div style={{ "font-size": "10px" }} />
<div style="font-size: 10px" />
```

Use an option for intentionally retained CSS strings.

```tsx
// valid with { allowString: true }
<div style={`color: ${themeColor};`} />
```

`styleProps` controls which prop names are inspected. With
`{ styleProps: ['style', 'css'] }`, `<div css={{ fontSize: '10px' }} />` is
also invalid; with `styleProps: ['css']`, `style` is ignored. The rule does not
trace style-object contents stored in a dynamic variable.
