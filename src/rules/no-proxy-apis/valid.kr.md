# no-proxy-apis 런타임 검증

[English](./valid.md)

아래 Playwright fixture는 이 rule이 구분해야 하는 Solid 2 형태를 설명한다. 이
검증은 애플리케이션 전체가 Proxy-free임을 증명하지는 않는다.

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

## 관찰 결과와 rule 결정

store UI는 `0:first`에서 `1:updated`로 바뀌었다. draft는 setter callback
동안에만 존재하므로 이 Solid 2 패턴은 report하지 않는다. 이는 외부에서 변경하는
`createMutable` state와 다른 모델이다.

두 번째 fixture는 function source가 `merge`에서 reactive하게 소비됨을 확인한다.
function source와 이미 proxied인 `merge` source는 Proxy를 만들 수 있으므로
보수적으로 report한다. Proxy를 엄격히 금지하는 환경에서는 signal과 명시적 값
갱신을 사용한다.
