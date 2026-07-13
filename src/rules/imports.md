# imports

Solid API를 올바른 패키지에서 가져오도록 검사하는 규칙입니다. `solid-js`, `solid-js/web`, `solid-js/store`에서 공개되는 것으로 알려진 값과 타입의 import source를 확인하고, 잘못된 source는 자동 수정할 수 있습니다.

## 패키지 경계

`solid-js`에는 반응성 primitive와 control-flow component가, `solid-js/web`에는 DOM renderer와 browser/web 기능이, `solid-js/store`에는 Proxy 기반 store API가 있습니다. 이름이 비슷하다고 해서 모든 API가 같은 entry point에서 export되는 것은 아니며, bundler의 export condition도 영향을 받을 수 있습니다.

```ts
// 잘못된 예
import { createEffect } from 'solid-js/web';
import { render } from 'solid-js';

// 권장
import { createEffect } from 'solid-js';
import { render } from 'solid-js/web';
```

이 규칙은 모든 React API 사용을 검사하는 규칙이 아니며, 구현에 등록된 Solid 심볼 목록을 기준으로 동작합니다. 새 Solid API를 다룰 때는 해당 목록과 테스트도 함께 갱신해야 합니다.

## 예제로 보는 동작

반응성 API, browser renderer, store API는 entry point가 다릅니다.

```ts
// valid
import { createSignal, createEffect } from 'solid-js';
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';
```

`createEffect`는 browser renderer API가 아니므로 아래는 invalid입니다.

```ts
// invalid
import { createEffect } from 'solid-js/web';

// autofix
import { createEffect } from 'solid-js';
```

수정 대상의 import가 이미 있다면 rule은 import를 중복 생성하지 않고 합칩니다.

```ts
// before: invalid
import { createEffect } from 'solid-js/web';
import { createSignal } from 'solid-js';

// after
import { createSignal, createEffect } from 'solid-js';
```

alias와 namespace import는 그대로 허용됩니다. 예를 들어 `import { mergeProps as merge } from 'solid-js'`와 `import * as Solid from 'solid-js'`는 valid입니다. 이 rule은 등록된 Solid export 목록만 검사하므로, 목록에 없는 새 API의 source까지 추론하지는 않습니다.
