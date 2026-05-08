/**
 * Standardized API response handler.
 * Ensures consistent JSON response format across all endpoints.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {*} data
 * @param {number} statusCode
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Send a created response (201).
 */
export const createdResponse = (res, message, data = null) => {
  return successResponse(res, message, data, 201);
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {*} errors
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors !== null && { errors }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Send a paginated response.
 */
export const paginatedResponse = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};
