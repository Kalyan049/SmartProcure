import { Response } from 'express';
import { ApiResponse } from '../../../shared/types';

export class ApiResponseHandler {
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200): Response {
    const payload: ApiResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 400,
    code?: string
  ): Response {
    const payload: ApiResponse = {
      success: false,
      message,
      code: code || 'ERROR',
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
