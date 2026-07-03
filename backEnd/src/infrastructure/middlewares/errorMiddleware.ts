import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/exceptions/AppError';

// Express identifies error-handling middleware by its 4-argument arity, so `_next`
// must stay in the signature even though it's unused.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};