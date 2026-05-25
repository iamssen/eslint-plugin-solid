# Fork 방향성

1. Monorepo를 해제하고 @iamssen/eslint-plugin-solid 만을 남깁니다.
2. pnpm, turbo 등 불필요한 복잡성을 최대한 제거합니다.
3. 기존 packages/eslint-solid-standalone은 별도의 문서 (eslint-solid-standalone.md)를 만들어서 빌드 및 사용 방식을 설명해놓고, 해당 패키지는 제거합니다.
4. ESLint v10 이전 버전 지원에 필요한 코드들이 프로젝트의 복잡성을 높이는지 분석해서 별도의 리포트 파일로 만들어주세요. 리포트를 보고 이전 버전 지원을 제거할지 판단하겠습니다.
