# event-handlers: Solid 2.0 전환 기록

[English](./migration.md)

## 근거

`event-handlers`의 변경은 다음 실제 Solid 2 runtime 검증을 근거로 한다.

- [valid.kr.md](./valid.kr.md)
- `solidjs2-web-prototype/apps/app/runtime-checks`의 array handler, on-attributes, custom event handler, spread event handler fixture

검증 결과는 문자열·숫자·boolean `on*` prop이 일반 attribute로 렌더링되고, native custom event·배열 handler·spread handler가 동작한다는 것이다.

## 규칙 역할 변경

Solid 1.x의 규칙은 `on`으로 시작하는 prop을 event handler로 간주하고, 정적으로 평가되는 문자열·숫자 값에는 `attr:on...`을 제안했다. Solid 2에서는 `attr:`가 제거됐고 `on*` 일반 attribute도 유효하므로 이 가정은 성립하지 않는다.

따라서 규칙은 다음으로 범위를 축소한다.

- 표준 DOM event handler의 casing 검사: `onclick` → `onClick`
- 표준 별칭 검사: `onDoubleClick` → `onDblClick`

다음 기능은 제거한다.

| Solid 1.x 규칙 동작                                   | Solid 2 결정 | 이유                                                                        |
| ----------------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `detected-attr` 오류                                  | 제거         | `on*` 문자열·숫자·boolean attribute가 유효함                                |
| `attr:on...` suggestion                               | 제거         | `attr:` namespace가 제거됨                                                  |
| 소문자 `on*` 이름의 handler/attribute 양자 suggestion | 제거         | attribute 대안이 더 이상 존재하지 않고 arbitrary attribute를 오탐할 수 있음 |
| `warnOnSpread` 옵션과 fixer                           | 제거         | JSX spread event handler가 정상 동작함                                      |

## namespace와 capture listener

`on:` 및 `oncapture:`는 이 규칙에서 별도로 처리하지 않는다. Solid 2 제거 문법은 `no-unknown-namespaces`가 migration 오류로 보고한다. 일반 event에는 camelCase handler를 사용하고, native capture/options는 `ref` callback에서 `addEventListener`로 설정한다.

## 테스트 보존 정책

Solid 1.x만을 전제한 `attr:`/`on:` 및 `warnOnSpread` 테스트와 `detected-attr` 기대 테스트는 삭제하거나 Solid 2 동작을 검증하는 사례로 교체한다. 더 이상 유효하지 않은 전제를 `test.skip()`으로 남겨 회귀를 숨기지 않는다.

## 타입 선언의 별도 한계

`@solidjs/web`의 기본 JSX 타입은 native `onCustom`과 검증용 `onCustom*` attribute를 선언하지 않는다. prototype fixture는 조건부 declaration merging으로 `<div>`와 `<button>`에만 필요한 prop을 허용한다. 이는 fixture의 type error를 막기 위한 국소적인 보완일 뿐이며, runtime 동작과 기본 타입 선언의 완전성은 별개다. 이 ESLint 규칙은 그 TypeScript 오류를 진단하거나 우회하지 않는다.
