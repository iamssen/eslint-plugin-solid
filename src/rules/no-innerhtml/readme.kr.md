# no-innerhtml

[English](./readme.md)

`innerHTML`을 통한 XSS 위험 HTML 주입을 보고합니다.

## 기본 설정

이 rule은 `recommended`에서 error로 활성화됩니다.

```js
'@ssen/solid/no-innerhtml': 'error'
```

## 옵션

`allowStatic`의 기본값은 `true`이며, 정적으로 증명 가능한 HTML 문자열 값을 허용합니다.
`false`로 설정하면 정적 HTML도 보고합니다.

```js
'@ssen/solid/no-innerhtml': ['error', { allowStatic: false }]
```

## 상세

신뢰할 수 없는 HTML을 `innerHTML`로 주입할 때 발생할 수 있는 XSS와, React식 `dangerouslySetInnerHTML` 사용을 검사합니다. 정적 HTML도 프로젝트 정책에 따라 금지할 수 있습니다.

Solid에서 `innerHTML`은 React의 `dangerouslySetInnerHTML` 객체를 거치지 않고 DOM의 `innerHTML` property에 직접 연결하는 escape 경로입니다. 이 때문에 HTML 문자열 내부의 markup을 의도한 것인지, 사용자 입력을 텍스트로 표시하려는 것인지 구분해야 합니다. 사용자 입력은 JSX text로 렌더링하면 기본적으로 escape됩니다.

```tsx
// 잘못된 예
<div innerHTML={userContent} />
<div dangerouslySetInnerHTML={{ __html: html }} />

// 일반 텍스트는 자식 또는 innerText 사용
<div>{text}</div>
```

기본 옵션은 정적 `innerHTML`을 허용합니다. `{ allowStatic: false }`를 사용하면 정적으로 평가되는 값도 보고합니다. `innerHTML`과 `textContent`/`innerText`를 함께 지정하는 충돌도 검사합니다.

## 예제로 보는 동작

외부 또는 동적 HTML을 DOM에 넣는 것은 invalid입니다. HTML 안에 script나 event attribute가 섞일 수 있기 때문입니다.

```tsx
// invalid
<article innerHTML={post.body} />
<article dangerouslySetInnerHTML={{ __html: post.body }} />

// valid: Solid가 이를 escape된 text로 렌더링
<article>{post.body}</article>
```

`innerHTML`과 텍스트 content를 동시에 지정하는 것도 invalid입니다. 둘 중 어느 것이 최종 DOM을 결정하는지 분명하지 않기 때문입니다.

```tsx
// invalid
<div innerHTML="<b>공지</b>" textContent="공지" />
```

기본 설정은 코드에 직접 쓴 정적 HTML을 허용할 수 있지만, `{ allowStatic: false }`이면 아래도 invalid입니다.

```tsx
<div innerHTML="<b>공지</b>" />
```

React migration 용도의 `dangerouslySetInnerHTML={{ __html: html }}`는 `innerHTML={html}`로 수정될 수 있습니다. 수정 뒤에도 `html`을 신뢰하거나 sanitize했는지는 개발자가 보장해야 합니다.
