import { apiClient } from './client';
import { Category, ApiResponse } from '@/types/api';

export const categoryApi = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/category');
    return response.data;
  },

  createCategory: async (name: string): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post<ApiResponse<Category>>('/category', { name });
    return response.data;
  },

  updateCategory: async (id: number, name: string): Promise<ApiResponse<Category>> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/category/${id}`, { name });
    return response.data;
  },

  deleteCategory: async (id: number): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.delete<ApiResponse<Category[]>>(`/category/${id}`);
    return response.data;
  },
};
