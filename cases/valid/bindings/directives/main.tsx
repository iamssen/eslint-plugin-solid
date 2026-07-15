// @ts-nocheck
import { render } from '@solidjs/web';
import { createSignal, Show } from 'solid-js';
import clickOutside from './click-outside';
import './style.css';

function App() {
  const [show, setShow] = createSignal(false);

  return (
    <Show
      when={show()}
      fallback={<button onClick={() => setShow(true)}>Open Modal</button>}
    >
      <div class="modal" ref={clickOutside(() => setShow(false))}>
        Some Modal
      </div>
    </Show>
  );
}

render(() => <App />, document.getElementById('app'));
