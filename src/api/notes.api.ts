import { apiClient } from './client';
import { ApiNote, ApiResponse } from '@/types/api';

export interface CreateNotePayload {
  title: string;
  description?: string | null;
  id_categories?: number | null;
  status?: boolean;
  background_path?: any;
}

export interface UpdateNotePayload {
  title?: string;
  description?: string | null;
  id_categories?: number | null;
  status?: boolean;
  background_path?: any;
}

export const notesApi = {
  getNotes: async (): Promise<ApiResponse<ApiNote[]>> => {
    const response = await apiClient.get<ApiResponse<ApiNote[]>>('/notes');
    return response.data;
  },

  getNoteDetail: async (id: number): Promise<ApiResponse<ApiNote>> => {
    const response = await apiClient.get<ApiResponse<ApiNote>>(`/notes/${id}`);
    return response.data;
  },

  createNote: async (payload: CreateNotePayload): Promise<ApiResponse<ApiNote>> => {
    // Jika ada background_path file, kirim sebagai FormData
    if (payload.background_path && typeof payload.background_path === 'object') {
      const formData = new FormData();
      formData.append('title', payload.title);
      if (payload.description) formData.append('description', payload.description);
      if (payload.id_categories) formData.append('id_categories', String(payload.id_categories));
      if (payload.status !== undefined) formData.append('status', payload.status ? '1' : '0');
      formData.append('background_path', payload.background_path);

      const response = await apiClient.post<ApiResponse<ApiNote>>('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }

    const response = await apiClient.post<ApiResponse<ApiNote>>('/notes', payload);
    return response.data;
  },

  updateNote: async (id: number, payload: UpdateNotePayload): Promise<ApiResponse<ApiNote>> => {
    // Backend menggunakan POST /notes/{id} untuk update dengan multipart/form-data
    if (payload.background_path && typeof payload.background_path === 'object') {
      const formData = new FormData();
      if (payload.title) formData.append('title', payload.title);
      if (payload.description !== undefined) formData.append('description', payload.description || '');
      if (payload.id_categories) formData.append('id_categories', String(payload.id_categories));
      if (payload.status !== undefined) formData.append('status', payload.status ? '1' : '0');
      formData.append('background_path', payload.background_path);

      const response = await apiClient.post<ApiResponse<ApiNote>>(`/notes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }

    const response = await apiClient.post<ApiResponse<ApiNote>>(`/notes/${id}`, payload);
    return response.data;
  },

  deleteNote: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/notes/${id}`);
    return response.data;
  },

  getNoteTasks: async (): Promise<ApiResponse<ApiNote[]>> => {
    const response = await apiClient.get<ApiResponse<ApiNote[]>>('/note-task');
    return response.data;
  },
};
