# no-unknown-namespaces

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js의 JSX 컴파일러는 `on:`, `use:`, `prop:`, `attr:`, `style:`, `class:`와 같은 특별한 네임스페이스 접두사를 해석하여 이벤트나 속성, 지시자를 DOM에 직접적이고 효율적으로 바인딩합니다. 만약 개발자가 오타를 내거나 지원하지 않는 임의의 네임스페이스(예: `custom:`)를 작성하면 예기치 않게 컴파일되거나 동작하지 않을 수 있으므로 이를 잡아냅니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 네임스페이스를 활용한 직접적이고 명시적인 바인딩 문법은 컴파일러의 핵심 최적화 방식 중 하나입니다.

## 3. 그 외 규칙 이해를 위한 설명
예를 들어 `on:click`은 이벤트 위임을 거치지 않고 직접 이벤트 리스너를 DOM에 연결하며, `use:directive`는 커스텀 액션을 요소에 연결하는 등 각 네임스페이스마다 중요한 프레임워크 수준의 역할이 부여되어 있습니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (존재하지 않는 네임스페이스 사용)
// 개발자가 'attr:'을 의도했으나 오타가 발생한 경우
<div atrr:id="my-div">Hello</div> 

// 'bind:' 같은 Svelte 스타일의 네임스페이스는 Solid에서 지원하지 않음
<input bind:value={mySignal} /> 

// ✅ 올바른 예시 (지원되는 공식 네임스페이스 사용)
<div attr:id="my-div">Hello</div>
<div class:active={isActive()}>Hello</div>
<button on:click={(e) => console.log('직접 바인딩된 이벤트')}>Click</button>
<div use:myDirective>Hello</div>
```
