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
  poster_url: z.string().url().optional(),
  level: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  whatsapp_group: z.string().nullable().optional().or(z.literal('')),
  whatsappGroup: z.string().nullable().optional().or(z.literal('')),
  requirements: z.array(z.string()).nullable().optional(),
  timeline: z.array(z.object({
    date: z.string().optional(),
    event: z.string().optional(),
    stage: z.string().optional()
  })).nullable().optional(),
  proposalFields: z.array(z.object({
    label: z.string(),
    type: z.string(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
    allowedFormats: z.array(z.string()).optional()
  })).nullable().optional(),
  proposal_fields: z.array(z.object({
    label: z.string(),
    type: z.string(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
    allowedFormats: z.array(z.string()).optional()
  })).nullable().optional(),
});

/**
 * Schema: Update competition
 */
export const updateCompetitionSchema = createCompetitionSchema.partial();

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
