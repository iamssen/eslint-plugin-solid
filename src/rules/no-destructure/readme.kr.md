# no-destructure

[English](./readme.md)

컴포넌트 props를 함수 매개변수나 변수 선언에서 구조 분해하지 않도록 검사합니다. Solid props는 반응형 getter를 포함할 수 있어, 일반적인 구조 분해는 값을 읽은 시점의 값으로 만들고 이후 변경 추적을 잃을 수 있습니다.

## React와 다른 점

React 함수 컴포넌트에서는 매 렌더마다 새 props 객체를 읽으므로 `({ title })`가 자연스럽습니다. Solid의 props는 호출 시점에 한 번 꺼내는 일반 값이 아니라, 부모의 변경을 읽기 시점에 반영하는 반응형 객체입니다. `const { title } = props`는 getter를 호출해 현재 값을 일반 변수에 저장하므로, JSX가 `title`을 읽어도 부모 변경에 대한 의존성이 연결되지 않습니다.

```tsx
// 잘못된 예
const Component = ({ title }) => <h1>{title}</h1>;

// 권장
const Component = (props) => <h1>{props.title}</h1>;
```

props 일부를 나누어 전달해야 하면 `omit`을 사용합니다. 이 규칙은 주로 JSX를 반환하는 컴포넌트의 props 구조 분해를 자동 수정합니다. 다만 parameter default는 명시적인 `undefined`를 기본값으로 바꾸는 JavaScript 의미를 가지며, Solid 2의 `merge`는 `undefined`도 덮어쓰기 값으로 취급합니다. 따라서 default가 있는 구조 분해는 안전하게 자동 수정하지 않고 report-only로 남깁니다.

구조 분해가 항상 문법적으로 불가능하다는 뜻은 아닙니다. 이미 accessor를 prop으로 전달했거나 반응성 추적이 필요 없는 값이라면 별도 판단이 필요하지만, 컴포넌트 props에는 직접 접근하는 것이 기본적으로 안전합니다.

## 예제로 보는 동작

React에서 익숙한 component parameter 구조 분해는 Solid props의 getter를 한 번 읽어 일반 값으로 만들기 때문에 invalid입니다.

```tsx
// invalid
const Title = ({ text }) => <h1>{text}</h1>;

// valid
const Title = (props) => <h1>{props.text}</h1>;
```

alias, 기본값, rest도 같은 이유로 검사합니다. rule은 가능한 경우 `props` access로 자동 수정합니다.

```tsx
// invalid
const Card = ({ title: heading = 'Untitled' }) => <article>{heading}</article>;

// 자동 수정하지 않음: `merge({ title: 'Untitled' }, props)`는
// title={undefined}를 'Untitled'로 바꾸지 않는다.
const Card = ({ title: heading = 'Untitled' }) => <article>{heading}</article>;
```

rest prop이 포함된 복합 수정은 결과를 반드시 확인해야 합니다. 반면 JSX component가 아닌 일반 함수의 객체 구조 분해는 valid입니다.

```ts
// valid: Solid props가 아닌 일반 객체
function formatUser({ name }: { name: string }) {
  return name.toUpperCase();
}
```

props 일부를 분리해 전달하려면 `const rest = omit(props, 'title')`를 사용합니다. `omit`은 rest props 객체 하나를 반환하며, 1.x의 `splitProps`처럼 tuple을 반환하지 않습니다.
