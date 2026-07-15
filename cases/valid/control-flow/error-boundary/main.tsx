// @ts-nocheck
import { render } from '@solidjs/web';
import { Errored } from 'solid-js';

const Broken = () => {
  throw new Error('Oh No');
  return <>Never Getting Here</>;
};

function App() {
  return (
    <>
      <div>Before</div>
      <Errored fallback={(err) => err()}>
        <Broken />
      </Errored>
      <div>After</div>
    </>
  );
}

render(() => <App />, document.getElementById('app'));
