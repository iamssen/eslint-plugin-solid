// @ts-nocheck
import { render } from '@solidjs/web';
import { createSignal, createEffect, untrack } from 'solid-js';

const App = () => {
  const [a, setA] = createSignal(1);
  const [b, setB] = createSignal(1);

  createEffect(
    () => [a(), untrack(b)],
    ([aValue, bValue]) => console.log(aValue, bValue),
  );

  return (
    <>
      <button onClick={() => setA(a() + 1)}>Increment A</button>
      <button onClick={() => setB(b() + 1)}>Increment B</button>
    </>
  );
};

render(App, document.getElementById('app'));
