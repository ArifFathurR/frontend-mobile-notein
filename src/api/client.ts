import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '@/constants/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Helper penyimpanan token lintas platform (SecureStore di native, localStorage di web)
export const tokenStorage = {
  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          return localStorage.getItem(TOKEN_STORAGE_KEY);
        }
        return null;
      }
      return await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
        }
        return;
      }
      await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn('Gagal menyimpan token:', e);
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
        return;
      }
      await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.warn('Gagal menghapus token:', e);
    }
  },
};

// Request Interceptor: Otomatis tambahkan Bearer token jika ada
apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
