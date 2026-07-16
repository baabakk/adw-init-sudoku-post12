import type { NextFunction, Request, Response } from 'express';
import type { ApiError } from '@init-sudoku-post12/contracts';

/**
 * Error thrown by route handlers to signal a specific HTTP status and
 * ApiError payload. Caught by the errorHandler middleware below.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function sendApiError(res: Response, status: number, code: string, message: string): void {
  const body: ApiError = { error: message, code };
  res.status(status).json(body);
}

/**
 * Express error-handling middleware. Must be registered after all routes
 * (with four parameters so Express recognizes it as an error handler).
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (res.headersSent) {
    return;
  }

  if (err instanceof HttpError) {
    sendApiError(res, err.status, err.code, err.message);
    return;
  }

  const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
  sendApiError(res, 500, 'INTERNAL_ERROR', message);
}

/**
 * Fallback handler for unmatched routes, returning a 404 ApiError.
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendApiError(res, 404, 'NOT_FOUND', `No route found for ${req.method} ${req.path}.`);
}
