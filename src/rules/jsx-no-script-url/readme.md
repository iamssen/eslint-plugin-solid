# jsx-no-script-url

[한국어](./readme.kr.md)

Disallow `javascript:` URLs in JSX attributes.

## Default configuration

This rule is enabled as an error by `recommended`.

```js
'@ssen/solid/jsx-no-script-url': 'error'
```

## Options

This rule has no options.

## Details

Disallow `javascript:` URLs in JSX attributes. Executable URLs are an XSS risk;
use a normal URL, an event handler, or another explicit interaction mechanism
instead.

`javascript:` asks a browser to execute a string instead of navigating. Static
strings, template literals, and statically evaluable concatenations can all be
dangerous. This is a DOM security rule, not a Solid-only restriction, so custom
component props such as `to` are checked too.

```tsx
// incorrect
<a href="javascript:alert('xss')" />
<Link to={`javascript:${value}`} />

// represent an action with a handler
<button type="button" onClick={handleClick}>Run</button>
```

## Examples

The rule checks statically known values in every JSX prop, not only `href`.

```tsx
// all invalid
<a href="javascript:alert('xss')" />
<Link to="javascript:run()" />
<Widget action="javascript:run()" />
<a href={`javascript:${command}`} />
```

```tsx
// valid
<button type="button" onClick={run}>Run</button>
<a href="https://example.com">Documentation</a>
```

For a runtime value such as `<a href={userUrl}>`, the rule cannot determine the
protocol. Application code must still validate an allowlist such as `https:`;
this rule is not a general URL validator or XSS filter.
