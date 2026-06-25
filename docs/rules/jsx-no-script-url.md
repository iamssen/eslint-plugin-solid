# jsx-no-script-url

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기준)

하이퍼링크 `<a>` 태그의 `href` 속성이나 이벤트 관련 속성에 `javascript:` 형태의 URL을 사용하는 것은 XSS(크로스 사이트 스크립팅) 취약점을 야기할 수 있는 심각한 보안 위험 요소입니다. 

사용자가 제공한 데이터가 필터링되지 않고 `javascript:` URL의 일부로 들어가면 공격자가 임의의 자바스크립트 코드를 실행시킬 수 있습니다. 특히 React나 Solid.js와 같이 컴포넌트 기반 라이브러리에서는 버튼 클릭이나 상태 갱신 등의 로직을 처리할 때 이벤트 핸들러(`onClick` 등)를 사용하는 것이 권장됩니다.

이 규칙은 JSX 내부에서 `javascript:` 스킴이 포함된 URL이 문자열로 사용되는 것을 감지하고 차단하여, 애플리케이션의 보안을 높이기 위해 존재합니다.

## 2. Solid.js 2.0에서의 변경 여부

보안 관점에서 `javascript:` URL을 차단하는 것은 자바스크립트 프레임워크의 버전에 관계없이 항상 지켜야 할 웹 표준 보안 규칙입니다. 따라서 Solid.js 2.0에서도 이 규칙은 변경 사항 없이 똑같이 적용됩니다.

## 3. 규칙의 이해를 돕기 위한 추가 설명 및 예제

### ❌ 잘못된 사용 예 (보안 취약점)

아래 코드처럼 `href` 속성에 자바스크립트 스크립트를 직접 삽입하면, 악의적인 코드 실행의 통로가 될 수 있습니다. 또한 브라우저의 기본 링크 동작 대신 스크립트를 실행하기 위해 임시방편으로 사용하는 `javascript:void(0)` 패턴 역시 금지됩니다.

```jsx
// ❌ javascript: 프로토콜을 사용한 문자열 삽입
const badLink = <a href="javascript:alert('XSS Attack!')">위험한 링크</a>;

// ❌ 클릭 이벤트 방지를 위해 javascript:void(0) 사용
const linkWithVoid = <a href="javascript:void(0)">클릭 불가 링크</a>;
```

### 🟢 올바른 사용 예 (이벤트 핸들러 사용)

어떤 동작을 트리거해야 한다면 `href`에 자바스크립트를 넣는 대신 `onClick` 이벤트 핸들러를 사용해야 합니다. 그리고 시각적으로 링크처럼 보여야 하지만 페이지 이동이 없는 요소라면 `<a>` 태그 대신 `<button>` 태그를 사용하거나, `e.preventDefault()`를 호출해야 합니다.

```jsx
// 🟢 올바른 URL 경로 사용
const validLink = <a href="/about-us">About Us</a>;

// 🟢 자바스크립트 동작이 필요하다면 onClick 사용
function MyButton() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log("Button Clicked!");
  };

  return <button onClick={handleClick}>안전한 버튼</button>;
}
```
