import rule from './no-destructure.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

const valid = testValid('no-destructure', rule);
const invalid = testInvalid('no-destructure', rule);

describe('no-destructure', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      valid(`let Component = props => <div />`);
    });
    test('valid case 2', () => {
      valid(`let Component = (props) => <div />`);
    });
    test('valid case 3', () => {
      valid(`let Component = (props) => { return <div />; }`);
    });
    test('valid case 4', () => {
      valid(`let Component = (props) => (<div />)`);
    });
    test('valid case 5', () => {
      valid(`let Component = props => null`);
    });
    test('valid case 6', () => {
      valid(`let Component = (props) => <div a={props.a} />`);
    });
    test('valid case 7', () => {
      valid(
        `let Component = (props) => { 
      const [local, rest] = splitProps(props, ['a']);
      return <div a={local.a} b={rest.b} />;
    }`,
      );
    });
    test('valid case 8', () => {
      valid(
        `let Component = props => {
      const { a } = someFunction();
      return <div a={a} />
    }`,
      );
    });
    test('valid case 9', () => {
      valid(`let NotAComponent = ({ a }, more, params) => <div a={a} />`);
    });
    test('valid case 10', () => {
      valid(
        `let Component = props => {
      let inner = ({ a, ...rest }) => a;
      let a = inner({ a: 5 });
      return <div a={a} />;
    }`,
      );
    });
    test('valid case 11', () => {
      valid(
        `
    // This one might be surprising, since we're clearly destructuring props!
    // But this will be caught as a reactive expression use outside of
    // a tracked scope, in the "solid/reactivity" rule. There's really 
    // nothing wrong with destructuring props in tracked scopes when done 
    // correctly, but catching it in the params covers the most common 
    // cases with good DX.
    let Component = props => {
      let { a } = props;
      return <div a={a} />;
    }`,
      );
    });
    test('valid case 12', () => {
      valid(`let element = <div />`);
    });
    test('valid case 13', () => {
      valid(`let Component = (props: Props) => <div />;`, true);
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      invalid({
        code: `let Component = ({}) => <div />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div />`,
      });
    });
    test('invalid case 2', () => {
      invalid({
        code: `let Component = ({ a }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props.a} />`,
      });
    });
    test('invalid case 3', () => {
      invalid({
        code: `let Component = ({ a }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => (<div a={props.a} />)`,
      });
    });
    test('invalid case 4', () => {
      invalid({
        code: `let Component = ({ a: A }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props.a} />`,
      });
    });
    test('invalid case 5', () => {
      invalid({
        code: `let Component = ({ 'a': A }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a']} />`,
      });
    });
    test('invalid case 6', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: a }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a' + '']} />`,
      });
    });
    test('invalid case 7', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: a, b }) => <div a={a} b={b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a' + '']} b={props.b} />`,
      });
    });
    test('invalid case 8', () => {
      invalid({
        code: `let Component = ({ a = 5 }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ a: 5 }, _props);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 9', () => {
      invalid({
        code: `let Component = ({ a = 5 }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ a: 5 }, _props);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 10', () => {
      invalid({
        code: `let Component = ({ a: A = 5 }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ a: 5 }, _props);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 11', () => {
      invalid({
        code: `let Component = ({ 'a': A = 5 }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ 'a': 5 }, _props);
  return (<div a={props['a']} />);
}`,
      });
    });
    test('invalid case 12', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: a = 5 }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ ['a' + '']: 5 }, _props);
  return (<div a={props['a' + '']} />);
}`,
      });
    });
    test('invalid case 13', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: a = 5, b = 10, c }) => <div a={a} b={b} c={c} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ ['a' + '']: 5, b: 10 }, _props);
  return (<div a={props['a' + '']} b={props.b} c={props.c} />);
}`,
      });
    });
    test('invalid case 14', () => {
      invalid({
        code: `let Component = ({ a = 5 }) => { 
        return <div a={a} />; 
      }`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => { 
          const props = mergeProps({ a: 5 }, _props);
return <div a={props.a} />; 
      }`,
      });
    });
    test('invalid case 15', () => {
      invalid({
        code: `let Component = ({ a = 5 }) => { 
        various();
        statements();
        return <div a={a} />; 
      }`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => { 
          const props = mergeProps({ a: 5 }, _props);
various();
        statements();
        return <div a={props.a} />; 
      }`,
      });
    });
    test('invalid case 16', () => {
      invalid({
        code: `let Component = ({ ...rest }) => <div a={rest.a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, []);
  return (<div a={rest.a} />);
}`,
      });
    });
    test('invalid case 17', () => {
      invalid({
        code: `let Component = ({ a, ...rest }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ["a"]);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 18', () => {
      invalid({
        code: `let Component = ({ a, ...rest }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ["a"]);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 19', () => {
      invalid({
        code: `let Component = ({ a, ...other }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, other] = splitProps(_props, ["a"]);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 20', () => {
      invalid({
        code: `let Component = ({ a, ...rest }) => <div a={a} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ["a"]);
  return (<div a={props.a} b={rest.b} />);
}`,
      });
    });
    test('invalid case 21', () => {
      invalid({
        code: `let Component = ({ a: A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ["a"]);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 22', () => {
      invalid({
        code: `let Component = ({ 'a': A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ['a']);
  return (<div a={props['a']} />);
}`,
      });
    });
    test('invalid case 23', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ['a' + '']);
  return (<div a={props['a' + '']} />);
}`,
      });
    });
    test('invalid case 24', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: A, ...rest }) => <div a={A} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ['a' + '']);
  return (<div a={props['a' + '']} b={rest.b} />);
}`,
      });
    });
    test('invalid case 25', () => {
      invalid({
        code: `let Component = ({ a = 5, ...rest }) => { 
        return <div a={a} b={rest.b} />; 
      }`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => { 
          const [props, rest] = splitProps(mergeProps({ a: 5 }, _props), ["a"]);return <div a={props.a} b={rest.b} />; 
      }`,
      });
    });
    test('invalid case 26', () => {
      invalid({
        code: `let Component = ({ a = 5, ...rest }) => (<div a={a} b={rest.b} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(mergeProps({ a: 5 }, _props), ["a"]);  return (<div a={props.a} b={rest.b} />);
}`,
      });
    });
    test('invalid case 27', () => {
      invalid({
        code: `let Component = ({ ['a' + '']: A = 5, ...rest }) => <div a={A} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(mergeProps({ ['a' + '']: 5 }, _props), ['a' + '']);  return (<div a={props['a' + '']} b={rest.b} />);
}`,
      });
    });
    test('invalid case 28', () => {
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
