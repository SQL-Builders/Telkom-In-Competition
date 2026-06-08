import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import uploadController from '../controllers/uploadController.js';

const router = Router();

// Upload route (requires authentication)
router.post(
  '/',
  authenticate,
  upload.single('file'), // Multer middleware looking for 'file' field
  uploadController.uploadFile
);

export default router;
