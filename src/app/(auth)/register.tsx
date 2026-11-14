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
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Semua field wajib diisi.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password minimal 8 karakter.');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      await register(name, email, password);
      router.replace('/(main)' as any);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Gagal mendaftar, coba gunakan email lain.';
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
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-3xl bg-blue-600 items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <Text className="text-3xl">📝</Text>
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Buat Akun
            </Text>
            <Text className="text-sm text-slate-500 mt-1">
              Daftar akun Notein baru untuk sinkronisasi catatanmu.
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
            {/* Name */}
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 mb-3">
              <User size={20} color="#64748B" />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                className="flex-1 ml-3 text-slate-800 text-base"
              />
            </View>

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
                placeholder="Password (min. 8 karakter)"
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
              onPress={handleRegister}
              disabled={loading}
              className="flex-row items-center justify-center p-4 rounded-2xl bg-blue-600 shadow-md shadow-blue-500/20"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <UserPlus size={20} color="#FFFFFF" />
                  <Text className="text-white font-bold text-base ml-2">
                    Daftar Sekarang
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Link to Login */}
          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-slate-500 text-sm">Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
              <Text className="text-blue-600 font-bold text-sm">Masuk disini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
