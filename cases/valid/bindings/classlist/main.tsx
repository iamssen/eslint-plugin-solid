// @ts-nocheck
import { render } from '@solidjs/web';
import { createSignal } from 'solid-js';

import './style.css';

function App() {
  const [current, setCurrent] = createSignal('foo');

  return (
    <>
      <button
        class={{ selected: current() === 'foo' }}
        onClick={() => setCurrent('foo')}
      >
        foo
      </button>
      <button
        class={{ selected: current() === 'bar' }}
        onClick={() => setCurrent('bar')}
      >
        bar
      </button>
      <button
        class={{ selected: current() === 'baz' }}
        onClick={() => setCurrent('baz')}
      >
        baz
      </button>
    </>
  );
}

render(() => <App />, document.getElementById('app'));
