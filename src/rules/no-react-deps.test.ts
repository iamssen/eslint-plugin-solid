import rule from './no-react-deps.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-react-deps', rule);
const invalid = testInvalid('no-react-deps', rule);

describe('no-react-deps', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(
        `createEffect(() => {
      console.log(signal());
    });`,
      );
    });
    test('valid case 2', () => {
      valid(
        `createEffect((prev) => {
      console.log(signal());
      return prev + 1;
    }, 0);`,
      );
    });
    test('valid case 3', () => {
      valid(
        `createEffect((prev) => {
      console.log(signal());
      return (prev || 0) + 1;
    });`,
      );
    });
    test('valid case 4', () => {
      valid(
        `createEffect((prev) => {
      console.log(signal());
      return prev ? prev + 1 : 1;
    }, undefined);`,
      );
    });
    test('valid case 5', () => {
      valid(`const value = createMemo(() => computeExpensiveValue(a(), b()));`);
    });
    test('valid case 6', () => {
      valid(`const sum = createMemo((prev) => input() + prev, 0);`);
    });
    test('valid case 7', () => {
      valid(
        `const args = [() => { console.log(signal()); }, [signal()]];
    createEffect(...args);`,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `createEffect(() => {
        console.log(signal());
      }, [signal()]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createEffect' } }],
        output: `createEffect(() => {
        console.log(signal());
      }, );`,
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `createEffect(() => {
        console.log(signal());
      }, [signal]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createEffect' } }],
        output: `createEffect(() => {
        console.log(signal());
      }, );`,
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `const deps = [signal];
      createEffect(() => {
        console.log(signal());
      }, deps);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createEffect' } }],
        // no `output`
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a(), b()]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a, b]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('invalid case 6', () => {
      invalid({
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a, b()]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('invalid case 7', () => {
      invalid({
        code: `const deps = [a, b];
      const value = createMemo(() => computeExpensiveValue(a(), b()), deps);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        // no `output`
      });
    });
    test('invalid case 8', () => {
      invalid({
        code: `const deps = [a, b];
      const memoFn = () => computeExpensiveValue(a(), b());
      const value = createMemo(memoFn, deps);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        // no `output`
      });
    });
  });
});
