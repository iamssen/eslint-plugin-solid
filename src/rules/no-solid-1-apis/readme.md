# no-solid-1-apis

Solid 2에서 제거된 Solid 1.x API의 사용을 금지합니다. 이 규칙은 `solid-js`와 `solid-js/store`의 named import, alias, namespace import 및 `createContext()`로 만든 `Context.Provider`를 추적합니다.

자동 수정은 제공하지 않습니다. API마다 대체 방식이 데이터 흐름과 UI 구조에 따라 달라, 기계적인 이름 치환이 안전하지 않기 때문입니다.

## 제거된 API와 대체 방향

| Solid 1.x API | Solid 2 대체 방향 |
| --- | --- |
| `createResource`, `<Suspense>`, `<SuspenseList>` | `Loading`, `Reveal` 및 명시적인 async 상태 |
| `<ErrorBoundary>` | `<Errored>` |
| `useTransition`, `startTransition` | `isPending` 또는 optimistic state |
| `batch` | 기본 microtask batching. 필요한 명령형 경계에서만 `flush()` |
| `on`, `createComputed` | 의존성을 직접 읽는 effect/memo/signal |
| `onMount` | DOM settle 뒤 실행할 작업에는 `onSettled` |
| `createReactive` | 명시적인 추적 callback에는 `createReaction` |
| `createMutable`, `modifyMutable` | `createStore`의 draft setter |
| `from`, `observable`, `createDeferred` | effect, async iterator, 명시적인 deferred state |
| `<Index>`, `indexArray` | `<For keyed={false}>`, `mapArray` |
| `<Context.Provider>` | `<Context value={...}>` |

## 예시

```tsx
// invalid
import { batch, createContext } from 'solid-js';

const Context = createContext();
batch(() => setCount(1));
const App = () => <Context.Provider value="value" />;
```

```tsx
// valid
import { createContext, flush } from 'solid-js';

const Context = createContext();
setCount(1);
flush(); // imperative boundary where an immediate read is required
const App = () => <Context value="value" />;
```
