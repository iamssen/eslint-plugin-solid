# 문서 정합성 점검 TODO

공개 문서의 영문 원문과 한국어 번역은 독자가 어느 언어를 선택해도 같은 정보를
같은 순서로 얻을 수 있어야 한다. runtime 검증 문서는 fixture 전체 코드, 관찰 결과,
그리고 그 결과가 rule의 허용·진단·autofix 범위에 미친 이유를 함께 기록한다.

이 파일은 2026-07-16에 `README*.md`와 `src/rules/**/*.md`를 대조해 확인한 작업
목록이다. `docs/`는 공개 사용자 문서가 아니므로 이 TODO와 migration guide 자체는
번역 쌍의 대상이 아니다.

## 완료 기준

- [x] 영문 `.md`와 한국어 `.kr.md`의 제목, 섹션 순서, 표, 목록, 코드 블록 위치를
  대응시킨다. 코드 블록은 번역하지 않되 양쪽 문서에 동일한 위치로 둔다.
- [x] 한쪽 문서에만 관찰, 제한 사항, 테스트 정책, 링크, 또는 rule 결정이 남지
  않도록 한다. 언어 링크는 내용의 대체가 아니다.
- [x] 모든 `valid.md` / `valid.kr.md` fixture를 **전체 소스 → runtime 관찰 →
  허용·진단·autofix 결정** 순서로 작성한다.
- [x] fixture 코드 블록을 prototype 원본과 대조해 축약·재포맷 과정에서 type
  declaration, test id, callback 구조, JSX가 빠지지 않았는지 확인한다.
- [x] 상대 링크와 언어 전환 링크가 실제 파일을 가리키는지 확인한다.

## P0: runtime 검증 문서의 번역 구조 복구

현재 다음 한국어 문서는 관찰·결정을 먼저 요약하고 fixture 코드를 문서 끝에
한꺼번에 둔다. 영문 원문의 fixture별 섹션과 관찰·결정 구조를 따라 다시 작성한다.

- [x] `src/rules/event-handlers/valid.kr.md`를 `valid.md`와 같은 네 fixture 순서로
  재작성한다. array handler, `on*` attribute, native custom event, spread handler마다
  **소스 → 관찰 → rule 결정**을 번역한다.
- [x] `src/rules/no-array-handlers/valid.kr.md`를 ordinary DOM event와 native custom
  event fixture로 분리한다. 각 전체 코드, count 관찰값, declaration merging이
  type-check 전용이라는 설명, `recommended: off` 결정을 원문 순서로 번역한다.
- [x] `src/rules/no-destructure/valid.kr.md`에 `merge-omit` fixture 전체 코드 바로
  뒤 초기·변경 후 출력, `omit` 관찰, default destructuring을 report-only로 두는 이유를
  배치한다.
- [x] `src/rules/no-proxy-apis/valid.kr.md`를 store draft setter와 `merge` function
  source의 독립 fixture 섹션으로 복구한다. “Proxy-free를 증명하지는 않음”이라는
  범위도 영문과 같은 위치에 둔다.
- [x] `src/rules/no-react-deps/valid.kr.md`에 `effects.tsx` 전체 코드 뒤
  compute/apply, `defer`, memo 관찰과 rule 결정을 영문 순서대로 번역한다.
- [x] `src/rules/prefer-for/valid.kr.md`에 fixture 전체 코드 뒤 `each={undefined}`,
  default `<For>`, `keyed={false}` 관찰과 각각의 autofix 제한을 세분해 번역한다.
- [x] `src/rules/reactivity/valid.kr.md`를 batching, compute/apply effects,
  `onSettled`, `merge`/`omit`의 네 fixture 섹션으로 나눈다. 각 코드와 대응 관찰을
  붙인 뒤 마지막 rule 결정을 번역한다.
- [x] 위 7개 쌍에서 heading 목록과 code-fence 위치를 비교한다. 언어 링크를 제외한
  섹션 수·순서가 같고, 한 언어에만 있는 문장이 없음을 확인한다.

## P1: 확인된 번역 쌍 불일치

- [x] `src/rules/event-handlers/migration.md`와 `migration.kr.md`를 일치시킨다.
  한국어에만 있는 `테스트 보존 정책`을 영문에도 추가하거나 제거하고, `Type
  declaration limitation`을 같은 heading 순서에 둔다.
- [x] `src/rules/no-unknown-namespaces/migration.kr.md`의 migration guide 링크를
  `../../../docs/Solid2-beta-Migration-Guide.md`로 수정한다.
- [x] `src/rules/no-unknown-namespaces/migration.md`와 `migration.kr.md`의 component
  우선순위 및 `prop:` 설명을 일치시킨다. 한국어 추가 내용이 필요하면 영문에도
  동등하게 추가하고, 그렇지 않으면 한국어를 원문 구조로 번역한다.
- [x] `src/rules/reactivity/readme.kr.md`에 영문 원문의 runtime validation 안내와
  `./valid.kr.md` 링크를 추가한다.

## P2: 전체 번역 쌍 재검토

- [x] `README.md`와 `README.kr.md`를 문단·표·링크·코드 주석 단위로 대조한다.
- [x] 모든 `src/rules/*/readme.md` / `readme.kr.md` 쌍을 문단·표·목록·링크·코드
  주석 단위로 대조한다.
- [x] `src/rules/event-handlers/migration.md` / `migration.kr.md`를 P1 수정 뒤 다시
  대조한다.
- [x] `src/rules/no-unknown-namespaces/migration.md` / `migration.kr.md`를 P1 수정
  뒤 다시 대조한다.
- [x] `src/rules/no-innerhtml/readme.md` / `readme.kr.md`에서 한국어가 영문 한
  code block을 둘로 나눈 것이 의도된 것인지 검토한다. invalid/valid 예제의 맥락과
  내용이 원문에 대응하지 않으면 같은 구조로 고친다.

## 최종 검증

- [x] 영문·한국어 문서를 fixture 원본까지 포함해 수동 대조한다.
- [x] `git diff --check`를 실행한다.
- [x] `npm run lint -- --quiet`를 실행한다.
