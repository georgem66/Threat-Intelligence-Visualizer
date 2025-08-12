import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const createError = (
  message: string, 
  statusCode: number = 500, 
  code?: string, 
  details?: any
): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

export const errorHandler = (
  err: ApiError | ValidationError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code: string | undefined;
  let details: any;

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    details = err.errors?.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value,
    }));
  } else if ('statusCode' in err && err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
    code = (err as ApiError).code;
    details = (err as ApiError).details;
  } else if (err.message) {
    message = err.message;
  }

  logger.error(`API Error: ${message}`, {
    statusCode,
    code,
    details,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse: any = {
    error: message,
    ...(code && { code }),
    ...(details && { details }),
    ...(isDevelopment && { stack: err.stack }),
  };

  res.status(statusCode).json(errorResponse);
};
