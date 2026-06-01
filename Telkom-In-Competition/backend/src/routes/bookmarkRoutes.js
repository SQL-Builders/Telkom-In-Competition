import { Router } from 'express';
import bookmarkController from '../controllers/bookmarkController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// All bookmark routes require authentication
router.use(authenticate);

// ── Bookmark Routes ────────────────────────────────────────
router.get('/', bookmarkController.getMyBookmarks);
router.post('/toggle/:competitionId', bookmarkController.toggleBookmark);
router.get('/check/:competitionId', bookmarkController.checkBookmark);
router.delete('/:id', bookmarkController.removeBookmark);

export default router;
