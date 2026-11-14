import { apiClient } from './client';
import { AuthResponse, ApiResponse, User } from '@/types/api';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/logout');
    return response.data;
  },

  getMe: async (): Promise<{ data: { user: User } }> => {
    const response = await apiClient.get<{ data: { user: User } }>('/me');
    return response.data;
  },
};
