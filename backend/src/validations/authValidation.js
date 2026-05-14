import { z } from 'zod';

/**
 * Schema: User registration
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required.' })
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.'),
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Invalid email format.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must not exceed 128 characters.'),
  nama_lengkap: z.string().max(150).optional(),
  no_telepon: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format.')
    .optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

/**
 * Schema: User login
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Invalid email format.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(1, 'Password is required.'),
});

/**
 * Schema: Refresh token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token is required.' })
    .min(1, 'Refresh token is required.'),
});

/**
 * Schema: Change password
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required.' })
    .min(1),
  newPassword: z
    .string({ required_error: 'New password is required.' })
    .min(8, 'New password must be at least 8 characters.')
    .max(128),
});
