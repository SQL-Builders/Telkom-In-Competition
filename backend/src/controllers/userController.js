import userService from '../services/userService.js';
import {
  successResponse,
  paginatedResponse,
} from '../utils/responseHandler.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
const userController = {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users (admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: List of users
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const { users, pagination } = await userService.getAllUsers(page, limit);
      return paginatedResponse(res, 'Users retrieved successfully.', users, pagination);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User data
   *       404:
   *         description: User not found
   */
  async getUserById(req, res, next) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await userService.getUserById(userId);
      return successResponse(res, 'User retrieved successfully.', user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               nama_lengkap:
   *                 type: string
   *               no_telepon:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated
   *       404:
   *         description: User not found
   */
  async updateUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id, 10);
      const updatedUser = await userService.updateUser(userId, req.body);
      return successResponse(res, 'User updated successfully.', updatedUser);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete a user (admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User deleted
   *       404:
   *         description: User not found
   */
  async deleteUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id, 10);
      await userService.deleteUser(userId);
      return successResponse(res, 'User deleted successfully.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/users/{id}/toggle-status:
   *   patch:
   *     summary: Toggle user status between active and banned (admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User status updated
   */
  async toggleUserStatus(req, res, next) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await userService.toggleUserStatus(userId);
      return successResponse(res, `User status updated to ${user.status}.`, user);
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
