import { Platform } from 'react-native';

/**
 * Konfigurasi URL backend Laravel.
 * - Android Emulator: 'http://10.0.2.2:8000/api'
 * - iOS Simulator: 'http://localhost:8000/api'
 * - Fisik Device: Sesuaikan dengan IP laptop di jaringan WiFi yang sama, misal: 'http://192.168.1.10:8000/api'
 */
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api',
  ios: 'http://localhost:8000/api',
  default: 'http://localhost:8000/api',
});

export const TOKEN_STORAGE_KEY = 'notein_auth_token';
