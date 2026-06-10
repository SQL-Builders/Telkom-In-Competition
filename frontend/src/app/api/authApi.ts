import { apiClient } from './client';

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  },

  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },
};
