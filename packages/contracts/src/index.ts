/**
 * Shared contracts for Sudoku platform.
 * All types are exported for compile‑time consumption only.
 */

/**
 * Difficulty levels supported by the platform.
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 9×9 Sudoku board. Numbers 1‑9 represent filled cells, 0 represents empty.
 */
export type Board = number[][]; // Expected shape: 9 rows of 9 numbers each; runtime validation is out of scope.

/**
 * Core domain entity representing a generated puzzle.
 */
export interface Puzzle {
  /** Unique identifier for the puzzle instance */
  puzzleId: string;
  /** Difficulty level of the puzzle */
  difficulty: Difficulty;
  /** The board state; 0 denotes empty cells */
  board: Board;
}

/**
 * Response payload for the GET /puzzle endpoint.
 * It is identical to {@link Puzzle} but kept as a separate exported type for clarity.
 */
export interface PuzzleResponse extends Puzzle {}

/**
 * Request payload for the POST /validate endpoint.
 */
export interface ValidateRequest {
  /** Board submitted for validation */
  board: Board;
}

/**
 * Response payload for the POST /validate endpoint.
 */
export interface ValidateResponse {
  /** Whether the submitted board satisfies Sudoku rules */
  valid: boolean;
  /** Optional list of validation error messages */
  errors?: string[];
}

/**
 * Payload used when a client submits a completed game score.
 */
export interface ScoreSubmission {
  /** Player's display name */
  playerName: string;
  /** Difficulty of the puzzle that was solved */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in seconds */
  timeToSolveSeconds: number;
}

/**
 * A single entry in a difficulty‑specific leaderboard.
 */
export interface LeaderboardEntry {
  /** Player's display name */
  playerName: string;
  /** Time taken to solve the puzzle, in seconds */
  timeToSolveSeconds: number;
  /** ISO‑8601 timestamp when the score was submitted */
  submittedAt: string;
}

/**
 * Response payload for the GET /leaderboard endpoint.
 */
export interface LeaderboardResponse {
  /** Difficulty for which this leaderboard applies */
  difficulty: Difficulty;
  /** Top‑10 entries ordered by {@link LeaderboardEntry.timeToSolveSeconds} ascending */
  entries: LeaderboardEntry[];
}

/**
 * Standard error shape returned by any API.
 */
export interface ApiError {
  /** Human‑readable error message */
  error: string;
  /** Machine‑readable error code */
  code: string;
}
