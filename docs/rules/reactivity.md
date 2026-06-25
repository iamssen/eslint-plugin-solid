# reactivity

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

Solid.js의 핵심은 **반응성(Reactivity)**입니다. `createSignal`이나 `createMemo` 등으로 만든 상태(State) 값들은 **추적 범위(Tracking Scope)** 안에서 접근될 때만 의존성으로 등록됩니다. 추적 범위란 `createEffect`, `createMemo`, 또는 JSX 템플릿 내부 등을 의미합니다.

만약 컴포넌트의 최상단이나 일반 함수 등 추적 범위 밖에서 신호(Signal)를 호출하여 값을 읽게 되면, Solid.js는 어떤 곳에서 해당 값을 사용하고 있는지 추적할 수 없습니다. 결과적으로 상태 값이 변경되더라도 관련된 UI가 업데이트되지 않는 심각한 버그가 발생합니다.

이 규칙은 개발자가 추적 범위 밖에서 반응형 값에 접근하는 실수를 방지하고, 반대로 반응형 값이 쓰이지 않는 곳(예: JSX에서 함수 호출 없이 속성으로 직접 전달하는 경우)에서 잘못 사용되는 것을 감지합니다.

## 2. Solid.js 2.0에서의 변경 여부

**이 규칙은 Solid.js 2.0에서도 여전히 중요하게 유지됩니다.**
Solid.js 2.0에서 컴파일러와 반응성 시스템에 많은 개선이 이루어지지만, "컴포넌트는 한 번만 실행되고 반응성은 추적 범위 안에서 발생한다"는 Solid.js의 핵심 패러다임은 변하지 않습니다. 따라서 추적 범위 밖에서 Signal을 읽는 것은 여전히 피해야 할 안티 패턴입니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (추적 불가)

아래 코드에서 `count()`는 컴포넌트 본문(추적 범위 밖)에서 호출되었습니다. `count` 값이 변경되어도 컴포넌트 함수가 다시 실행되지 않으므로(Solid.js의 컴포넌트는 한 번만 실행됨), `double` 값은 영원히 초기값의 두 배로 멈춰 있게 됩니다.

```jsx
// ❌ 추적 범위 밖에서 Signal 접근
function Counter() {
  const [count, setCount] = createSignal(1);
  
  // 컴포넌트가 처음 렌더링될 때 딱 한 번만 계산됨
  const double = count() * 2; 

  return <div>Double is: {double}</div>;
}
```

### 🟢 올바른 사용 예 (추적 유지)

계산된 값을 반응형으로 만들려면 파생된 신호(Derived Signal)인 함수로 만들거나, `createMemo`를 사용해야 합니다.

```jsx
// 🟢 파생된 함수 형태로 정의 (호출은 JSX 안에서 이루어짐)
function Counter() {
  const [count, setCount] = createSignal(1);
  
  // count()를 호출하는 함수 자체를 만듦
  const double = () => count() * 2; 

  // JSX(추적 범위) 내부에서 double()이 호출되므로 반응성이 유지됨
  return <div>Double is: {double()}</div>;
}
```

### 시각적 요약

- **컴포넌트 바디(Component Body)**: 단 1회 실행됨. (이곳에서 Signal을 읽으면 초기값만 읽힘)
- **추적 범위(Tracking Scope, 예: JSX, createEffect)**: 의존성이 변경될 때마다 다시 실행됨. (이곳에서 Signal을 읽어야 함)
