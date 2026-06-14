import axios, { type AxiosError } from 'axios';
import type { ApiError } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const AUTH_TOKEN_KEY = 'telkom-in-competition:token';
const AUTH_USER_KEY = 'telkom-in-competition:user';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 detik timeout
});

// ── Request Interceptor: Attach token ──────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle errors globally ───────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Token expired / unauthorized → logout user
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);

      // Redirect ke login hanya jika belum di halaman login/register
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }

    // Throw error yang lebih deskriptif
    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan pada server';

    return Promise.reject(new Error(message));
  }
);
