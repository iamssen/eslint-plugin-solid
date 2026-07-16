import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('components-return-once', rule);
const invalid = testInvalid('components-return-once', rule);

describe('components-return-once', () => {
  describe('valid', () => {
    test('standard component with a single return is valid', () => {
      valid(`
        function Component() {
          return <div />;
        }
      `);
    });
    test('early return is permitted in standard functions', () => {
      valid(`
        function someFunc() {
          if (condition) {
            return 5;
          }
          return 10;
        }
      `);
    });
    test('early return is permitted in functions not used as components', () => {
      valid(`
        function notAComponent() {
          if (condition) {
            return <div />;
          }
          return <div />;
        }
      `);
    });
    test('early return is permitted inside callbacks', () => {
      valid(`
        callback(() => {
          if (condition) {
            return <div />;
          }
          return <div />;
        });
      `);
    });
    test('early return is permitted inside inner functions in a component', () => {
      valid(`
        function Component() {
          const renderContent = () => {
            if (false) return <></>;
            return <></>;
          }
          return <>{renderContent()}</>;
        }
      `);
    });
    test('early return is permitted inside inner function declarations in a component', () => {
      valid(`
        function Component() {
          function renderContent() {
            if (false) return <></>;
            return <></>;
          }
          return <>{renderContent()}</>;
        }
      `);
    });
    test('early return is permitted inside deeply nested inner functions', () => {
      valid(`
        function Component() {
          const renderContent = () => {
            const renderContentInner = () => {
              // ifs in render functions are fine no matter what nesting level this is
              if (false) return;
              return <></>;
            };
            return <>{renderContentInner()}</>;
          };
          return <></>;
        }
      `);
    });
    test('hoisted functions can be used in component returns', () => {
      valid(`
        function Component() {
          return <>{hoisted()}</>;
          function hoisted() {
            return 'hoisted';
          }
        }
      `);
    });
    test('component can have trailing variable declarations after return', () => {
      valid(`
        function Component() {
          return <></>;
          const hoisted = 'hoisted';
        }`);
    });
    test('component can have trailing class declarations after return', () => {
      valid(`
        function Component() {
          return <></>;
          class Hoisted {}
        }`);
    });
  });
  describe('invalid', () => {
    describe(`Early returns`, () => {
      test('early return inside a component breaks reactivity', () => {
        invalid({
          code: `
            function Component() {
              if (condition) {
                return <div />;
              };
              return <span />;
            }
          `,
          errors: [{ messageId: 'noEarlyReturn' }],
        });
      });
      test('early return inside an arrow function component breaks reactivity', () => {
        invalid({
          code: `
            const Component = () => {
              if (condition) {
                return <div />;
              }
              return <span />;
            }
          `,
          errors: [{ messageId: 'noEarlyReturn' }],
        });
      });
      test('early return breaks reactivity even with hoisted functions', () => {
        invalid({
          code: `
            const Component = () => {
              if (condition) {
                return <div />;
              }
              return <span />;
              function hoisted() {}
            }
          `,
          errors: [{ messageId: 'noEarlyReturn' }],
        });
      });
    });
    describe(`Balanced ternaries`, () => {
      test('returning a ternary with JSX expressions on both branches is invalid', () => {
        invalid({
          code: `
            function Component() {
              return Math.random() > 0.5 ? <div>Big!</div> : <div>Small!</div>;
            }
          `,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `
            function Component() {
              return <>{Math.random() > 0.5 ? <div>Big!</div> : <div>Small!</div>}</>;
            }
          `,
        });
      });
      test('returning a ternary with mixed branches is invalid', () => {
        invalid({
          code: `
            function Component() {
              return Math.random() > 0.5 ? <div>Big!</div> : "Small!";
            }
          `,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `
            function Component() {
              return <>{Math.random() > 0.5 ? <div>Big!</div> : "Small!"}</>;
            }
          `,
        });
      });
    });
    describe(`Ternaries with clear fallback`, () => {
      test('returning a ternary with nested JSX elements is invalid', () => {
        invalid({
          code: `
            function Component() {
              return Math.random() > 0.5 ? (
                <div>
                  Big!
                  No, really big!
                </div>
              ) : <div>Small!</div>;
              }
          `,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `
            function Component() {
              return <Show when={Math.random() > 0.5} fallback={<div>Small!</div>}><div>
                  Big!
                  No, really big!
                </div>
              </Show>;
            }
          `,
        });
      });
    });
    describe(`Switch/Match`, () => {
      test('returning nested ternary expressions is invalid', () => {
        invalid({
          code: `
            function Component(props) {
              return props.cond1 ? (
                <div>Condition 1</div>
              ) : Boolean(props.cond2) ? (
                <div>Not condition 1, but condition 2</div>
              ) : (
                <div>Neither condition 1 or 2</div>
              );
            }
          `,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `
            function Component(props) {
              return <Switch fallback={<div>Neither condition 1 or 2</div>}>
                <Match when={props.cond1}><div>Condition 1</div></Match>
                <Match when={Boolean(props.cond2)}><div>Not condition 1, but condition 2</div></Match>
              </Switch>;
            }
          `,
        });
      });
    });
    describe(`Logical`, () => {
      test('returning a logical AND expression is invalid', () => {
        invalid({
          code: `
            function Component(props) {
              return !!props.cond && <div>Conditional</div>;
            }
          `,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `
            function Component(props) {
              return <Show when={!!props.cond}><div>Conditional</div></Show>;
            }
          `,
        });
      });
    });
    describe(`HOCs`, () => {
      test('early return inside higher-order components breaks reactivity', () => {
        invalid({
          code: `
            HOC(() => {
              if (condition) {
                return <div />;
              }
              return <div />;
            });
          `,
          errors: [{ messageId: 'noEarlyReturn' }],
        });
      });
    });
  });
});
