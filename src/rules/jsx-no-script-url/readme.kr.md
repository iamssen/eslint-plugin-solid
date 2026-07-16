# jsx-no-script-url

[English](./readme.md)

JSX 속성 값에 `javascript:` URL을 사용하지 않도록 검사합니다. 보안상 실행 가능한 URL을 링크나 컴포넌트 prop으로 전달하는 것을 피해야 합니다.

`javascript:`는 브라우저가 URL 이동 대신 문자열을 JavaScript로 실행하게 하는 특수 scheme입니다. 정적 문자열뿐 아니라 template literal, 상수 결합처럼 정적으로 계산되는 표현도 위험할 수 있습니다. Solid-specific 문제가 아니라 DOM에 URL을 전달하는 모든 UI 코드의 보안 문제이므로, Solid 컴포넌트의 `to` 같은 사용자 정의 prop도 검사 대상입니다.

```tsx
// 잘못된 예
<a href="javascript:alert('xss')" />
<Link to={`javascript:${value}`} />

// 액션은 버튼과 이벤트 핸들러로 표현
<button type="button" onClick={handleClick}>실행</button>
```

URL을 사용하는 경우에는 허용된 프로토콜과 목적지를 별도로 검증해야 합니다. 이 규칙은 일반적인 XSS 필터나 URL 검증기를 대체하지 않습니다.

## 예제로 보는 동작

`javascript:`는 `href`에만 위험한 것이 아닙니다. rule은 모든 JSX prop에서 정적으로 확인되는 값을 검사합니다.

```tsx
// 모두 invalid
<a href="javascript:alert('xss')" />
<Link to="javascript:run()" />
<Widget action="javascript:run()" />
<a href={`javascript:${command}`} />
```

사용자 동작은 URL scheme이 아니라 이벤트 handler로 표현합니다.

```tsx
// valid
<button type="button" onClick={run}>실행</button>
<a href="https://example.com">문서</a>
```

`<a href={userUrl}>`처럼 값이 런타임에 정해지면 이 rule은 URL의 실제 protocol을 알 수 없어 통과시킬 수 있습니다. 이 경우에도 `https:` 등 허용 목록을 애플리케이션 코드에서 검증해야 합니다.
