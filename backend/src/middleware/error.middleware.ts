import { Request, Response, NextFunction } from 'express';
import { ApiResponseHandler } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 400, code: string = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response => {
  logger.error(`Error handling ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AppError) {
    return ApiResponseHandler.error(res, err.message, err.statusCode, err.code);
  }

  return ApiResponseHandler.error(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal Server Error',
    500,
    'INTERNAL_SERVER_ERROR'
  );
};
