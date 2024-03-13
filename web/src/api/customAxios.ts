import axios, { AxiosError } from 'axios';
import { isDevelopment } from '../utilities/env';
import { refreshToken } from './auth/auth.api';

export const api = axios.create({
  baseURL: isDevelopment() ? 'http://localhost:3000/api/v1' : process.env.API_URL,
  timeout: 8000,
  headers: {
    Accept: 'application/json',

  },
  withCredentials: true,
})

api.interceptors.response.use((response) => {
  return response
}, async (error: AxiosError) => {
  const originalRequest = error.config as typeof error.config & { _retry: boolean };

  if (!originalRequest || !error.response) return Promise.reject(error);

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    await refreshToken();
    return api(originalRequest);
  }

  return Promise.reject(error);
});