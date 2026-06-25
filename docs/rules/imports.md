# imports

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

Solid.js는 기능의 종류에 따라 모듈을 여러 패키지(예: `solid-js`, `solid-js/web`, `solid-js/store`)로 분리하여 제공합니다. 
예를 들어 `createSignal`, `createEffect`와 같은 코어 API는 `solid-js`에서 가져와야 하지만, 브라우저 DOM 렌더링과 관련된 `render`나 `hydrate` 같은 함수는 `solid-js/web`에서 가져와야 합니다. 

만약 개발자가 자동 완성(Auto-import) 기능의 실수 등으로 코어 API를 `solid-js/web`에서 가져오거나 반대로 사용할 경우, 런타임 에러가 발생하거나 번들 크기 최적화에 문제가 생길 수 있습니다.

이 규칙은 개발자가 Solid.js의 내장 함수와 타입들을 올바른 패키지 경로에서 가져오고 있는지 검사하고, 잘못된 경로가 있다면 자동으로 수정(Auto-fix)해 주기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

Solid.js 2.0에서도 핵심 API(`solid-js`), 웹 전용 API(`solid-js/web`), 스토어 API(`solid-js/store`) 등으로 모듈을 분리하는 구조적 철학은 유지될 것으로 예상되므로, 이 규칙은 2.0에서도 여전히 유효하며 중요하게 사용될 것입니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (경로 오지정)

`createEffect`는 코어 상태 관리 함수인데 웹 전용 패키지인 `solid-js/web`에서 불러오면 오류가 발생합니다. 반대로 `render`를 `solid-js`에서 불러오는 것도 잘못된 접근입니다.

```js
// ❌ 코어 함수를 웹 전용 패키지에서 가져옴
import { createEffect } from "solid-js/web";

// ❌ 렌더링 함수를 코어 패키지에서 가져옴
import { render } from "solid-js";
```

### 🟢 올바른 사용 예 (올바른 경로 지정)

기능의 목적에 맞는 패키지에서 정확하게 불러와야 합니다.

```js
// 🟢 올바른 경로에서 가져옴
import { createEffect, createSignal } from "solid-js";
import { render, hydrate } from "solid-js/web";
import { createStore } from "solid-js/store";
```

### 자동 수정 (Auto-fix) 작동 방식

이 규칙은 ESLint의 `--fix` 옵션을 통해 잘못된 가져오기 경로를 발견하면, 알맞은 패키지로 해당 import 문을 이동시키고 기존에 있던 올바른 import 문과 병합(Merge)해 줍니다.
