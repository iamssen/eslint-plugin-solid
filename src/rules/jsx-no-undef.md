# jsx-no-undef

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
JSX 내부에서 사용된 컴포넌트(`HelloWorld`)나 변수 등이 스코프 내에 선언되지 않았을 때(Undefined) 미리 경고나 오류를 발생시켜 런타임 에러를 방지합니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** JavaScript/JSX 문법 검사의 기본 요소입니다.

## 3. 그 외 규칙 이해를 위한 설명

Solid.js에서는 특별하게 **커스텀 지시자(Custom Directives)**를 사용할 수 있습니다(`use:directiveName`). 이 규칙은 단순히 태그 이름뿐만 아니라, 이러한 지시자에 바인딩된 변수가 스코프 내에 올바르게 정의되어 있는지도 함께 파악하고 검사합니다. *(커스텀 지시자에 대한 자세한 설명과 예제는 문서 하단을 참고하세요.)*

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (선언되지 않은 컴포넌트와 지시자 사용)
function App() {
  // MyComponent 가 import 되거나 선언되지 않았습니다.
  // clickOutside 함수도 정의되지 않았습니다.
  return <MyComponent use:clickOutside={() => {}} />; 
}

// ✅ 올바른 예시
import MyComponent from './MyComponent';
import { clickOutside } from './directives';

function App() {
  return <MyComponent use:clickOutside={() => {}} />;
}
```

---

## 5. 💡 보충 설명: Solid.js의 커스텀 지시자(Directives)란?

Solid.js의 `use:` 지시자는 컴포넌트를 위한 Mixin(믹스인)이라기보다는, **DOM 요소에 재사용 가능한 행동(Behavior)을 쉽게 부착(Attach)하기 위한 문법적 설탕(Syntactic Sugar)**입니다. (Svelte의 `use:action`이나 Vue의 커스텀 디렉티브와 매우 유사합니다.)

예를 들어 `<div use:clickOutside={handler} />` 라고 작성하면, Solid.js 컴파일러는 내부적으로 요소가 DOM에 렌더링될 때 아래와 같은 일반 함수를 실행해 줍니다:
`clickOutside(div요소_참조, () => handler)`

즉, `clickOutside`라는 함수는 첫 번째 인자로 **DOM 엘리먼트 자체(ref)**를 받고, 두 번째 인자로 **전달된 값의 접근자(Accessor)**를 받게 됩니다. 이를 통해 외부 클릭 감지, 드래그 앤 드롭 등 반복적으로 쓰이는 순수 DOM 제어 로직을 깔끔하게 외부로 분리할 수 있습니다.

### 커스텀 지시자 구현 및 사용 예제 코드

아래는 외부 클릭을 감지하는 커스텀 지시자를 직접 만들고 사용하는 간단한 예제입니다:

```javascript
import { onCleanup } from "solid-js";

// 1. 커스텀 지시자 함수 정의 (외부 파일로 분리 가능)
// 매개변수 1: 적용된 DOM 요소 자체 (el)
// 매개변수 2: 전달받은 값을 리턴하는 함수 (accessor)
function clickOutside(el, accessor) {
  const onClick = (e) => {
    // 클릭된 요소가 el 내부가 아니라면 전달받은 콜백 함수 실행
    if (!el.contains(e.target)) {
      accessor()();
    }
  };
  
  document.body.addEventListener("click", onClick);
  
  // 요소가 파괴될 때 이벤트 리스너 제거
  onCleanup(() => document.body.removeEventListener("click", onClick));
}

// 2. 컴포넌트에서 지시자 사용
function Modal() {
  // 모달을 닫는 함수
  const closeModal = () => console.log("모달 닫기!");

  return (
    // 💡 use:clickOutside={closeModal} 형태로 부착합니다.
    // 린터(jsx-no-undef)는 clickOutside 함수가 스코프 내에 존재하는지 검사합니다.
    <div class="modal-background">
      <div class="modal-content" use:clickOutside={closeModal}>
        이 모달 밖을 클릭하면 닫힙니다.
      </div>
    </div>
  );
}
```

*참고: TypeScript 환경에서 `use:` 지시자를 사용하려면 `solid-js`의 JSX 네임스페이스를 확장하여 지시자의 타입을 선언해주어야 합니다.*

### 구조적 설계 관점: 권장되는 패턴인가요?

네, 커스텀 지시자(Custom Directives)는 Solid.js 공식 문서에서도 소개하고 권장하는 **매우 강력하고 표준적인 패턴**입니다. 하지만 모든 곳에 남용해서는 안 되며, 장단점을 명확히 이해하고 적재적소에 사용하는 것이 중요합니다.

#### 👍 장점 (Pros)
1. **컴포넌트 트리 평탄화 (Flat Tree)**: 단순히 돔(DOM) 이벤트를 다루기 위해 불필요한 래퍼(Wrapper) 컴포넌트를 만들거나 `ref`를 이리저리 전달할 필요가 없어집니다.
2. **높은 재사용성과 관심사 분리**: 특정 기능(예: `clickOutside`, `draggable`, `intersectionObserver`)이 컴포넌트 내부 로직과 완전히 분리된 독립적인 순수 함수로 작성되므로, 어디서든 쉽게 재사용이 가능합니다.
3. **완벽한 수명 주기 관리**: 지시자 함수 내부에서 `onCleanup`을 사용하면 해당 DOM 엘리먼트가 화면에서 사라질 때(Unmount) 이벤트 리스너가 자동으로 깔끔하게 정리됩니다. 메모리 누수를 방지하기 좋습니다.

#### 👎 단점 및 주의할 점 (Cons & Risks)
1. **타입스크립트(TypeScript) 지원의 번거로움**: 일반적인 `props`와 달리 `use:` 지시자는 기본적으로 타입 추론이 되지 않습니다. `declare module "solid-js" { namespace JSX { interface Directives { ... } } }` 형태로 매번 타입을 확장해 주어야 하는 약간의 번거로움이 존재합니다.
2. **명시성(Explicitness) 저하**: 코드를 처음 보는 사람은 `use:myDirective`가 내부적으로 DOM을 어떻게 조작하고 있는지 파악하기 어려울 수 있습니다. 즉, 마법처럼 동작하는(Magic) 코드가 될 위험이 있습니다.
3. **상태 관리 오용**: 지시자는 "DOM 제어"를 위해 만들어졌습니다. 애플리케이션의 복잡한 비즈니스 로직이나 리액티브 상태(State) 관리를 지시자 내부로 욱여넣으려고 하면 설계가 꼬일 수 있습니다.

> **💡 요약 가이드**: 
> 일반적인 컴포넌트 렌더링 로직이나 상태 관리는 보통 하던 대로 컴포넌트 트리와 Hook(`createSignal` 등)에 맡기세요. 
> 하지만 **"특정 DOM 엘리먼트에 직접 접근해서 저수준(Low-level)의 이벤트 리스너나 브라우저 API(ResizeObserver 등)를 붙여야 할 때"**는 커스텀 지시자를 적극적으로 도입하는 것이 훌륭한 설계 선택입니다.

---

## 🧐 심화: 커스텀 컴포넌트(Custom Component)에 지시자 사용하기

`use:` 지시자는 태그의 종류(네이티브 DOM vs 커스텀 컴포넌트)에 따라 바벨(Babel) 컴파일러의 처리 방식이 다릅니다. 이 차이를 이해하면 더욱 유연한 설계가 가능합니다.

- **네이티브 DOM 태그 (`<div use:foo={bar} />`)**: 
  컴파일러가 이를 인지하고 `foo(엘리먼트, () => bar)` 형태의 독립적인 함수 호출 코드를 생성하여 실제로 돔에 즉시 부착합니다.
- **커스텀 컴포넌트 (`<MyComponent use:foo={bar} />`)**: 
  커스텀 컴포넌트는 단일 DOM을 가지지 않을 수도 있으므로, 컴파일러는 이를 즉시 함수 호출로 변환하지 않습니다. 대신 `"use:foo"`라는 이름의 **프로퍼티(Prop)**로 컴포넌트에 넘겨줍니다. (즉, `props["use:foo"]` 형태로 값이 전달됩니다.)

### 컴포넌트에서 지시자를 위임(Delegation)받아 처리하기

커스텀 컴포넌트에 지시자를 사용하는 것은 결코 잘못된 패턴이 아닙니다. (실제로 `eslint-plugin-solid`의 린터 테스트 케이스에서도 `<Component use:X />` 형태를 정상적인(Valid) 코드로 통과시킵니다!) 

다만, 컴포넌트 작성자가 전달받은 지시자 Prop을 내부의 실제 DOM 요소에 수동으로 연결해 주어야 합니다.

```javascript
// 💡 커스텀 컴포넌트 내부에서 지시자 처리하기
function MyComponent(props) {
  // 컴포넌트 사용자가 <MyComponent use:clickOutside={...} /> 로 넘긴 경우
  // props["use:clickOutside"] 에 접근할 수 있습니다.
  
  return (
    // 내부의 최상단 DOM에 전달받은 props를 전개(Spread)하거나 직접 적용하여
    // 지시자가 정상적으로 동작하도록 위임할 수 있습니다.
    <div {...props}>
      컴포넌트 내용
    </div>
  );
}
```

결론적으로, 커스텀 컴포넌트에 지시자를 부착하는 것은 **컴포넌트가 해당 지시자 prop을 내부 DOM에 올바르게 전달(Forwarding)하도록 설계되어 있다면 매우 훌륭하고 유효한 패턴**입니다. 개발자는 이 컴파일 차이점만 명확히 인지하고 있으면 됩니다.
