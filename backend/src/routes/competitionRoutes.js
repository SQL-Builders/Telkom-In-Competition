import { Router } from 'express';
import competitionController from '../controllers/competitionController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createCompetitionSchema,
  updateCompetitionSchema,
  listCompetitionsQuerySchema,
} from '../validations/competitionValidation.js';

const router = Router();

// ── Public Routes ──────────────────────────────────────────
router.get(
  '/',
  validate(listCompetitionsQuerySchema, 'query'),
  competitionController.getAllCompetitions
);
router.get('/categories', competitionController.getAllCategories);
router.get(
  '/registrations/me',
  authenticate,
  competitionController.getMyRegistrations
);
router.get('/:id', competitionController.getCompetitionById);

// ── Protected Routes ───────────────────────────────────────
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createCompetitionSchema),
  competitionController.createCompetition
);
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateCompetitionSchema),
  competitionController.updateCompetition
);
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  competitionController.deleteCompetition
);

// ── Registration ───────────────────────────────────────────
router.post(
  '/:id/register',
  authenticate,
  competitionController.registerForCompetition
);

// ── Admin Registrant Management ─────────────────────────
router.get(
  '/:id/registrants',
  authenticate,
  authorize('admin'),
  competitionController.getRegistrants
);
router.patch(
  '/registrations/:id/status',
  authenticate,
  authorize('admin'),
  competitionController.updateRegistrantStatus
);
router.patch(
  '/registrations/:id/winner',
  authenticate,
  authorize('admin'),
  competitionController.markWinner
);
router.delete(
  '/registrations/:id',
  authenticate,
  authorize('admin'),
  competitionController.deleteRegistration
);

// ── Categories (admin) ────────────────────────────────────
router.post(
  '/categories',
  authenticate,
  authorize('admin'),
  competitionController.createCategory
);

export default router;
