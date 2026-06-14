import { apiClient } from './client';
import type {
  AuthResponse,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from './types';

/** Auth API — wraps semua endpoint /api/auth */
export const authApi = {
  /** Login user, returns token + user data */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  /** Register user baru */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      '/auth/register',
      userData
    );
    return response.data.data;
  },

  /** Ambil data user yang sedang login (requires token) */
  getMe: async (): Promise<AuthUser> => {
    const response = await apiClient.get<{ data: AuthUser }>('/auth/me');
    return response.data.data;
  },

  /** Ganti password (requires token) */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/auth/change-password', data);
  },

  /** Refresh access token menggunakan refresh token */
  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      '/auth/refresh-token',
      data
    );
    return response.data.data;
  },
};
