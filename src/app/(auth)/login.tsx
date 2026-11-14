import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Silakan isi email dan password.');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      await login(email, password);
      router.replace('/(main)' as any);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Gagal login, periksa koneksi atau kredensial Anda.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Title */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-3xl bg-blue-600 items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <Text className="text-3xl">👑</Text>
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Notein
            </Text>
            <Text className="text-sm text-slate-500 mt-1">
              Catat idemu, kelola aktivitasmu dengan mudah.
            </Text>
          </View>

          {/* Error Alert */}
          {errorMessage ? (
            <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
              <Text className="text-xs text-red-600 font-medium text-center">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="space-y-4">
            {/* Email */}
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 mb-3">
              <Mail size={20} color="#64748B" />
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                className="flex-1 ml-3 text-slate-800 text-base"
              />
            </View>

            {/* Password */}
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 mb-5">
              <Lock size={20} color="#64748B" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="flex-1 ml-3 text-slate-800 text-base"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                {showPassword ? (
                  <EyeOff size={20} color="#94A3B8" />
                ) : (
                  <Eye size={20} color="#94A3B8" />
                )}
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
              className="flex-row items-center justify-center p-4 rounded-2xl bg-blue-600 shadow-md shadow-blue-500/20"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <LogIn size={20} color="#FFFFFF" className="mr-2" />
                  <Text className="text-white font-bold text-base ml-2">
                    Masuk
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Link to Register */}
          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-slate-500 text-sm">Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
              <Text className="text-blue-600 font-bold text-sm">Daftar sekarang</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
