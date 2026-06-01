import logger from '../utils/logger.js';
import { errorResponse } from '../utils/responseHandler.js';
import env from '../config/env.js';

/**
 * Custom application error class with HTTP status code.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found handler — catches routes that don't exist.
 */
export const notFoundHandler = (req, res, _next) => {
  return errorResponse(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404
  );
};

/**
 * Global error handling middleware.
 * Must be registered LAST in the middleware chain.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  // Log the full error
  logger.error(err);

  // Operational errors (thrown intentionally)
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode);
  }

  // Supabase / PostgreSQL error
  if (err.code && typeof err.code === 'string' && err.code.length === 5) {
    return errorResponse(res, 'Database operation failed.', 500);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired.', 401);
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const validationErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return errorResponse(res, 'Validation failed.', 400, validationErrors);
  }

  // Default 500 — hide details in production
  const message = env.isProduction
    ? 'Internal server error.'
    : err.message || 'Internal server error.';

  return errorResponse(res, message, 500);
};
