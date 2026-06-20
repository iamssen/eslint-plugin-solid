import rule from './no-react-deps.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('no-react-deps', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'no-react-deps',
        rule,
        `createEffect(() => {
      console.log(signal());
    });`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'no-react-deps',
        rule,
        `createEffect((prev) => {
      console.log(signal());
      return prev + 1;
    }, 0);`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'no-react-deps',
        rule,
        `createEffect((prev) => {
      console.log(signal());
      return (prev || 0) + 1;
    });`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'no-react-deps',
        rule,
        `createEffect((prev) => {
      console.log(signal());
      return prev ? prev + 1 : 1;
    }, undefined);`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'no-react-deps',
        rule,
        `const value = createMemo(() => computeExpensiveValue(a(), b()));`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'no-react-deps',
        rule,
        `const sum = createMemo((prev) => input() + prev, 0);`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'no-react-deps',
        rule,
        `const args = [() => { console.log(signal()); }, [signal()]];
    createEffect(...args);`,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('no-react-deps', rule, {
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
      testInvalid('no-react-deps', rule, {
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
      testInvalid('no-react-deps', rule, {
        code: `const deps = [signal];
      createEffect(() => {
        console.log(signal());
      }, deps);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createEffect' } }],
        // no `output`
      });
    });
    test('invalid case 4', () => {
      testInvalid('no-react-deps', rule, {
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a(), b()]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('invalid case 5', () => {
      testInvalid('no-react-deps', rule, {
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a, b]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('invalid case 6', () => {
      testInvalid('no-react-deps', rule, {
        code: `const value = createMemo(() => computeExpensiveValue(a(), b()), [a, b()]);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        output: `const value = createMemo(() => computeExpensiveValue(a(), b()), );`,
      });
    });
    test('invalid case 7', () => {
      testInvalid('no-react-deps', rule, {
        code: `const deps = [a, b];
      const value = createMemo(() => computeExpensiveValue(a(), b()), deps);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        // no `output`
      });
    });
    test('invalid case 8', () => {
      testInvalid('no-react-deps', rule, {
        code: `const deps = [a, b];
      const memoFn = () => computeExpensiveValue(a(), b());
      const value = createMemo(memoFn, deps);`,
        errors: [{ messageId: 'noUselessDep', data: { name: 'createMemo' } }],
        // no `output`
      });
    });
  });
});
