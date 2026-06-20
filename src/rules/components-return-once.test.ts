import { describe, test } from 'vitest';
import rule from './components-return-once.js';
import { testInvalid, testValid } from './ruleTester.js';

describe('components-return-once', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid(
        'components-return-once',
        rule,
        `function Component() {
      return <div />;
    }`,
      );
    });
    test('valid case 2', () => {
      testValid(
        'components-return-once',
        rule,
        `function someFunc() {
      if (condition) {
        return 5;
      }
      return 10;
    }`,
      );
    });
    test('valid case 3', () => {
      testValid(
        'components-return-once',
        rule,
        `function notAComponent() {
      if (condition) {
        return <div />;
      }
      return <div />;
    }`,
      );
    });
    test('valid case 4', () => {
      testValid(
        'components-return-once',
        rule,
        `callback(() => {
      if (condition) {
        return <div />;
      }
      return <div />;
    });`,
      );
    });
    test('valid case 5', () => {
      testValid(
        'components-return-once',
        rule,
        `function Component() {
      const renderContent = () => {
        if (false) return <></>;
        return <></>;
      }
      return <>{renderContent()}</>;
    }`,
      );
    });
    test('valid case 6', () => {
      testValid(
        'components-return-once',
        rule,
        `function Component() {
      function renderContent() {
        if (false) return <></>;
        return <></>;
      }
      return <>{renderContent()}</>;
    }`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'components-return-once',
        rule,
        `function Component() {
      const renderContent = () => {
        const renderContentInner = () => {
          // ifs in render functions are fine no matter what nesting level this is
          if (false) return;
          return <></>;
        };
        return <>{renderContentInner()}</>;
      };
      return <></>;
    }`,
      );
    });
    test('valid case 8', () => {
      testValid(
        'components-return-once',
        rule,
        `function Component() {
      return <>{hoisted()}</>;
      function hoisted() {
        return 'hoisted';
      }
    }`,
      );
    });
    test('valid case 9', () => {
      testValid(
        'components-return-once',
        rule,
        `function Component() {
      return <></>;
      const hoisted = 'hoisted';
    }`,
      );
    });
    test('valid case 10', () => {
      testValid(
        'components-return-once',
        rule,
        `function Component() {
      return <></>;
      class Hoisted {}
    }`,
      );
    });
  });
  describe('invalid', () => {
    describe(`Early returns`, () => {
      test('invalid case 1', () => {
        testInvalid('components-return-once', rule, {
          code: `function Component() {
        if (condition) {
          return <div />;
        };
        return <span />;
      }`,
          errors: [{ messageId: 'noEarlyReturn' }],
        });
      });
      test('invalid case 2', () => {
        testInvalid('components-return-once', rule, {
          code: `const Component = () => {
        if (condition) {
          return <div />;
        }
        return <span />;
      }`,
          errors: [{ messageId: 'noEarlyReturn' }],
        });
      });
      test('invalid case 3', () => {
        testInvalid('components-return-once', rule, {
          code: `const Component = () => {
        if (condition) {
          return <div />;
        }
        return <span />;
        function hoisted() {}
      }`,
          errors: [{ messageId: 'noEarlyReturn' }],
        });
      });
    });
    describe(`Balanced ternaries`, () => {
      test('invalid case 4', () => {
        testInvalid('components-return-once', rule, {
          code: `function Component() {
  return Math.random() > 0.5 ? <div>Big!</div> : <div>Small!</div>;
}`,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `function Component() {
  return <>{Math.random() > 0.5 ? <div>Big!</div> : <div>Small!</div>}</>;
}`,
        });
      });
      test('invalid case 5', () => {
        testInvalid('components-return-once', rule, {
          code: `function Component() {
  return Math.random() > 0.5 ? <div>Big!</div> : "Small!";
}`,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `function Component() {
  return <>{Math.random() > 0.5 ? <div>Big!</div> : "Small!"}</>;
}`,
        });
      });
    });
    describe(`Ternaries with clear fallback`, () => {
      test('invalid case 6', () => {
        testInvalid('components-return-once', rule, {
          code: `function Component() {
  return Math.random() > 0.5 ? (
    <div>
      Big!
      No, really big!
    </div>
  ) : <div>Small!</div>;
}`,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `function Component() {
  return <Show when={Math.random() > 0.5} fallback={<div>Small!</div>}><div>
      Big!
      No, really big!
    </div></Show>;
}`,
        });
      });
    });
    describe(`Switch/Match`, () => {
      test('invalid case 7', () => {
        testInvalid('components-return-once', rule, {
          code: `function Component(props) {
  return props.cond1 ? (
    <div>Condition 1</div>
  ) : Boolean(props.cond2) ? (
    <div>Not condition 1, but condition 2</div>
  ) : (
    <div>Neither condition 1 or 2</div>
  );
}`,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `function Component(props) {
  return <Switch fallback={<div>Neither condition 1 or 2</div>}>
<Match when={props.cond1}><div>Condition 1</div></Match>
<Match when={Boolean(props.cond2)}><div>Not condition 1, but condition 2</div></Match>
</Switch>;
}`,
        });
      });
    });
    describe(`Logical`, () => {
      test('invalid case 8', () => {
        testInvalid('components-return-once', rule, {
          code: `function Component(props) {
  return !!props.cond && <div>Conditional</div>;
}`,
          errors: [{ messageId: 'noConditionalReturn' }],
          output: `function Component(props) {
  return <Show when={!!props.cond}><div>Conditional</div></Show>;
}`,
        });
      });
      test('invalid case 9', () => {
        testInvalid('components-return-once', rule, {
          code: `function Component(props) {
  return props.primary || <div>{props.secondaryText}</div>;
}`,
          errors: [{ messageId: 'noConditionalReturn' }],
        });
      });
    });
    describe(`HOCs`, () => {
      test('invalid case 10', () => {
        testInvalid('components-return-once', rule, {
          code: `HOC(() => {
        if (condition) {
          return <div />;
        }
        return <div />;
      });`,
          errors: [{ messageId: 'noEarlyReturn' }],
        });
      });
    });
  });
});
