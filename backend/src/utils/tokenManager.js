import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Token management utility for JWT operations.
 */
const tokenManager = {
  /**
   * Generate an access token.
   * @param {object} payload - Data to encode in the token.
   * @returns {string} Signed JWT token.
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });
  },

  /**
   * Generate a refresh token.
   * @param {object} payload
   * @returns {string}
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtRefreshExpiresIn,
    });
  },

  /**
   * Verify and decode a token.
   * @param {string} token
   * @returns {object} Decoded token payload.
   * @throws {Error} If the token is invalid or expired.
   */
  verifyToken(token) {
    return jwt.verify(token, env.jwtSecret);
  },

  /**
   * Decode a token without verification (useful for debugging).
   * @param {string} token
   * @returns {object|null}
   */
  decodeToken(token) {
    return jwt.decode(token);
  },
};

export default tokenManager;
