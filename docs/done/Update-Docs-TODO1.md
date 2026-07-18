# AGENTS.md 문서 갱신 계획 (TODO1)

## 목적과 범위

이 계획은 2026-07-18에 갱신된 `AGENTS.md`의 문서 요구 사항을 공개 문서에
반영하기 위한 실행 순서다. 이번 작업의 범위는 `README.md`, `README.kr.md`, 및
`src/rules/*/*.md`의 문서 정합성이다. rule 구현, 테스트, 공개 설정, `docs/`의 기존
내부 문서, 그리고 빌드 산출물 `dist/`는 변경하지 않는다.

새 요구 사항은 다음과 같다.

- README 상단에서 이 패키지가
  [solidjs-community/eslint-plugin-solid](https://github.com/solidjs-community/eslint-plugin-solid)의
  하드포크임을 밝힌다.
- 각 rule의 영어 `readme.md` 상단에 간단한 설명, 기본 설정, 설정 가능한 옵션을
  코드로 제시한다.
- 영어 원문과 한국어 번역은 번역을 제외하고 같은 정보를 같은 구조로 제공한다.

현재 확인 결과, `README.md`에는 하드포크 고지가 없고 모든 rule README에는 위의
공통 상단 형식이 없다. 언어 전환 링크와 번역 파일은 이미 존재하지만, 이번에
추가하는 내용까지 양 언어에서 동등하게 유지해야 한다.

## 완료 기준

- [ ] `README.md`와 `README.kr.md`의 제목 및 언어 링크 바로 아래에 하드포크
  고지가 있고, 원본 프로젝트의 문구·URL을 복사하지 않으며 패키지명과 저장소 링크는
  이 포크의 실제 값(`@ssen/eslint-plugin-solid`, `iamssen/eslint-plugin-solid`)을 쓴다.
- [ ] 19개 모든 `src/rules/*/readme.md`가 제목·언어 링크 다음에 아래 순서로
  공통 안내를 가진다: 짧은 설명, `recommended` 기본 상태, 설정 가능한 옵션.
- [ ] 옵션이 없는 rule도 그 사실을 명시해 독자가 옵션 유무를 판단할 수 있다.
- [ ] 옵션이 있는 rule은 `rule.ts`의 `meta.schema`와 실제 테스트에 있는 값만
  코드 블록으로 문서화한다. 배열/객체/enum의 허용 형태, 기본값, 효과를 빠뜨리지
  않는다.
- [ ] 각 영어 README와 `readme.kr.md`는 번역을 제외하면 제목, 섹션 순서, 문단,
  목록, 표, 링크, 코드 블록, 설정 값이 대응한다.
- [ ] `valid.md`/`valid.kr.md`, `migration.md`/`migration.kr.md`가 있는 rule은
  이번 README 변경으로 링크나 언어 전환이 깨지지 않았는지 함께 확인한다.

## 실행 순서

### 1. 문서의 기준 데이터 확정

- [ ] `src/index.ts`를 기준으로 19개 rule의 `recommended` 상태와 severity를 표로
  만든다. 문서의 기본 설정은 실제 flat config를 그대로 반영한다.
- [ ] 각 `src/rules/<rule>/rule.ts`의 `meta.schema`, `defaultOptions`, `meta.docs`,
  `meta.fixable`을 대조한다. schema가 비어 있으면 “No options”로, 값이 있으면
  허용 값과 기본값을 기록할 근거로 삼는다.
- [ ] 규칙 문서에 이미 설명된 옵션/기본값이 구현과 다른 경우, 구현을 바꾸지 않고
  문서를 구현 기준으로 정정할 목록을 만든다. 애매한 schema 의미는 해당 rule의
  `rule.test.ts`로 확인한다.

### 2. README의 포크 정체성과 번역 동기화

- [ ] `README.md`의 언어 링크 바로 다음에, 이 저장소가
  `solidjs-community/eslint-plugin-solid`의 hard fork이며 Solid.js 2 전용으로
  유지된다는 짧은 영어 고지를 추가한다.
- [ ] `README.kr.md`의 같은 위치에 같은 의미의 한국어 고지를 추가한다.
- [ ] Rules 표의 패키지 규칙 접두사, 설치 명령, 설정 예제, rule 문서 링크가
  `@ssen/eslint-plugin-solid`과 `iamssen/eslint-plugin-solid`를 일관되게 가리키는지
  재검토한다. 원본 upstream URL은 하드포크 고지의 출처 링크에만 사용한다.
- [ ] 두 README의 표, 코드 블록, 기여 안내 접기 구조까지 문단 단위로 재대조한다.

### 3. 모든 rule README에 공통 상단 형식 추가

각 영어 `readme.md`에서 언어 링크 뒤, 기존 상세 설명 앞에 다음 내용을 추가한다.
한국어 `readme.kr.md`에는 동일한 위치·순서·코드 형태의 번역을 추가한다.

````md
<!-- Rule-specific one-sentence summary. -->

**Default configuration**

```js
// eslint.config.js
export default [
  {
    rules: {
      '@ssen/solid/<rule-name>': '<severity or option tuple>',
    },
  },
];
```

**Options**

<!-- Either “This rule has no options.” or schema-derived examples. -->
````

`recommended`에서 꺼진 rule은 기본 상태가 off임을 명시하고, 사용자가 활성화하는
설정 예제를 제시한다. `recommended`에서 켜진 rule은 실제 severity와 필요 시
기본 옵션을 표시한다. 새 문구의 heading 명칭은 기존 문서의 언어·톤에 맞추되,
모든 rule에서 같은 정보 순서를 유지한다.

- [ ] `components-return-once`, `event-handlers`, `imports`,
  `jsx-no-duplicate-props`, `jsx-no-script-url`, `jsx-no-undef`를 갱신한다.
- [ ] `no-array-handlers`, `no-destructure`, `no-innerhtml`, `no-proxy-apis`,
  `no-react-deps`, `no-react-specific-props`, `no-solid-1-apis`,
  `no-unknown-namespaces`를 갱신한다.
- [ ] `prefer-for`, `prefer-show`, `reactivity`, `self-closing-comp`,
  `style-prop`를 갱신한다.

### 4. 번역쌍과 관련 문서의 정합성 점검

- [ ] 위 19개 `readme.md` / `readme.kr.md` 쌍을 앞에서 뒤까지 대조한다. 한쪽에만
  설명, 제약, 옵션 예제, 링크, 코드 주석이 남지 않게 한다.
- [ ] `valid.md` / `valid.kr.md`가 있는 8개 rule과 `migration.md` /
  `migration.kr.md`가 있는 2개 rule에서 양방향 언어 링크, README에서의 참조 링크,
  기존 내용 동등성을 확인한다. 내용 변경은 불일치가 확인된 파일에 한정한다.
- [ ] 공개 문서가 아닌 `docs/`는 번역 대상으로 추가하지 않는다. 이 TODO 문서도
  실행 계획이므로 번역하지 않는다.

## 검증 및 검토 절차

- [ ] 문서 링크를 검사해 `README*.md`와 `src/rules/**/*.md`의 모든 상대 `.md` 링크가
  존재하는 대상 파일을 가리키는지 확인한다.
- [ ] 19개 rule마다 문서의 기본 rule name, severity, option 예제가 `src/index.ts`와
  `rule.ts`의 schema에 일치하는지 표로 대조한다.
- [ ] 영어/한국어 문서쌍의 heading 순서와 코드 블록 수를 비교하고, 차이는 언어별
  제목 번역만인지 수동으로 확인한다.
- [ ] `git diff --check`를 실행한다.
- [ ] 코드 변경이 없는 문서 작업이므로 필수 검증은 위 문서 대조와 diff 검사다.
  Markdown 링크 검사 도구나 formatter를 도입·실행하려면 그 변경 여부를 별도로
  검토한다.

## 작업 시 주의 사항

- 기존 사용자의 수정(`AGENTS.md` 포함)을 덮어쓰지 않는다.
- 실제 구현에 없는 옵션, 안전하지 않은 autofix, 또는 Solid 1 전용 사용법을 문서에
  추가하지 않는다.
- 자동 생성 표를 갱신해야 한다는 근거가 발견되지 않는 한 Rules 표의 정렬과 생성
  마커(`doc-gen`)는 보존한다.
- 문서 링크와 metadata는 이 하드포크의 GitHub 경로를 사용한다. upstream 링크는
  하드포크 관계를 설명하기 위한 단일 고지 외에는 추가하지 않는다.
