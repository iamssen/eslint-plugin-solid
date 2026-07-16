# no-proxy-apis runtime validation

[한국어](./valid.kr.md)

These complete Playwright fixtures clarify the Solid 2 forms that this rule
must distinguish. They do not prove that an application is entirely Proxy-free.

## Fixture source: store draft setter

```tsx
import type { Element } from 'solid-js';
import { createStore } from 'solid-js';

export function StoreDraft(): Element {
  const [state, setState] = createStore({ count: 0, item: 'first' });

  return (
    <section>
      <h2>store draft setter</h2>
      <button
        type="button"
        data-testid="store-draft-increment-button"
        onClick={() =>
          setState((draft) => {
            draft.count++;
            draft.item = 'updated';
          })
        }
      >
        update draft
      </button>
      <output data-testid="store-draft-result">
        {state.count}:{state.item}
      </output>
    </section>
  );
}
```

## Fixture source: `merge` function source

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

## Observations and rule decision

The store UI changed from `0:first` to `1:updated`, so a draft exists only
during its setter callback. The rule must not report this Solid 2 pattern; it
is not externally mutable `createMutable` state.

The second fixture confirms that a function source is consumed reactively by
`merge`. Function and already-proxied `merge` sources can create a Proxy, so
the rule reports them conservatively. For a strict no-Proxy requirement, use
signals and explicit value updates instead.
