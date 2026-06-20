import rule from './no-destructure.js';
import { testValid, testInvalid } from './ruleTester.js';
import { describe, test } from 'vitest';

describe('no-destructure', () => {
  describe('valid', () => {
    test('valid case 1', () => {
      testValid('no-destructure', rule, `let Component = props => <div />`);
    });
    test('valid case 2', () => {
      testValid('no-destructure', rule, `let Component = (props) => <div />`);
    });
    test('valid case 3', () => {
      testValid(
        'no-destructure',
        rule,
        `let Component = (props) => { return <div />; }`,
      );
    });
    test('valid case 4', () => {
      testValid('no-destructure', rule, `let Component = (props) => (<div />)`);
    });
    test('valid case 5', () => {
      testValid('no-destructure', rule, `let Component = props => null`);
    });
    test('valid case 6', () => {
      testValid(
        'no-destructure',
        rule,
        `let Component = (props) => <div a={props.a} />`,
      );
    });
    test('valid case 7', () => {
      testValid(
        'no-destructure',
        rule,
        `let Component = (props) => { 
      const [local, rest] = splitProps(props, ['a']);
      return <div a={local.a} b={rest.b} />;
    }`,
      );
    });
    test('valid case 8', () => {
      testValid(
        'no-destructure',
        rule,
        `let Component = props => {
      const { a } = someFunction();
      return <div a={a} />
    }`,
      );
    });
    test('valid case 9', () => {
      testValid(
        'no-destructure',
        rule,
        `let NotAComponent = ({ a }, more, params) => <div a={a} />`,
      );
    });
    test('valid case 10', () => {
      testValid(
        'no-destructure',
        rule,
        `let Component = props => {
      let inner = ({ a, ...rest }) => a;
      let a = inner({ a: 5 });
      return <div a={a} />;
    }`,
      );
    });
    test('valid case 11', () => {
      testValid(
        'no-destructure',
        rule,
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
      testValid('no-destructure', rule, `let element = <div />`);
    });
    test('valid case 13', () => {
      testValid(
        'no-destructure',
        rule,
        `let Component = (props: Props) => <div />;`,
        true,
      );
    });
  });
  describe('invalid', () => {
    test('invalid case 1', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({}) => <div />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div />`,
      });
    });
    test('invalid case 2', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props.a} />`,
      });
    });
    test('invalid case 3', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => (<div a={props.a} />)`,
      });
    });
    test('invalid case 4', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a: A }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props.a} />`,
      });
    });
    test('invalid case 5', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ 'a': A }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a']} />`,
      });
    });
    test('invalid case 6', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ ['a' + '']: a }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a' + '']} />`,
      });
    });
    test('invalid case 7', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ ['a' + '']: a, b }) => <div a={a} b={b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (props) => <div a={props['a' + '']} b={props.b} />`,
      });
    });
    test('invalid case 8', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a = 5 }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ a: 5 }, _props);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 9', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a = 5 }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ a: 5 }, _props);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 10', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a: A = 5 }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ a: 5 }, _props);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 11', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ 'a': A = 5 }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ 'a': 5 }, _props);
  return (<div a={props['a']} />);
}`,
      });
    });
    test('invalid case 12', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ ['a' + '']: a = 5 }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ ['a' + '']: 5 }, _props);
  return (<div a={props['a' + '']} />);
}`,
      });
    });
    test('invalid case 13', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ ['a' + '']: a = 5, b = 10, c }) => <div a={a} b={b} c={c} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const props = mergeProps({ ['a' + '']: 5, b: 10 }, _props);
  return (<div a={props['a' + '']} b={props.b} c={props.c} />);
}`,
      });
    });
    test('invalid case 14', () => {
      testInvalid('no-destructure', rule, {
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
      testInvalid('no-destructure', rule, {
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
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ ...rest }) => <div a={rest.a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, []);
  return (<div a={rest.a} />);
}`,
      });
    });
    test('invalid case 17', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a, ...rest }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ["a"]);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 18', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a, ...rest }) => (<div a={a} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ["a"]);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 19', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a, ...other }) => <div a={a} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, other] = splitProps(_props, ["a"]);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 20', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a, ...rest }) => <div a={a} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ["a"]);
  return (<div a={props.a} b={rest.b} />);
}`,
      });
    });
    test('invalid case 21', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a: A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ["a"]);
  return (<div a={props.a} />);
}`,
      });
    });
    test('invalid case 22', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ 'a': A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ['a']);
  return (<div a={props['a']} />);
}`,
      });
    });
    test('invalid case 23', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ ['a' + '']: A, ...rest }) => <div a={A} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ['a' + '']);
  return (<div a={props['a' + '']} />);
}`,
      });
    });
    test('invalid case 24', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ ['a' + '']: A, ...rest }) => <div a={A} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(_props, ['a' + '']);
  return (<div a={props['a' + '']} b={rest.b} />);
}`,
      });
    });
    test('invalid case 25', () => {
      testInvalid('no-destructure', rule, {
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
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ a = 5, ...rest }) => (<div a={a} b={rest.b} />)`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(mergeProps({ a: 5 }, _props), ["a"]);  return (<div a={props.a} b={rest.b} />);
}`,
      });
    });
    test('invalid case 27', () => {
      testInvalid('no-destructure', rule, {
        code: `let Component = ({ ['a' + '']: A = 5, ...rest }) => <div a={A} b={rest.b} />`,
        errors: [{ messageId: 'noDestructure' }],
        output: `let Component = (_props) => {
  const [props, rest] = splitProps(mergeProps({ ['a' + '']: 5 }, _props), ['a' + '']);  return (<div a={props['a' + '']} b={rest.b} />);
}`,
      });
    });
    test('invalid case 28', () => {
      testInvalid(
        'no-destructure',
        rule,
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
