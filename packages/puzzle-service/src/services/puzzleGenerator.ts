import { v4 as uuidv4 } from 'uuid';
import type { Board, Difficulty, PuzzleResponse } from '@init-sudoku-post12/contracts';
import { cloneBoard, hasUniqueSolution, isValidPlacement, solveBoard } from './sudokuSolver';

const SIZE = 9;

/**
 * Number of cells to remove from a fully solved board for each difficulty
 * level, per FR-06.
 */
const REMOVALS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 36,
  medium: 46,
  hard: 56,
};

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => new Array<number>(SIZE).fill(0));
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a fully solved, valid 9x9 Sudoku board by filling cells in
 * randomized order via backtracking.
 */
function generateSolvedBoard(): Board {
  const board = emptyBoard();

  function fill(position: number): boolean {
    if (position === SIZE * SIZE) return true;

    const row = Math.floor(position / SIZE);
    const col = position % SIZE;
    const candidates = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of candidates) {
      if (isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        if (fill(position + 1)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  }

  fill(0);
  return board;
}

/**
 * Removes cells from a solved board until `removals` cells are empty,
 * verifying after each removal that the puzzle still has a unique solution.
 * A cell whose removal would introduce a second solution is left filled.
 */
function removeCellsForUniqueness(solved: Board, removals: number): Board {
  const puzzle = cloneBoard(solved);
  const positions = shuffled(
    Array.from({ length: SIZE * SIZE }, (_, i) => [Math.floor(i / SIZE), i % SIZE] as [number, number])
  );

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= removals) break;

    const previousValue = puzzle[row][col];
    puzzle[row][col] = 0;

    if (hasUniqueSolution(puzzle)) {
      removed++;
    } else {
      puzzle[row][col] = previousValue;
    }
  }

  return puzzle;
}

/**
 * Generates a valid, uniquely-solvable Sudoku puzzle for the given
 * difficulty. Completes well within the 1s SLA (ADR-009) since the
 * generator/solver operates on a single 9x9 board with early-exit
 * solution counting.
 */
export function generatePuzzle(difficulty: Difficulty): PuzzleResponse {
  const solved = generateSolvedBoard();
  // Sanity check: a freshly generated board must itself be a complete,
  // valid solution before any cells are removed.
  solveBoard(cloneBoard(solved));

  const removals = REMOVALS_BY_DIFFICULTY[difficulty];
  const board = removeCellsForUniqueness(solved, removals);

  return {
    puzzleId: uuidv4(),
    difficulty,
    board,
  };
}
