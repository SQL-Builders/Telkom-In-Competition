import winston from 'winston';
import env from '../config/env.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format for development console output.
 */
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

/**
 * Winston logger instance.
 * - Development: colorized console output.
 * - Production:  JSON file output + console.
 */
const logger = winston.createLogger({
  level: env.logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  ),
  defaultMeta: { service: 'telkom-in-api' },
  transports: [
    // Console transport (always enabled)
    new winston.transports.Console({
      format: combine(
        colorize(),
        devFormat
      ),
    }),
  ],
});

// In production, also write to files
if (env.isProduction) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(winston.format.json()),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(winston.format.json()),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

export default logger;
