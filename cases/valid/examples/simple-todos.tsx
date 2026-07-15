// @ts-nocheck
import { createEffect, For } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js';
import { render } from '@solidjs/web';

// Checked but not used for demo purposes
function createLocalStore<T>(initState: T): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore(initState);
  if (localStorage.todos) {
    setState((draft) => Object.assign(draft, JSON.parse(localStorage.todos)));
  }
  createEffect(
    () => JSON.stringify(state),
    (value) => (localStorage.todos = value),
  );
  return [state, setState];
}

const App = () => {
  const [state, setState] = createStore({
    todos: [],
    newTitle: '',
  });
  return (
    <>
      <h3>Simple Todos Example</h3>
      <input
        type="text"
        placeholder="enter todo and click +"
        value={state.newTitle}
        onInput={(e) => setState((draft) => (draft.newTitle = e.target.value))}
      />
      <button
        onClick={() =>
          setState((draft) => {
            draft.todos.push({ title: draft.newTitle, done: false });
            draft.newTitle = '';
          })
        }
      >
        +
      </button>
      <For each={state.todos}>
        {(todo, i) => {
          const { done, title } = todo;
          return (
            <div>
              <input
                type="checkbox"
                checked={done}
                onChange={(e) =>
                  setState((draft) => {
                    draft.todos[i()].done = e.target.checked;
                  })
                }
              />
              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setState((draft) => {
                    draft.todos[i()].title = e.target.value;
                  })
                }
              />
              <button
                onClick={() =>
                  setState((draft) => {
                    draft.todos.splice(i(), 1);
                  })
                }
              >
                x
              </button>
            </div>
          );
        }}
      </For>
    </>
  );
};

render(App, document.getElementById('app'));
