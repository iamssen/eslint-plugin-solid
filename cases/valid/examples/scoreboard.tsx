// @ts-nocheck
import {
  createMemo,
  createSignal,
  createEffect,
  createStore,
  For,
} from 'solid-js';
import { render } from '@solidjs/web';

const App = () => {
  let newName, newScore;
  const [state, setState] = createStore({
      players: [
        { name: 'Mark', score: 3 },
        { name: 'Troy', score: 2 },
        { name: 'Jenny', score: 1 },
        { name: 'David', score: 8 },
      ],
    }),
    lastPos = new WeakMap(),
    curPos = new WeakMap(),
    getSorted = createMemo((list = []) => {
      list.forEach((p, i) => lastPos.set(p, i));
      const newList = state.players.slice().sort((a, b) => {
        if (b.score === a.score) return a.name.localeCompare(b.name); // stabalize the sort
        return b.score - a.score;
      });
      let updated = newList.length !== list.length;
      newList.forEach(
        (p, i) => lastPos.get(p) !== i && (updated = true) && curPos.set(p, i),
      );
      return updated ? newList : list;
    }),
    handleAddClick = () => {
      const name = newName.value,
        score = +newScore.value;
      if (!name.length || isNaN(score)) return;
      setState((state) => state.players.push({ name, score }));
      newName.value = newScore.value = '';
    },
    handleDeleteClick = (player) => {
      setState((state) => {
        const index = state.players.indexOf(player);
        if (index >= 0) state.players.splice(index, 1);
      });
    },
    handleScoreChange = (player, { target }) => {
      const score = +target.value;
      const idx = state.players.indexOf(player);
      if (isNaN(+score) || idx < 0) return;
      setState((state) => {
        state.players[idx].score = score;
      });
    },
    createStyles = (player) => {
      const [style, setStyle] = createSignal();
      createEffect(
        () => {
          getSorted();
          return lastPos.get(player) * 18 - curPos.get(player) * 18;
        },
        (offset) => {
          const t = setTimeout(() =>
            setStyle({ transition: '250ms', transform: null }),
          );
          setStyle({
            transform: `translateY(${offset}px)`,
            transition: null,
          });
          return () => clearTimeout(t);
        },
      );
      return style;
    };

  return (
    <div id="scoreboard">
      <div class="board">
        <For each={getSorted()}>
          {(player) => {
            const getStyles = createStyles(player),
              { name } = player;
            return (
              <div class="player" style={getStyles()}>
                <div class="name">{name}</div>
                <div class="score">{player.score}</div>
              </div>
            );
          }}
        </For>
      </div>
      <form class="admin">
        <For each={state.players}>
          {(player) => {
            const { name, score } = player;
            return (
              <div class="player">
                {name}
                <input
                  class="score"
                  type="number"
                  value={score}
                  onInput={(event) => handleScoreChange(player, event)}
                />
                <button type="button" onClick={() => handleDeleteClick(player)}>
                  x
                </button>
              </div>
            );
          }}
        </For>
        <div class="player">
          <input
            type="text"
            name="name"
            placeholder="New player..."
            ref={newName}
          />
          <input class="score" type="number" name="score" ref={newScore} />
          <button type="button" onClick={handleAddClick}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

render(App, document.getElementById('app'));
