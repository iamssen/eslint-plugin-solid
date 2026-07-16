# no-react-deps 런타임 검증

[English](./valid.md)

`solidjs2-web-prototype/apps/app/runtime-checks/effects.tsx`와 Playwright
`index.spec.ts`는 Solid 2 effect의 compute/apply 및 `defer` 의미를 확인한다.

```tsx
createEffect(() => count(), apply);
createEffect(count, applyAfterChange, { defer: true });
```

첫 effect는 최초 `undefined->0`, 변경 뒤 `0->1`을 기록했다. `defer: true` effect는
최초에는 실행되지 않고 count 변경 뒤에만 `1`을 기록했다.

따라서 이 rule은 dependency array를 React식 API 사용으로 계속 진단하지만, Solid 2의
compute/apply 시그니처와 `{ defer: true }` options는 정상 사용으로 허용한다. 명확한
primitive initial value는 제거된 1.x overload와 충돌하므로 별도 진단한다.
