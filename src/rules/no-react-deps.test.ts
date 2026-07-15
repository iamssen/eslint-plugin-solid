import { describe, test } from 'vitest';
import rule from './no-react-deps.js';
import { testInvalid, testValid } from './ruleTester.js';

const valid = testValid('no-react-deps', rule);
const invalid = testInvalid('no-react-deps', rule);

describe('no-react-deps', () => {
  describe('valid', () => {
    test('createEffect without dependency array is valid', () => {
      valid(`
        createEffect(() => {
          console.log(signal());
        });
      `);
    });
    // Solid 2.0에서 createEffect의 두 번째 인수는 initialValue가 아니라 apply 함수다.
    test.skip('createEffect with initial value is valid', () => {
      valid(`
        createEffect((prev) => {
          console.log(signal());
          return prev + 1;
        }, 0);
      `);
    });
    test('createEffect with logical OR initial value is valid', () => {
      valid(`
        createEffect((prev) => {
          console.log(signal());
          return (prev || 0) + 1;
        });
      `);
    });
    // Solid 2.0에서 createEffect의 두 번째 인수는 initialValue가 아니라 apply 함수다.
    test.skip('createEffect with undefined initial value is valid', () => {
      valid(`
        createEffect((prev) => {
          console.log(signal());
          return prev ? prev + 1 : 1;
        }, undefined);
      `);
    });
    test('createMemo without dependency array is valid', () => {
      valid(`const value = createMemo(() => computeExpensiveValue(a(), b()));`);
    });
    // Solid 2.0에서 createMemo initialValue 인수는 제거됐다.
    test.skip('createMemo with initial value is valid', () => {
      valid(`const sum = createMemo((prev) => input() + prev, 0);`);
    });
    test('createEffect with spread arguments is valid', () => {
      valid(`
        const args = [() => { console.log(signal()); }, [signal()]];
        createEffect(...args);
      `);
    });
  });
  describe('invalid', () => {
    test('detects createEffect with dependency array', () => {
      invalid({
        code: `
          createEffect(() => {
              console.log(signal());
          }, [signal()]);
        `,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createEffect' } }],
        output: `
          createEffect(() => {
            console.log(signal());
          }, );
        `,
      });
    });
    test('detects createEffect with identifier in dependency array', () => {
      invalid({
        code: `
          createEffect(() => {
            console.log(signal());
          }, [signal]);
        `,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createEffect' } }],
        output: `
          createEffect(() => {
            console.log(signal());
          }, );
        `,
      });
    });
    test('detects createEffect with variable as dependency array', () => {
      invalid({
        code: `
          const deps = [signal];
          createEffect(() => {
            console.log(signal());
          }, deps);
        `,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createEffect' } }],
        // no `output`
      });
    });
    test('detects createMemo with dependency array', () => {
      invalid({
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a(), b()]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('detects createMemo with identifiers in dependency array', () => {
      invalid({
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a, b]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('detects createMemo with mixed dependency array', () => {
      invalid({
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a, b()]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('detects createMemo with variable as dependency array', () => {
      invalid({
        code: `
          const deps = [a, b];
          const value = createMemo(() => computeExpensiveValue(a(), b()), deps);
        `,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        // no `output`
      });
    });
    test('detects createMemo with variable function and dependency array', () => {
      invalid({
        code: `
          const deps = [a, b];
          const memoFn = () => computeExpensiveValue(a(), b());
          const value = createMemo(memoFn, deps);
        `,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        // no `output`
      });
    });
  });
});
