// @ts-nocheck
import { render } from '@solidjs/web';
import { createSignal, createEffect } from 'solid-js';

const App = () => {
  const [a, setA] = createSignal(1);
  const [b, setB] = createSignal(1);
  const [c, setC] = createSignal(1);

  createEffect(
    () => a(),
    (value) => console.log(value, b()),
    { defer: true },
  );

  return (
    <>
      <button onClick={() => setA(a() + 1)}>Increment A</button>
      <button onClick={() => setB(b() + 1)}>Increment B</button>
      <button onClick={() => setC(c() + 1)}>Increment C</button>
      <button onClick={async () => setA(a() + 1)}>Async Increment A</button>
      <button onClick={async () => setB(b() + 1)}>Async Increment B</button>
      <button onClick={async () => setC(c() + 1)}>Async Increment C</button>
    </>
  );
};

render(App, document.getElementById('app'));
