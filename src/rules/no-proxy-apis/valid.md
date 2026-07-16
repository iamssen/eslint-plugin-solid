# no-proxy-apis 런타임 검증

이 문서는 `solidjs2-web-prototype/apps/app/runtime-checks/store-draft.tsx`와
`merge-omit.tsx`를 Playwright로 실행한 결과를 기록한다. 이 rule은 runtime Proxy의
완전한 부재를 보장하는 rule이 아니라, Proxy를 만들 수 있는 API 사용을 보수적으로
표시하는 rule이다.

## store draft setter

Solid 2 store는 setter callback에 draft를 전달한다.

```tsx
setState((draft) => {
  draft.count++;
  draft.item = 'updated';
});
```

초기 `0:first`는 click 뒤 `1:updated`가 됐다. 따라서 draft setter 자체는 이 rule이
보고하지 않는다. `createMutable`처럼 component 밖에서 직접 변경하는 mutable proxy와
동일한 모델이 아니다.

## `merge` source

`merge-omit.tsx`는 function source와 `merge`/`omit`의 반응형 prop 동작을 확인한다.
함수 또는 이미 Proxy인 source를 전달한 `merge`는 Proxy를 생성할 수 있으므로
`no-proxy-apis`는 이를 보수적으로 진단한다. 반면 이 fixture가 store/merge가 Proxy를
전혀 만들지 않음을 증명하는 것은 아니며, Proxy 금지 환경에서는 signal과 명시적 값
갱신을 선택해야 한다.
