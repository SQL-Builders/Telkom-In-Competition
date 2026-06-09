import multer from 'multer';
import { AppError } from './errorMiddleware.js';

// ini biar file langsung disimpan di memori, bukan di disk. kalo ga salah namanya multer tapi gatau sih lupa
const storage = multer.memoryStorage();

// buat filter file
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/zip',
    'application/x-zip-compressed',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
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
