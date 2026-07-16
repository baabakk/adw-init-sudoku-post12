import type { Board } from '@init-sudoku-post12/contracts';

const SIZE = 9;
const BOX_SIZE = 3;

/**
 * Returns true if placing `num` at (row, col) does not violate row, column,
 * or 3x3 box constraints for the given board.
 */
export function isValidPlacement(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const boxRowStart = row - (row % BOX_SIZE);
  const boxColStart = col - (col % BOX_SIZE);
  for (let r = boxRowStart; r < boxRowStart + BOX_SIZE; r++) {
    for (let c = boxColStart; c < boxColStart + BOX_SIZE; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

/**
 * Returns a deep copy of a 9x9 board.
 */
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function findEmptyCell(board: Board): [number, number] | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return [r, c];
    }
  }
  return null;
}

/**
 * Solves the given board in place via backtracking.
 * Returns true if a solution was found, false if the board is unsolvable.
 */
export function solveBoard(board: Board): boolean {
  const empty = findEmptyCell(board);
  if (!empty) return true;

  const [row, col] = empty;
  for (let num = 1; num <= SIZE; num++) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      if (solveBoard(board)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

/**
 * Counts the number of distinct solutions for the given board, stopping
 * early once `limit` solutions have been found. Used to verify a puzzle
 * has exactly one solution without exhaustively enumerating all of them.
 */
export function countSolutions(board: Board, limit = 2): number {
  const working = cloneBoard(board);

  function count(current: Board): number {
    const empty = findEmptyCell(current);
    if (!empty) return 1;

    const [row, col] = empty;
    let found = 0;
    for (let num = 1; num <= SIZE && found < limit; num++) {
      if (isValidPlacement(current, row, col, num)) {
        current[row][col] = num;
        found += count(current);
        current[row][col] = 0;
        if (found >= limit) break;
      }
    }
    return found;
  }

  return count(working);
}

/**
 * Returns true if the board has exactly one solution.
 */
export function hasUniqueSolution(board: Board): boolean {
  return countSolutions(board, 2) === 1;
}

/**
 * Validates that a board is well-formed (9x9, values 0-9) and, if fully
 * filled, that it satisfies all Sudoku row/column/box constraints.
 * Returns a list of human-readable error messages; empty when valid.
 */
export function checkBoardRules(board: Board): string[] {
  const errors: string[] = [];

  if (!Array.isArray(board) || board.length !== SIZE) {
    return ['Board must have exactly 9 rows.'];
  }

  for (let r = 0; r < SIZE; r++) {
    const row = board[r];
    if (!Array.isArray(row) || row.length !== SIZE) {
      errors.push(`Row ${r} must have exactly 9 columns.`);
      return errors;
    }
    for (let c = 0; c < SIZE; c++) {
      const value = row[c];
      if (!Number.isInteger(value) || value < 0 || value > 9) {
        errors.push(`Cell (${r}, ${c}) must be an integer between 0 and 9.`);
      }
    }
  }

  if (errors.length > 0) return errors;

  for (let r = 0; r < SIZE; r++) {
    const seen = new Set<number>();
    for (let c = 0; c < SIZE; c++) {
      const value = board[r][c];
      if (value === 0) continue;
      if (seen.has(value)) {
        errors.push(`Row ${r} contains duplicate value ${value}.`);
      }
      seen.add(value);
    }
  }

  for (let c = 0; c < SIZE; c++) {
    const seen = new Set<number>();
    for (let r = 0; r < SIZE; r++) {
      const value = board[r][c];
      if (value === 0) continue;
      if (seen.has(value)) {
        errors.push(`Column ${c} contains duplicate value ${value}.`);
      }
      seen.add(value);
    }
  }

  for (let boxRow = 0; boxRow < SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < SIZE; boxCol += BOX_SIZE) {
      const seen = new Set<number>();
      for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
        for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
          const value = board[r][c];
          if (value === 0) continue;
          if (seen.has(value)) {
            errors.push(`Box starting at (${boxRow}, ${boxCol}) contains duplicate value ${value}.`);
          }
          seen.add(value);
        }
      }
    }
  }

  return errors;
}
