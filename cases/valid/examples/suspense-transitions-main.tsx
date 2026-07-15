// @ts-nocheck
import { createSignal, isPending, Loading, Switch, Match } from 'solid-js';
import { render } from '@solidjs/web';
import Child from './child';

import './styles.css';

const App = () => {
  const [tab, setTab] = createSignal(0);
  const pending = () => isPending(() => tab());
  const updateTab = (index) => () => setTab(index);

  return (
    <>
      <ul class="inline">
        <li class={{ selected: tab() === 0 }} onClick={updateTab(0)}>
          Uno
        </li>
        <li class={{ selected: tab() === 1 }} onClick={updateTab(1)}>
          Dos
        </li>
        <li class={{ selected: tab() === 2 }} onClick={updateTab(2)}>
          Tres
        </li>
      </ul>
      <div class={['tab', { pending: pending() }]}>
        <Loading fallback={<div class="loader">Loading...</div>}>
          <Switch>
            <Match when={tab() === 0}>
              <Child page="Uno" />
            </Match>
            <Match when={tab() === 1}>
              <Child page="Dos" />
            </Match>
            <Match when={tab() === 2}>
              <Child page="Tres" />
            </Match>
          </Switch>
        </Loading>
      </div>
    </>
  );
};

render(App, document.getElementById('app'));
