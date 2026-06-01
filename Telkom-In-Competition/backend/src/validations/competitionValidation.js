import { z } from 'zod';

/**
 * Schema: Create competition
 */
export const createCompetitionSchema = z.object({
  nama_lomba: z
    .string({ required_error: 'Competition name is required.' })
    .min(3, 'Competition name must be at least 3 characters.')
    .max(200),
  id_kategori: z.number().int().positive().optional(),
  deskripsi: z.string().max(5000).optional(),
  hadiah: z.string().max(500).optional(),
  penyelenggara: z
    .string({ required_error: 'Organizer is required.' })
    .min(2)
    .max(200),
  biaya: z.number().nonnegative('Fee must be non-negative.').default(0),
  tgl_mulai: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD format.')
    .optional(),
  tgl_selesai: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD format.')
    .optional(),
  deadline: z.string().datetime({ offset: true }).optional(),
  status: z.enum(['active', 'inactive', 'upcoming', 'completed']).default('active'),
  is_document_required: z.boolean().default(false),
  max_document_size_mb: z.number().int().positive().default(10),
  allowed_document_formats: z.string().default('.pdf,.zip,.png,.jpg,.jpeg'),
  poster_url: z.string().url().optional(),
});

/**
 * Schema: Update competition
 */
export const updateCompetitionSchema = createCompetitionSchema.partial();

/**
 * Schema: Competition registration
 */
export const registerCompetitionSchema = z.object({
  id_lomba: z
    .number({ required_error: 'Competition ID is required.' })
    .int()
    .positive(),
  data_berkas_id_data_berkas: z
    .number()
    .int()
    .positive()
    .optional(),
});

/**
 * Schema: Query parameters for listing competitions
 */
export const listCompetitionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(['active', 'inactive', 'upcoming', 'completed']).optional(),
  search: z.string().max(100).optional(),
  kategori: z.coerce.number().int().positive().optional(),
});
