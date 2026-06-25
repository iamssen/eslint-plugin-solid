# reactivity

## 1. 규칙이 존재하는 이유 (Solid.js 1.0 기반)
이 규칙은 Solid.js 애플리케이션에서 **가장 치명적인 버그를 막아주는 핵심 린트 규칙**입니다. 반응형 데이터(Signal, Store, Props 등)는 값이 접근될 때(Getter 호출) 자동으로 의존성을 추적(Track)합니다. 그러나 이 추적은 JSX 내부, `createEffect`, `createMemo`와 같이 프레임워크가 인지하는 "추적 스코프(Tracking Scope)" 내에서 일어날 때만 작동합니다. setTimeout의 콜백, 비동기 함수 내부, 이벤트 핸들러 등 스코프를 벗어난 곳에서 접근하면 값의 변경을 감지하지 못하고 상태 동기화가 끊기는 문제(Tracking Loss)가 발생하므로 이를 강력히 경고합니다.

## 2. Solid.js 2.0에서의 변경 여부
**변경 없음.** Solid.js 2.0에서 반응성 시스템의 내부 구조가 다듬어졌더라도, "함수 실행과 Getter 기반의 의존성 추적"이라는 프레임워크의 대원칙은 변하지 않기 때문에 이 규칙은 여전히 가장 중요하게 취급됩니다.

## 3. 그 외 규칙 이해를 위한 설명
만약 비동기 작업 결과나 setTimeout 내부에서 반응형 상태를 읽거나 써야 하는 상황이라면, 그 함수 내부에서 로직을 처리하는 데 그쳐야 매, 해당 결과에 따라 DOM이 갱신되기를 원한다면 스코프 바깥의 Signal을 업데이트(Setter 호출)하여 다시 추적 스코프(JSX 렌더링 등)가 갱신되도록 설계해야 합니다.

## 4. 예제 코드 및 시각적 설명

```javascript
// ❌ 잘못된 예시 (추적 스코프를 벗어난 경우)
function Timer() {
  const [time, setTime] = createSignal(0);

  // createEffect 내부의 setTimeout 콜백 안에서 time()을 호출하면 
  // 동기적인 추적 스코프가 끊겨 반응성이 동작하지 않습니다.
  createEffect(() => {
    setTimeout(() => {
      console.log(time()); // 린터 경고: 비동기 스코프 내부에서의 반응성 호출
    }, 1000);
  });

  return <div>{time()}</div>;
}

// ✅ 올바른 예시 (추적 스코프 내부에서 미리 읽기)
function Timer() {
  const [time, setTime] = createSignal(0);

  createEffect(() => {
    // 동기적인 스코프 안에서 미리 값을 읽습니다.
    const currentTime = time(); 
    setTimeout(() => {
      console.log(currentTime);
    }, 1000);
  });

  return <div>{time()}</div>;
}
```
