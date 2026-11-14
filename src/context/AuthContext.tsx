import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/api';
import { authApi } from '@/api/auth.api';
import { tokenStorage } from '@/api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data.user);
    } catch {
      setUser(null);
      setToken(null);
      await tokenStorage.removeToken();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await tokenStorage.getToken();
        if (storedToken) {
          setToken(storedToken);
          const res = await authApi.getMe();
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn('Gagal memuat token auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const newToken = res.data.token;
    await tokenStorage.setToken(newToken);
    setToken(newToken);
    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    await authApi.register(name, email, password);
    // Setelah registrasi sukses, langsung login
    await login(email, password);
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch {
      // Ignore network error saat logout
    } finally {
      await tokenStorage.removeToken();
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
