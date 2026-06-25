# no-innerhtml

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

Solid.js의 JSX 요소에서 `innerHTML` 속성을 사용하면, 브라우저의 DOM에 직접 HTML 문자열을 주입(Inject)하게 됩니다. 이는 React의 `dangerouslySetInnerHTML`과 동일한 역할을 수행합니다.

`innerHTML`을 사용하면 XSS(Cross-Site Scripting, 크로스 사이트 스크립팅) 공격에 노출될 위험이 매우 높아집니다. 만약 검증되지 않은 사용자의 입력값이 `innerHTML`을 통해 렌더링되면, 공격자가 심어놓은 악성 스크립트가 브라우저에서 실행될 수 있습니다.

이 규칙은 `innerHTML`이나 React에서 자주 사용되던 `dangerouslySetInnerHTML`의 사용을 엄격하게 제한하여 보안 취약점을 예방하고, 안전한 JSX 구문(컴포넌트 및 기본 DOM 속성)을 사용하도록 유도하기 위해 존재합니다. 또한 잘못 작성된 HTML 문자열이나 일반 텍스트를 `innerHTML`에 삽입하는 실수도 찾아냅니다.

## 2. Solid.js 2.0에서의 변경 여부

`innerHTML`을 통한 DOM 조작이 지닌 보안상의 위험성은 프레임워크의 업데이트와 관계없이 브라우저 렌더링 및 웹 표준 보안 모델에서 비롯됩니다. 따라서 Solid.js 2.0 환경에서도 이 규칙의 중요도와 동작 원리는 전혀 변함없이 동일하게 유지됩니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (보안 취약점 및 오용)

아래 코드들은 XSS 취약점에 노출되거나 불필요하게 `innerHTML`을 사용한 예시입니다.

```jsx
// ❌ 외부에서 들어온 알 수 없는 데이터를 innerHTML에 직접 삽입 (XSS 위험)
let el1 = <div innerHTML={userProvidedContent} />;

// ❌ 일반 텍스트를 넣을 때 innerHTML을 사용 (비효율적)
let el2 = <div innerHTML="안녕하세요!" />;

// ❌ 잘못된 HTML 문법 사용 (</> 등)
let el3 = <div innerHTML="<p>Hello</><p>world!</p>" />;

// ❌ React의 dangerouslySetInnerHTML 문법 사용 (Solid에서는 불필요함)
let el4 = <div dangerouslySetInnerHTML={{ __html: "<p>Hello</p>" }} />;
```

### 🟢 올바른 사용 예 (안전한 렌더링)

텍스트를 렌더링할 때는 JSX의 자식 요소(Children)로 넣거나, `innerText` 속성을 사용하는 것이 훨씬 더 안전하고 빠릅니다.

```jsx
// 🟢 JSX 자식 요소로 안전하게 텍스트 전달
let el1 = <div>안녕하세요!</div>;

// 🟢 일반 텍스트 삽입 시 innerText 사용 (HTML이 이스케이프되어 렌더링됨)
let el2 = <div innerText={userProvidedContent} />;
```

### 시각적 요약

- **`innerHTML="<script>...</script>"`**: 입력된 태그가 실제 DOM 요소로 파싱되어 **실행**됩니다. (매우 위험!)
- **`innerText="<script>...</script>"`**: 입력된 태그가 화면에 단순히 문자로만 **표시**됩니다. (안전함!)
- **`<div>{data}</div>`**: Solid의 기본 동작 방식으로 텍스트가 안전하게 이스케이프 처리됩니다. (가장 권장됨!)
