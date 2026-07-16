# Solid 2.0 마이그레이션 작업 순서

이 문서는 `@ssen/eslint-plugin-solid`를 Solid 2.0 전용 플러그인으로 전환하기 위한 구현 순서와 rule별 작업 목록이다. 현재 fixture와 테스트는 목표 상태를 먼저 반영하는 중이므로, 각 단계에서는 해당 rule만 개별 실행해 수정 범위를 작게 유지한다.

```sh
# 실행할 rule 이름 또는 테스트 파일 경로를 반드시 뒤에 전달한다.
npm run test:rule -- imports
npm run test:rule -- reactivity
npm run test:rule -- src/rules/no-destructure/rule.test.ts
```

## 완료 기준

- 해당 rule의 RuleTester 테스트가 통과한다.
- 해당 rule의 문서와 메시지가 Solid 2.0 API를 설명한다.
- autofix가 있다면 제거된 1.x API나 JSX 문법을 출력하지 않는다.
- 관련 `cases/valid` fixture가 권장 설정에서 통과한다.
- 확정 제거 API의 테스트는 2.0 대체 test로 전환하거나, 이유·대체 API가 적힌 `test.skip`으로 보존한다.

## 0. 공통 기반: import 추적과 테스트 실행

먼저 여러 rule이 공유하는 import 추적을 Solid 2.0 경로까지 인식하게 만든다. 이 단계를 뒤로 미루면 `@solidjs/web` import alias를 사용하는 대부분의 rule 테스트가 잘못된 원인으로 실패한다.

- [ ] `src/utils.ts`의 `trackImports()` 기본 source 범위를 `solid-js`뿐 아니라 `@solidjs/web` 등 필요한 `@solidjs/*` 경로까지 확장한다.
- [ ] core, renderer, type-only import, alias import의 추적 범위를 명시적으로 테스트한다.
- [ ] `npm run test:rule -- <rule>` 사용법을 README 또는 개발 문서에 추가할지 결정한다.

## 1. `imports`: public API 경계 확정

다른 rule의 import alias 인식에 직접 영향을 주므로 가장 먼저 수정한다.

- [x] `solid-js/web` → `@solidjs/web` fixer와 test를 구현한다.
- [x] `solid-js/store`의 store API → `solid-js` fixer와 test를 구현한다.
- [x] `@solidjs/h`, `@solidjs/html`, `@solidjs/universal` 경로를 source map에 추가한다.
- [x] 웹 JSX 타입(`JSX`, `ComponentProps`)은 `@solidjs/web`, renderer-neutral 타입(`Element` 등)은 `solid-js`로 분리한다.
- [x] 제거 API는 존재하지 않는 core import로 고치지 않는다. 별도 migration 진단으로 넘길지 결정한다.
- [x] `imports.test.ts`의 현재 skip migration matrix를 새 source map 기대값으로 다시 활성화한다.

## 2. JSX namespace와 이벤트 모델

제거된 JSX 문법을 계속 valid로 두면 이후 rule의 분석 전제가 틀어진다.

### `no-unknown-namespaces`

- [x] `use:`, `attr:`, `bool:`, `on:`, `oncapture:`를 Solid 2.0 제거 문법으로 진단한다.
- [x] `class:`/`style:`도 일반 `class`/`style` 값으로 유도한다.
- [x] `prop:`은 `@solidjs/web` JSX 타입에서 native/custom element의 writable DOM property 설정으로 지원됨을 확인했다.
- [x] XML/SVG namespace의 지원 범위를 보존한다.

### `event-handlers`와 `no-array-handlers`

- [x] `attr:on...` suggestion과 fixer를 제거한다.
- [x] 일반 handler는 camelCase prop으로, native capture/options는 `ref` + `addEventListener`로 안내한다.
- [x] array handler의 2.0 지원 범위를 prototype에서 확인했다. 지원되는 문법이므로 `no-array-handlers`는 recommended에서 끈 opt-in 스타일 정책으로 유지한다.
- [x] 제거된 namespace 사례는 이유·대체 API를 적은 `test.skip()`으로 보존하고, 일반 handler·배열 handler·spread handler의 2.0 valid 사례를 추가한다.

### `jsx-no-undef`

- [x] `use:X` directive 식별자 전용 분기를 제거한다.
- [x] ref directive factory는 일반 JavaScript expression으로 취급한다.
- [x] 기존 custom directive test를 2.0 ref factory 사례로 바꾼다.

## 3. JSX class와 목록 제어 흐름

### `prefer-for`

- [x] 메시지와 문서에서 `<Index>` 선택지를 제거한다.
- [x] 위치 기반 목록은 `<For keyed={false}>`를 사용하도록 설명한다.
- [x] item accessor와 index 값의 callback 형태 차이를 runtime test와 문서로 고정한다.

## 4. 반응성 핵심: `reactivity`

가장 큰 rule이며, 나머지 reactivity 관련 fixer의 전제가 된다. 작은 subtask로 나누어 개별 실행한다.

- [ ] `merge`와 `omit` 결과를 reactive props로 추적한다.
- [ ] `createEffect`의 compute/apply 시그니처를 모델링한다.
  - [ ] compute 단계의 signal/store setter write를 진단한다.
  - [ ] apply 단계의 write와 cleanup 반환은 허용한다.
  - [ ] `EffectBundle`/`error` option 지원 범위를 결정한다.
- [ ] 기본 microtask batch를 반영한다. `batch` sync callback 가정과 test를 제거 API migration으로 전환한다.
- [ ] `onMount` → `onSettled` tracked scope 및 cleanup 반환을 처리한다.
- [ ] `For keyed={false}` callback의 item accessor·숫자 index를 정확히 추적한다.
- [ ] `Index`, `indexArray`, `createResource`, `createMutable`, `observable` 등 1.x 전용 분기를 제거하거나 migration rule로 옮긴다.
- [ ] 컴포넌트 최상위 reactive read와 `untrack` 의도 표기를 회귀 test로 강화한다.

## 5. props/store fixer와 보조 reactivity rule

### `no-destructure`

- [ ] default prop fixer를 `merge(defaults, props)`로 바꾼다.
- [ ] rest prop fixer를 `omit(props, ...keys)` 기반의 별도 문장으로 바꾼다.
- [ ] default + rest, implicit return, computed key, alias의 기존 test case를 하나씩 다시 활성화한다.
- [ ] `merge`의 `undefined` overwrite 의미 때문에 fix가 안전하지 않은 경우 report-only로 제한한다.

### `no-react-deps`

- [x] `createEffect(fn, initialValue)`와 `createMemo(fn, initialValue)`의 명확한 primitive initial value를 이 rule에서 Solid 2 제거 API로 진단한다. `undefined`는 생략과 같으므로 허용한다.
- [ ] compute/apply effect와 `defer` options를 valid 사례로 추가한다.
- [ ] dependency array 검사 자체는 유지한다.

### `no-proxy-apis`

- [x] `mergeProps` 추적을 `merge`로 바꾼다. 함수 또는 Proxy source를 전달한 `merge`는 Proxy를 생성할 수 있다.
- [x] `solid-js/store` import 진단 책임은 `imports` rule로 옮긴다.
- [ ] 2.0 store의 draft setter와 proxy 제약의 실제 관계를 확인해 메시지를 갱신한다.

## 6. 제거 API migration rule

이름만 바꾸면 의미가 달라지는 API는 기존 style rule에 억지로 넣지 않고 별도 rule로 관리한다.

- [ ] `no-solid-1-apis` 같은 migration rule의 이름·권장 설정 포함 여부를 결정한다.
- [ ] import alias와 namespace import를 포함해 다음 API를 탐지한다.
  - [ ] `createResource`, `Suspense`, `SuspenseList`, `ErrorBoundary`
  - [ ] `useTransition`, `startTransition`, `batch`, `on`, `createComputed`
  - [ ] `createMutable`, `modifyMutable`, `from`, `observable`, `createDeferred`
  - [ ] `Index`, `indexArray`, `Context.Provider`
- [ ] 대체가 단일하지 않은 API는 autofix하지 않고 `Loading`, `Reveal`, `action`, `isPending`, async iterator 등 문맥별 대체 방향만 메시지에 제시한다.
- [ ] 단순 rename이고 안전한 경우만 fixer를 제공한다.

## 7. 설정·fixture·문서 통합

모든 개별 rule이 안정화된 후에 실행한다.

- [ ] `src/index.ts`의 recommended 설정을 Solid 2.0 전용으로 갱신한다.
- [ ] skip된 test를 가능한 한 2.0 test로 되살리고, 남은 skip은 외부 API 불확실성만 남긴다.
- [ ] `cases/`를 빌드된 plugin으로 실행해 fixture 전체를 점검한다.
- [ ] `README.md`에는 영어로 2.0 사용법과 `jsxImportSource: "@solidjs/web"`을 기록한다.
- [ ] 각 `src/rules/{rule-name}/readme.md`에는 한국어로 2.0 동작과 migration 주의점을 기록한다.
- [ ] rule metadata URL을 이 하드 포크의 실제 GitHub 경로로 정정한다.

## 최종 검증

```sh
npm run lint
npm run type-check
npm run test:all
npm run build
```

전체 테스트는 모든 rule의 개별 단계가 통과한 뒤에만 실행한다. 실패가 생기면 먼저 해당 rule의 `npm run test:rule -- <rule>`로 범위를 좁힌다.
