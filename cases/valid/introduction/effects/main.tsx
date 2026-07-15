// @ts-nocheck
import { render } from '@solidjs/web';
import { createSignal, createEffect } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);
  createEffect(count, (value) => {
    console.log('The count is now', value);
  });

  return <button onClick={() => setCount(count() + 1)}>Click Me</button>;
}

render(() => <Counter />, document.getElementById('app'));
