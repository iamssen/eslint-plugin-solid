# eslint-plugin-solid 작업 지침

## 먼저 보는 파일과 변경 위치

| 대상                 | 위치                                | 변경할 때 함께 확인할 것                     |
| -------------------- | ----------------------------------- | -------------------------------------------- |
| ESLint rule          | `src/rules/<rule-name>/`            | `rule.ts`, `rule.test.ts`, `readme.md`       |
| runtime 검증 근거    | `src/rules/<rule-name>/valid.md`    | prototype fixture, E2E 결과, rule 결정 이유  |
| rule 등록            | `src/plugin.ts`                     | `allRules`와 `.js` import                    |
| 공개 설정            | `src/index.ts`                      | `recommended`, `src/configs.test.ts`, README |
| 공용 AST/호환성 코드 | `src/utils.ts`, `src/compat.ts`     | 영향받는 모든 rule의 parser 조합             |
| 통합 fixture         | `cases/`                            | 빌드된 plugin으로 `cases/index.test.ts` 실행 |
| 사용자 문서          | `README.md`                         | 실제 package 이름·config·링크                |
| 마이그레이션 근거    | `docs/`, `Solid2-Migration-TODO.md` | 현재 Solid 2 동작과 일치 여부                |

`dist/`는 빌드 산출물이므로 직접 수정하지 않는다.

## 문서와 검증 근거

- `README.md`의 내용 구성은 아래를 포함한다.
  - Plug-in 설명
  - Node 및 ESLint 제한 사항을 적고, 이 Plug-in은 Solid.js 2.0만을 지원함을 명시한다.
  - 설치 방법
  - 설정 방법
  - Rule 관련 정보들
  - Contribution에 필요한 정보들 (기본 감춰진 상태면 더 좋다)
- `README.md`는 영어로 작성한다.
- `README.kr.md`는 `README.md`를 한국어로 번역한다.
- `src/rules/<rule-name>/readme.md`는 영어로 작성한다.
- `src/rules/<rule-name>/*.md`파일들을 `*.kr.md`로 번역한다.
- `*.md`와 `*.kr.md` 파일들은 상호간에 전환될 수 있도록 상단에 언어 선택 링크를 둔다.
- `docs/`의 문서들은 사용자에게 제공되는 문서가 아니므로 번역하지 않는다.
- rule의 runtime 의미를 prototype에서 확인했다면 해당 rule의 `valid.md`에 다음을 기록한다.
  - 해당 fixture 파일의 내용 (문서에서 코드 확인이 가능해야 합니다.)
  - 관찰한 결과
  - 그 결과가 rule의 허용·진단·autofix 범위에 미친 이유
  - 이 문서만으로 fixture의 내용을 알 수 있어야 함. fixture의 위치는 문서를 읽는 사람에게 중요하지 않음.
  - `valid.kr.md` 번역 문서 업데이트도 잊지 않는다.
- 원본 프로젝트 문구·URL을 복사하지 않는다. package는 `@ssen/eslint-plugin-solid`이고
  metadata 및 문서 링크는 이 하드 포크의 GitHub 경로를 사용한다.

## Rule 변경 체크리스트

1. 기존 rule의 의도와 Solid 2 API를 먼저 확인한다. Solid 1 전용 동작은 유지하지 않는다.
2. 구현은 `src/rules/<rule-name>/rule.ts`에 둔다. 새 rule은 `src/plugin.ts`에 등록한다.
3. RuleTester에는 valid, invalid, 경계·회귀 사례를 실제 Solid 사용 패턴으로 추가한다.
4. AST 변경에서는 JSX/TypeScript parser 차이, scope, type guard, alias import를 검토한다.
5. 자동 수정은 의미를 보존할 때만 제공한다. 확신할 수 없으면 report-only로 둔다.
6. 여러 파일의 실제 ESLint 처리 또는 runtime 의미가 관련되면 `cases/` 또는 prototype으로
   검증한다. prototype E2E를 새로 추가했다면 `valid.md`도 갱신한다.

테스트를 지우거나 skip으로 바꿔 실패를 숨기지 않는다. 제거된 Solid 1 API의 테스트는
Solid 2 대체 사례로 바꾸거나, 더 이상 유지할 근거가 없으면 삭제한다.

## 작업 단위와 검증

- 사용자의 기존 변경은 보존하고, 요청 범위 밖 파일은 수정하지 않는다.
- 의존성을 바꾸면 `package.json`과 `package-lock.json`을 함께 갱신한다.
- 하나의 rule 또는 응집된 문서/설정 변경을 작은 단위로 끝내고, 검증 후 커밋한다.
- 단순 rule 작업은 다음처럼 범위를 좁혀 시작한다.

```sh
npm run test:rule -- reactivity
npm run test:rule -- src/rules/no-destructure/rule.test.ts
```

- 변경 위험에 맞춰 다음 검사를 실행한다.

```sh
npm run lint
npm run type-check
npm run test:all
npm run build
npx vitest run cases/index.test.ts
```

`test:all`은 지원 parser 조합을 검증한다. `cases/index.test.ts`는 먼저 build한 뒤
실행해 배포 plugin 기준 fixture를 확인한다.

커밋 메시지와 PR 설명에는 변경 이유, 영향 rule, 실행한 검증 명령을 적는다.

## 안정적인 기술·프로젝트 제약

- Node.js 22 이상, ESLint 10 이상, strict TypeScript, ESM(`"type": "module"`)을 사용한다.
- 패키지 매니저는 `package-lock.json`을 기준으로 npm을 사용한다.
- Solid.js 2.0 이상만 지원한다. 기준 문서는 `docs/Solid2-beta-Migration-Guide.md`다.
- `src/rules/`는 rule 구현, `cases/`는 통합 fixture, `eslint.config.mjs`는 저장소 lint,
  `rollup.config.mjs`는 배포 번들/타입 선언 설정이다.
- 공개 rule/config 이름은 `src/plugin.ts`와 `src/index.ts`가 기준이다. 이 패키지는 단일
  `recommended` flat config를 공개한다.
