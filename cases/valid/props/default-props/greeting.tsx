// @ts-nocheck
import { merge } from 'solid-js';

export default function Greeting(props) {
  const merged = merge({ greeting: 'Hi', name: 'John' }, props);

  return (
    <h3>
      {merged.greeting} {merged.name}
    </h3>
  );
}
