import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticate, authorize, authorizeSelfOrAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// ── User Routes ────────────────────────────────────────────
router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', authorizeSelfOrAdmin(), userController.getUserById);
router.put('/:id', authorizeSelfOrAdmin(), userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);
router.patch('/:id/toggle-status', authorize('admin'), userController.toggleUserStatus);

export default router;
