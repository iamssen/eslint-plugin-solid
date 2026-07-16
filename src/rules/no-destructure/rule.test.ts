import { describe, test } from 'vitest';
import rule from './rule.js';
import { testInvalid, testValid } from '../ruleTester.js';

const valid = testValid('no-destructure', rule);
const invalid = testInvalid('no-destructure', rule);

describe('no-destructure', () => {
  describe('valid', () => {
    test('accessing props without destructuring is valid', () => {
      valid(`let Component = props => <div />`);
    });
    test('accessing props with parenthesis without destructuring is valid', () => {
      valid(`let Component = (props) => <div />`);
    });
    test('accessing props with block body without destructuring is valid', () => {
      valid(`let Component = (props) => { return <div />; }`);
    });
    test('accessing props with implicit return without destructuring is valid', () => {
      valid(`let Component = (props) => (<div />)`);
    });
    test('returning null without destructuring is valid', () => {
      valid(`let Component = props => null`);
    });
    test('passing props properties without destructuring is valid', () => {
      valid(`let Component = (props) => <div a={props.a} />`);
    });
    test('using omit without destructuring component props is valid', () => {
      valid(`
        let Component = (props) => { 
          const local = props;
          const rest = omit(props, 'a');
          return <div a={local.a} b={rest.b} />;
        }
      `);
    });
    test('destructuring non-props variables is valid', () => {
      valid(`
        let Component = props => {
          const { a } = someFunction();
          return <div a={a} />
        }
      `);
    });
    test('destructuring params in non-component functions is valid', () => {
      valid(`let NotAComponent = ({ a }, more, params) => <div a={a} />`);
    });
    test('destructuring params in inner functions is valid', () => {
      valid(`
        let Component = props => {
          let inner = ({ a, ...rest }) => a;
          let a = inner({ a: 5 });
          return <div a={a} />;
        }
      `);
    });
    test('destructuring props inside component body is caught by reactivity rule instead', () => {
      valid(`
        // This one might be surprising, since we're clearly destructuring props!
        // But this will be caught as a reactive expression use outside of
        // a tracked scope, in the "solid/reactivity" rule. There's really 
        // nothing wrong with destructuring props in tracked scopes when done 
        // correctly, but catching it in the params covers the most common 
        // cases with good DX.
        let Component = props => {
          let { a } = props;
          return <div a={a} />;
        }
      `);
    });
    test('standard JSX elements are valid', () => {
      valid(`let element = <div />`);
    });
    test('accessing props with typescript types without destructuring is valid', () => {
      valid(`let Component = (props: Props) => <div />;`, true);
    });
  });
  describe('invalid', () => {
    test('detects empty object destructuring in component params', () => {
      invalid({
        code: `let Component = ({}) => <div />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div />`,
      });
    });
    test('detects simple property destructuring in component params', () => {
      invalid({
        code: `let Component = ({ a }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props.a} />`,
      });
    });
    test('detects simple property destructuring in component params with implicit return', () => {
      invalid({
        code: `let Component = ({ a }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => (<div a={props.a} />)`,
      });
    });
    test('detects property destructuring with alias in component params', () => {
      invalid({
        code: `let Component = ({ a: A }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props.a} />`,
      });
    });
    test('detects string literal property destructuring in component params', () => {
      invalid({
        code: `let Component = ({ 'a': A }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a']} />`,
      });
    });
    test('detects computed property destructuring in component params', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: a }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a' + '']} />`,
      });
    });
    test('detects mixed destructuring in component params', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: a, b }) => <div a={a} b={b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a' + '']} b={props.b} />`,
      });
    });
    // `merge`에서 명시적인 undefined는 default를 덮어쓴다. parameter default와
    // 의미가 다르므로 default가 포함된 경우에는 report-only로 유지한다.
    test('detects destructuring with default values in component params', () => {
      invalid({
        code: `let Component = ({ a = 5 }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('detects destructuring with default values and implicit return', () => {
      invalid({
        code: `let Component = ({ a = 5 }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('detects destructuring with alias and default values', () => {
      invalid({
        code: `let Component = ({ a: A = 5 }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('detects string literal destructuring with default values', () => {
      invalid({
        code: `let Component = ({ 'a': A = 5 }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('detects computed property destructuring with default values', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: a = 5 }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('detects mixed destructuring with default values', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: a = 5, b = 10, c }) => <div a={a} b={b} c={c} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('detects destructuring with default values in block body', () => {
      invalid({
        code: `
          let Component = ({ a = 5 }) => { 
            return <div a={a} />; 
          }
        `,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('detects destructuring with default values in block body with other statements', () => {
      invalid({
        code: `
          let Component = ({ a = 5 }) => { 
            various();
            statements();
            return <div a={a} />; 
          }
        `,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    // Solid 2.0에서 rest prop은 splitProps tuple이 아니라 omit 결과다.
    test('detects rest operator in component params', () => {
      invalid({
        code: `let Component = ({ ...rest }) => <div a={rest.a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
          const props = _props;
          const rest = omit(props);
            return (<div a={rest.a} />);
          }
        `,
      });
    });
    test('detects property destructuring with rest operator', () => {
      invalid({
        code: `let Component = ({ a, ...rest }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
          const props = _props;
          const rest = omit(props, "a");
            return (<div a={props.a} />);
          }
        `,
      });
    });
    test('detects property destructuring with rest operator and implicit return', () => {
      invalid({
        code: `let Component = ({ a, ...rest }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
          const props = _props;
          const rest = omit(props, "a");
            return (<div a={props.a} />);
          }
        `,
      });
    });
    test('detects property destructuring with differently named rest operator', () => {
      invalid({
        code: `let Component = ({ a, ...other }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
          const props = _props;
          const other = omit(props, "a");
            return (<div a={props.a} />);
          }
        `,
      });
    });
    test('detects property destructuring with rest operator and multiple props uses', () => {
      invalid({
        code: `let Component = ({ a, ...rest }) => <div a={a} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
            const props = _props;
            const rest = omit(props, "a");
            return (<div a={props.a} b={rest.b} />);
          }
        `,
      });
    });
    test('detects destructuring with alias and rest operator', () => {
      invalid({
        code: `let Component = ({ a: A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
            const props = _props;
            const rest = omit(props, "a");
            return (<div a={props.a} />);
          }
        `,
      });
    });
    test('detects string literal destructuring with rest operator', () => {
      invalid({
        code: `let Component = ({ 'a': A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
            const props = _props;
            const rest = omit(props, 'a');
            return (<div a={props['a']} />);
          }
        `,
      });
    });
    test('detects computed property destructuring with rest operator', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
            const props = _props;
            const rest = omit(props, 'a' + '');
            return (<div a={props['a' + '']} />);
          }
        `,
      });
    });
    test('detects computed property destructuring with rest operator and multiple uses', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: A, ...rest }) => <div a={A} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `
          let Component = (_props) => {
            const props = _props;
            const rest = omit(props, 'a' + '');
            return (<div a={props['a' + '']} b={rest.b} />);
          }
        `,
      });
    });
    test('reports destructuring with default values and rest operator without a fix', () => {
      invalid({
        code: `
          let Component = ({ a = 5, ...rest }) => { 
            return <div a={a} b={rest.b} />; 
          }
        `,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('reports destructuring with default values and rest operator with implicit return without a fix', () => {
      invalid({
        code: `let Component = ({ a = 5, ...rest }) => (<div a={a} b={rest.b} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('reports computed destructuring with default values and rest operator without a fix', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: A = 5, ...rest }) => <div a={A} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: null,
      });
    });
    test('detects destructuring with typescript types', () => {
      invalid(
        {
          code: `let Component = ({ prop1, prop2 }: Props) => <div p1={prop1} p2={prop2} />;`,
          errors: [{ messageId: 'noDestructure' }],
          output: `let Component = (props: Props) => <div p1={props.prop1} p2={props.prop2} />;`,
        },
        true,
      );
    });
  });
});
