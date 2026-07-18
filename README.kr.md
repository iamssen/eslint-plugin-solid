# @ssen/eslint-plugin-solid

[English](./README.md)

[solidjs-community/eslint-plugin-solid](https://github.com/solidjs-community/eslint-plugin-solid)의
하드포크이며, Solid.js 2를 대상으로 독립적으로 유지 관리합니다.

반응성, JSX, event handler, 흔한 React 패턴 오류를 검사하는 Solid.js 전용 ESLint rule 모음입니다.
이 패키지는 Solid.js 2.0 이상만 지원합니다.

## 요구 사항

- Node.js 22 이상
- ESLint 10 이상
- Solid.js 2.0 이상

## 설치

```sh
npm install --save-dev eslint @ssen/eslint-plugin-solid
```

## 설정

이 plugin은 `recommended`라는 단일 flat config를 제공합니다.

```js
// eslint.config.js
import solid from '@ssen/eslint-plugin-solid';

export default [solid.configs.recommended];
```

TypeScript처럼 별도 파서를 사용하거나 기존 ESLint 구성에 플러그인을 추가하고 규칙을 조정하려면, 다음과 같이 설정할 수 있습니다.

```js
// eslint.config.js
import solid from '@ssen/eslint-plugin-solid';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@ssen/solid': solid,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...solid.configs.recommended.rules,
      // customize rules here
      '@ssen/solid/no-innerhtml': 'off',
    },
  },
];
```

Solid 2 web JSX 프로젝트는 TypeScript의 JSX import source를 `@solidjs/web`으로
설정합니다.

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@solidjs/web"
  }
}
```

이 config는 environment global을 정의하지 않습니다. 필요한 경우 애플리케이션 config의
`languageOptions.globals`에 추가하세요.

## Rules

✔: `recommended`에서 활성화됨.

🔧: `eslint --fix` 또는 editor integration으로 수정 가능.

|  ✔  | 🔧  | Rule                                                                                                                                     | 설명                                                                                                        |
| :-: | :-: | :--------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
|  ✔  | 🔧  | [solid/components-return-once](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/components-return-once/readme.kr.md)   | component의 조기 return을 금지합니다. Solid component는 한 번만 실행되므로 조건문은 JSX 안에 두어야 합니다. |
|  ✔  | 🔧  | [solid/event-handlers](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/event-handlers/readme.kr.md)                   | 표준 DOM event handler 이름을 일관되게 강제합니다.                                                          |
|  ✔  | 🔧  | [solid/imports](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/imports/readme.kr.md)                                 | `solid-js`와 `@solidjs/*` renderer package의 Solid 2 import를 강제합니다.                                   |
|  ✔  |     | [solid/jsx-no-duplicate-props](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/jsx-no-duplicate-props/readme.kr.md)   | 같은 JSX prop을 두 번 전달하는 것을 금지합니다.                                                             |
|  ✔  |     | [solid/jsx-no-script-url](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/jsx-no-script-url/readme.kr.md)             | `javascript:` URL을 금지합니다.                                                                             |
|  ✔  | 🔧  | [solid/jsx-no-undef](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/jsx-no-undef/readme.kr.md)                       | 정의되지 않은 JSX component 참조를 금지합니다.                                                              |
|     |     | [solid/no-array-handlers](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-array-handlers/readme.kr.md)             | Solid 배열 event handler를 선택적으로 금지합니다.                                                           |
|  ✔  | 🔧  | [solid/no-destructure](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-destructure/readme.kr.md)                   | 반응성을 깨는 props destructuring을 금지합니다.                                                             |
|  ✔  | 🔧  | [solid/no-innerhtml](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-innerhtml/readme.kr.md)                       | 잠재적으로 안전하지 않은 `innerHTML` attribute를 금지합니다.                                                |
|     |     | [solid/no-proxy-apis](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-proxy-apis/readme.kr.md)                     | ES6 Proxy 지원이 필요한 API를 금지합니다.                                                                   |
|  ✔  | 🔧  | [solid/no-react-deps](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-react-deps/readme.kr.md)                     | `createEffect`와 `createMemo`에서 React 스타일 dependency array를 금지합니다.                               |
|  ✔  | 🔧  | [solid/no-react-specific-props](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-react-specific-props/readme.kr.md) | React 전용 `className`과 `htmlFor` prop을 금지합니다.                                                       |
|  ✔  |     | [solid/no-solid-1-apis](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-solid-1-apis/readme.kr.md)                 | Solid 2에서 제거된 API와 migration 방향을 보고합니다.                                                       |
|  ✔  |     | [solid/no-unknown-namespaces](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-unknown-namespaces/readme.kr.md)     | Solid 2에서 제거되었거나 알 수 없는 JSX namespace를 보고합니다.                                             |
|  ✔  | 🔧  | [solid/prefer-for](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/prefer-for/readme.kr.md)                           | JSX의 array mapping 대신 `<For />`를 선호합니다.                                                            |
|     | 🔧  | [solid/prefer-show](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/prefer-show/readme.kr.md)                         | 조건부 JSX에 `<Show />`를 선호합니다.                                                                       |
|  ✔  |     | [solid/reactivity](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/reactivity/readme.kr.md)                           | 반응형 값이 tracked context에서 사용되는지 검사합니다.                                                      |
|  ✔  | 🔧  | [solid/self-closing-comp](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/self-closing-comp/readme.kr.md)             | 자식이 없는 component의 self-closing tag를 요구합니다.                                                      |
|  ✔  | 🔧  | [solid/style-prop](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/style-prop/readme.kr.md)                           | `style` prop의 CSS property 이름과 값을 검증합니다.                                                         |

<details>
<summary>기여하기</summary>

## 개발

```sh
npm run lint
npm run type-check
npm test
npm run build
```

지원 parser 조합은 `npm run test:all`로 확인합니다.

하나의 rule에 집중하려면 `npm run test:rule -- <rule-name>`을 실행합니다. 예를 들어
`npm run test:rule -- reactivity`를 사용할 수 있습니다.

</details>
