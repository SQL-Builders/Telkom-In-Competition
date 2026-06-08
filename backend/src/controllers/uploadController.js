import uploadService from '../services/uploadService.js';
import { successResponse } from '../utils/responseHandler.js';
import { AppError } from '../middleware/errorMiddleware.js';

const uploadController = {
  /**
   * @swagger
   * /api/upload:
   *   post:
   *     summary: Upload a file (document/archive/image) to be used for registrations.
   *     tags: [Uploads]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: File uploaded successfully
   *       400:
   *         description: No file provided or invalid format
   */
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        throw new AppError('No file provided.', 400);
      }

      const berkasRecord = await uploadService.uploadFile(req.file, req.user.id_user);

      return successResponse(
        res,
        'File uploaded successfully.',
        berkasRecord
      );
    } catch (error) {
      next(error);
    }
  },
};

export default uploadController;
