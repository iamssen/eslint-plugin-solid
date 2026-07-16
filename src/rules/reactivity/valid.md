# reactivity 런타임 검증

이 문서는 `solidjs2-web-prototype/apps/app/runtime-checks`와
`index.spec.ts`를 Playwright로 실행해 확인한 Solid 2 반응성 모델을 기록한다.
`reactivity` rule의 tracked scope, effect callback, setter 경고 범위를 바꿀 때 이
결과를 우선한다.

## microtask batching과 `flush()`

`batching.tsx`에서 setter 직후 accessor를 읽으면 이전 값 `0`이었고, 다음
microtask에서는 `1`이었다. `setCount(2)` 뒤 `flush()`를 호출한 경우에는 같은
handler 안의 읽기가 `2`였다.

따라서 Solid 1의 `batch()` callback을 동기 tracked scope로 취급하지 않는다.
일반 setter write는 자동 batching에 맡기고, 명령형 경계에서 즉시 읽기가 필요한
경우만 `flush()`를 사용한다. 제거된 `batch` 호출은 `no-solid-1-apis`가 진단한다.

## `createEffect` compute/apply와 defer

`effects.tsx`에서 `createEffect(() => count(), apply)`는 최초에
`undefined->0`, count 증가 뒤 `0->1`을 표시했다. `defer: true` effect는 최초에는
실행되지 않아 `not run`이었고, count 변경 뒤 `1`을 표시했다. 같은 fixture의
`createMemo(() => count() * 2, { lazy: false })`는 `0`에서 `2`로 갱신됐다.

compute callback만 dependency를 수집하므로 rule은 그 안의 setter write를 보고한다.
apply callback은 계산 결과를 적용하는 위치이므로 read, setter write, cleanup 반환을
허용한다. 이 근거는 `no-react-deps`의 effect initial value/defer 문서와도 공유한다.

## `onSettled` lifecycle

`on-settled.tsx`는 mount 뒤 `settled`를 기록하고, child unmount 뒤 callback이 반환한
cleanup으로 `settled,cleanup`을 기록했다. 그러므로 `onSettled` callback은 실행 시점
읽기와 cleanup을 허용하는 called-function scope로 취급한다. 제거된 `onMount`는
`no-solid-1-apis`가 `onSettled` 방향으로 진단한다.

## `merge`와 `omit`

`merge-omit.tsx`에서 `merge(defaults, source)`의 source가 `{ label: undefined }`를
반환하면 default를 보존하지 않고 label이 `undefined`가 됐다. `omit(props, 'label')`은
`retained`를 유지했고, 인수 없는 `omit(props)`은 모든 prop을 유지했다.

따라서 `merge`/`omit` 결과는 reactive props로 추적한다. 한편 default prop
destructuring을 `merge(defaults, props)`로 자동 수정하면 `undefined` 의미가 달라질 수
있으므로 `no-destructure`는 그 경우 report-only다.
