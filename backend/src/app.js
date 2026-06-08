import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import env from './config/env.js';
import swaggerSpec from './docs/swagger.js';
import logger from './utils/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

// ── Route Imports ──────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import competitionRoutes from './routes/competitionRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// ── Global Middleware ──────────────────────────────────────

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging (skip in test environment)
if (env.nodeEnv !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// ── API Routes ─────────────────────────────────────────────

// Root route — welcome message
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Telkom-In Competition API',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/api/health',
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Telkom-In Competition API is running.',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Telkom-In API Docs',
}));

// Swagger JSON endpoint
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/upload', uploadRoutes);

// ── Error Handling ─────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
