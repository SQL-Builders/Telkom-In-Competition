import { jest } from '@jest/globals';

// ── Mock Supabase ──────────────────────────────────────────
// We mock the Supabase client so tests don't hit the real database.
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
describe('Auth Service', () => {
  let authService;

  beforeAll(async () => {
    // Dynamic import after mocking
    const module = await import('../services/authService.js');
    authService = module.default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw an error if email is already registered', async () => {
      // Mock: email already exists
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_user: 1 },
        error: null,
      });

      await expect(
        authService.register({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email is already registered.');
    });

    it('should successfully register a new user', async () => {
      // Mock: email does not exist
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });

      // Mock: insert user
      mockSupabase.single.mockResolvedValueOnce({
        data: {
          id_user: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
          nama_lengkap: null,
          no_telepon: null,
          tgl_daftar: new Date().toISOString(),
        },
        error: null,
      });

      const result = await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('login', () => {
    it('should throw an error for non-existent user', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });

      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password.');
    });
  });
});

describe('Auth Validation Schemas', () => {
  let registerSchema, loginSchema;

  beforeAll(async () => {
    const module = await import('../validations/authValidation.js');
    registerSchema = module.registerSchema;
    loginSchema = module.loginSchema;
  });

  describe('registerSchema', () => {
    it('should validate a correct registration payload', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John',
        email: 'not-an-email',
        password: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        name: 'John',
        email: 'john@example.com',
        password: '123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate a correct login payload', () => {
      const validData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
