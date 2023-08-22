import {
  createSignal,
  type Component,
  For,
  onMount,
  createEffect,
  onCleanup,
} from "solid-js";
import { State, makeGrid, updateGrid } from "./lib/conway";

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
  const [seed, setSeed] = createSignal(20);
  const [rows, setRows] = createSignal(20);
  const [columns, setColumns] = createSignal(20);
  const [tick, setTick] = createSignal(200);

  const [grid, setGrid] = createSignal(makeGrid(rows(), columns(), seed()));

  createEffect(() => {
    if ([rows(), columns(), seed(), tick()].some((f) => f === 0)) {
      return;
    }

    setGrid(makeGrid(rows(), columns(), seed()));

    const ref = setInterval(() => {
      setGrid(updateGrid(grid()));
    }, tick());
    onCleanup(() => clearInterval(ref));
  });

  return (
    <main class="w-full h-full flex flex-col items-center gap-10 pt-10 px-4 md:px-10">
      <h1 class="text-white text-xl">Conway's Game of Life</h1>

      <div class="flex items-end gap-4 text-white w-full max-w-4xl">
        <div class="w-1/2">
          <label
            for="rows"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Rows
          </label>
          <input
            id="rows"
            type="number"
            min={1}
            max={100_000}
            placeholder="Rows"
            class="bg-neutral-900 text-sm rounded-lg block w-full p-2.5"
            value={rows()}
            onInput={(e) => setRows(e.currentTarget.valueAsNumber)}
          />
        </div>

        <div class="w-1/2">
          <label
            for="cols"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Cols
          </label>
          <input
            id="cols"
            type="number"
            min={1}
            max={100_000}
            placeholder="Cols"
            class="bg-neutral-900 text-sm rounded-lg block w-full p-2.5"
            value={columns()}
            onInput={(e) => setColumns(e.currentTarget.valueAsNumber)}
          />
        </div>

        <div class="w-1/3">
          <label
            for="seed"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Seed
          </label>
          <input
            id="seed"
            type="number"
            min={1}
            placeholder="Seed"
            class="bg-neutral-900 text-sm rounded-lg block w-full p-2.5"
            value={seed()}
            onInput={(e) => setSeed(e.currentTarget.valueAsNumber)}
          />
        </div>

        <div class="w-1/3">
          <label
            for="tick"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tick
          </label>
          <input
            id="tick"
            type="number"
            min={1}
            max={100_000}
            placeholder="Tick"
            class="bg-neutral-900 text-sm rounded-lg block w-full p-2.5"
            value={tick()}
            onInput={(e) => setTick(e.currentTarget.valueAsNumber)}
          />
        </div>
      </div>

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
