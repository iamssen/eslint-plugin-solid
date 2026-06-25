# no-innerhtml

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
Solid.js는 `innerHTML` prop을 통해 DOM 요소에 HTML 문자열을 직접 주입할 수 있는 기능을 제공합니다. 하지만 사용자 입력값이나 검증되지 않은 데이터를 `innerHTML`에 바인딩할 경우 XSS(크로스 사이트 스크립팅) 취약점이 발생할 위험이 크기 때문에, 보안상 이를 경고하기 위한 규칙입니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** 프레임워크 자체의 변화와 무관하게 브라우저 DOM 조작의 보안 원칙에 기반한 규칙입니다.

## 3. 그 외 규칙 이해를 위한 설명
만약 마크다운 렌더러나 외부 API에서 가져온 신뢰할 수 있는 HTML을 부득이하게 삽입해야 한다면, 반드시 DOMPurify 같은 라이브러리를 사용해 문자열을 Sanitize(소독) 처리한 후 주입해야 합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (XSS 공격에 취약)
function BlogPost(props) {
  // props.content 안에 <script> 악성 코드가 있다면 그대로 실행됩니다.
  return <div innerHTML={props.content} />;
}

// ✅ 올바른 예시 1 (일반적인 텍스트 바인딩)
function BlogPost(props) {
  return <div>{props.content}</div>; // HTML 태그는 텍스트로 안전하게 이스케이프 됨
}

// ✅ 올바른 예시 2 (소독을 거친 안전한 HTML 바인딩)
import DOMPurify from 'dompurify';

function BlogPost(props) {
  const cleanHTML = DOMPurify.sanitize(props.content);
  return <div innerHTML={cleanHTML} />;
}
```
