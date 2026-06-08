import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// ── User Routes ────────────────────────────────────────────
router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);
router.patch('/:id/toggle-status', authorize('admin'), userController.toggleUserStatus);

export default router;
