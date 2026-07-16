# jsx-no-undef

JSX에서 참조하는 컴포넌트와 Solid 제어 흐름 컴포넌트가 현재 스코프에 정의되어 있는지 검사합니다.

## JSX에서 이름이 해석되는 방식

`<Button />`은 HTML 문자열이 아니라 JavaScript 식별자 `Button`을 참조하는 JSX 표현식입니다. 따라서 import가 빠지거나 이름을 잘못 입력하면 브라우저에서 렌더링할 때까지 발견되지 않을 수 있습니다.

```tsx
import { For } from 'solid-js';

<For each={items}>{(item) => <li>{item.name}</li>}</For>
```

정의되지 않은 대문자 컴포넌트는 오류가 됩니다. `typescriptEnabled`와 `allowGlobals` 옵션으로 TypeScript 전용 검사 및 전역 scope 허용 방식을 조정할 수 있습니다. 이 규칙은 TypeScript의 전체 타입 검사나 import 해석기를 대체하지 않습니다.

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

## Solid 2.0의 `ref` directive factory

```tsx
// ref 값은 일반 JavaScript expression입니다.
import { clickOutside } from './directives';

<div ref={clickOutside(close)} />

const autofocus = (element) => element.focus();
const validate = () => (element) => element.checkValidity();
<input ref={[autofocus, validate()]} />
```

Solid 2.0에서는 `use:` directive가 제거되었습니다. `ref={factory(options)}` 내부의 `factory`와 `options`는 일반 JavaScript 식별자이므로, 이 규칙이 별도의 directive scope로 검사하지 않습니다. 해당 식별자의 미정의 여부는 기본 `no-undef` 또는 TypeScript가 검사합니다. 제거된 `use:` namespace는 `no-unknown-namespaces`가 진단합니다.

`allowGlobals: true`를 설정하면 전역 값도 허용합니다. 일부 알려진 Solid component 오류는 import 추가 suggestion을 제공합니다. 이 rule은 경로가 실제 파일을 가리키는지나 TypeScript 타입이 맞는지는 검사하지 않습니다.
