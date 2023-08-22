import { createSignal, type Component, For, onMount } from "solid-js";
import { State, TICK, makeGrid, updateGrid } from "./lib/conway";

const Cell: Component<{ state: State }> = (props) => {
  return (
    <div
      class="h-4 w-4 border border-black"
      classList={{
        "bg-black": props.state === 0,
        "bg-white": props.state === 1,
      }}
    ></div>
  );
};

const App: Component = () => {
  const [grid, setGrid] = createSignal(makeGrid());

  onMount(() => {
    const interval = setInterval(() => {
      setGrid(updateGrid(grid()));
    }, TICK);
    return () => clearInterval(interval);
  });

  return (
    <main class="w-screen h-screen bg-black flex flex-col items-center justify-center gap-10">
      <h1 class="text-white text-xl">Conway's Game of Life</h1>
      <div class="flex flex-col border border-white">
        <For each={grid()}>
          {(row) => (
            <div class="flex">
              <For each={row}>{(cell) => <Cell state={cell} />}</For>
            </div>
          )}
        </For>
      </div>
    </main>
  );
};

export default App;
