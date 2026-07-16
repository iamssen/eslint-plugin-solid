# no-innerhtml

[한국어](./readme.kr.md)

Report XSS-prone HTML injection through `innerHTML` and React-style
`dangerouslySetInnerHTML`. Static HTML can also be disallowed when that is the
project policy.

In Solid, `innerHTML` writes directly to the DOM `innerHTML` property; it does
not pass through React's `dangerouslySetInnerHTML` object. Decide explicitly
whether markup is intended or whether untrusted input should be rendered as
escaped text. Ordinary JSX text is escaped by default.

```tsx
// invalid
<div innerHTML={userContent} />
<div dangerouslySetInnerHTML={{ __html: html }} />

// Render ordinary text as a child (or with innerText).
<div>{text}</div>
```

Static `innerHTML` is allowed by default. With `{ allowStatic: false }`, even
values that can be evaluated statically are reported. The rule also reports a
conflicting `innerHTML` together with `textContent` or `innerText`.

## Examples

Dynamic or external HTML is invalid because its markup may contain scripts or
event attributes.

```tsx
// invalid
<article innerHTML={post.body} />
<article dangerouslySetInnerHTML={{ __html: post.body }} />

// valid: Solid renders this as escaped text
<article>{post.body}</article>
```

Do not specify an HTML source and a text source on the same element.

```tsx
// invalid
<div innerHTML="<b>Notice</b>" textContent="Notice" />
```

With `{ allowStatic: false }`, this is invalid too:

```tsx
<div innerHTML="<b>Notice</b>" />
```

The React migration form `dangerouslySetInnerHTML={{ __html: html }}` can be
fixed to `innerHTML={html}`. The author must still ensure that `html` is trusted
or sanitized.
