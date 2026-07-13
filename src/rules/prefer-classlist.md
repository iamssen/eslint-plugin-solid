# prefer-classlist

`cn`, `clsx`, `classnames` 같은 class name 조합 함수로 조건부 클래스를 만들 때 Solid의 `classList`를 사용하도록 안내합니다. 기본으로 이 세 함수 이름을 인식하며, `classnames` 옵션으로 목록을 지정할 수 있습니다.

Solid의 `class`와 `classList`는 React의 `className`과 이름만 다른 기능이 아닙니다. `classList`는 `{ className: boolean }` 객체의 각 boolean을 추적해 개별 class token을 추가·제거합니다. 여러 조건부 class를 외부 문자열 조합 함수로 만들면 Solid 컴파일러가 각 조건을 직접 추적하기 어렵고, 클래스 이름 정책도 별도 함수에 의존하게 됩니다.

```tsx
// 잘못된 예
<div class={cn({ active: isActive() })} />

// 권장
<div classList={{ active: isActive() }} />
```

정적 클래스나 단순한 문자열 조합을 모두 금지하는 규칙은 아닙니다. `classList`는 조건부 클래스가 여러 개일 때 특히 읽기 쉬운 대안이며, 단일 조건에서는 기존 `class` 표현식이 더 적절할 수도 있습니다.

## 예제로 보는 동작

기본적으로 `cn`, `clsx`, `classnames`에 조건부 class object를 넘기는 코드는 invalid입니다.

```tsx
// invalid
<button class={cn({ primary: props.primary, disabled: props.disabled })} />

// autofix 후: valid
<button classList={{ primary: props.primary, disabled: props.disabled }} />
```

`className`을 써도 같은 방식으로 수정합니다.

```tsx
// invalid → <div classList={{ selected: selected() }} />
<div className={clsx({ selected: selected() })} />
```

기본 목록에 없는 함수는 rule이 class name helper인지 알 수 없으므로 valid입니다.

```tsx
// valid: x는 기본 인식 함수가 아님
<div class={x({ selected: selected() })} />
```

이 함수도 class name helper라면 옵션에 등록합니다.

```json
{ "classnames": ["cn", "clsx", "x"] }
```

등록 뒤에는 `x({ selected: true })`도 invalid입니다. 정적 `class="card"`나 일반 문자열 expression은 이 rule의 대상이 아닙니다.
