import rule from './no-array-handlers.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('no-array-handlers', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'no-array-handlers',
        rule,
        `let el = <button style={{background: 'red'}} onClick={() => 9001} />`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'no-array-handlers',
        rule,
        `const handler = () => 1+1;
    let el = <button onClick={handler} />`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'no-array-handlers',
        rule,
        `let el = <button onclick={() => 9001} />`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'no-array-handlers',
        rule,
        `const handler = () => 1+1;
    let el = <button style={{background: 'pink'}} onclick={handler} />`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'no-array-handlers',
        rule,
        `let el = <button attr:click={[(x) => x, 9001]} />`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'no-array-handlers',
        rule,
        `let el = <button prop:onClick={[(x) => x, 9001]} />`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'no-array-handlers',
        rule,
        `let el = <button on:Click={() => 1+1} />`,
      );
    });
    test('valid case 8', () => {
      testValid(
        'no-array-handlers',
        rule,
        `function Component(props) {
      return <div onClick={props.onClick} />;
    }`,
      );
    });
    test('valid case 9', () => {
      testValid(
        'no-array-handlers',
        rule,
        `<button onClick={() => [handler, "abc"]} />`,
      );
    });
    test('valid case 10', () => {
      testValid(
        'no-array-handlers',
        rule,
        `<button onClick={() => [handler, {data:true}]} /> `,
      );
    });
    test('valid case 11', () => {
      testValid(
        'no-array-handlers',
        rule,
        `function Component() {
      return <div onClick={[(n: number) => n*n, 2] as SafeArray<number>} />;
    }`,
        true,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('no-array-handlers', rule, {
        code: `let el = <button onClick={[(n) => console.log(n), 'str']} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 2', () => {
      testInvalid(
        'no-array-handlers',
        rule,
        {
          code: `let el = <button onClick={[(k: string) => k.toUpperCase(), 'hello']} />`,
          errors: [{ messageId: 'noArrayHandlers' }],
        },
        true,
      );
    });
    test('invalid case 3', () => {
      testInvalid('no-array-handlers', rule, {
        code: `let el = <div onMouseOver={[1,2,3]} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 4', () => {
      testInvalid('no-array-handlers', rule, {
        code: `let el = <div on:click={[handler, i()]} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 5', () => {
      testInvalid('no-array-handlers', rule, {
        code: `let el = <button type="button" onclick={[handler, i() + 2]} class="btn" />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 6', () => {
      testInvalid('no-array-handlers', rule, {
        code: `let handler = [(x) => x*2, 54];
      let el = <button style={{background: 'pink'}} onclick={handler} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 7', () => {
      testInvalid('no-array-handlers', rule, {
        code: `const thing = (props) => <div onclick={[props.callback, props.id]}><button type="button" onclick={handler} class="btn" /></div>`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 8', () => {
      testInvalid(
        'no-array-handlers',
        rule,
        {
          code: `function Component() {
      const arr = [(n: number) => n*n, 2];
      return <div onClick={arr} />;
    }`,
          errors: [{ messageId: 'noArrayHandlers' }],
        },
        true,
      );
    });
  });
});
