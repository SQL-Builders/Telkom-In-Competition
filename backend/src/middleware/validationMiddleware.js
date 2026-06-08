import { ZodError } from 'zod';
import { errorResponse } from '../utils/responseHandler.js';

/**
 * Creates an Express middleware that validates request data against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod validation schema.
 * @param {'body'|'query'|'params'} source - Which part of the request to validate.
 * @returns {import('express').RequestHandler}
 *
 * @example
 * router.post('/login', validate(loginSchema), authController.login);
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      // Replace with parsed (coerced/transformed) data
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return errorResponse(res, 'Validation failed.', 400, validationErrors);
      }
      next(error);
    }
  };
};
