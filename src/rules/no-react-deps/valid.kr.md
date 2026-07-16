# no-react-deps 런타임 검증

[English](./valid.md)

다음 전체 Playwright fixture는 Solid 2의 compute/apply effect와 `defer` 동작을
확인한다.

## Fixture source

```tsx
import type { Element } from 'solid-js';
import { createEffect, createMemo, createSignal } from 'solid-js';

export function Effects(): Element {
  const [count, setCount] = createSignal(0);
  const [effectResult, setEffectResult] = createSignal('pending');
  const [deferredResult, setDeferredResult] = createSignal('not run');
  const doubled = createMemo(() => count() * 2, { lazy: false });

  createEffect(
    () => count(),
    (value, previous) => {
      setEffectResult(`${previous ?? 'undefined'}->${value}`);
    },
  );

  createEffect(
    count,
    (value) => {
      setDeferredResult(String(value));
    },
    { defer: true },
  );

  return (
    <section>
      <h2>separated effects and memos</h2>
      <button
        type="button"
        data-testid="effects-increment-button"
        onClick={() => setCount((value) => value + 1)}
      >
        increment
      </button>
      <output data-testid="effects-apply-result">{effectResult()}</output>
      <output data-testid="effects-defer-result">{deferredResult()}</output>
      <output data-testid="effects-memo-result">{doubled()}</output>
    </section>
  );
}
```

## 관찰 결과와 rule 결정

compute/apply effect는 최초에 `undefined->0`, 갱신 뒤 `0->1`을 표시했다.
deferred effect는 최초에 `not run`이고 count 변경 뒤에만 `1`을 표시했다.
memo는 `0`에서 `2`로 바뀌었다.

이 rule은 React식 dependency array는 계속 진단하지만 Solid 2의 compute/apply
signature와 `{ defer: true }`는 허용한다. 확정된 primitive initial value는 제거된
Solid 1 overload와 충돌하므로 별도로 진단한다.
