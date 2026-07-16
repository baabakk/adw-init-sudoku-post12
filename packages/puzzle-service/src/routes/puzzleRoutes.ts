import { Router } from 'express';
import type { PuzzleResponse } from '@init-sudoku-post12/contracts';
import { generatePuzzle } from '../services/puzzleGenerator';
import { validateDifficulty } from '../utils/validation';
import { sendApiError } from '../utils/errorHandler';

export const puzzleRouter = Router();

/**
 * GET /puzzle?difficulty=easy|medium|hard
 * Generates a valid, uniquely-solvable Sudoku puzzle for the requested
 * difficulty. Returns 400 with an ApiError when difficulty is missing or
 * not one of the supported values.
 */
puzzleRouter.get('/puzzle', (req, res, next) => {
  try {
    const validation = validateDifficulty(req.query.difficulty);

    if (!validation.valid || !validation.difficulty) {
      sendApiError(res, 400, 'INVALID_DIFFICULTY', validation.error ?? 'Invalid difficulty.');
      return;
    }

    const puzzle: PuzzleResponse = generatePuzzle(validation.difficulty);
    res.status(200).json(puzzle);
  } catch (err) {
    next(err);
  }
});
