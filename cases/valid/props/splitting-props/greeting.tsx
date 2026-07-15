// @ts-nocheck
import { omit } from 'solid-js';

export default function Greeting(props) {
  const others = omit(props, 'greeting', 'name');
  return (
    <h3 {...others}>
      {props.greeting} {props.name}
    </h3>
  );
}
