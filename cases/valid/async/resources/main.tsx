// @ts-nocheck
import { createMemo, createSignal, isPending, Loading } from 'solid-js';
import { render } from '@solidjs/web';

const fetchUser = async (id) =>
  (await fetch(`https://swapi.dev/api/people/${id}/`)).json();

const App = () => {
  const [userId, setUserId] = createSignal();
  const user = createMemo(() =>
    userId() ? fetchUser(userId()) : Promise.resolve(undefined),
  );

  return (
    <>
      <input
        type="number"
        min="1"
        placeholder="Enter Numeric Id"
        onInput={(e) => setUserId(e.currentTarget.value)}
      />
      <Loading fallback={<span>Loading...</span>}>
        <span>{isPending(() => user()) && 'Updating...'}</span>
        <div>
          <pre>{JSON.stringify(user(), null, 2)}</pre>
        </div>
      </Loading>
    </>
  );
};

render(App, document.getElementById('app'));
