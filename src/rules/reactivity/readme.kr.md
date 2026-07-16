# reactivity

[English](./readme.md)

Solid signal, memo, props, store 등의 반응형 값을 추적되지 않는 위치에서 읽거나 잘못된 방식으로 다루는 패턴을 검사합니다. Solid는 반응형 값을 추적 스코프에서 읽을 때 의존성을 등록하므로, 일반 컴포넌트 본문에서 값을 미리 읽어 변수에 고정하면 이후 변경을 놓칠 수 있습니다.

## Solid의 핵심 실행 모델

React의 의존성 배열은 “다음 렌더에서 이 값을 비교할 것”을 선언합니다. Solid는 대신 `count()`나 `props.value`처럼 반응형 값을 **읽는 순간** 현재 실행 중인 reactive computation에 의존성을 등록합니다. 그래서 같은 값이라도 JSX expression, `createEffect` callback 안에서 읽으면 추적되지만, 컴포넌트 초기화 시 일반 변수에 복사하면 추적되지 않습니다.

```tsx
// 주의: props.value를 컴포넌트 실행 시점에 고정
const value = props.value;
return <div>{value}</div>;

// 권장: 반응형 읽기를 JSX 안에 둠
return <div>{props.value}</div>;
```

규칙은 반응형 값의 쓰기, 이름 없는 파생 값, 비동기/콜백 추적 스코프, JSX·연산식·템플릿 리터럴에서의 읽기 등을 상황별로 검사합니다. 사용자 정의 reactive 함수는 `{ customReactiveFunctions: ['customQuery'] }`로 등록할 수 있습니다.

모든 콜백에서 signal을 읽는 것이 오류라는 뜻은 아닙니다. 이벤트 핸들러나 `setTimeout`처럼 실행 시점에 최신 값을 읽는 것이 의도된 코드는 규칙의 진단과 실제 추적 필요성을 함께 검토해야 합니다.

비동기 callback 안의 읽기는 callback이 나중에 실행될 때 새로운 추적 computation을 자동으로 만들지 않습니다. callback이 반응형 UI를 갱신해야 한다면 effect 안에서 값을 읽어 dependency를 등록하거나, callback에서 setter를 호출해 별도의 반응형 값을 갱신하는 식으로 의도를 분명히 해야 합니다.

## 예제로 보는 동작

가장 흔한 오류는 반응형 값을 컴포넌트 초기화 중에 일반 변수로 고정하는 것입니다.

```tsx
function Profile(props) {
  const name = props.name; // invalid: 현재 값을 한 번만 읽음
  return <h1>{name}</h1>;
}

function Profile(props) {
  return <h1>{props.name}</h1>; // valid: JSX가 props.name을 추적
}
```

signal도 같은 원리입니다. signal accessor를 JSX나 reactive callback 안에서 호출해야 합니다.

```tsx
const [count, setCount] = createSignal(0);

const initial = count(); // invalid: 일반 변수에 고정
const doubled = createMemo(() => count() * 2); // valid: createMemo가 추적
```

초기 snapshot이 의도된 경우에는 `untrack` callback으로 그 의도를 명시합니다. 이 값은 이후 변경을 반영하지 않으므로, 렌더링에 쓸 값이라면 JSX나 memo로 읽어야 합니다.

```tsx
const initial = untrack(() => count()); // valid: 의도적인 한 번 읽기
```

이벤트 handler는 나중에 실행되는 “읽기”이며 dependency를 등록할 목적이 아니므로 valid입니다.

```tsx
// valid: 클릭 시점의 최신 count를 읽음
<button onClick={() => console.log(count())}>현재 값</button>
```

반대로 effect가 비동기 경계를 건너 읽은 값은 effect dependency가 되지 않습니다.

```ts
// invalid: count()는 setTimeout callback에서 읽혀 effect가 count를 추적하지 않음
createEffect(() => {
  setTimeout(() => console.log(count()), 100);
});

// valid: effect 실행 중에 count를 읽어 dependency를 등록
createEffect(() => {
  const current = count();
  setTimeout(() => console.log(current), 100);
});
```

Solid 2의 `createEffect`는 compute/apply 형태입니다. 첫 callback만 dependency를 등록하며, 두 번째 apply callback(또는 `{ effect, error }` bundle)은 계산된 값을 적용하고 setter를 호출하거나 cleanup을 반환할 수 있습니다. compute callback 안에서 signal/store setter를 호출하면 순환적인 갱신이 되므로 이 rule이 보고합니다.

```ts
// invalid: compute 단계에서 state를 다시 씀
createEffect(
  () => {
    setCount(1);
    return count();
  },
  (value) => console.log(value),
);

// valid: apply 단계에서 결과를 반영
createEffect(
  () => count(),
  (value) => setDisplay(value),
);
```

컴포넌트가 DOM에 반영된 뒤 한 번 실행해야 하는 작업에는 제거된 `onMount` 대신 `onSettled`를 사용합니다. 이 callback은 실행 시점 읽기와 async setter 작업을 허용하며, 반환한 cleanup도 component가 dispose될 때 실행됩니다.

```ts
onSettled(() => {
  const onResize = () => measureLayout();
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
});
```

Solid 2의 setter는 기본적으로 microtask 단위로 배치됩니다. 따라서 setter 직후 accessor를 읽으면 이전 값을 볼 수 있습니다. 여러 쓰기를 감싸던 1.x `batch`는 사용하지 않으며, 명령형 코드에서 즉시 최신 값이 꼭 필요한 경우에만 `flush()`를 명시적으로 호출합니다.

```ts
setFirstName('Ada');
setLastName('Lovelace');
// 다음 microtask 뒤 자동 반영

flush(); // 드문 동기 read가 필요한 경우에만
```

프로젝트의 custom primitive가 callback을 reactive scope로 실행한다면 옵션에 등록합니다.

```ts
// { customReactiveFunctions: ['createQuery'] }
createQuery(() => count()); // valid with the option
```

이 rule은 event listener, observer, 일부 `create*`/`use*` hook을 의도적으로 허용합니다. 진단을 고칠 때는 먼저 그 callback이 UI 갱신을 위해 dependency를 **등록**해야 하는지, 단지 실행 시점의 최신 값을 **읽기만** 하면 되는지 구분하세요.

`isPending(() => expression)`의 callback도 dependency를 등록하는 compute callback으로 처리합니다. 목록 callback은 `<For>`의 keyed mode에 따라 형태가 다릅니다. 기본 `<For>`는 `(item, indexAccessor)`이고, `<For keyed={false}>`는 `(itemAccessor, indexNumber)`입니다.

```tsx
<For each={items()} keyed={false}>
  {(item, index) => <li>{index}: {item().name}</li>}
</For>
```
