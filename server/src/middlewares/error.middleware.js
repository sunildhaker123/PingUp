import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env.js';

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = StatusCodes.NOT_FOUND;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = error.message || 'Internal server error';
  let details = error.details;

  if (error.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Invalid authentication token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Authentication token has expired';
  }

  if (error.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation failed';
    details = Object.values(error.errors).map((fieldError) => ({
      field: fieldError.path,
      message: fieldError.message,
    }));
  }

  if (error.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    message = 'Resource already exists';
    details = Object.keys(error.keyValue || {}).map((field) => ({
      field,
      message: `${field} is already in use`,
    }));
  }

  const isProduction = env.nodeEnv === 'production';

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(!isProduction && { stack: error.stack }),
  });
};
