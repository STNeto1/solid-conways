export type State = 1 | 0;
type Grid = State[][];

const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const makeGrid = (rows: number, cols: number, seed: number): Grid => {
  const generator = mulberry32(seed);

  const grid: Grid = [];
  for (let i = 0; i < rows; i++) {
    const row: State[] = [];
    for (let j = 0; j < cols; j++) {
      const value = generator();
      row.push(value > 0.8 ? 1 : 0);
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
  const rows = grid.length;
  const cols = grid[0].length;

  let count = 0;

  for (const [r, c] of neighbors) {
    const nRow = (row + r + rows) % rows;
    const nCol = (col + c + cols) % cols;

    const neighbor = grid[nRow]?.[nCol];

    if (neighbor) {
      count += 1;
    }
  }

  return count;
};

export const updateGrid = (grid: Grid): Grid => {
  const rows = grid.length;
  const cols = grid[0].length;

  const newGrid: Grid = [];

  for (let i = 0; i < rows; i++) {
    const row: State[] = [];
    for (let j = 0; j < cols; j++) {
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
