# no-destructure 런타임 검증

[English](./valid.md)

다음 Playwright fixture는 rest prop fixer의 runtime 근거다. prototype 경로와
무관하게 검증 내용을 확인할 수 있도록 전체 소스를 기록한다.

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

## 관찰 결과

`omit(props, 'label')`은 나머지 key를 유지하고, `omit(props)`은 모든 prop을
유지했다. 따라서 rest destructuring fixer는 별도의 `omit(props, ...keys)`
statement를 만들 수 있다.

## Rule 결정

source가 `{ label: undefined }`를 반환하면 `merge` 결과는 default가 아니라
`undefined`였다. default-value destructuring을 `merge(defaults, props)`로
바꾸면 이 의미가 달라지므로 해당 패턴은 report-only로 둔다.
