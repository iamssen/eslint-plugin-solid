# jsx-no-script-url

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
`<a>` 태그의 `href` 속성 등에 `javascript:` 형태의 URL 스킴을 사용하는 것은 사용자의 입력값을 적절히 필터링하지 못할 경우 XSS(Cross Site Scripting) 공격에 취약해지는 원인이 됩니다. 보안상 이를 금지하기 위해 도입되었습니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 프레임워크의 버전에 상관없이 준수해야 하는 웹 보안 관련 일반 규칙입니다.

## 3. 그 외 규칙 이해를 위한 설명
버튼 클릭이나 링크 이동 시 스크립트를 실행해야 한다면, URL에 `javascript:void(0)`를 넣는 대신 올바른 이벤트 핸들러(예: `onClick`)를 바인딩하고 기본 동작을 막는(`e.preventDefault()`) 패턴을 사용하는 것이 권장됩니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (XSS 공격에 취약)
<a href="javascript:alert('hello')">클릭하세요</a>
<a href={`javascript:${userProvidedData}`}>위험한 링크</a>

// ✅ 올바른 예시 (이벤트 핸들러 사용)
<a href="#" onClick={(e) => {
  e.preventDefault();
  alert('hello');
}}>
  클릭하세요
</a>

// 접근성(a11y) 측면에서는 링크 이동이 없는 액션의 경우 버튼을 사용하는 것이 더 낫습니다.
<button onClick={() => alert('hello')}>클릭하세요</button>
```
