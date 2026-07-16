/**
 * Shared contract types for the Sudoku platform.
 * All services and the web client import these types for compile‑time safety.
 * The file is deliberately self‑contained and does not import any external modules.
 */

/**
 * Difficulty levels supported by the platform.
 */
export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

/**
 * A single Sudoku cell value.
 * `0` represents an empty cell, `1`‑`9` represent filled cells.
 */
export type SudokuCell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * A 9×9 Sudoku board.
 * The outer array is rows, the inner array is columns.
 */
export type SudokuBoard = [
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell],
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell],
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell],
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell],
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell],
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell],
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell],
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell],
  [SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell, SudokuCell]
];

/**
 * Core domain entity representing a generated puzzle.
 */
export interface Puzzle {
  /** The Sudoku board to be solved. */
  board: SudokuBoard;
  /** Difficulty level of the puzzle. */
  difficulty: Difficulty;
}

/**
 * Request payload for validating a Sudoku board.
 */
export interface ValidateRequest {
  /** The board submitted by the client for validation. */
  board: SudokuBoard;
}

/**
 * Response payload for a validation request.
 */
export interface ValidateResponse {
  /** Whether the submitted board satisfies Sudoku rules. */
  isValid: boolean;
  /** Human‑readable error messages when `isValid` is false. */
  errors: string[];
}

/**
 * Response payload for a puzzle generation request.
 */
export interface PuzzleResponse {
  /** The generated puzzle. */
  puzzle: Puzzle;
  /** Timestamp when the puzzle was generated (ISO 8601). */
  generatedAt: string;
}

/**
 * Payload used by the client to submit a completed game score.
 */
export interface ScoreSubmission {
  /** Player's display name. */
  playerName: string;
  /** Difficulty of the puzzle that was solved. */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in seconds. */
  timeToSolveSeconds: number;
}

/**
 * Single entry in a leaderboard.
 */
export interface LeaderboardEntry {
  /** Player's display name. */
  playerName: string;
  /** Time taken to solve the puzzle, in seconds. */
  timeToSolveSeconds: number;
  /** When the score was submitted (ISO 8601). */
  submittedAt: string;
}

/**
 * Response payload for a leaderboard request.
 */
export interface LeaderboardResponse {
  /** Difficulty for which the leaderboard is returned. */
  difficulty: Difficulty;
  /** Top‑10 entries ordered by `timeToSolveSeconds` ascending. */
  entries: LeaderboardEntry[];
}

/**
 * Standardised error shape returned by any service.
 */
export interface ApiError {
  /** HTTP status code (e.g., 400, 404, 500). */
  statusCode: number;
  /** Short error identifier. */
  error: string;
  /** Optional human‑readable description. */
  message?: string;
}
