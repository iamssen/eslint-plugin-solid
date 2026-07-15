// @ts-nocheck
import { render } from '@solidjs/web';
import { lazy, Loading } from 'solid-js';

const Greeting = lazy(async () => {
  // simulate delay
  await new Promise((r) => setTimeout(r, 1000));
  return import('./greeting');
});

function App() {
  return (
    <>
      <h1>Welcome</h1>
      <Loading fallback={<p>Loading...</p>}>
        <Greeting name="Jake" />
      </Loading>
    </>
  );
}

render(() => <App />, document.getElementById('app'));
