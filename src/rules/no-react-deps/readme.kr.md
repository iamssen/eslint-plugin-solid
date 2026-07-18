# no-react-deps

[English](./readme.md)

Solid 반응형 primitive의 React식 dependency array를 금지합니다.

## 기본 설정

이 rule은 `recommended`에서 warning으로 활성화됩니다.

```js
'@ssen/solid/no-react-deps': 'warn'
```

## 옵션

이 rule에는 옵션이 없습니다.

## 상세

`createEffect`와 `createMemo`에 React식 dependency array를 전달하지 않도록 검사합니다. Solid는 계산 함수 안에서 읽은 반응형 값을 자동으로 추적합니다.

## React의 dependency array와 다른 점

React의 `useEffect(fn, [a, b])`는 다음 render에서 effect를 다시 실행할 조건을 인자로 전달합니다. Solid의 `createEffect`와 `createMemo`는 callback을 실행하는 동안 signal, props, store를 읽어 dependency graph를 구성합니다. 따라서 dependency array는 Solid API의 설정값이 아니라 React 코드를 마이그레이션하면서 남은 잘못된 인자일 가능성이 큽니다.

```ts
// 잘못된 예
createEffect(() => console.log(count()), [count]);

// 권장: 자동 추적
createEffect(() => console.log(count()));
```

Solid 2에서는 effect의 계산과 적용을 분리합니다. 특정 값만 계산 단계에서 읽어 의존성을 제한하고, 적용 함수에서 부수 효과를 수행합니다.

```ts
createEffect(
  () => count(),
  (value) => console.log(value, other()),
);
```

이 규칙은 dependency array의 내용이 올바른지 검사하는 것이 아니라, 두 번째 인자로 전달된 배열을 제거하도록 안내합니다.

Solid 2에서 `createEffect`의 두 번째 인자는 apply 함수이고, `createMemo`의 두 번째 인자는 options입니다. 1.x의 initial value 인수는 제거되었으므로 숫자·문자열·boolean 같은 명확한 legacy value도 보고합니다. `undefined`는 생략한 인수와 같으므로 보고하지 않습니다.

## 예제로 보는 동작

React effect를 옮기면서 남은 dependency array는 invalid입니다. Solid는 callback 안에서 `count()`를 읽을 때 이미 `count`를 추적합니다.

```ts
// invalid
createEffect(() => console.log(count()), [count]);
createMemo(() => filter(items(), query()), [items, query]);

// autofix 후: valid
createEffect(() => console.log(count()));
createMemo(() => filter(items(), query()));
```

특정 값만 effect를 다시 실행시키고, apply callback 안의 다른 읽기는 추적하지 않게 하려면 compute/apply 형태를 사용합니다.

```ts
// valid: compute 단계에서 count만 의존성으로 선언
createEffect(count, (value) => {
  console.log(value, debugLabel());
});

// valid: 첫 실행을 건너뛰고 이후 변경만 적용
createEffect(count, (value) => {
  console.log('changed to', value);
}, { defer: true });
```

배열의 내용이 accessor인지 `count()` 호출 결과인지는 중요하지 않습니다. `createEffect(fn, [...])`처럼 두 번째 인자가 배열이면 React dependency array로 보고합니다. 반면 다른 함수의 일반 배열 인자까지 금지하지는 않습니다.
