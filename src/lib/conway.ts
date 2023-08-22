const ROWS = 50;
const COLS = 50;

export const TICK = 1000;

type State = 1 | 0;
type Grid = State[][];

const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const makeGrid = (): Grid => {
  const generator = mulberry32(Math.random() * 1000);

  const grid: Grid = [];
  for (let i = 0; i < ROWS; i++) {
    const row: State[] = [];
    for (let j = 0; j < COLS; j++) {
      const value = generator();
      console.log(value);

      row.push(value <= 0.1 ? 1 : 0);
    }
    grid.push(row);
  }

  return grid;
};

const neighbors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
const checkNeighbors = (grid: Grid, row: number, col: number): number => {
  let count = 0;

  for (const [r, c] of neighbors) {
    const nRow = row + r;
    const nCol = col + c;

    const neighbor = grid[nRow]?.[nCol];

    if (neighbor) {
      count += 1;
    }
  }

  return count;
};

export const updateGrid = (grid: Grid): Grid => {
  const newGrid: Grid = [];

  for (let i = 0; i < ROWS; i++) {
    const row: State[] = [];
    for (let j = 0; j < COLS; j++) {
      const value = grid[i][j];
      const count = checkNeighbors(grid, i, j);

      // dead cell becomes alive if it has 3 neighbors
      if (value === 0 && count === 3) {
        row.push(1);
        continue;
      }

      // alive cell dies if it has less than 2 or more than 3 neighbors
      if (value === 1 && (count < 2 || count > 3)) {
        row.push(0);
        continue;
      }

      // otherwise, cell stays the same
      row.push(value);
    }
    newGrid.push(row);
  }

  return newGrid;
};
