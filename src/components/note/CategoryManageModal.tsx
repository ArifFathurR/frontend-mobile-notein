import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react-native';
import { Category } from '@/types/api';
import { categoryApi } from '@/api/category.api';

interface CategoryManageModalProps {
  visible: boolean;
  categories: Category[];
  onClose: () => void;
  onRefresh: () => void;
}

export const CategoryManageModal: React.FC<CategoryManageModalProps> = ({
  visible,
  categories,
  onClose,
  onRefresh,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreate = async () => {
    if (!categoryName.trim()) {
      setErrorMsg('Nama kategori tidak boleh kosong');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      await categoryApi.createCategory(categoryName.trim());
      setCategoryName('');
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menambahkan kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await categoryApi.deleteCategory(id);
      onRefresh();
    } catch (err: any) {
      console.warn('Gagal menghapus kategori:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-3xl p-6 w-full max-w-[380px] shadow-2xl">
              {/* Header */}
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
                <View className="flex-row items-center gap-2">
                  <FolderPlus size={20} color="#2563EB" />
                  <Text className="text-lg font-bold text-slate-800">
                    Kelola Kategori
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="p-1 rounded-full bg-slate-100"
                >
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Error Message */}
              {errorMsg ? (
                <Text className="text-xs text-red-500 mt-2">{errorMsg}</Text>
              ) : null}

              {/* Input Buat Kategori Baru */}
              <View className="flex-row items-center gap-2 mt-4 mb-4">
                <TextInput
                  placeholder="Nama kategori baru..."
                  placeholderTextColor="#94A3B8"
                  value={categoryName}
                  onChangeText={setCategoryName}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800"
                />
                <TouchableOpacity
                  onPress={handleCreate}
                  disabled={loading}
                  className="p-3 bg-blue-600 rounded-2xl items-center justify-center active:opacity-80"
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Plus size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Daftar Kategori */}
              <Text className="text-xs font-semibold text-slate-400 mb-2">
                Daftar Kategori Anda ({categories.length})
              </Text>
              <View className="max-h-52">
                <FlatList
                  data={categories}
                  keyExtractor={(item) => String(item.id)}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between p-3 bg-slate-50 rounded-2xl mb-2 border border-slate-100">
                      <Text className="text-sm font-semibold text-slate-700">
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 rounded-lg active:opacity-70"
                      >
                        {deletingId === item.id ? (
                          <ActivityIndicator size="small" color="#EF4444" />
                        ) : (
                          <Trash2 size={16} color="#EF4444" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text className="text-xs text-slate-400 text-center py-4">
                      Belum ada kategori kustom
                    </Text>
                  }
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
