import { describe, test } from 'vitest';
import rule from './no-array-handlers.js';
import { testInvalid, testValid } from './ruleTester.js';

const valid = testValid('no-array-handlers', rule);
const invalid = testInvalid('no-array-handlers', rule);

describe('no-array-handlers', () => {
  describe('valid', () => {
    test('standard function event handlers are valid', () => {
      valid(
        `let el = <button style={{background: 'red'}} onClick={() => 9001} />`,
      );
    });
    test('variable function event handlers are valid', () => {
      valid(`
        const handler = () => 1+1;
        let el = <button onClick={handler} />
      `);
    });
    test('lowercase standard function event handlers are valid', () => {
      valid(`let el = <button onclick={() => 9001} />`);
    });
    test('lowercase variable function event handlers are valid', () => {
      valid(`
        const handler = () => 1+1;
        let el = <button style={{background: 'pink'}} onclick={handler} />
      `);
    });
    test('array handlers are valid for attr: namespace', () => {
      valid(`let el = <button attr:click={[(x) => x, 9001]} />`);
    });
    test('array handlers are valid for prop: namespace', () => {
      valid(`let el = <button prop:onClick={[(x) => x, 9001]} />`);
    });
    test('function handlers are valid for on: namespace', () => {
      valid(`let el = <button on:Click={() => 1+1} />`);
    });
    test('props passed as event handlers are valid', () => {
      valid(`
        function Component(props) {
          return <div onClick={props.onClick} />;
        }
      `);
    });
    test('functions returning arrays are valid', () => {
      valid(`<button onClick={() => [handler, "abc"]} />`);
    });
    test('functions returning arrays with objects are valid', () => {
      valid(`<button onClick={() => [handler, {data:true}]} /> `);
    });
    test('array handlers casted with as are valid', () => {
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
    test('detects array syntax for standard event handlers', () => {
      invalid({
        code: `let el = <button onClick={[(n) => console.log(n), 'str']} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('detects array syntax with typescript types for standard event handlers', () => {
      invalid(
        {
          code: `let el = <button onClick={[(k: string) => k.toUpperCase(), 'hello']} />`,
          errors: [{ messageId: 'noArrayHandlers' }],
        },
        true,
      );
    });
    test('detects array syntax without functions for standard event handlers', () => {
      invalid({
        code: `let el = <div onMouseOver={[1,2,3]} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('detects array syntax for on: namespace event handlers', () => {
      invalid({
        code: `let el = <div on:click={[handler, i()]} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('detects array syntax for lowercase standard event handlers', () => {
      invalid({
        code: `let el = <button type="button" onclick={[handler, i() + 2]} class="btn" />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('detects array syntax passed as variables', () => {
      invalid({
        code: `let handler = [(x) => x*2, 54];
      let el = <button style={{background: 'pink'}} onclick={handler} />`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('detects array syntax for event handlers inside nested components', () => {
      invalid({
        code: `const thing = (props) => <div onclick={[props.callback, props.id]}><button type="button" onclick={handler} class="btn" /></div>`,
        errors: [{ messageId: 'noArrayHandlers' }],
      });
    });
    test('detects array syntax passed as variables with typescript types', () => {
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
