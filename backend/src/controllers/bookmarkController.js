import bookmarkService from '../services/bookmarkService.js';
import { successResponse } from '../utils/responseHandler.js';

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Competition bookmark (favorites) endpoints
 */
const bookmarkController = {
  /**
   * @swagger
   * /api/bookmarks:
   *   get:
   *     summary: Get current user's bookmarked competitions
   *     tags: [Bookmarks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of bookmarked competitions
   */
  async getMyBookmarks(req, res, next) {
    try {
      const bookmarks = await bookmarkService.getUserBookmarks(
        req.user.id_user
      );
      return successResponse(
        res,
        'Bookmarks retrieved successfully.',
        bookmarks
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/bookmarks/toggle/{competitionId}:
   *   post:
   *     summary: Toggle bookmark for a competition
   *     tags: [Bookmarks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: competitionId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Bookmark toggled
   */
  async toggleBookmark(req, res, next) {
    try {
      const competitionId = parseInt(req.params.competitionId, 10);
      const result = await bookmarkService.toggleBookmark(
        req.user.id_user,
        competitionId
      );

      const message = result.bookmarked
        ? 'Competition bookmarked successfully.'
        : 'Bookmark removed successfully.';

      return successResponse(res, message, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/bookmarks/{id}:
   *   delete:
   *     summary: Remove a bookmark
   *     tags: [Bookmarks]
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
   *         description: Bookmark removed
   *       404:
   *         description: Bookmark not found
   */
  async removeBookmark(req, res, next) {
    try {
      const bookmarkId = parseInt(req.params.id, 10);
      await bookmarkService.removeBookmark(req.user.id_user, bookmarkId);
      return successResponse(res, 'Bookmark removed successfully.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/bookmarks/check/{competitionId}:
   *   get:
   *     summary: Check if a competition is bookmarked
   *     tags: [Bookmarks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: competitionId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Bookmark status
   */
  async checkBookmark(req, res, next) {
    try {
      const competitionId = parseInt(req.params.competitionId, 10);
      const isBookmarked = await bookmarkService.isBookmarked(
        req.user.id_user,
        competitionId
      );
      return successResponse(res, 'Bookmark status retrieved.', {
        isBookmarked,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default bookmarkController;
