# jsx-no-undef

JSX에서 참조하는 컴포넌트, 변수, Solid 제어 흐름 컴포넌트 및 `use:` directive가 현재 스코프에 정의되어 있는지 검사합니다.

## JSX에서 이름이 해석되는 방식

`<Button />`은 HTML 문자열이 아니라 JavaScript 식별자 `Button`을 참조하는 JSX 표현식입니다. 따라서 import가 빠지거나 이름을 잘못 입력하면 브라우저에서 렌더링할 때까지 발견되지 않을 수 있습니다. `use:tooltip`의 `tooltip`도 컴파일러가 호출할 함수이므로 동일한 scope 검사가 필요합니다.

```tsx
import { For } from 'solid-js';
import { clickOutside } from './directives';

<For each={items}>{(item) => <div use:clickOutside={item} />}</For>
```

정의되지 않은 대문자 컴포넌트나 directive는 오류가 됩니다. `typescriptEnabled`, `allowGlobals`, `allow` 등의 옵션으로 TypeScript 전용 전역 및 예외를 조정할 수 있습니다. 이 규칙은 TypeScript의 전체 타입 검사나 import 해석기를 대체하지 않습니다.

## 예제로 보는 동작

JSX component 이름은 현재 JavaScript scope에서 찾을 수 있어야 합니다.

```tsx
// invalid: Button이 선언되거나 import되지 않음
<Button />

// valid
import { Button } from './Button';
<Button />
```

Solid control-flow component도 일반 식별자입니다. `For`를 JSX에서 썼다면 import가 필요합니다.

```tsx
// invalid: For가 없음
<For each={items}>{(item) => <li>{item}</li>}</For>

// valid
import { For } from 'solid-js';
<For each={items}>{(item) => <li>{item}</li>}</For>
```

`use:` 뒤의 이름도 directive 함수 참조입니다.

```tsx
// invalid: clickOutside가 선언되지 않음
<div use:clickOutside={close} />

// valid
import { clickOutside } from './directives';
<div use:clickOutside={close} />
```

`allow`에는 프로젝트 전역 component 이름을, `allowGlobals: true`에는 전역 값 허용을 설정할 수 있습니다. 일부 알려진 Solid component 오류는 import 추가 suggestion을 제공합니다. 이 rule은 경로가 실제 파일을 가리키는지나 TypeScript 타입이 맞는지는 검사하지 않습니다.
