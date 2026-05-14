import swaggerJsdoc from 'swagger-jsdoc';
import env from '../config/env.js';

/**
 * Swagger / OpenAPI specification configuration.
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Telkom-In Competition API',
      version: '1.0.0',
      description:
        'REST API for the Telkom-In Competition platform. Manage competitions, user registrations, bookmarks, and authentication.',
      contact: {
        name: 'API Support',
        email: 'support@telkom-in.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        // ── Reusable Schemas ────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        User: {
          type: 'object',
          properties: {
            id_user: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            nama_lengkap: { type: 'string' },
            no_telepon: { type: 'string' },
            tgl_daftar: { type: 'string', format: 'date-time' },
          },
        },
        Competition: {
          type: 'object',
          properties: {
            id_lomba: { type: 'integer' },
            nama_lomba: { type: 'string' },
            id_kategori: { type: 'integer' },
            deskripsi: { type: 'string' },
            hadiah: { type: 'string' },
            penyelenggara: { type: 'string' },
            biaya: { type: 'number' },
            tgl_mulai: { type: 'string', format: 'date' },
            tgl_selesai: { type: 'string', format: 'date' },
            deadline: { type: 'string', format: 'date-time' },
            status: { type: 'string' },
          },
        },
        Bookmark: {
          type: 'object',
          properties: {
            id_lomba_favorit: { type: 'integer' },
            id_user: { type: 'integer' },
            id_lomba: { type: 'integer' },
            favorit: { type: 'integer' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
  },
  // Path to the API route files with JSDoc annotations
  apis: ['./src/controllers/*.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
