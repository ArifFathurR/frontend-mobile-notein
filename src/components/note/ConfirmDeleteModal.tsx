import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface ConfirmDeleteModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  title = 'Hapus Catatan',
  description = 'Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.',
  loading = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center px-6"
        onPress={onCancel}
      >
        <Pressable
          className="w-full max-w-sm bg-white rounded-3xl p-6 items-center shadow-xl"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Trash Icon Circle */}
          <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
            <Trash2 size={32} color="#EF4444" strokeWidth={2.2} />
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-slate-900 text-center mb-2">
            {title}
          </Text>

          {/* Description */}
          <Text className="text-sm text-slate-500 text-center leading-relaxed mb-6">
            {description}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-3 w-full">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              disabled={loading}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 items-center justify-center"
            >
              <Text className="text-sm font-semibold text-slate-700">
                Batal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onConfirm}
              disabled={loading}
              className="flex-1 py-3.5 rounded-2xl bg-red-500 items-center justify-center shadow-md shadow-red-500/30"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-sm font-semibold text-white">
                  Hapus
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
