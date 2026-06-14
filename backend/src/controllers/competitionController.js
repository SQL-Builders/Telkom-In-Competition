import competitionService from '../services/competitionService.js';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from '../utils/responseHandler.js';

/**
 * @swagger
 * tags:
 *   name: Competitions
 *   description: Competition management endpoints
 */
const competitionController = {
  /**
   * @swagger
   * /api/competitions:
   *   get:
   *     summary: Get all competitions
   *     tags: [Competitions]
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
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [draft, active, completed]
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: kategori
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: List of competitions
   */
  async getAllCompetitions(req, res, next) {
    try {
      const { competitions, pagination } =
        await competitionService.getAllCompetitions(req.query);
      return paginatedResponse(
        res,
        'Competitions retrieved successfully.',
        competitions,
        pagination
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/competitions/{id}:
   *   get:
   *     summary: Get competition by ID
   *     tags: [Competitions]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Competition data
   *       404:
   *         description: Competition not found
   */
  async getCompetitionById(req, res, next) {
    try {
      const competitionId = parseInt(req.params.id, 10);
      const competition =
        await competitionService.getCompetitionById(competitionId);
      return successResponse(
        res,
        'Competition retrieved successfully.',
        competition
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/competitions:
   *   post:
   *     summary: Create a new competition (admin only)
   *     tags: [Competitions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [nama_lomba, penyelenggara]
   *             properties:
   *               nama_lomba:
   *                 type: string
   *               id_kategori:
   *                 type: integer
   *               deskripsi:
   *                 type: string
   *               hadiah:
   *                 type: string
   *               penyelenggara:
   *                 type: string
   *               biaya:
   *                 type: number
   *               tgl_mulai:
   *                 type: string
   *                 format: date
   *               tgl_selesai:
   *                 type: string
   *                 format: date
   *               deadline:
   *                 type: string
   *                 format: date-time
   *               status:
   *                 type: string
   *                 enum: [draft, active, completed]
   *     responses:
   *       201:
   *         description: Competition created
   *       400:
   *         description: Validation error
   */
  async createCompetition(req, res, next) {
    try {
      const competition = await competitionService.createCompetition(req.body);
      return createdResponse(
        res,
        'Competition created successfully.',
        competition
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/competitions/{id}:
   *   put:
   *     summary: Update a competition (admin only)
   *     tags: [Competitions]
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
   *               nama_lomba:
   *                 type: string
   *               deskripsi:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Competition updated
   *       404:
   *         description: Competition not found
   */
  async updateCompetition(req, res, next) {
    try {
      const competitionId = parseInt(req.params.id, 10);
      const competition = await competitionService.updateCompetition(
        competitionId,
        req.body
      );
      return successResponse(
        res,
        'Competition updated successfully.',
        competition
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/competitions/{id}:
   *   delete:
   *     summary: Delete a competition (admin only)
   *     tags: [Competitions]
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
   *         description: Competition deleted
   *       404:
   *         description: Competition not found
   */
  async deleteCompetition(req, res, next) {
    try {
      const competitionId = parseInt(req.params.id, 10);
      await competitionService.deleteCompetition(competitionId);
      return successResponse(res, 'Competition deleted successfully.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/competitions/{id}/register:
   *   post:
   *     summary: Register for a competition
   *     tags: [Competitions]
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
   *             required: [id_berkas]
   *             properties:
   *               id_berkas:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Registered for competition
   *       409:
   *         description: Already registered
   */
  async registerForCompetition(req, res, next) {
    try {
      const competitionId = parseInt(req.params.id, 10);
      const registration = await competitionService.registerForCompetition(
        req.user.id_user,
        {
          id_lomba: competitionId,
          id_berkas: req.body.id_berkas,
          form_data: req.body.form_data,
        }
      );
      return createdResponse(
        res,
        'Registered for competition successfully.',
        registration
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/competitions/registrations/me:
   *   get:
   *     summary: Get current user's competition registrations
   *     tags: [Competitions]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User registrations
   */
  async getMyRegistrations(req, res, next) {
    try {
      const registrations = await competitionService.getUserRegistrations(
        req.user.id_user
      );
      return successResponse(
        res,
        'Registrations retrieved successfully.',
        registrations
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/competitions/categories:
   *   get:
   *     summary: Get all competition categories
   *     tags: [Competitions]
   *     responses:
   *       200:
   *         description: List of categories
   */
  async getAllCategories(req, res, next) {
    try {
      const categories = await competitionService.getAllCategories();
      return successResponse(
        res,
        'Categories retrieved successfully.',
        categories
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /api/competitions/categories:
   *   post:
   *     summary: Create a new category (admin only)
   *     tags: [Competitions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [nama_kategori]
   *             properties:
   *               nama_kategori:
   *                 type: string
   *               deskripsi:
   *                 type: string
   *     responses:
   *       201:
   *         description: Category created
   */
  async createCategory(req, res, next) {
    try {
      const category = await competitionService.createCategory(req.body);
      return createdResponse(res, 'Category created successfully.', category);
    } catch (error) {
      next(error);
    }
  },
  // ── Admin Registrants Management ──────────────────────────

  async getRegistrants(req, res, next) {
    try {
      const competitionId = parseInt(req.params.id, 10);
      const registrants = await competitionService.getCompetitionRegistrants(competitionId);

      // Support CSV export if requested
      if (req.query.format === 'csv') {
        let csvContent = 'Registration ID,User Name,User Email,Status,Date\n';
        registrants.forEach(reg => {
          const name = reg.user_pengguna?.name || '';
          const email = reg.user_pengguna?.email || '';
          const status = reg.status_pendaftaran;
          const date = new Date(reg.tgl_daftar).toLocaleDateString();
          csvContent += `"${reg.nomor_pendaftaran}","${name}","${email}","${status}","${date}"\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=registrants-${competitionId}.csv`);
        return res.status(200).send(csvContent);
      }

      return successResponse(res, 'Registrants retrieved successfully.', registrants);
    } catch (error) {
      next(error);
    }
  },

  async getAllRegistrations(req, res, next) {
    try {
      const registrations = await competitionService.getAllRegistrations();
      return successResponse(res, 'All registrations retrieved successfully.', registrations);
    } catch (error) {
      next(error);
    }
  },

  async updateRegistrantStatus(req, res, next) {
    try {
      const registrationId = parseInt(req.params.id, 10);
      const updated = await competitionService.updateRegistrantStatus(registrationId, req.body.status);
      return successResponse(res, 'Status updated successfully.', updated);
    } catch (error) {
      next(error);
    }
  },

  async updateRegistrantStage(req, res, next) {
    try {
      const registrationId = parseInt(req.params.id, 10);
      const updated = await competitionService.updateRegistrantStage(registrationId, req.body.stage);
      return successResponse(res, 'Stage updated successfully.', updated);
    } catch (error) {
      next(error);
    }
  },

  async updateRegistrantReview(req, res, next) {
    try {
      const registrationId = parseInt(req.params.id, 10);
      const updated = await competitionService.updateRegistrantReview(registrationId, req.body.reviewData);
      return successResponse(res, 'Review updated successfully.', updated);
    } catch (error) {
      next(error);
    }
  },

  async createRegistrationAdmin(req, res, next) {
    try {
      const registration = await competitionService.createRegistrationAdmin(req.body);
      return successResponse(res, 'Registration created successfully.', registration, 201);
    } catch (error) {
      next(error);
    }
  },



  async deleteRegistration(req, res, next) {
    try {
      const registrationId = parseInt(req.params.id, 10);
      await competitionService.deleteRegistration(registrationId);
      return successResponse(res, 'Registration deleted successfully.');
    } catch (error) {
      next(error);
    }
  },
};

export default competitionController;
