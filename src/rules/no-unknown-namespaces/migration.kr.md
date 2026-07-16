# no-unknown-namespaces: Solid 2.0 전환 기록

[English](./migration.md)

## 목적과 범위

이 문서는 `no-unknown-namespaces`를 Solid 1.x의 “허용된 Solid namespace 검사”에서 Solid 2.0의 “제거된 JSX namespace와 알 수 없는 namespace 검사”로 전환한 이유와 경계를 기록한다.

근거는 저장소의 [Solid2-beta-Migration-Guide](../../../docs/Solid2-beta-Migration-Guide.md) DOM 절과 빠른 제거 매핑이다. 가이드는 `use:`, `attr:`, `bool:`, `on:`, `oncapture:`의 제거를 명시하고, `class:`/`style:`은 더 이상 특별한 JSX 문법이 아니라고 설명한다.

## 유지 결정

규칙은 삭제하지 않는다. Solid 2에서는 제거된 namespace가 컴파일 오류로 항상 드러난다고 보장할 수 없고, DOM JSX에서 의도와 다른 attribute가 남을 수 있다. 따라서 다음 두 오류를 계속 잡는 역할이 있다.

1. Solid 1.x 문법을 계속 사용한 migration 누락
2. `foo:bar`, `bind:value` 같은 오타 또는 다른 프레임워크 문법의 혼입

공개 rule 이름과 `recommended` 설정의 error 수준도 유지한다.

## namespace별 결정

| namespace             | Solid 2 결정   | 규칙 동작                    | 대체 방향                          | 자동 수정 |
| --------------------- | -------------- | ---------------------------- | ---------------------------------- | --------- |
| `use:`                | 제거됨         | `legacy` 오류                | `ref={directive(options)}` factory | 하지 않음 |
| `attr:`               | 제거됨         | `legacy` 오류                | 일반 HTML attribute                | 하지 않음 |
| `bool:`               | 제거됨         | `legacy` 오류                | 일반 boolean attribute             | 하지 않음 |
| `on:`                 | 제거됨         | `legacy` 오류                | `onClick` 등 camelCase handler     | 하지 않음 |
| `oncapture:`          | 제거됨         | `legacy` 오류                | `ref` + `addEventListener`         | 하지 않음 |
| `class:`              | 특별 문법 제거 | `legacy` 오류                | `class` 객체/배열 값               | 하지 않음 |
| `style:`              | 특별 문법 제거 | `legacy` 오류                | `style` 객체 값                    | 하지 않음 |
| `xmlns:`, `xlink:`    | 유지           | 허용                         | SVG/XML namespace                  | 해당 없음 |
| 사용자 설정 namespace | 유지           | `allowedNamespaces`에서 허용 | 프로젝트 JSX transform             | 해당 없음 |
| `prop:`               | 지원됨         | native/custom element에서 허용 | writable DOM property 직접 설정  | 해당 없음 |

## 자동 수정을 하지 않는 이유

namespace를 지우거나 이름을 바꾸는 것만으로는 안전한 2.0 코드가 되지 않는 경우가 많다.

- `use:`는 설정 factory와 element 적용 callback이라는 두 단계 구조로 다시 설계해야 한다.
- `on:` 이벤트 이름은 camelCase 변환이 필요하고, `oncapture:`는 listener options와 cleanup의 소유자를 결정해야 한다.
- `class:`/`style:`는 여러 namespace prop과 기존 `class`/`style` 값을 하나의 객체 또는 배열 expression으로 합쳐야 한다.
- `attr:`/`bool:`도 기존 코드가 property 강제 동작에 의존했는지 확인이 필요하다.

따라서 규칙은 고정된 migration 메시지만 제공하고, 문맥을 보존한다고 증명할 수 없는 fixer/suggestion은 제공하지 않는다.

## 컴포넌트와 `prop:`

기존 규칙은 대문자로 시작하는 component에 namespace prop을 사용하면 “효과가 없다”는 오류와 namespace 제거 suggestion을 제공했다. 이 동작은 **알 수 없는 namespace**에 유지한다.

제거된 Solid namespace는 component에서도 migration 오류를 우선 보고한다. 예를 들어 `<Widget attr:label="Save" />`는 단순히 `label`로 바꾸라는 suggestion보다, `attr:`이 2.0에서 제거되었다는 사실과 일반 prop/attribute 모델을 검토해야 한다는 안내가 더 중요하기 때문이다.

`@solidjs/web`의 Solid 2 JSX 타입은 `prop:*`를 native element와 custom element의
writable property 직접 설정 문법으로 명시한다. 예를 들어
`<custom-element prop:myProp={true} />`는 `element.myProp = true`에 해당한다.

타입은 element별 writable property만 `prop:*`로 생성하며, 이미 일반 prop으로
특별 취급되는 `value`, `checked`, `selected` 등에는 `prop:*`를 `never`로 제한할 수
있다. 따라서 이 rule은 `prop:`을 기본 허용하되, component에 붙은 namespace prop은
효과가 없다는 기존 `component` 오류를 유지한다.

## 관련 후속 작업

- `event-handlers`: `attr:on...` suggestion/fixer를 제거하고 `onClick` 및 ref listener 안내로 전환
- `no-array-handlers`: `on:` namespace 전용 분기 제거
- `jsx-no-undef`: `use:` directive 식별자 전용 분석 제거 또는 ref factory 분석으로 대체
- `reactivity`: `use:` tracked scope 가정을 제거하고 ref factory의 설정/적용 단계를 구분
