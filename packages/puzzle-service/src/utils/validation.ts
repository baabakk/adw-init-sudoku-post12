import type { Difficulty } from '@init-sudoku-post12/contracts';

const VALID_DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

export interface DifficultyValidationResult {
  valid: boolean;
  difficulty?: Difficulty;
  error?: string;
}

/**
 * Validates a raw query parameter value against the set of supported
 * Difficulty values. Returns the narrowed Difficulty on success, or an
 * error message describing why validation failed.
 */
export function validateDifficulty(rawValue: unknown): DifficultyValidationResult {
  if (typeof rawValue !== 'string' || rawValue.length === 0) {
    return {
      valid: false,
      error: `Query parameter "difficulty" is required and must be one of: ${VALID_DIFFICULTIES.join(', ')}.`,
    };
  }

  if (!VALID_DIFFICULTIES.includes(rawValue as Difficulty)) {
    return {
      valid: false,
      error: `Invalid "difficulty" value "${rawValue}". Must be one of: ${VALID_DIFFICULTIES.join(', ')}.`,
    };
  }

  return { valid: true, difficulty: rawValue as Difficulty };
}
