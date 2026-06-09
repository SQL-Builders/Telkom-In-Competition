import { apiClient } from './client';
import type { Competition } from '../data/competitions';

export const competitionsApi = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; search?: string; kategori?: string }) => {
    const response = await apiClient.get<{ data: Competition[], pagination: any }>('/competitions', { params });
    return response.data;
  },
  
  getById: async (id: number | string) => {
    const response = await apiClient.get<{ data: Competition }>(`/competitions/${id}`);
    return response.data.data;
  },
  
  getCategories: async () => {
    const response = await apiClient.get('/competitions/categories');
    return response.data.data;
  },
  
  register: async (id: number | string, data: any) => {
    const response = await apiClient.post(`/competitions/${id}/register`, data);
    return response.data;
  },
  
  getMyRegistrations: async () => {
    const response = await apiClient.get('/competitions/registrations/me');
    return response.data.data;
  },

  // Admin Methods
  create: async (data: any) => {
    const response = await apiClient.post('/competitions', data);
    return response.data.data;
  },

  update: async (id: string | number, data: any) => {
    const response = await apiClient.put(`/competitions/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/competitions/${id}`);
    return response.data.data;
  },

  getAllRegistrations: async () => {
    const response = await apiClient.get('/competitions/registrations/all');
    return response.data.data;
  },

  updateRegistrationStatus: async (id: string | number, status: string) => {
    const response = await apiClient.patch(`/competitions/registrations/${id}/status`, { status });
    return response.data.data;
  },

  updateRegistrantStage: async (id: string | number, stage: string) => {
    const response = await apiClient.patch(`/competitions/registrations/${id}/stage`, { stage });
    return response.data.data;
  },

  updateRegistration: async (id: string | number, data: { status?: string; stage?: string }) => {
    const promises = [];
    if (data.status) promises.push(apiClient.patch(`/competitions/registrations/${id}/status`, { status: data.status }));
    if (data.stage) promises.push(apiClient.patch(`/competitions/registrations/${id}/stage`, { stage: data.stage }));
    await Promise.all(promises);
  },

  deleteRegistration: async (id: string | number) => {
    const response = await apiClient.delete(`/competitions/registrations/${id}`);
    return response.data.data;
  },

  createRegistrationAdmin: async (data: { id_lomba: number; id_user: number; stage?: string; status_pendaftaran?: string }) => {
    const response = await apiClient.post('/competitions/registrations', data);
    return response.data.data;
  },
};
