# no-destructure 런타임 검증

[English](./valid.md)

`solidjs2-web-prototype/apps/app/runtime-checks/merge-omit.tsx`와 Playwright
`index.spec.ts`는 rest prop fixer의 Solid 2 근거를 기록한다.

```tsx
const props = merge({ label: 'default', retained: 'yes' }, source);
const rest = omit(props, 'label');
const allProps = omit(props);
```

검증에서 `omit(props, 'label')`은 선택한 key만 제외하고 `retained`를 유지했다.
인수 없는 `omit(props)`은 모든 prop을 유지했다. 따라서 rest destructuring fixer는
`omit(props, ...keys)`를 별도 statement로 만들 수 있다.

반면 source가 `{ label: undefined }`를 반환하면 `merge` 결과 label은 default가 아니라
`undefined`였다. 이 차이 때문에 default value destructuring을
`merge(defaults, props)`로 자동 수정하면 의미를 보존하지 못한다. 해당 패턴은
report-only로 남긴다.
