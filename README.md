# @ssen/eslint-plugin-solid

[한국어](./README.kr.md)

Solid.js-specific ESLint rules for reactivity, JSX, event handlers, and common React-pattern mistakes.
This package supports Solid.js 2.0 and later only.

## Requirements

- Node.js 22+
- ESLint 10+
- Solid.js 2.0+

## Installation

```sh
npm install --save-dev eslint @ssen/eslint-plugin-solid
```

To lint TypeScript files, also install `typescript-eslint` in your project.

```sh
npm install --save-dev typescript-eslint
```

## Configuration

This plugin provides a single flat config: `recommended`.

```js
// eslint.config.js
import solid from '@ssen/eslint-plugin-solid';

export default [solid.configs.recommended];
```

For TypeScript, configure the parser in your application while using the same Solid config.

```js
// eslint.config.js
import solid from '@ssen/eslint-plugin-solid';
import tseslint from 'typescript-eslint';

const recommended = solid.configs.recommended;

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ...recommended,
    languageOptions: {
      ...recommended.languageOptions,
      parser: tseslint.parser,
    },
  },
];
```

For a web JSX project using Solid 2, set TypeScript's JSX import source to
`@solidjs/web`.

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@solidjs/web"
  }
}
```

The config does not define environment globals. Add `languageOptions.globals` in your application config when needed.

## Rules

✔: enabled in `recommended`.

🔧: fixable with `eslint --fix` or an editor integration.

<!-- doc-gen RULES -->
| ✔ | 🔧 | Rule | Description |
| :---: | :---: | :--- | :--- |
| ✔ | 🔧 | [solid/components-return-once](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/components-return-once/readme.md) | Disallow early returns in components. Solid components only run once, so conditionals should be inside JSX. |
| ✔ | 🔧 | [solid/event-handlers](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/event-handlers/readme.md) | Enforce consistent names for standard DOM event handlers. |
| ✔ | 🔧 | [solid/imports](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/imports/readme.md) | Enforce Solid 2 imports from `solid-js` and `@solidjs/*` renderer packages. |
| ✔ |  | [solid/jsx-no-duplicate-props](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/jsx-no-duplicate-props/readme.md) | Disallow passing the same prop twice in JSX. |
| ✔ |  | [solid/jsx-no-script-url](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/jsx-no-script-url/readme.md) | Disallow `javascript:` URLs. |
| ✔ | 🔧 | [solid/jsx-no-undef](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/jsx-no-undef/readme.md) | Disallow undefined JSX component references. |
|  |  | [solid/no-array-handlers](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-array-handlers/readme.md) | Optionally disallow Solid array event handlers. |
| ✔ | 🔧 | [solid/no-destructure](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-destructure/readme.md) | Disallow destructuring props, which breaks Solid reactivity. |
| ✔ | 🔧 | [solid/no-innerhtml](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-innerhtml/readme.md) | Disallow the potentially unsafe `innerHTML` attribute. |
|  |  | [solid/no-proxy-apis](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-proxy-apis/readme.md) | Disallow APIs that require ES6 Proxy support. |
| ✔ | 🔧 | [solid/no-react-deps](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-react-deps/readme.md) | Disallow React-style dependency arrays in `createEffect` and `createMemo`. |
| ✔ | 🔧 | [solid/no-react-specific-props](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-react-specific-props/readme.md) | Disallow React-specific `className` and `htmlFor` props. |
| ✔ |  | [solid/no-solid-1-apis](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-solid-1-apis/readme.md) | Report APIs removed from Solid 2 and explain their migration direction. |
| ✔ |  | [solid/no-unknown-namespaces](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/no-unknown-namespaces/readme.md) | Report removed and unknown JSX namespaces in Solid 2. |
| ✔ | 🔧 | [solid/prefer-for](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/prefer-for/readme.md) | Prefer `<For />` to array mapping in JSX. |
|  | 🔧 | [solid/prefer-show](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/prefer-show/readme.md) | Prefer `<Show />` for conditional JSX. |
| ✔ |  | [solid/reactivity](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/reactivity/readme.md) | Ensure reactive values are used in tracked contexts. |
| ✔ | 🔧 | [solid/self-closing-comp](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/self-closing-comp/readme.md) | Require self-closing tags for components without children. |
| ✔ | 🔧 | [solid/style-prop](https://github.com/iamssen/eslint-plugin-solid/blob/main/src/rules/style-prop/readme.md) | Validate CSS property names and values in the `style` prop. |
<!-- end-doc-gen -->

<details>
<summary>Contributing</summary>

## Development

```sh
npm run lint
npm run type-check
npm test
npm run build
```

Run `npm run test:all` to test supported parser combinations.

To focus on one rule while developing, run `npm run test:rule -- <rule-name>`;
for example, `npm run test:rule -- reactivity`.

</details>
