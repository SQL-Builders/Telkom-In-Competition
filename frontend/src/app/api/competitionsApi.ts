import { apiClient } from './client';
import type { Competition } from '../data/competitions';
import type {
  CompetitionQueryParams,
  CreateCompetitionRequest,
  CreateRegistrationAdminRequest,
  PaginatedResponse,
  RegisterForCompetitionRequest,
  UpdateCompetitionRequest,
} from './types';

/** Competitions API — wraps semua endpoint /api/competitions */
export const competitionsApi = {
  // ── Public / User Endpoints ─────────────────────────────

  /** Ambil semua kompetisi dengan filter opsional */
  getAll: async (
    params?: CompetitionQueryParams
  ): Promise<PaginatedResponse<Competition>> => {
    // Backend paginatedResponse shape:
    // { success, message, data: Competition[], pagination: {...} }
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Competition[];
      pagination: PaginatedResponse<Competition>['pagination'];
    }>('/competitions', { params });
    return {
      data: response.data.data ?? [],
      pagination: response.data.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  },

  /** Ambil detail satu kompetisi berdasarkan ID */
  getById: async (id: number | string): Promise<Competition> => {
    // Backend successResponse shape: { success, message, data: Competition }
    const response = await apiClient.get<{ success: boolean; message: string; data: Competition }>(
      `/competitions/${id}`
    );
    return response.data.data;
  },

  /** Ambil semua kategori kompetisi */
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<{ data: string[] }>(
      '/competitions/categories'
    );
    return response.data.data;
  },

  /** Daftar ke kompetisi tertentu (requires login) */
  register: async (
    id: number | string,
    data: RegisterForCompetitionRequest = {}
  ): Promise<unknown> => {
    const response = await apiClient.post(
      `/competitions/${id}/register`,
      data
    );
    return response.data;
  },

  /** Ambil daftar kompetisi yang sudah didaftarkan oleh user saat ini */
  getMyRegistrations: async (): Promise<unknown[]> => {
    const response = await apiClient.get<{ data: unknown[] }>(
      '/competitions/registrations/me'
    );
    return response.data.data;
  },

  // ── Admin Endpoints ─────────────────────────────────────

  /** Buat kompetisi baru (admin only) */
  create: async (data: CreateCompetitionRequest): Promise<Competition> => {
    const response = await apiClient.post<{ data: Competition }>(
      '/competitions',
      data
    );
    return response.data.data;
  },

  /** Update kompetisi (admin only) */
  update: async (
    id: string | number,
    data: UpdateCompetitionRequest
  ): Promise<Competition> => {
    const response = await apiClient.put<{ data: Competition }>(
      `/competitions/${id}`,
      data
    );
    return response.data.data;
  },

  /** Hapus kompetisi (admin only) */
  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/competitions/${id}`);
  },

  /** Ambil semua registrasi (admin only) */
  getAllRegistrations: async (): Promise<unknown[]> => {
    const response = await apiClient.get<{ data: unknown[] }>(
      '/competitions/registrations/all'
    );
    return response.data.data;
  },

  /** Ambil semua registrant untuk kompetisi tertentu (admin only) */
  getRegistrants: async (id: string | number): Promise<unknown[]> => {
    const response = await apiClient.get<{ data: unknown[] }>(
      `/competitions/${id}/registrants`
    );
    return response.data.data;
  },

  /** Update status registrasi (admin only) */
  updateRegistrationStatus: async (
    id: string | number,
    status: string
  ): Promise<void> => {
    await apiClient.patch(`/competitions/registrations/${id}/status`, {
      status,
    });
  },

  /** Update stage registrasi (admin only) */
  updateRegistrantStage: async (
    id: string | number,
    stage: string
  ): Promise<void> => {
    await apiClient.patch(`/competitions/registrations/${id}/stage`, { stage });
  },

  /** Update review data registrasi (admin only) */
  updateRegistrationReview: async (
    id: string | number,
    reviewData: any
  ): Promise<any> => {
    const response = await apiClient.patch<{ data: any }>(
      `/competitions/registrations/${id}/review`,
      { reviewData }
    );
    return response.data.data;
  },

  /**
   * Update status DAN/ATAU stage sekaligus (admin only)
   * Menggabungkan dua PATCH call menjadi satu fungsi yang mudah dipakai
   */
  updateRegistration: async (
    id: string | number,
    data: { status?: string; stage?: string }
  ): Promise<void> => {
    const promises: Promise<void>[] = [];

    if (data.status) {
      promises.push(competitionsApi.updateRegistrationStatus(id, data.status));
    }
    if (data.stage) {
      promises.push(competitionsApi.updateRegistrantStage(id, data.stage));
    }

    await Promise.all(promises);
  },

  /** Hapus registrasi (admin only) */
  deleteRegistration: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/competitions/registrations/${id}`);
  },

  /** Buat registrasi manual untuk user tertentu (admin only) */
  createRegistrationAdmin: async (
    data: CreateRegistrationAdminRequest
  ): Promise<unknown> => {
    const response = await apiClient.post('/competitions/registrations', data);
    return response.data.data;
  },

  /** Buat kategori baru (admin only) */
  createCategory: async (data: { name: string }): Promise<unknown> => {
    const response = await apiClient.post('/competitions/categories', data);
    return response.data.data;
  },
};
