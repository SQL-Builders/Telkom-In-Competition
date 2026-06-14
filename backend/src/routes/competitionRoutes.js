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

// ── Registration: specific paths MUST come BEFORE /:id ─────
router.get(
  '/registrations/me',
  authenticate,
  competitionController.getMyRegistrations
);
router.get(
  '/registrations/all',
  authenticate,
  authorize('admin'),
  competitionController.getAllRegistrations
);
router.patch(
  '/registrations/:id/status',
  authenticate,
  authorize('admin'),
  competitionController.updateRegistrantStatus
);
router.patch(
  '/registrations/:id/stage',
  authenticate,
  authorize('admin'),
  competitionController.updateRegistrantStage
);
router.patch(
  '/registrations/:id/review',
  authenticate,
  authorize('admin'),
  competitionController.updateRegistrantReview
);
router.delete(
  '/registrations/:id',
  authenticate,
  authorize('admin'),
  competitionController.deleteRegistration
);
router.post(
  '/registrations',
  authenticate,
  authorize('admin'),
  competitionController.createRegistrationAdmin
);

// ── Single competition (after all /registrations/* routes) ──
router.get('/:id', competitionController.getCompetitionById);

// ── Protected Competition CRUD ─────────────────────────────
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

// ── Register for competition ───────────────────────────────
router.post(
  '/:id/register',
  authenticate,
  competitionController.registerForCompetition
);

// ── Per-competition registrants (admin) ───────────────────
router.get(
  '/:id/registrants',
  authenticate,
  authorize('admin'),
  competitionController.getRegistrants
);

// ── Categories (admin) ────────────────────────────────────
router.post(
  '/categories',
  authenticate,
  authorize('admin'),
  competitionController.createCategory
);

export default router;
