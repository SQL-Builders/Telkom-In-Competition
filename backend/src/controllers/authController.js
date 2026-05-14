import authService from '../services/authService.js';
import {
  successResponse,
  createdResponse,
} from '../utils/responseHandler.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
const authController = {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 example: john@example.com
   *               password:
   *                 type: string
   *                 example: securepassword123
   *               nama_lengkap:
   *                 type: string
   *               no_telepon:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [user, admin]
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: Email already registered
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return createdResponse(res, 'User registered successfully.', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login with email and password
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 example: john@example.com
   *               password:
   *                 type: string
   *                 example: securepassword123
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return successResponse(res, 'Login successful.', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/auth/refresh-token:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [refreshToken]
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Token refreshed
   *       401:
   *         description: Invalid refresh token
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return successResponse(res, 'Token refreshed successfully.', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/auth/change-password:
   *   put:
   *     summary: Change user password
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [currentPassword, newPassword]
   *             properties:
   *               currentPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password changed
   *       400:
   *         description: Current password incorrect
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(
        req.user.id_user,
        currentPassword,
        newPassword
      );
      return successResponse(res, 'Password changed successfully.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get current authenticated user info
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User info retrieved
   *       401:
   *         description: Unauthorized
   */
  async getMe(req, res, next) {
    try {
      return successResponse(res, 'User info retrieved.', {
        id_user: req.user.id_user,
        email: req.user.email,
        role: req.user.role,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
