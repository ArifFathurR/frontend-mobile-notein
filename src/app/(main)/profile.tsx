import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  User,
  Mail,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  FolderOpen,
  FileText,
  LogIn,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login' as any);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F8FAFC]">
      {/* Header */}
      <View className="px-5 py-4 border-b border-slate-100 bg-white">
        <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Profile
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View className="mx-4 mt-5 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm flex-row items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-md shadow-blue-500/20">
            <User size={32} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-800">
              {user?.name || 'Tamu / Belum Login'}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <Mail size={13} color="#94A3B8" />
              <Text className="text-xs text-slate-500">
                {user?.email || 'Belum terhubung ke akun'}
              </Text>
            </View>
            <View className="mt-2 inline-flex self-start px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              <Text className="text-[11px] font-semibold text-blue-600">
                {user ? 'Terhubung (Sanctum)' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions / Auth check */}
        {!user ? (
          <View className="mx-4 mt-4">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login' as any)}
              className="flex-row items-center justify-center gap-2 p-4 bg-blue-600 rounded-2xl shadow-sm"
            >
              <LogIn size={18} color="#FFFFFF" />
              <Text className="text-white font-bold text-sm">Masuk / Daftar Akun</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Menu Section */}
        <View className="mx-4 mt-5 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-slate-50"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-xl bg-slate-50 items-center justify-center">
                <Settings size={18} color="#475569" />
              </View>
              <Text className="text-sm font-semibold text-slate-700">Account Settings</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-slate-50"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-xl bg-slate-50 items-center justify-center">
                <Shield size={18} color="#475569" />
              </View>
              <Text className="text-sm font-semibold text-slate-700">Security & Privacy</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-xl bg-slate-50 items-center justify-center">
                <HelpCircle size={18} color="#475569" />
              </View>
              <Text className="text-sm font-semibold text-slate-700">Help & Support</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        {user ? (
          <View className="mx-4 mt-5 mb-10">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogout}
              className="flex-row items-center justify-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl"
            >
              <LogOut size={18} color="#EF4444" />
              <Text className="text-sm font-bold text-red-600">Logout</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

