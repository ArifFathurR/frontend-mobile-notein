import { Platform } from 'react-native';

/**
 * Konfigurasi URL backend Laravel.
 * - Android Emulator: 'http://10.0.2.2:8000/api'
 * - iOS Simulator: 'http://localhost:8000/api'
 * - Fisik Device: Sesuaikan dengan IP laptop di jaringan WiFi yang sama, misal: 'http://192.168.1.10:8000/api'
 */
export const API_BASE_URL = Platform.select({
  android: 'https://test2.cloudslabs.my.id/api/',
  ios: 'https://test2.cloudslabs.my.id/api/',
  default: 'https://test2.cloudslabs.my.id/api/',
});

export const TOKEN_STORAGE_KEY = 'notein_auth_token';

/**
 * Helper untuk mengubah relative path gambar dari backend menjadi full URL yang valid.
 */
export const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  // Abaikan jika ternyata string tanggal
  if (/^\d{4}-\d{2}-\d{2}/.test(path)) return null;
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('file://') ||
    path.startsWith('data:') ||
    path.startsWith('content://')
  ) {
    return path;
  }
  const baseHost = (API_BASE_URL || '').replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseHost}/${cleanPath}`;
};
