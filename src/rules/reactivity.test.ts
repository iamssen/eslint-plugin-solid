import rule from './reactivity.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('reactivity', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'reactivity',
        rule,
        `function MyComponent(props) {
      return <div>Hello {props.name}</div>;
    }
    let el = <MyComponent name="Solid" />;`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'reactivity',
        rule,
        `const [first, setFirst] = createSignal("JSON");
    const [last, setLast] = createSignal("Bourne");
    createEffect(() => console.log(\`\${first()} \${last()}\`));`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'reactivity',
        rule,
        `let Component = props => {
      return <div>{props.value || "default"}</div>;
    };`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'reactivity',
        rule,
        `let Component = props => {
      const value = () => props.value || "default";
      return <div>{value()}</div>;
    };`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'reactivity',
        rule,
        `let Component = props => {
      const value = createMemo(() => props.value || "default");
      return <div>{value()}</div>;
    };`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'reactivity',
        rule,
        `let Component = _props => {
      const props = mergeProps({ value: "default" }, _props);
      return <div>{props.value}</div>;
    };`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'reactivity',
        rule,
        `let Component = _props => {
      const [foo, bar, baz] = splitProps(_props, ["foo"], ["bar"]);
      return <div>{foo.foo} {bar.bar} {baz.baz}</div>;
    }`,
      );
    });
    test('valid case 8', () => {
      testValid(
        'reactivity',
        rule,
        `let Component = () => {
      const [a, setA] = createSignal(1);
      const [b, setB] = createSignal(1);
      createEffect(() => {
        console.log(a(), untrack(b));
      });
    }`,
      );
    });
    test('valid case 9', () => {
      testValid(
        'reactivity',
        rule,
        `function Component(props) {
      const [value, setValue] = createSignal();
      return <div class={props.class}>{value()}</div>;
    }`,
      );
    });
    test('valid case 10', () => {
      testValid(
        'reactivity',
        rule,
        `function Component(props) {
      const [value, setValue] = createSignal();
      createEffect(() => console.log(value()));
      return <div class={props.class}>{value()}</div>;
    }`,
      );
    });
    test('valid case 11', () => {
      testValid(
        'reactivity',
        rule,
        `const [value, setValue] = createSignal();
    on(value, () => console.log('hello'));`,
      );
    });
    test('valid case 12', () => {
      testValid(
        'reactivity',
        rule,
        `const [value, setValue] = createSignal();
    on([value], () => console.log('hello'));`,
      );
    });
    describe(`spreading props`, () => {
      test('valid case 13', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      return <div {...props} />;
    }`,
        );
      });
      test('valid case 14', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      return <div {...props.nestedProps} />;
    }`,
        );
      });
      test('valid case 15', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      const [signal, setSignal] = createSignal({});
      return <div {...signal()} />;
    }`,
        );
      });
    });
    describe(`Derived signals`, () => {
      test('valid case 16', () => {
        testValid(
          'reactivity',
          rule,
          `let c = () => {
      const [signal] = createSignal();
      const d = () => {
        function e() { // <-- e becomes a derived signal
          signal();
        }
      } // <-- d never uses it
      d(); // <-- this is fine
    };`,
        );
      });
      test('valid case 17', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal] = createSignal();
    createEffect(() => console.log(signal()));`,
        );
      });
      test('valid case 18', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal] = createSignal();
    const memo = createMemo(() => signal());`,
        );
      });
      test('valid case 19', () => {
        testValid(
          'reactivity',
          rule,
          `const el = <button onClick={() => toggleShow(!show())}>
      {show() ? "Hide" : "Show"}
    </button>`,
        );
      });
      test('valid case 20', () => {
        testValid(
          'reactivity',
          rule,
          `const [count] = createSignal();
    createEffect(() => {
      (() => count())()
    })`,
        );
      });
      test('valid case 21', () => {
        testValid(
          'reactivity',
          rule,
          `const [count] = createSignal();
    const el = <div>{(() => count())()}</div>`,
        );
      });
      test('valid case 22', () => {
        testValid(
          'reactivity',
          rule,
          `const [count, setCount] = createSignal();
    const el = <button type="button" onClick={() => setCount(count() + 1)}>Increment</button>;`,
        );
      });
    });
    describe(`Parse top level JSX`, () => {
      test('valid case 23', () => {
        testValid('reactivity', rule, `const el = <div />`);
      });
    });
    describe(`getOwner/runWithOwner`, () => {
      test('valid case 24', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal] = createSignal();
    createEffect(() => {
      const owner = getOwner();
      runWithOwner(owner, () => console.log(signal()));
    });`,
        );
      });
      test('valid case 25', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal] = createSignal();
    createEffect(() => {
      runWithOwner(undefined, () => console.log(signal()));
    });`,
        );
      });
    });
    describe(`Sync callbacks`, () => {
      test('valid case 26', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal] = createSignal();
    createEffect(() => {
      [1, 2].forEach(() => console.log(signal()));
    });`,
        );
      });
      test('valid case 27', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      createEffect(() => {
        [1, 2].forEach(() => console.log(props.foo));
      });
      return <div />;
    }`,
        );
      });
      test('valid case 28', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(bleargh /* doesn't match props regex */) {
      createEffect(() => {
        [1, 2].forEach(() => console.log(bleargh.foo));
      });
      return <div />;
    }`,
        );
      });
    });
    describe(`Timers`, () => {
      test('valid case 29', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal] = createSignal(5);
    setTimeout(() => console.log(signal()), 500);
    setInterval(() => console.log(signal()), 600);
    setImmediate(() => console.log(signal()));
    requestAnimationFrame(() => console.log(signal()));
    requestIdleCallback(() => console.log(signal()));`,
        );
      });
    });
    describe(`Observers from Standard Web APIs`, () => {
      test('valid case 30', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal] = createSignal(5);
    new IntersectionObserver(() => console.log(signal()));
    new MutationObserver(() => console.log(signal()));
    new PerformanceObserver(() => console.log(signal()));
    new ReportingObserver(() => console.log(signal()));
    new ResizeObserver(() => console.log(signal()));`,
        );
      });
    });
    describe(`Async tracking scope exceptions`, () => {
      test('valid case 31', () => {
        testValid(
          'reactivity',
          rule,
          `const [photos, setPhotos] = createSignal([]);
    onMount(async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=20");
      setPhotos(await res.json());
    });`,
        );
      });
      test('valid case 32', () => {
        testValid(
          'reactivity',
          rule,
          `const [a, setA] = createSignal(1);
    const [b] = createSignal(2);
    on(b, async () => { await delay(1000); setA(a() + 1) });`,
        );
      });
    });
    describe(`Custom hooks`, () => {
      test('valid case 33', () => {
        testValid(
          'reactivity',
          rule,
          `const Component = (props) => {
      const localRef = () => props.ref;
      const composedRef1 = useComposedRefs(localRef);
      const composedRef2 = useComposedRefs(() => props.ref);
      const composedRef3 = createComposedRefs(localRef);
    }`,
        );
      });
      test('valid case 34', () => {
        testValid(
          'reactivity',
          rule,
          `function createFoo(v) {}
    const [bar, setBar] = createSignal();
    createFoo({ onBar: () => bar() });`,
        );
      });
      test('valid case 35', () => {
        testValid(
          'reactivity',
          rule,
          `function createFoo(v) {}
    const [bar, setBar] = createSignal();
    createFoo({ onBar() { bar() } });`,
        );
      });
      test('valid case 36', () => {
        testValid(
          'reactivity',
          rule,
          `function createFoo(v) {}
    const [bar, setBar] = createSignal();
    createFoo(bar);`,
        );
      });
      test('valid case 37', () => {
        testValid(
          'reactivity',
          rule,
          `function createFoo(v) {}
    const [bar, setBar] = createSignal();
    createFoo([bar]);`,
        );
      });
      test('valid case 38', () => {
        testValid(
          'reactivity',
          rule,
          `function createFoo(v) {}
      const [bar, setBar] = createSignal();
      createFoo({ onBar: () => bar() } as object);`,
          true,
        );
      });
      test('valid case 39', () => {
        testValid(
          'reactivity',
          rule,
          `const [bar, setBar] = createSignal();
    X.createFoo(() => bar());`,
        );
      });
      test('valid case 40', () => {
        testValid(
          'reactivity',
          rule,
          `const [bar, setBar] = createSignal();
    X . Y\n. createFoo(() => bar());`,
        );
      });
      test('valid case 41', () => {
        testValid('reactivity', rule, {
          code: `function customQuery(v) {}
      const [signal, setSignal] = createSignal();
      customQuery(() => signal());`,
          options: [{ customReactiveFunctions: ['customQuery'] }], // only needed when not create*/use*
        });
      });
    });
    describe(`Event listeners`, () => {
      test('valid case 42', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal, setSignal] = createSignal(1);
    const element = document.getElementById("id");
    element.addEventListener("click", () => {
      console.log(signal());
    }, { once: true });`,
        );
      });
      test('valid case 43', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal, setSignal] = createSignal(1);
    const element = document.getElementById("id");
    element.onclick = () => {
      console.log(signal());
    };`,
        );
      });
      test('valid case 44', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      const [signal, setSignal] = createSignal(1);
      return <div onClick={() => console.log(signal())} />;
    }`,
        );
      });
      test('valid case 45', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      const [signal, setSignal] = createSignal(1);
      const handler = () => console.log(signal());
      return <div onClick={handler} />;
    }`,
        );
      });
      test('valid case 46', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      const [signal, setSignal] = createSignal(1);
      return <div onClick={signal} />;
    }`,
        );
      });
      test('valid case 47', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      const [signal, setSignal] = createSignal(1);
      return <div on:click={() => console.log(signal())} />;
    }`,
        );
      });
      test('valid case 48', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      return <div onClick={e => props.onClick(e)} />;
    }`,
        );
      });
    });
    describe(`event listeners are reactive on components`, () => {
      test('valid case 49', () => {
        testValid(
          'reactivity',
          rule,
          `const Parent = props => {
      return <Child onClick={props.onClick} />;
    }`,
        );
      });
      test('valid case 50', () => {
        testValid(
          'reactivity',
          rule,
          `const Parent = props => {
      return <Child onClick={e => props.onClick(e)} />;
    }`,
        );
      });
    });
    describe(`Pass reactive variables as-is into provider value prop`, () => {
      test('valid case 51', () => {
        testValid(
          'reactivity',
          rule,
          `const Component = props => {
      const [signal] = createSignal();
      return <SomeContext.Provider value={signal}>{props.children}</SomeContext.Provider>;
    }`,
        );
      });
    });
    describe(`Don't warn on using props.initial* or props.default* for initialization`, () => {
      test('valid case 52', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      const [count, setCount] = useSignal(props.initialCount);
      return <div>{count()}</div>;
    }`,
        );
      });
      test('valid case 53', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      const [count, setCount] = useSignal(props.defaultCount);
      return <div>{count()}</div>;
    }`,
        );
      });
    });
    describe(`Store getters`, () => {
      test('valid case 54', () => {
        testValid(
          'reactivity',
          rule,
          `const [state, setState] = createStore({
      firstName: 'Will',
      lastName: 'Smith',
      get fullName() {
        return state.firstName + " " + state.lastName;
      }
    });`,
        );
      });
    });
    describe(`untrack()`, () => {
      test('valid case 55', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal] = createSignal(5);
    untrack(() => {
      console.log(signal());
    });`,
        );
      });
    });
    describe(`has JSX, but lowercase function and not named props => don't treat first parameter as props`, () => {
      test('valid case 56', () => {
        testValid(
          'reactivity',
          rule,
          `function notAComponent(something) {
      console.log(something.a);
      return <div />;
    }`,
        );
      });
    });
    describe(`function expression inside tagged template literal expression is tracked scope`, () => {
      test('valid case 57', () => {
        testValid('reactivity', rule, 'css`color: ${props => props.color}`;');
      });
      test('valid case 58', () => {
        testValid(
          'reactivity',
          rule,
          'html`<div>${props => props.name}</div>`;',
        );
      });
      test('valid case 59', () => {
        testValid(
          'reactivity',
          rule,
          'styled.css`color: ${props => props.color};`',
        );
      });
    });
    describe(`refs`, () => {
      test('valid case 60', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      let canvas;
      return <canvas ref={canvas} />;
    }`,
        );
      });
      test('valid case 61', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      let canvas;
      return (
        <canvas ref={c => {
          canvas = c;
        }} />
      );
    }`,
        );
      });
      test('valid case 62', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      const [index] = createSignal(0);
      let canvas;
      return (
        <canvas ref={c => {
          index();
          canvas = c;
        }} />
      );
    }`,
        );
      });
      test('valid case 63', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      const [canvas, setCanvas] = createSignal();
      return <canvas ref={c => setCanvas(c)} />;
    }`,
        );
      });
    });
    describe(`mapArray()`, () => {
      test('valid case 64', () => {
        testValid(
          'reactivity',
          rule,
          `function createCustomStore() {
      const [store, updateStore] = createStore({});

      return mapArray(
        // the first argument to mapArray is a tracked scope
        () => store.path.to.field,
        (item) => ({})
      );
    }`,
        );
      });
      test('valid case 65', () => {
        testValid(
          'reactivity',
          rule,
          `function createCustomStore() {
      const [store, updateStore] = createStore({});

      return indexArray(
        // the first argument to mapArray is a tracked scope
        () => store.path.to.field,
        (item) => ({})
      );
    }`,
        );
      });
    });
    describe(`type casting`, () => {
      test('valid case 66', () => {
        testValid(
          'reactivity',
          rule,
          `const m = createMemo(() => 5) as Accessor<number>;`,
          true,
        );
      });
      test('valid case 67', () => {
        testValid('reactivity', rule, `const m = createMemo(() => 5)!;`, true);
      });
      test('valid case 68', () => {
        testValid(
          'reactivity',
          rule,
          `const m = createMemo(() => 5)! as Accessor<number>;`,
          true,
        );
      });
      test('valid case 69', () => {
        testValid(
          'reactivity',
          rule,
          `const m = createMemo(() => 5) satisfies Accessor<number>;`,
          true,
        );
      });
      test('valid case 70', () => {
        testValid(
          'reactivity',
          rule,
          `const [s] = createSignal('a' as string)`,
          true,
        );
      });
      test('valid case 71', () => {
        testValid('reactivity', rule, `createFoo('a' as string)`, true);
      });
    });
    describe(`functions in JSXExpressionContainers`, () => {
      test('valid case 72', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      return (
        <div>{() => {
          console.log('hello');
          return props.greeting;
        }}</div>
      );
    }`,
        );
      });
    });
    describe(`passing function instead of signal`, () => {
      test('valid case 73', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal, setSignal] = createSignal();
    let el = <Child foo={() => signal()}></Child>`,
        );
      });
    });
    describe(`static* prefix for props`, () => {
      test('valid case 74', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      const value = props.staticValue;
    }`,
        );
      });
      test('valid case 75', () => {
        testValid(
          'reactivity',
          rule,
          `function Component() {
      const staticValue = () => props.value;
      const value = staticValue();
    }`,
        );
      });
    });
    describe(`observable`, () => {
      test('valid case 76', () => {
        testValid(
          'reactivity',
          rule,
          `function Component(props) {
      const count$ = observable(() => props.count);
      return <div />;
    }`,
        );
      });
      test('valid case 77', () => {
        testValid(
          'reactivity',
          rule,
          `const [signal, setSignal] = createSignal(0);
    const value$ = observable(signal);`,
        );
      });
    });
    describe(`use: functions`, () => {
      test('valid case 78', () => {
        testValid(
          'reactivity',
          rule,
          `let someHook;
    function Component(props) {
      return <div use:someHook={() => props.count} />;
    }`,
        );
      });
    });
    describe(`f*cking insane edge case with multiple functions taking props as sync callbacks (#110)`, () => {
      test('valid case 79', () => {
        testValid(
          'reactivity',
          rule,
          `function formObjectDispatch(formObject, action) {
      const { field } = action.payload;
      formObject.findIndex((props) => props.field === field);
      formObject.findIndex((props) => props.field === field);
    }`,
        );
      });
    });
  });
  describe('invalid', () => {
    describe(`Untracked signals`, () => {
      test('invalid case 1', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal(5);
        console.log(signal());
        return null;
      }`,
          errors: [{ messageId: 'untrackedReactive', line: 4 }],
        });
      });
      test('invalid case 2', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal(5);
        console.log(signal());
        return <div>{signal()}</div>
      }`,
          errors: [{ messageId: 'untrackedReactive', line: 4 }],
        });
      });
    });
    describe(`Untracked property access`, () => {
      test('invalid case 3', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        const value = props.value;
        return <div>{value()}</div>;
      }`,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('invalid case 4', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        const { value: valueProp } = props;
        const value = createMemo(() => valueProp || "default");
        return <div>{value()}</div>;
      };`,
          errors: [
            {
              messageId: 'untrackedReactive',
              line: 3,
              column: 38,
              endColumn: 43,
            },
          ],
        });
      });
      test('invalid case 5', () => {
        testInvalid('reactivity', rule, {
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
      test('invalid case 6', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        const [value] = createSignal(props.value);
      }`,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
    });
    describe(`mark \`props\` as props by name before we've determined if Component is a component in :exit`, () => {
      test('invalid case 7', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        const derived = () => props.value;
        const oops = derived();
        return <div>{oops}</div>;
      }`,
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
      test('invalid case 8', () => {
        testInvalid('reactivity', rule, {
          code: `
      function Component(something) {
        console.log(something.a);
        return <div />;
      }`,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
    });
    describe(`Derived signals`, () => {
      test('invalid case 9', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal();
        const d = () => { // <-- d becomes a derived signal
          signal();
        }
        d(); // not ok
      }`,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'd' },
            },
          ],
        });
      });
      test('invalid case 10', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal();
        function d() { // <-- d becomes a derived signal
          signal();
        }
        d(); // not ok
      }`,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'd' },
            },
          ],
        });
      });
      test('invalid case 11', () => {
        testInvalid('reactivity', rule, {
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
      }`,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'd' },
            },
          ],
        });
      });
      test('invalid case 12', () => {
        testInvalid('reactivity', rule, {
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
      }`,
          errors: [
            {
              messageId: 'untrackedReactive',
              data: { name: 'e' },
            },
          ],
        });
      });
      test('invalid case 13', () => {
        testInvalid('reactivity', rule, {
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
      }`,
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
      test('invalid case 14', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        createSignal();
      }`,
          errors: [
            {
              messageId: 'shouldDestructure',
              data: { nth: 'first ' },
            },
          ],
        });
      });
      test('invalid case 15', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [, setSignal] = createSignal();
      }`,
          errors: [
            {
              messageId: 'shouldDestructure',
              data: { nth: 'first ' },
            },
          ],
        });
      });
      test('invalid case 16', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        createMemo(() => 5);
      }`,
          errors: [
            {
              messageId: 'shouldAssign',
            },
          ],
        });
      });
    });
    describe(`Uncalled signals`, () => {
      test('invalid case 17', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal();
        return <div>{signal}</div>
      }`,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'JSX' },
            },
          ],
        });
      });
      test('invalid case 18', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const memo = createMemo(() => 5);
        return <div>{memo}</div>
      }`,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'memo', where: 'JSX' },
            },
          ],
        });
      });
      test('invalid case 19', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal();
        return <button type={signal}>Button</button>
      }`,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'JSX' },
            },
          ],
        });
      });
      test('invalid case 20', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal("world");
        const memo = createMemo(() => "hello " + signal)
      }`,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'arithmetic or comparisons' },
            },
          ],
        });
      });
      test('invalid case 21', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal("world");
        const memo = createMemo(() => \`hello \${signal}\`)
      }`,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'template literals' },
            },
          ],
        });
      });
      test('invalid case 22', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = () => {
        const [signal] = createSignal(5);
        const memo = createMemo(() => -signal)
      }`,
          errors: [
            {
              messageId: 'badSignal',
              line: 4,
              data: { name: 'signal', where: 'unary expressions' },
            },
          ],
        });
      });
      test('invalid case 23', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = (props) => {
        const [signal] = createSignal(5);
        const memo = createMemo(() => props.array[signal])
      }`,
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
      test('invalid case 24', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        return <div onClick={props.onClick} />;
      }`,
          errors: [
            {
              messageId: 'expectedFunctionGotExpression',
              line: 3,
              data: { name: 'props.onClick' },
            },
          ],
        });
      });
      test('invalid case 25', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        createEffect(props.theEffect);
      }`,
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
      test('invalid case 26', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        return <SomeContext.Provider value={props.value}>{props.children}</SomeContext.Provider>;
      }`,
          errors: [
            { messageId: 'untrackedReactive', data: { name: 'props.value' } },
          ],
        });
      });
      test('invalid case 27', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        return <SomeProvider value={props.value}>{props.children}</SomeProvider>;
      }`,
          errors: [
            { messageId: 'untrackedReactive', data: { name: 'props.value' } },
          ],
        });
      });
      test('invalid case 28', () => {
        testInvalid('reactivity', rule, {
          code: `
      const Component = props => {
        const [signal] = createSignal();
        return <SomeContext.Provider value={signal()} someOtherProp={props.foo}>{props.children}</SomeContext.Provider>;
      }`,
          errors: [
            { messageId: 'untrackedReactive', data: { name: 'signal' } },
          ],
        });
      });
    });
    describe(`getOwner/runWithOwner`, () => {
      test('invalid case 29', () => {
        testInvalid('reactivity', rule, {
          code: `
      const owner = getOwner();
      const [signal] = createSignal();
      createEffect(() => runWithOwner(owner, () => console.log(signal())));`,
          errors: [{ messageId: 'badUnnamedDerivedSignal', line: 4 }],
        });
      });
      test('invalid case 30', () => {
        testInvalid('reactivity', rule, {
          code: `
      function Component() {
        const owner = getOwner();
        const [signal] = createSignal();
        createEffect(() => runWithOwner(owner, () => console.log(signal())));
      }`,
          errors: [{ messageId: 'badUnnamedDerivedSignal', line: 5 }],
        });
      });
    });
    describe(`Async tracking scopes`, () => {
      test('invalid case 31', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [count, setCount] = createSignal(0);
      createEffect(async () => {
        await Promise.resolve();
        console.log(count());
      });`,
          errors: [{ messageId: 'noAsyncTrackedScope', line: 3 }],
        });
      });
      test('invalid case 32', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [photos, setPhotos] = createSignal([]);
      createEffect(async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=20");
        setPhotos(await res.json());
      });`,
          errors: [{ messageId: 'noAsyncTrackedScope', line: 3 }],
        });
      });
    });
    describe(`non-function expression inside tagged template literal expression is not tracked scope`, () => {
      test('invalid case 33', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [signal] = createSignal("red");
      css\`color: \${signal}\`;`,
          errors: [{ messageId: 'badSignal', line: 3 }],
        });
      });
      test('invalid case 34', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [signal] = createSignal("red");
      const f = () => signal();
      css\`color: \${f}\`;`,
          errors: [{ messageId: 'badSignal', line: 4 }],
        });
      });
    });
    describe(`mapArray`, () => {
      test('invalid case 35', () => {
        testInvalid('reactivity', rule, {
          code: `
      function createCustomStore() {
        const [store, updateStore] = createStore({});
        return mapArray(
          [],
          (item) => store.path.to.field
        );
      }`,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('invalid case 36', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [array] = createSignal([]);
      const result = mapArray(array, (item, i) => {
        i()
      });`,
          errors: [{ messageId: 'untrackedReactive', line: 4 }],
        });
      });
      test('invalid case 37', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [array] = createSignal([]);
      const result = indexArray(array, (item) => {
        item()
      });`,
          errors: [{ messageId: 'untrackedReactive', line: 4 }],
        });
      });
    });
    describe(`static* prefix for props`, () => {
      test('invalid case 38', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [signal] = createSignal();
      let el = <Component staticProp={signal()} />;`,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
    });
    describe(`custom hooks`, () => {
      test('invalid case 39', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [signal] = createSignal(0);
      useExample(signal())`,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('invalid case 40', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [signal] = createSignal(0);
      useExample([signal()])`,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('invalid case 41', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [signal] = createSignal(0);
      useExample({ value: signal() })`,
          errors: [{ messageId: 'untrackedReactive' }],
        });
      });
      test('invalid case 42', () => {
        testInvalid('reactivity', rule, {
          code: `
      const [signal] = createSignal(0);
      useExample((() => signal())())`,
          errors: [{ messageId: 'expectedFunctionGotExpression' }],
        });
      });
    });
  });
});
