# prefer-classlist

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
동적으로 변하는 CSS 클래스를 제어할 때 `<div class={isActive() ? 'active' : ''}>` 처럼 문자열 조합이나 삼항 연산자를 복잡하게 사용하는 것보다, Solid.js가 제공하는 전용 유틸리티 속성인 `<div classList={{ active: isActive(), disabled: isDisabled() }}>`를 사용하는 것이 코드 가독성과 렌더링 성능 면에서 더 우수하기 때문에 이를 권장하기 위함입니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** `classList`는 여전히 다중 클래스의 토글을 가장 선언적이고 깔끔하게 작성할 수 있는 방법입니다.

## 3. 그 외 규칙 이해를 위한 설명
복수의 클래스가 조건에 따라 수시로 켜지고 꺼지는 복잡한 UI(예: 폼의 검증 상태, 버튼의 활성/비활성 상태)에서 문자열 템플릿 리터럴을 쓰는 것보다 유지보수성을 크게 높여줍니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 지양하는 예시 (복잡한 템플릿 리터럴과 삼항 연산자)
function Button(props) {
  return (
    <button class={`btn ${props.isPrimary ? 'primary' : ''} ${props.isDisabled ? 'disabled' : ''}`}>
      Submit
    </button>
  );
}

// ✅ 권장하는 예시 (classList 사용)
function Button(props) {
  return (
    <button class="btn" classList={{
      primary: props.isPrimary,
      disabled: props.isDisabled
    }}>
      Submit
    </button>
  );
}
```
