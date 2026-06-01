import tokenManager from '../utils/tokenManager.js';
import { errorResponse } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';

/**
 * Middleware: Authenticate JWT token from Authorization header.
 * Attaches decoded user data to `req.user`.
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = tokenManager.verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please login again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token.', 401);
    }

    return errorResponse(res, 'Authentication failed.', 401);
  }
};

/**
 * Middleware: Authorize specific roles.
 * Must be used after `authenticate` middleware.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user').
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Authorization failed: user ${req.user.id_user} with role "${req.user.role}" tried to access resource requiring [${roles.join(', ')}]`
      );
      return errorResponse(
        res,
        'Access denied. Insufficient permissions.',
        403
      );
    }

    next();
  };
};
