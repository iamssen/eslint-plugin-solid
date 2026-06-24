import { describe, test } from 'vitest';
import rule from './no-array-handlers.js';
import { testInvalid, testValid } from './ruleTester.js';

const valid = testValid('no-array-handlers', rule);
const invalid = testInvalid('no-array-handlers', rule);

describe('no-array-handlers', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(
        `let el = <button style={{background: 'red'}} onClick={() => 9001} />`,
      );
    });
    test('valid case 2', () => {
      valid(`
        const handler = () => 1+1;
        let el = <button onClick={handler} />
      `);
    });
    test('valid case 3', () => {
      valid(`let el = <button onclick={() => 9001} />`);
    });
    test('valid case 4', () => {
      valid(`
        const handler = () => 1+1;
        let el = <button style={{background: 'pink'}} onclick={handler} />
      `);
    });
    test('valid case 5', () => {
      valid(`let el = <button attr:click={[(x) => x, 9001]} />`);
    });
    test('valid case 6', () => {
      valid(`let el = <button prop:onClick={[(x) => x, 9001]} />`);
    });
    test('valid case 7', () => {
      valid(`let el = <button on:Click={() => 1+1} />`);
    });
    test('valid case 8', () => {
      valid(`
        function Component(props) {
          return <div onClick={props.onClick} />;
        }
      `);
    });
    test('valid case 9', () => {
      valid(`<button onClick={() => [handler, "abc"]} />`);
    });
    test('valid case 10', () => {
      valid(`<button onClick={() => [handler, {data:true}]} /> `);
    });
    test('valid case 11', () => {
      valid(
        `
        function Component() {
          return <div onClick={[(n: number) => n*n, 2] as SafeArray<number>} />;
        }
      `,
        true,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let el = <button onClick={[(n) => console.log(n), 'str']} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 2', () => {
      invalid(
        {
          code: `let el = <button onClick={[(k: string) => k.toUpperCase(), 'hello']} />`,
          errors: [{ messageId: 'noArrayHandlers' }],
        },
        true,
      );
    });
    test('invalid case 3', () => {
      invalid({
        code: `let el = <div onMouseOver={[1,2,3]} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let el = <div on:click={[handler, i()]} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `let el = <button type="button" onclick={[handler, i() + 2]} class="btn" />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 6', () => {
      invalid({
        code: `let handler = [(x) => x*2, 54];
      let el = <button style={{background: 'pink'}} onclick={handler} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 7', () => {
      invalid({
        code: `const thing = (props) => <div onclick={[props.callback, props.id]}><button type="button" onclick={handler} class="btn" /></div>`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('invalid case 8', () => {
      invalid(
        {
          code: `
            function Component() {
              const arr = [(n: number) => n*n, 2];
              return <div onClick={arr} />;
            }
          `,
          errors: [{ messageId: 'noArrayHandlers' }],
        },
        true,
      );
    });
  });
});
