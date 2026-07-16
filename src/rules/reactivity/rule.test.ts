import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('reactivity', rule);
const invalid = testInvalid('reactivity', rule);

describe('reactivity', () => {
  describe('valid', () => {
    test('component rendering with props access is valid', () => {
      valid(`
        function MyComponent(props) {
          return <div>Hello {props.name}</div>;
        }
        let el = <MyComponent name="Solid" />;
      `);
    });
    test('using signal in createEffect is tracked', () => {
      valid(`
        const [first, setFirst] = createSignal("JSON");
        const [last, setLast] = createSignal("Bourne");
        createEffect(() => console.log(\`\${first()} \${last()}\`));
      `);
    });
    test('createEffect apply callback may read signals and write state', () => {
      valid(`
        const [count, setCount] = createSignal(0);
        const [applied, setApplied] = createSignal(0);
        createEffect(
          () => count(),
          (value) => {
            setApplied(value + count());
            return () => {};
          },
        );
      `);
    });
    test('createEffect EffectBundle callbacks are called-function scopes', () => {
      valid(`
        const [count] = createSignal(0);
        const [applied, setApplied] = createSignal(0);
        createEffect(
          () => count(),
          {
            effect: (value) => setApplied(value),
            error: (error) => console.error(error, count(), applied()),
          },
        );
      `);
    });
    test('using props inside component body is valid if wrapped in tracking scope', () => {
      valid(`
        let Component = props => {
          return <div>{props.value || "default"}</div>;
        };
      `);
    });
    test('accessing props in a function called in JSX is valid', () => {
      valid(`
        let Component = props => {
          const value = () => props.value || "default";
          return <div>{value()}</div>;
        };
      `);
    });
    test('accessing props in createMemo is tracked', () => {
      valid(`
        let Component = props => {
          const value = createMemo(() => props.value || "default");
          return <div>{value()}</div>;
        };
      `);
    });
    test('accessing merged props is tracked', () => {
      valid(`
        import { merge } from 'solid-js';
        let Component = _props => {
          const props = merge({ value: "default" }, _props);
          return <div>{props.value}</div>;
        };
      `);
    });
    test('accessing omitted props is tracked', () => {
      valid(`
        import { omit } from 'solid-js';
        let Component = _props => {
          const rest = omit(_props, "foo", "bar");
          return <div>{rest.baz}</div>;
        };
      `);
    });
    test('using untrack prevents tracking', () => {
      valid(`
        let Component = () => {
          const [a, setA] = createSignal(1);
          const [b, setB] = createSignal(1);
          createEffect(() => {
            console.log(a(), untrack(b));
          });
        };
      `);
    });
    test('using signal in JSX is tracked', () => {
      valid(`
        function Component(props) {
          const [value, setValue] = createSignal();
          return <div class={props.class}>{value()}</div>;
        }
      `);
    });
    test('using signal in both createEffect and JSX is tracked', () => {
      valid(`
        function Component(props) {
          const [value, setValue] = createSignal();
          createEffect(() => console.log(value()));
          return <div class={props.class}>{value()}</div>;
        }
      `);
    });
    test('using a signal in isPending compute callback is tracked', () => {
      valid(`
        const [tab] = createSignal(0);
        const pending = () => isPending(() => tab());
        const Component = () => <div class={{ pending: pending() }} />;
      `);
    });
    test('using signal in on callback is valid', () => {
      valid(`
        const [value, setValue] = createSignal();
        on(value, () => console.log('hello'));
      `);
    });
    test('using signal array in on callback is valid', () => {
      valid(`
        const [value, setValue] = createSignal();
        on([value], () => console.log('hello'));
      `);
    });
    describe(`spreading props`, () => {
      test('spreading props in JSX is tracked', () => {
        valid(`
          function Component(props) {
            return <div {...props} />;
          }
        `);
      });
      test('spreading nested props in JSX is tracked', () => {
        valid(`
          function Component(props) {
            return <div {...props.nestedProps} />;
          }
        `);
      });
      test('spreading signal object in JSX is tracked', () => {
        valid(`
          function Component() {
            const [signal, setSignal] = createSignal({});
            return <div {...signal()} />;
          }
        `);
      });
    });
    describe(`Derived signals`, () => {
      test('derived signal nested inside unused function is valid', () => {
        valid(`
          let c = () => {
            const [signal] = createSignal();
            const d = () => {
              function e() { // <-- e becomes a derived signal
                signal();
              }
            } // <-- d never uses it
            d(); // <-- this is fine
          };
        `);
      });
      test('signal access inside createEffect is valid', () => {
        valid(`
          const [signal] = createSignal();
          createEffect(() => console.log(signal()));
        `);
      });
      test('using signal in createMemo is tracked', () => {
        valid(`
          const [signal] = createSignal();
          const memo = createMemo(() => signal());
        `);
      });
      test('using signal in event handler and JSX is tracked', () => {
        valid(`
          const el = <button onClick={() => toggleShow(!show())}>
            {show() ? "Hide" : "Show"}
          </button>
        `);
      });
      test('using signal inside IIFE inside createEffect is tracked', () => {
        valid(`
          const [count] = createSignal();
          createEffect(() => {
            (() => count())()
          });
        `);
      });
      test('using signal inside IIFE inside JSX is tracked', () => {
        valid(`
          const [count] = createSignal();
          const el = <div>{(() => count())()}</div>
        `);
      });
      test('using signal in setter in event handler is valid', () => {
        valid(`
          const [count, setCount] = createSignal();
          const el = <button type="button" onClick={() => setCount(count() + 1)}>Increment</button>;
        `);
      });
    });
    describe(`Parse top level JSX`, () => {
      test('top level JSX is valid', () => {
        valid(`const el = <div />`);
      });
    });
    describe(`getOwner/runWithOwner`, () => {
      test('using runWithOwner with getOwner is valid', () => {
        valid(`
          const [signal] = createSignal();
          createEffect(() => {
            const owner = getOwner();
            runWithOwner(owner, () => console.log(signal()));
          });
        `);
      });
      test('using runWithOwner with undefined is valid', () => {
        valid(`
          const [signal] = createSignal();
          createEffect(() => {
            runWithOwner(undefined, () => console.log(signal()));
          });
        `);
      });
    });
    describe(`Sync callbacks`, () => {
      test('synchronous array methods like forEach are tracked scopes', () => {
        valid(`
          const [signal] = createSignal();
          createEffect(() => {
            [1, 2].forEach(() => console.log(signal()));
          });
        `);
      });
      test('synchronous array methods are tracked scopes for props', () => {
        valid(`
          function Component(props) {
            createEffect(() => {
              [1, 2].forEach(() => console.log(props.foo));
            });
            return <div />;
          }
        `);
      });
      test('synchronous array methods are tracked scopes for non-props', () => {
        valid(`
          function Component(bleargh /* doesn't match props regex */) {
            createEffect(() => {
              [1, 2].forEach(() => console.log(bleargh.foo));
            });
            return <div />;
          }
        `);
      });
    });
    describe(`Timers`, () => {
      test('using signals in timer callbacks is valid', () => {
        valid(`
          const [signal] = createSignal(5);
          setTimeout(() => console.log(signal()), 500);
          setInterval(() => console.log(signal()), 600);
          setImmediate(() => console.log(signal()));
          requestAnimationFrame(() => console.log(signal()));
          requestIdleCallback(() => console.log(signal()));
        `);
      });
    });
    describe(`Observers from Standard Web APIs`, () => {
      test('using signals in observer callbacks is valid', () => {
        valid(`
          const [signal] = createSignal(5);
          new IntersectionObserver(() => console.log(signal()));
          new MutationObserver(() => console.log(signal()));
          new PerformanceObserver(() => console.log(signal()));
          new ReportingObserver(() => console.log(signal()));
          new ResizeObserver(() => console.log(signal()));
        `);
      });
    });
    describe(`Async tracking scope exceptions`, () => {
      // Solid 2.0에서 onMount는 onSettled로 대체된다.
      // 비동기 lifecycle tracking의 2.0 모델을 구현한 뒤 새 API로 다시 작성한다.
      test.skip('fetch with await before state setter is valid', () => {
        valid(`
          const [photos, setPhotos] = createSignal([]);
          onMount(async () => {
            const res = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=20");
            setPhotos(await res.json());
          });
        `);
      });
      test('awaiting delay in on callback before setter is valid', () => {
        valid(`
          const [a, setA] = createSignal(1);
          const [b] = createSignal(2);
          on(b, async () => { await delay(1000); setA(a() + 1) });
        `);
      });
    });
    describe(`Custom hooks`, () => {
      test('custom hooks like createComposedRefs create tracked scopes', () => {
        valid(`
          const Component = (props) => {
            const localRef = () => props.ref;
            const composedRef1 = useComposedRefs(localRef);
            const composedRef2 = useComposedRefs(() => props.ref);
            const composedRef3 = createComposedRefs(localRef);
          }
        `);
      });
      test('passing object with method to custom hook is valid', () => {
        valid(`
          function createFoo(v) {}
          const [bar, setBar] = createSignal();
          createFoo({ onBar: () => bar() });
        `);
      });
      test('passing object with concise method to custom hook is valid', () => {
        valid(`
          function createFoo(v) {}
          const [bar, setBar] = createSignal();
          createFoo({ onBar() { bar() } });
        `);
      });
      test('passing signal as argument to custom hook is valid', () => {
        valid(`
          function createFoo(v) {}
          const [bar, setBar] = createSignal();
          createFoo(bar);
        `);
      });
      test('passing array containing signal to custom hook is valid', () => {
        valid(`
          function createFoo(v) {}
          const [bar, setBar] = createSignal();
          createFoo([bar]);
        `);
      });
      test('passing object with method cast to object to custom hook is valid', () => {
        valid(
          `
          function createFoo(v) {}
          const [bar, setBar] = createSignal();
          createFoo({ onBar: () => bar() } as object);
        `,
          true,
        );
      });
      test('passing function to namespaced custom hook is valid', () => {
        valid(`
          const [bar, setBar] = createSignal();
          X.createFoo(() => bar());
        `);
      });
      test('passing function to deeply namespaced custom hook is valid', () => {
        valid(`
          const [bar, setBar] = createSignal();
          X . Y\n. createFoo(() => bar());
        `);
      });
      test('custom hook specified in customReactiveFunctions is a tracked scope', () => {
        valid({
          code: `
            function customQuery(v) {}
            const [signal, setSignal] = createSignal();
            customQuery(() => signal());
          `,
          options: [{ customReactiveFunctions: ['customQuery'] }], // only needed when not create*/use*
        });
      });
    });
    describe(`Event listeners`, () => {
      test('using signal in addEventListener callback is valid', () => {
        valid(`
          const [signal, setSignal] = createSignal(1);
          const element = document.getElementById("id");
          element.addEventListener("click", () => {
            console.log(signal());
          }, { once: true });
        `);
      });
      test('using signal in element.onclick is valid', () => {
        valid(`
          const [signal, setSignal] = createSignal(1);
          const element = document.getElementById("id");
          element.onclick = () => {
            console.log(signal());
          };
        `);
      });
      test('using signal in JSX onClick is valid', () => {
        valid(`
          function Component() {
            const [signal, setSignal] = createSignal(1);
            return <div onClick={() => console.log(signal())} />;
          }
        `);
      });
      test('using signal in handler passed to JSX onClick is valid', () => {
        valid(`
          function Component() {
            const [signal, setSignal] = createSignal(1);
            const handler = () => console.log(signal());
            return <div onClick={handler} />;
          }
        `);
      });
      test('passing signal directly to JSX onClick is valid', () => {
        valid(`
          function Component() {
            const [signal, setSignal] = createSignal(1);
            return <div onClick={signal} />;
          }
        `);
      });
      // Solid 2.0에서 on: namespace는 제거됐다. onClick handler로 재작성할 때 활성화한다.
      test.skip('using signal in JSX on:click is valid', () => {
        valid(`
          function Component() {
            const [signal, setSignal] = createSignal(1);
            return <div on:click={() => console.log(signal())} />;
          }
        `);
      });
      test('calling props.onClick in JSX onClick is valid', () => {
        valid(`
          function Component(props) {
            return <div onClick={e => props.onClick(e)} />;
          }
        `);
      });
    });
    describe(`event listeners are reactive on components`, () => {
      test('passing props.onClick to component is valid', () => {
        valid(`
          const Parent = props => {
            return <Child onClick={props.onClick} />;
          }
        `);
      });
      test('wrapping props.onClick in function and passing to component is valid', () => {
        valid(`
          const Parent = props => {
            return <Child onClick={e => props.onClick(e)} />;
          }
        `);
      });
    });
    describe(`Pass reactive variables as-is into provider value prop`, () => {
      test('passing signal directly to Context Provider value is valid', () => {
        valid(`
          const Component = props => {
            const [signal] = createSignal();
            return <SomeContext.Provider value={signal}>{props.children}</SomeContext.Provider>;
          }
        `);
      });
    });
    describe(`<For /> callback shapes`, () => {
      test('keyed=false uses an item accessor and a numeric index', () => {
        valid(`
          const [items] = createSignal([{ id: 'first' }]);
          const Component = () => (
            <For each={items()} keyed={false}>
              {(item, index) => <div>{index}:{item().id}</div>}
            </For>
          );
        `);
      });
      test('default For uses a value item and an index accessor', () => {
        valid(`
          const [items] = createSignal([{ id: 'first' }]);
          const Component = () => (
            <For each={items()}>
              {(item, index) => <div>{index()}:{item.id}</div>}
            </For>
          );
        `);
      });
    });
    describe(`Don't warn on using props.initial* or props.default* for initialization`, () => {
      test('using initial* props for initialization is valid', () => {
        valid(`
          function Component(props) {
            const [count, setCount] = useSignal(props.initialCount);
            return <div>{count()}</div>;
          }
        `);
      });
      test('using default* props for initialization is valid', () => {
        valid(`
          function Component(props) {
            const [count, setCount] = useSignal(props.defaultCount);
            return <div>{count()}</div>;
          }
        `);
      });
    });
    describe(`Store getters`, () => {
      test('store getters are tracked scopes', () => {
        valid(`
          const [state, setState] = createStore({
            firstName: 'Will',
            lastName: 'Smith',
            get fullName() {
              return state.firstName + " " + state.lastName;
            }
          });
        `);
      });
    });
    describe(`untrack()`, () => {
      test('untrack creates untracked scope', () => {
        valid(`
          const [signal] = createSignal(5);
          untrack(() => {
            console.log(signal());
          });
        `);
      });
    });
    describe(`has JSX, but lowercase function and not named props => don't treat first parameter as props`, () => {
      test('lowercase function without props parameter is not treated as component', () => {
        valid(`
          function notAComponent(something) {
            console.log(something.a);
            return <div />;
          }
        `);
      });
    });
    describe(`function expression inside tagged template literal expression is tracked scope`, () => {
      test('tagged template literal for css creates tracked scope', () => {
        valid('css`color: ${props => props.color}`;');
      });
      test('tagged template literal for html creates tracked scope', () => {
        valid('html`<div>${props => props.name}</div>`;');
      });
      test('tagged template literal for styled.css creates tracked scope', () => {
        valid('styled.css`color: ${props => props.color};`');
      });
    });
    describe(`refs`, () => {
      test('ref callback is valid', () => {
        valid(`
          function Component() {
            let canvas;
            return <canvas ref={canvas} />;
          }
        `);
      });
      test('ref callback with block body is valid', () => {
        valid(`
          function Component() {
            let canvas;
            return (
              <canvas ref={c => {
                canvas = c;
              }} />
            );
          }
        `);
      });
      test('using signal in ref callback is valid', () => {
        valid(`
          function Component() {
            const [index] = createSignal(0);
            let canvas;
            return (
              <canvas ref={c => {
                index();
                canvas = c;
              }} />
            );
          }
        `);
      });
      test('passing setter to ref is valid', () => {
        valid(`
          function Component() {
            const [canvas, setCanvas] = createSignal();
            return <canvas ref={c => setCanvas(c)} />;
          }
        `);
      });
    });
    describe(`mapArray()`, () => {
      test('mapArray first argument is a tracked scope', () => {
        valid(`
          function createCustomStore() {
            const [store, updateStore] = createStore({});

            return mapArray(
              // the first argument to mapArray is a tracked scope
              () => store.path.to.field,
              (item) => ({})
            );
          }
        `);
      });
      // Solid 2.0에서 indexArray는 제거됐다. For keyed={false}의 accessor 모델로 대체한다.
      test.skip('indexArray first argument is a tracked scope', () => {
        valid(`
          function createCustomStore() {
            const [store, updateStore] = createStore({});

            return indexArray(
              // the first argument to mapArray is a tracked scope
              () => store.path.to.field,
              (item) => ({})
            );
          }
        `);
      });
    });
    describe(`type casting`, () => {
      test('createMemo with type casting is valid', () => {
        valid(`const m = createMemo(() => 5) as Accessor<number>;`, true);
      });
      test('createMemo with non-null assertion is valid', () => {
        valid(`const m = createMemo(() => 5)!;`, true);
      });
      test('createMemo with non-null assertion and type casting is valid', () => {
        valid(`const m = createMemo(() => 5)! as Accessor<number>;`, true);
      });
      test('createMemo with satisfies operator is valid', () => {
        valid(
          `const m = createMemo(() => 5) satisfies Accessor<number>;`,
          true,
        );
      });
      test('createSignal with type casting is valid', () => {
        valid(`const [s] = createSignal('a' as string)`, true);
      });
      test('custom hook with type casting is valid', () => {
        valid(`createFoo('a' as string)`, true);
      });
    });
    describe(`functions in JSXExpressionContainers`, () => {
      test('function in JSXExpressionContainer is a tracked scope', () => {
        valid(`
          function Component(props) {
            return (
              <div>{() => {
                console.log('hello');
                return props.greeting;
              }}</div>
            );
          }
        `);
      });
    });
    describe(`passing function instead of signal`, () => {
      test('passing function wrapping signal is valid', () => {
        valid(`
          const [signal, setSignal] = createSignal();
          let el = <Child foo={() => signal()}></Child>
        `);
      });
    });
    describe(`static* prefix for props`, () => {
      test('static prop access is not reactive', () => {
        valid(`
          function Component(props) {
            const value = props.staticValue;
          }
        `);
      });
      test('static prop access via helper function is not reactive', () => {
        valid(`
          function Component() {
            const staticValue = () => props.value;
            const value = staticValue();
          }
        `);
      });
    });
    // Solid 2.0에서 observable()은 제거됐다. createEffect 기반 adapter test로 대체한다.
    describe.skip(`observable`, () => {
      test('observable from props is a tracked scope', () => {
        valid(`
          function Component(props) {
            const count$ = observable(() => props.count);
            return <div />;
          }
        `);
      });
      test('observable from signal is a tracked scope', () => {
        valid(`
          const [signal, setSignal] = createSignal(0);
          const value$ = observable(signal);
        `);
      });
    });
    // Solid 2.0에서 use: directive는 제거됐다. ref directive factory 분석으로 대체한다.
    describe.skip(`use: functions`, () => {
      test('use: directive is a tracked scope', () => {
        valid(`
          let someHook;
          function Component(props) {
            return <div use:someHook={() => props.count} />;
          }
        `);
      });
    });
    describe(`f*cking insane edge case with multiple functions taking props as sync callbacks (#110)`, () => {
      test('multiple functions taking props as sync callbacks is valid', () => {
        valid(`
          function formObjectDispatch(formObject, action) {
            const { field } = action.payload;
            formObject.findIndex((props) => props.field === field);
            formObject.findIndex((props) => props.field === field);
          }
        `);
      });
    });
  });
  describe('invalid', () => {
    describe(`Untracked signals`, () => {
      test('detects a signal setter write in a createEffect compute callback', () => {
        invalid({
          code: `
            const [count, setCount] = createSignal(0);
            createEffect(
              () => {
                setCount(1);
                return count();
              },
              () => {},
            );
          `,
          errors: [{ messageId: 'noWrite', data: { name: 'setCount' } }],
        });
      });
      test('detects a store setter write in a createEffect compute callback', () => {
        invalid({
          code: `
            const [state, setState] = createStore({ count: 0 });
            createEffect(
              () => {
                setState((draft) => { draft.count++; });
                return state.count;
              },
              () => {},
            );
          `,
          errors: [{ messageId: 'noWrite', data: { name: 'setState' } }],
        });
      });
      test('detects untracked signal usage in component body', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal(5);
              console.log(signal());
              return null;
            }
          `,
          errors: [{ messageId: 'untrackedReactive', line: 4 }],
        });
      });
      test('detects untracked signal usage alongside tracked usage', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal(5);
              console.log(signal());
              return <div>{signal()}</div>
            }
          `,
          errors: [{ messageId: 'untrackedReactive', line: 4 }],
        });
      });
    });
    describe(`Untracked property access`, () => {
      test('detects untracked property access from omitted props', () => {
        invalid({
          code: `
            import { omit } from 'solid-js';
            const Component = _props => {
              const rest = omit(_props, 'value');
              const extra = rest.extra;
              return <div>{extra}</div>;
            }
          `,
          errors: [
            { messageId: 'untrackedReactive', data: { name: 'rest.extra' } },
          ],
        });
      });
      test('detects untracked property access in component body', () => {
        invalid({
          code: `
            const Component = props => {
              const value = props.value;
              return <div>{value()}</div>;
            }
          `,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('detects untracked property access via destructuring', () => {
        invalid({
          code: `
            const Component = props => {
              const { value: valueProp } = props;
              const value = createMemo(() => valueProp || "default");
              return <div>{value()}</div>;
            };
          `,
          errors: [
            {
              messageId: 'untrackedReactive',
              line: 3,
              column: 44,
              endColumn: 49,
            },
          ],
        });
      });
      test('detects untracked property access when assigned to variable', () => {
        invalid({
          code: `
            const Component = props => {
              const valueProp = props.value;
              const value = createMemo(() => valueProp || "default");
              return <div>{value()}</div>;
            };`,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'props.value' },
            },
          ],
        });
      });
      test('detects untracked property access in createSignal initialization', () => {
        invalid({
          code: `
            const Component = props => {
              const [value] = createSignal(props.value);
            }
          `,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
    });
    describe(`mark \`props\` as props by name before we've determined if Component is a component in :exit`, () => {
      test('detects untracked property access in derived signal when called in component body', () => {
        invalid({
          code: `
            const Component = props => {
              const derived = () => props.value;
              const oops = derived();
              return <div>{oops}</div>;
            }
          `,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'derived' },
            },
          ],
        });
      });
    });
    describe(`treat first parameter of uppercase function with JSX as a props`, () => {
      test('detects untracked property access in uppercase function returning JSX', () => {
        invalid({
          code: `
            function Component(something) {
              console.log(something.a);
              return <div />;
            }
          `,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
    });
    describe(`Derived signals`, () => {
      test('detects untracked signal usage in derived signal when called in component body', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal();
              const d = () => { // <-- d becomes a derived signal
                signal();
              }
              d(); // not ok
            }
          `,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'd' },
            },
          ],
        });
      });
      test('detects untracked signal usage in derived signal function when called in component body', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal();
              function d() { // <-- d becomes a derived signal
                signal();
              }
              d(); // not ok
            }
          `,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'd' },
            },
          ],
        });
      });
      test('detects untracked signal usage in nested derived signal when called in component body', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal();
              const d = () => { // <-- d becomes a derived signal
                const e = () => { // <-- e becomes a derived signal
                  signal();
                }
                e();
              }
              d(); // not ok
            }
          `,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'd' },
            },
          ],
        });
      });
      test('detects untracked signal usage in derived signal when called in component body alongside other signals', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal1] = createSignal();
              const d = () => { // <-- d becomes a derived signal
                const [signal2] = createSignal();
                const e = () => { // <-- e becomes a derived signal
                  signal1();
                  signal2();
                }
                e(); // not ok, signal2 is in scope
              }
            }
          `,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'e' },
            },
          ],
        });
      });
      test('detects untracked signal usage through multiple derived signals when called in component body', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal();
              const foo = () => { // foo becomes a derived signal
                signal();
              }
              const bar = () => { // bar becomes a derived signal
                foo();
              }
              bar(); // not ok
            }
          `,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'bar' },
            },
          ],
        });
      });
    });
    describe(`Unused reactives`, () => {
      test('detects unused createSignal', () => {
        invalid({
          code: `
            const Component = () => {
              createSignal();
            }
          `,
          errors: [
            {
              messageId: 'shouldDestructure',
              data: { nth: 'first ' },
            },
          ],
        });
      });
      test('detects unused createSignal with only setter', () => {
        invalid({
          code: `
            const Component = () => {
              const [, setSignal] = createSignal();
            }
          `,
          errors: [
            {
              messageId: 'shouldDestructure',
              data: { nth: 'first ' },
            },
          ],
        });
      });
      test('detects unused createMemo', () => {
        invalid({
          code: `
            const Component = () => {
              createMemo(() => 5);
            }
          `,
          errors: [
            {
              messageId: 'shouldAssign',
            },
          ],
        });
      });
    });
    describe(`Uncalled signals`, () => {
      test('detects uncalled signal passed to JSX', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal();
              return <div>{signal}</div>
            }
          `,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'JSX' },
            },
          ],
        });
      });
      test('detects uncalled memo passed to JSX', () => {
        invalid({
          code: `
            const Component = () => {
              const memo = createMemo(() => 5);
              return <div>{memo}</div>
            }
          `,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'memo', where: 'JSX' },
            },
          ],
        });
      });
      test('detects uncalled signal used as attribute', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal();
              return <button type={signal}>Button</button>
            }
          `,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'JSX' },
            },
          ],
        });
      });
      test('detects uncalled signal in string concatenation', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal("world");
              const memo = createMemo(() => "hello " + signal)
            }
          `,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'arithmetic or comparisons' },
            },
          ],
        });
      });
      test('detects uncalled signal in template literal', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal("world");
              const memo = createMemo(() => \`hello \${signal}\`)
            }
          `,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'template literals' },
            },
          ],
        });
      });
      test('detects uncalled signal in unary expression', () => {
        invalid({
          code: `
            const Component = () => {
              const [signal] = createSignal(5);
              const memo = createMemo(() => -signal)
            }
          `,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'unary expressions' },
            },
          ],
        });
      });
      test('detects uncalled signal in property access', () => {
        invalid({
          code: `
            const Component = (props) => {
              const [signal] = createSignal(5);
              const memo = createMemo(() => props.array[signal])
            }
          `,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'property accesses' },
            },
          ],
        });
      });
    });
    describe(`event listeners are not rebound on native elements`, () => {
      test('detects passing props.onClick to native element without wrapping in function', () => {
        invalid({
          code: `
            const Component = props => {
              return <div onClick={props.onClick} />;
            }
          `,
          errors: [
            {
              messageId: 'expectedFunctionGotExpression',
              line: 3,
              data: { name: 'props.onClick' },
            },
          ],
        });
      });
      test('detects passing props as effect callback without wrapping in function', () => {
        invalid({
          code: `
            const Component = props => {
              createEffect(props.theEffect);
            }
          `,
          errors: [
            {
              messageId: 'expectedFunctionGotExpression',
              line: 3,
              data: { name: 'props.theEffect' },
            },
          ],
        });
      });
    });
    describe(`provider value passed as-is`, () => {
      test('detects passing props.value as-is to Context Provider', () => {
        invalid({
          code: `
            const Component = props => {
              return <SomeContext.Provider value={props.value}>{props.children}</SomeContext.Provider>;
            }
          `,
          errors: [
            { messageId: 'untrackedReactive', data: { name: 'props.value' } },
          ],
        });
      });
      test('detects passing props.value as-is to aliased Context Provider', () => {
        invalid({
          code: `
            const Component = props => {
              return <SomeProvider value={props.value}>{props.children}</SomeProvider>;
            }
          `,
          errors: [
            { messageId: 'untrackedReactive', data: { name: 'props.value' } },
          ],
        });
      });
      test('detects passing signal function call to Context Provider value', () => {
        invalid({
          code: `
            const Component = props => {
              const [signal] = createSignal();
              return <SomeContext.Provider value={signal()} someOtherProp={props.foo}>{props.children}</SomeContext.Provider>;
            }
          `,
          errors: [
            { messageId: 'untrackedReactive', data: { name: 'signal' } },
          ],
        });
      });
    });
    describe(`getOwner/runWithOwner`, () => {
      test('detects runWithOwner called in effect without assigning to named variable', () => {
        invalid({
          code: `
            const owner = getOwner();
            const [signal] = createSignal();
            createEffect(() => runWithOwner(owner, () => console.log(signal())));
          `,
          errors: [{ messageId: 'badUnnamedDerivedSignal', line: 4 }],
        });
      });
      test('detects runWithOwner called in effect inside component without assigning to named variable', () => {
        invalid({
          code: `
            function Component() {
              const owner = getOwner();
              const [signal] = createSignal();
              createEffect(() => runWithOwner(owner, () => console.log(signal())));
            }
          `,
          errors: [{ messageId: 'badUnnamedDerivedSignal', line: 5 }],
        });
      });
    });
    describe(`Async tracking scopes`, () => {
      test('detects signal access after await in createEffect', () => {
        invalid({
          code: `
            const [count, setCount] = createSignal(0);
            createEffect(async () => {
              await Promise.resolve();
              console.log(count());
            });
          `,
          errors: [{ messageId: 'noAsyncTrackedScope', line: 3 }],
        });
      });
      test('detects signal access after await in async createEffect', () => {
        invalid({
          code: `
            const [photos, setPhotos] = createSignal([]);
            createEffect(async () => {
              const res = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=20");
              setPhotos(await res.json());
            });
          `,
          errors: [{ messageId: 'noAsyncTrackedScope', line: 3 }],
        });
      });
    });
    describe(`non-function expression inside tagged template literal expression is not tracked scope`, () => {
      test('detects uncalled signal in css tagged template literal', () => {
        invalid({
          code: `
            const [signal] = createSignal("red");
            css\`color: \${signal}\`;
          `,
          errors: [{ messageId: 'badSignal', line: 3 }],
        });
      });
      test('detects uncalled derived signal in css tagged template literal', () => {
        invalid({
          code: `
            const [signal] = createSignal("red");
            const f = () => signal();
            css\`color: \${f}\`;
          `,
          errors: [{ messageId: 'badSignal', line: 4 }],
        });
      });
    });
    describe(`mapArray`, () => {
      test('detects untracked property access in mapArray second argument', () => {
        invalid({
          code: `
            function createCustomStore() {
              const [store, updateStore] = createStore({});
              return mapArray(
                [],
                (item) => store.path.to.field
              );
            }
          `,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('detects untracked signal access in mapArray second argument', () => {
        invalid({
          code: `
            const [array] = createSignal([]);
            const result = mapArray(array, (item, i) => {
              i()
            });
          `,
          errors: [{ messageId: 'untrackedReactive', line: 4 }],
        });
      });
      // Solid 2.0에서 indexArray는 제거됐다. For keyed={false} 분석으로 대체한다.
      test.skip('detects untracked signal access in indexArray second argument', () => {
        invalid({
          code: `
            const [array] = createSignal([]);
            const result = indexArray(array, (item) => {
              item()
            });
          `,
          errors: [{ messageId: 'untrackedReactive', line: 4 }],
        });
      });
    });
    describe(`static* prefix for props`, () => {
      test('detects untracked signal access passed to static prop', () => {
        invalid({
          code: `
            const [signal] = createSignal();
            let el = <Component staticProp={signal()} />;
          `,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
    });
    describe(`custom hooks`, () => {
      test('detects untracked signal access in custom hook', () => {
        invalid({
          code: `
            const [signal] = createSignal(0);
            useExample(signal())
          `,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('detects untracked signal access in array passed to custom hook', () => {
        invalid({
          code: `
            const [signal] = createSignal(0);
            useExample([signal()])
          `,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('detects untracked signal access in object passed to custom hook', () => {
        invalid({
          code: `
            const [signal] = createSignal(0);
            useExample({ value: signal() })
          `,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('detects passing IIFE to custom hook', () => {
        invalid({
          code: `
            const [signal] = createSignal(0);
            useExample((() => signal())())
          `,
          errors: [{ messageId: 'expectedFunctionGotExpression' }],
        });
      });
    });
  });
});
