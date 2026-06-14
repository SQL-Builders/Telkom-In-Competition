// ── Auth Types ──────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  nama_lengkap?: string;
  no_telepon?: string;
  role?: 'user' | 'admin';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  nama_lengkap?: string;
  no_telepon?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

// ── User Types ──────────────────────────────────────────────

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  nama_lengkap?: string;
  no_telepon?: string;
}

// ── Competition Types ───────────────────────────────────────

export interface CompetitionQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  kategori?: string;
}

export interface CreateCompetitionRequest {
  title: string;
  shortTitle?: string;
  description: string;
  fullDescription?: string;
  category: string;
  deadline: string;
  registrationDeadline?: string;
  level: 'University' | 'National' | 'International';
  organizer?: string;
  location?: string;
  whatsappGroup?: string;
  prizes?: string[];
  status?: 'draft' | 'active' | 'completed';
  featured?: boolean;
  recommended?: boolean;
  image?: string;
}

export type UpdateCompetitionRequest = Partial<CreateCompetitionRequest>;

export interface RegisterForCompetitionRequest {
  catatan?: string;
  [key: string]: unknown;
}

export interface RegistrationStatusUpdate {
  status: string;
}

export interface RegistrationStageUpdate {
  stage: string;
}

export interface CreateRegistrationAdminRequest {
  id_lomba: number;
  id_user: number;
  stage?: string;
  status_pendaftaran?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ── API Response Wrapper ────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
