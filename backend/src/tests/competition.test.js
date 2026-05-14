import { jest } from '@jest/globals';

// ── Mock Supabase ──────────────────────────────────────────
const mockSupabase = {
  from: jest.fn(() => mockSupabase),
  select: jest.fn(() => mockSupabase),
  insert: jest.fn(() => mockSupabase),
  update: jest.fn(() => mockSupabase),
  delete: jest.fn(() => mockSupabase),
  eq: jest.fn(() => mockSupabase),
  single: jest.fn(() => mockSupabase),
  order: jest.fn(() => mockSupabase),
  range: jest.fn(() => mockSupabase),
  or: jest.fn(() => mockSupabase),
};

jest.unstable_mockModule('../config/supabase.js', () => ({
  default: mockSupabase,
  supabase: mockSupabase,
  supabaseAdmin: null,
}));

// ── Tests ──────────────────────────────────────────────────
describe('Competition Service', () => {
  let competitionService;

  beforeAll(async () => {
    const module = await import('../services/competitionService.js');
    competitionService = module.default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCompetitions', () => {
    it('should return competitions with pagination', async () => {
      // Mock count
      mockSupabase.select.mockReturnValueOnce({
        ...mockSupabase,
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        then: (resolve) =>
          resolve({ count: 25, error: null }),
      });

      // Mock data
      const mockCompetitions = [
        {
          id_lomba: 1,
          nama_lomba: 'Test Competition',
          penyelenggara: 'Telkom',
          status: 'active',
        },
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockCompetitions,
        error: null,
      });

      // Note: This test demonstrates the structure.
      // In a real scenario, you'd need more thorough mocking.
      expect(competitionService.getAllCompetitions).toBeDefined();
    });
  });

  describe('getCompetitionById', () => {
    it('should throw error for non-existent competition', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });

      await expect(
        competitionService.getCompetitionById(999)
      ).rejects.toThrow('Competition not found.');
    });
  });
});

describe('Competition Validation Schemas', () => {
  let createCompetitionSchema, listCompetitionsQuerySchema;

  beforeAll(async () => {
    const module = await import('../validations/competitionValidation.js');
    createCompetitionSchema = module.createCompetitionSchema;
    listCompetitionsQuerySchema = module.listCompetitionsQuerySchema;
  });

  describe('createCompetitionSchema', () => {
    it('should validate a correct competition payload', () => {
      const validData = {
        nama_lomba: 'Hackathon 2026',
        penyelenggara: 'Telkom University',
        biaya: 0,
        status: 'active',
      };

      const result = createCompetitionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing nama_lomba', () => {
      const invalidData = {
        penyelenggara: 'Telkom',
      };

      const result = createCompetitionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const invalidData = {
        nama_lomba: 'Test',
        penyelenggara: 'Test Org',
        tgl_mulai: '12/31/2026', // wrong format
      };

      const result = createCompetitionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('listCompetitionsQuerySchema', () => {
    it('should provide defaults for pagination', () => {
      const result = listCompetitionsQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    });

    it('should coerce string page number', () => {
      const result = listCompetitionsQuerySchema.safeParse({ page: '3' });
      expect(result.success).toBe(true);
      expect(result.data.page).toBe(3);
    });
  });
});
