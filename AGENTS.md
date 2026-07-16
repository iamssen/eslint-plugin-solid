# eslint-plugin-solid 작업 지침

## 프로젝트 개요

이 저장소는 Solid.js 코드에 특화된 ESLint 플러그인입니다. Solid의 반응성, JSX 사용 방식,
이벤트 핸들러, 제어 흐름 및 React 패턴과 관련된 문제를 감지하는 ESLint 규칙과 설정을
TypeScript로 관리합니다.

현재 패키지는 원본 `eslint-plugin-solid`에서 분리된 하드 포크이며, 패키지 이름은
`@ssen/eslint-plugin-solid`입니다. 원본 프로젝트의 문서나 링크를 수정할 때는 이 저장소의
패키지명과 GitHub 경로가 맞는지 확인합니다.

## 기술 기준

- Node.js 22 이상
- ESLint 10 이상
- TypeScript의 strict 모드
- ESM(`"type": "module"`)
- 패키지 매니저는 `package-lock.json`을 기준으로 npm을 사용
- 소스 코드는 `src/`, 통합 테스트용 예제는 `cases/`에 둠
- Solid.js 2.0 이상만 지원함
  - docs/Solid2-beta-Migration-Guide.md 파일을 참고합니다.
  - Solid.js 1.0 를 위한 규칙은 제거됩니다.

## 주요 디렉터리와 파일

- `src/rules/`: ESLint 규칙 구현
  - 규칙은 `src/rules/{rule-name}/`와 같이 디렉터리로 분리합니다.
  - 각 디렉터리에는 구현(`rule.ts`), 단위 테스트(`rule.test.ts`), 개발자 문서(`readme.md`)를 둡니다.
  - 마이그레이션 근거나 유효 예제 같은 보조 문서도 해당 규칙 디렉터리에 둡니다.
  - 공용 RuleTester 헬퍼는 `src/rules/ruleTester.ts`에 둡니다.
- `src/plugin.ts`: 규칙을 플러그인에 등록하는 진입점
- `src/index.ts`: 플러그인과 단일 `recommended` flat config를 공개하는 진입점
- `src/utils.ts`, `src/compat.ts`: 여러 규칙에서 공유하는 유틸리티와 호환성 코드
- `cases/`: 실제 ESLint 설정으로 동작을 확인하는 통합 테스트 케이스
- `eslint.config.mjs`: 저장소 자체의 린트 규칙
- `rollup.config.mjs`: 배포 번들 및 타입 선언 빌드 설정

## 개발 명령

변경 후에는 가능한 범위에서 다음 검사를 실행합니다.

```sh
npm run lint
npm run type-check
npm test
npm run build
```

추가 파서 조합까지 확인해야 하는 변경은 다음을 사용합니다.

```sh
npm run test:all
```

코드 스타일은 저장소의 Prettier 및 ESLint 설정을 따릅니다. 포맷이 필요한 경우
`npm run format`을 사용하되, 변경 범위를 불필요하게 넓히지 않습니다.

## 문서 언어

- `README.md`는 패키지 사용자용 문서이므로 영어로 작성합니다.
- `src/rules/{rule-name}/readme.md`와 같은 규칙별 개발자 문서는 한국어로 작성합니다.

## 규칙을 추가하거나 수정할 때

1. 규칙 구현은 `src/rules/<rule-name>/rule.ts`에 작성합니다.
2. 규칙은 `src/plugin.ts`의 `allRules`에 등록하고, import는 `./rules/<rule-name>/rule.js`를 가리킵니다.
3. 정상 동작과 오류 동작을 모두 `src/rules/<rule-name>/rule.test.ts`에 추가합니다. 공용 헬퍼는 `../ruleTester.js`에서 가져옵니다.
4. 사용자-facing 규칙 설명은 `src/rules/<rule-name>/readme.md`에 추가하거나 갱신합니다. 보조 문서가 필요하면 같은 디렉터리에 둡니다.
5. 규칙 메타데이터, 메시지, 옵션 스키마 및 문서 URL은 `eslint.config.mjs`의 플러그인 규칙을
   만족해야 합니다.
6. 규칙 동작이 여러 파일의 실제 ESLint 처리와 관련되면 `cases/` 통합 테스트도 보강합니다.

기존 규칙의 의도와 호환성을 먼저 확인하고, AST 처리 변경 시에는 JSX/TypeScript 파서 차이,
범위(scope), 타입 가드, 자동 수정 가능 여부를 함께 검토합니다. 수정 가능한 규칙이라도
코드 의미를 바꿀 수 있는 자동 수정은 신중하게 다룹니다.

## 설정과 공개 API

공개되는 규칙명과 설정명은 `src/plugin.ts` 및 `src/index.ts`를 기준으로 합니다. 설정을
변경할 때는 레거시 설정과 flat config 양쪽의 동작, TypeScript 설정의 목적, README 예제를
함께 확인합니다. 배포 파일인 `dist/`는 소스 변경의 결과물이며 직접 수정하지 않습니다.

## 테스트 작성 원칙

- 단순한 규칙 동작은 해당 규칙의 RuleTester 테스트로 검증합니다.
- 유효한 코드와 오류 코드, 경계 조건 및 회귀 사례를 구분해 작성합니다.
- 테스트 케이스의 코드는 실제 Solid 사용 패턴을 반영하고, 테스트만 통과하기 위한 과도한
  예외 처리는 피합니다.
- 실패한 검사를 숨기거나 기존 테스트를 삭제해 문제를 회피하지 않습니다.

## 작업 및 변경 원칙

- 사용자의 기존 변경 사항을 보존하고, 요청 범위를 벗어난 파일은 수정하지 않습니다.
- 의존성 변경이 필요하면 `package.json`과 `package-lock.json`을 함께 갱신합니다.
- 새 규칙이나 동작 변경에는 테스트와 문서를 함께 반영합니다.
- 커밋 메시지나 PR 설명에서는 변경 이유, 영향받는 규칙, 실행한 검증 명령을 명확히 적습니다.
- README의 원본 프로젝트 관련 문구와 링크는 하드 포크 상태를 고려해 무조건 복사하지 말고,
  현재 패키지의 실제 사용법과 일치하는지 확인합니다.
