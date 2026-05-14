import multer from 'multer';
import { AppError } from './errorMiddleware.js';

// Configure multer for memory storage (we will upload directly from memory to Supabase)
const storage = multer.memoryStorage();

// File filter to allow only specific types (e.g., pdf, images, archives)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only PDF, JPEG, PNG, and ZIP are allowed.', 400), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});
