# no-proxy-apis

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

Solid.js의 반응성 시스템 중 핵심인 상태 객체(Store)와 컴포넌트의 `props`는 내부적으로 자바스크립트의 **Proxy 객체**로 구현되어 있습니다. 이 Proxy 덕분에 속성에 접근하는 순간을 캡처하여 추적(Tracking)할 수 있습니다.

하지만 일부 개발팀이나 특정 프로젝트에서는 메모리 비용, 런타임 성능 최적화, 예측 가능성 등의 이유로 **Proxy 객체나 Store 계열 API를 완전히 배제하고, 오직 순수 Signal(`createSignal`)만으로 애플리케이션의 상태를 관리하고자 할 수 있습니다.**

이 규칙(`no-proxy-apis`)은 프로젝트 내에서 Proxy 관련 API를 엄격히 금지하기 위해 존재합니다. 구체적으로 다음과 같은 동작을 차단합니다:
1. `solid-js/store` 패키지의 임포트.
2. `new Proxy()` 또는 `Proxy.revocable()`의 직접 사용.
3. Proxy가 섞일 위험이 있는 불명확한 `mergeProps` 사용 패턴 (함수를 전달하거나 단일 인자만 전달하는 행위).
4. 함수 호출이나 멤버 표현식을 객체 내에서 스프레드(`...`)하는 행위 (Proxy의 getter가 의도치 않게 트리거되는 것을 방지).

## 2. Solid.js 2.0에서의 변경 여부

Solid.js 2.0에서는 반응성 모델에 대한 내부 구현이 일부 개선되고, `props` 자체가 Proxy 없이 동작하도록 변경될 계획(예: Destructuring 지원)이 논의되고 있습니다. 그러나 Store 모듈 자체는 복잡한 객체 상태 관리에 널리 쓰일 것이므로 여전히 Proxy를 사용합니다. 
따라서 "Proxy 의존도를 낮추고 순수 Signal만 사용하겠다"는 아키텍처 규칙을 강제하고자 한다면 2.0에서도 이 규칙은 여전히 유용합니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

> 💡 **참고**: 이 규칙은 일반적인 Solid.js 개발 환경에서는 기본적으로 **꺼져(Disabled) 있는 규칙**입니다. 오직 "Store와 Proxy를 절대 사용하지 않는 아키텍처"를 고수하는 특정 환경에서만 활성화해서 사용하세요.

### ❌ 잘못된 사용 예 (Proxy 계열 및 위험 패턴 사용)

아래의 코드들은 모두 이 규칙에 의해 오류로 감지됩니다.

```jsx
// ❌ 1. solid-js/store 사용 금지
import { createStore } from "solid-js/store";

// ❌ 2. 자바스크립트 내장 Proxy 사용 금지
const obj = new Proxy(target, handler);

// ❌ 3. 함수 호출 결과를 전개 연산자(Spread)로 사용하는 행위 금지
// (반환값이 Proxy일 수 있고, 의도치 않은 반응성 오류를 야기할 수 있음)
let el = <div {...maybeSignal()} />;
let el2 = <div {...maybeProps.foo} />;

// ❌ 4. 함수 인자가 포함된 mergeProps 사용 금지
// (명확한 객체 리터럴과의 병합만 허용됨)
let merged = mergeProps(() => ({ a: 1 }), props);
```

### 🟢 올바른 사용 예 (안전하고 명확한 객체 처리)

순수한 Signal을 사용하거나, 객체를 다룰 때 명확하고 정적인 리터럴 형태를 유지해야 합니다.

```jsx
// 🟢 createSignal 등 기본 반응형 API만 사용
import { createSignal } from "solid-js";

// 🟢 명시적인 객체 리터럴과의 mergeProps는 허용
const defaultOptions = { color: 'blue' };
let merged = mergeProps(defaultOptions, props);

// 🟢 변수에 담긴 객체의 스프레드는 허용
let obj = { class: "btn" };
let el = <div {...obj} />;
```
