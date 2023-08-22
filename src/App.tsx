import { createSignal, type Component, For, onMount } from "solid-js";
import { TICK, makeGrid, updateGrid } from "./lib/conway";

const App: Component = () => {
  const [grid, setGrid] = createSignal(makeGrid());

  onMount(() => {
    const interval = setInterval(() => {
      setGrid(updateGrid(grid()));
    }, TICK);
    return () => clearInterval(interval);
  });

  return (
    <main>
      <For each={grid()}>
        {(row) => (
          <div>
            <For each={row}>{(cell) => <span>{cell}</span>}</For>
          </div>
        )}
      </For>
    </main>
  );
};

export default App;
