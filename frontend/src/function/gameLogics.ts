
export type Cell = 0 | 1 | 2;

export const BOARD_SIZE = 8;
export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0],  [1, 1],
];

export const getValidMoves = (
  board: Cell[][],
  player: Cell
): [number, number][] => {
  const validMoves: [number, number][] = [];
  const opponent = player === 1 ? 2 : 1;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== 0) continue;

      for (const [dx, dy] of DIRECTIONS) {
        let x = row + dx;
        let y = col + dy;
        let foundOpponent = false;

        while (
          x >= 0 && x < BOARD_SIZE &&
          y >= 0 && y < BOARD_SIZE &&
          board[x][y] === opponent
        ) {
          foundOpponent = true;
          x += dx;
          y += dy;
        }

        if (
          foundOpponent &&
          x >= 0 && x < BOARD_SIZE &&
          y >= 0 && y < BOARD_SIZE &&
          board[x][y] === player
        ) {
          validMoves.push([row, col]);
          break;
        }
      }
    }
  }

  return validMoves;
};
