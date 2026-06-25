# no-destructure

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

Solid.js 1.0에서 컴포넌트의 `props`는 일반적인 자바스크립트 객체가 아니라 **Proxy 객체**로 구현되어 있습니다. 이 Proxy는 속성에 접근(getter)할 때마다 접근을 추적하여, 값이 변경되면 해당 속성을 참조하는 컴포넌트나 이펙트(Effect)를 다시 실행(Re-render)할 수 있도록 돕습니다.

하지만 자바스크립트의 **구조 분해 할당(Destructuring)**을 사용하면, 변수가 선언되는 시점에 `props`의 속성 값을 즉시 읽어오게 됩니다. 이렇게 되면 반응성(Reactivity) 추적 컨텍스트 밖에서 값이 평가되므로 반응성을 잃게 됩니다. 결국 `props`가 변경되더라도 컴포넌트가 다시 렌더링되지 않는 버그가 발생합니다. 

이 규칙은 개발자가 실수로 `props`를 구조 분해 할당하여 반응성을 잃는 것을 방지하기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

**Solid.js 2.0에서는 구조 분해 할당에 대한 지원이 컴파일러 단에서 도입될 예정입니다.** 
즉, 바벨(Babel) 컴파일러가 구조 분해 할당된 변수를 추적 가능한 getter로 자동 변환해주기 때문에, 더 이상 반응성을 잃지 않게 됩니다. 따라서 Solid.js 2.0 환경에서는 이 규칙(`no-destructure`)의 필요성이 사라지며, 기본적으로 비활성화되거나 사용하지 않아도 무방해질 것입니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (반응성 상실)

다음 코드에서는 `props`를 구조 분해 할당하여 `name`을 가져오고 있습니다. 이 경우 부모 컴포넌트에서 `name` 값을 변경하더라도, `Greeting` 컴포넌트는 새로운 이름으로 다시 렌더링되지 않습니다.

```jsx
// ❌ 구조 분해 할당으로 인해 'name'의 반응성을 잃게 됨
function Greeting({ name }) {
  return <div>Hello, {name}!</div>;
}
```

### 🟢 올바른 사용 예 (반응성 유지)

반응성을 유지하려면 `props.name` 형태로 필요할 때마다 속성에 접근하거나, `mergeProps` 및 `splitProps`와 같은 Solid.js의 유틸리티 함수를 사용해야 합니다.

```jsx
// 🟢 props 속성에 직접 접근하여 반응성을 유지함
function Greeting(props) {
  return <div>Hello, {props.name}!</div>;
}

// 🟢 만약 props를 분리해야 한다면 splitProps를 사용합니다
function Button(props) {
  const [local, others] = splitProps(props, ["children", "class"]);
  return (
    <button class={local.class} {...others}>
      {local.children}
    </button>
  );
}
```

### 시각적 요약

- **`{ name } = props` 실행 시**: Proxy의 getter가 변수 선언 시점에 단 한 번만 실행되어 당시의 값을 변수에 단순히 복사합니다. 이후 추적 연결고리가 끊어집니다.
- **`props.name` 사용 시**: JSX 템플릿 안에서 평가될 때 Proxy의 getter가 실행되면서, Solid의 반응성 시스템에 "이 속성 값이 바뀌면 템플릿을 다시 업데이트하라"고 등록(Subscribe)되어 반응성이 유지됩니다.
