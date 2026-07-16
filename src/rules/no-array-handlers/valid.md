# no-array-handlers 런타임 검증

이 문서는 `solidjs2-web-prototype/apps/app/runtime-checks/array-handler.tsx`와
`custom-event-handlers.tsx`를 Playwright로 실행한 결과를 기록한다. 이 rule은
Solid 2에서 지원되는 문법을 팀 스타일로 제한하는 선택적 정책이므로, runtime
결과가 recommended 설정과 문서의 근거가 된다.

## 검증한 동작

일반 DOM event에 `[handler, value]`를 전달하면 두 번째 배열 항목이 handler의
첫 번째 인수로 전달된다.

```tsx
<button onClick={[increment, 2]}>{count()}</button>
```

초기 count `1`에서 Playwright click 두 번 뒤 값은 차례로 `3`, `5`였다.

native custom event도 일반 handler와 배열 handler를 모두 지원한다.

```tsx
<button onCustom={incrementDirect} />
<button onCustom={[incrementArray, 2]} />
```

`CustomEvent('custom')`를 dispatch했을 때 일반 handler는 `1`만큼, 배열 handler는
`2`만큼 증가했다. 다만 `@solidjs/web` 기본 JSX 타입은 임의의 `onCustom` prop을
선언하지 않으므로 prototype은 필요한 element에만 declaration merging을 적용했다.

## rule 결정

배열 handler는 Solid 2 runtime에서 유효하므로 `no-array-handlers`는 recommended에서
`off`다. 이 rule을 켜는 것은 runtime 호환성 진단이 아니라 배열 문법을 피하려는 팀의
스타일 선택이다. 제거된 `on:`/`oncapture:` namespace는 이 rule이 아니라
`no-unknown-namespaces`가 진단한다.
