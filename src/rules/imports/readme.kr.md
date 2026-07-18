# imports

[English](./readme.md)

Solid 2 공개 API import 경계를 강제합니다.

## 기본 설정

이 rule은 `recommended`에서 warning으로 활성화됩니다.

```js
'@ssen/solid/imports': 'warn'
```

## 옵션

이 rule에는 옵션이 없습니다.

## 상세

Solid 2.0의 공개 API를 올바른 패키지에서 가져오도록 검사하고, 경로가 확정된 경우 자동 수정합니다.

## 패키지 경계

- `solid-js`: 반응성 primitive, control-flow 컴포넌트, store API, 렌더러 중립 타입
- `@solidjs/web`: DOM renderer와 웹 JSX 타입
- `@solidjs/h`, `@solidjs/html`, `@solidjs/universal`: 각각 hyperscript, HTML 태그 템플릿, 사용자 지정 renderer

Solid 1.x의 `solid-js/web`과 `solid-js/store`는 더 이상 올바른 import 경로가 아닙니다. store API는 `solid-js`에서, DOM renderer는 `@solidjs/web`에서 가져와야 합니다.

```ts
// 잘못된 예
import { createStore } from 'solid-js/store';
import { render } from 'solid-js/web';

// 권장
import { createStore } from 'solid-js';
import { render } from '@solidjs/web';
```

## 타입 import

`Component`, `Element`, `Store`처럼 renderer에 독립적인 타입은 `solid-js`에 둡니다. 웹 JSX의 `JSX`, `ComponentProps`는 `@solidjs/web`에서 가져옵니다.

```ts
// valid
import type { Component, Element, Store } from 'solid-js';
import type { ComponentProps, JSX } from '@solidjs/web';
```

웹 JSX 프로젝트는 TypeScript의 `jsxImportSource`도 `@solidjs/web`으로 설정해야 합니다.

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@solidjs/web"
  }
}
```

## 자동 수정 범위

이 규칙은 다음과 같이 목적지가 확정된 경로와 이름만 수정합니다.

- `solid-js/web`의 알려진 renderer export → `@solidjs/web`
- `solid-js/store`의 알려진 store export → `solid-js`
- `solid-js/h`, `solid-js/html`, `solid-js/universal` → 대응하는 `@solidjs/*` 패키지
- `solid-js/jsx-runtime`, `solid-js/jsx-dev-runtime` → `@solidjs/web`의 대응 runtime entry point

제거되었거나 이름이 바뀐 Solid 1.x API는 이 규칙이 존재하지 않는 `solid-js` export로 자동 수정하지 않습니다. 예를 들어 `createResource`, `mergeProps`, `splitProps`, `Index`는 별도의 Solid 2.0 migration 진단에서 다룹니다.

한 import 선언에 서로 다른 목적지의 이름이 섞여 있으면 이 규칙은 모두 보고하지만 부분 자동 수정을 하지 않습니다. import 선언을 패키지별로 나누는 편이 안전하기 때문입니다.

alias와 namespace import는 이름의 실제 사용처를 안전하게 추론할 수 없으므로, 올바른 source에서의 사용은 그대로 허용합니다.
