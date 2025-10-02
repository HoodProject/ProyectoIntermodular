import type { NextFunction, Request, Response } from 'express';

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  const status = err.status ?? 500;
  const payload = {
    message: err.message ?? 'Error inesperado',
    details: err.details ?? null
  };
  if (status >= 500) {
    console.error(err);
  }
  return res.status(status).json(payload);
}
