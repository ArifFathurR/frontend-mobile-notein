import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import '../../global.css';
import { AuthProvider, useAuth } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Sembunyikan splash screen segera setelah state auth siap
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }

    // Safety fallback: sembunyikan splash setelah 2.5 detik maksimal
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 2500);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Auth routing guard
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login' as any);
    } else if (token && inAuthGroup) {
      router.replace('/(main)' as any);
    }
  }, [token, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
