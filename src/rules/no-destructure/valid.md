# no-destructure runtime validation

[한국어](./valid.kr.md)

The following Playwright fixture is the runtime basis for the rest-prop fixer.
Its complete source is recorded here independently of the prototype path.

## Fixture source

```tsx
import type { Element } from 'solid-js';
import { createSignal, merge, omit } from 'solid-js';

export function MergeOmit(): Element {
  const [override, setOverride] = createSignal<string | undefined>('provided');
  const props = merge({ label: 'default', retained: 'yes' }, () => ({
    label: override(),
  }));
  const rest = omit(props, 'label');
  const allProps = omit(props);

  return (
    <section>
      <h2>merge and omit</h2>
      <button
        type="button"
        data-testid="merge-set-undefined-button"
        onClick={() => setOverride(undefined)}
      >
        set undefined
      </button>
      <output data-testid="merge-label-result">
        {props.label ?? 'undefined'}
      </output>
      <output data-testid="omit-retained-result">{rest.retained}</output>
      <output data-testid="omit-all-label-result">
        {allProps.label ?? 'undefined'}
      </output>
    </section>
  );
}
```

## Observations

Initially, the outputs were `provided`, `yes`, and `provided`. After clicking
the button, the label outputs became `undefined`; the function source therefore
overrode the default with an actual `undefined`. `omit(props, 'label')` retained
`retained`, while `omit(props)` retained every property.

## Rule decision

The fixer may produce a separate `omit(props, ...keys)` statement for rest
destructuring. Rewriting default-value destructuring as
`merge(defaults, props)` would change the observed `undefined` behavior, so
that pattern remains report-only.
