import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Pin,
  Share2,
  MoreVertical,
  Calendar as CalendarIcon,
  ChevronDown,
  Image as ImageIcon,
  Type,
  Palette,
  Undo2,
  Redo2,
  Check,
  X,
  Trash2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ApiNote, Category } from '@/types/api';
import { getImageUrl } from '@/constants/api';
import { DatePickerModal } from '../calendar/DatePickerModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { notesApi } from '@/api/notes.api';

interface TXTnotesProps {
  initialNote?: ApiNote | null;
  categories: Category[];
  defaultDate?: Date;
  onBack: () => void;
  onDelete?: (id: number) => Promise<void> | void;
  onSave?: (note: {
    title: string;
    description: string;
    id_categories?: number | null;
    create_at?: string;
    background_path?: { uri: string; name: string; type: string } | null;
  }) => Promise<void> | void;
}

export const TXTnotes: React.FC<TXTnotesProps> = ({
  initialNote,
  categories,
  defaultDate,
  onBack,
  onDelete,
  onSave,
}) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [description, setDescription] = useState(initialNote?.description || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    initialNote?.id_categories || (categories[0]?.id ?? null)
  );
  const [noteDate, setNoteDate] = useState<Date>(
    initialNote?.create_at
      ? new Date(initialNote.create_at)
      : defaultDate || new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // State untuk menu More & Delete
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State untuk background image — bisa berupa URI lokal (baru) atau URL server (lama)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    getImageUrl(initialNote?.background_path) || null
  );
  // File object siap dikirim ke API (hanya ada jika user memilih gambar baru)
  const [imageFile, setImageFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Izin akses galeri diperlukan untuk memilih gambar latar belakang.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;
        const filename = asset.fileName || uri.split('/').pop() || `image_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const mimeType = asset.mimeType || (match ? `image/${match[1]}` : 'image/jpeg');

        setBackgroundImage(uri);
        setImageFile({ uri, name: filename, type: mimeType });
      }
    } catch (e) {
      console.warn('Gagal memilih gambar dari galeri:', e);
    }
  };

  const removeBackground = () => {
    setBackgroundImage(null);
    setImageFile(null);
  };

  const selectedCategoryName =
    categories.find((c) => c.id === selectedCategoryId)?.name || 'Kategori';

  // Format YYYY-MM-DD
  const formatYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleConfirmDelete = async () => {
    if (!initialNote?.id) return;
    setIsDeleting(true);
    try {
      await notesApi.deleteNote(initialNote.id);
      setShowDeleteModal(false);
      await onDelete?.(initialNote.id);
      onBack();
    } catch (err) {
      console.warn('Gagal menghapus note dari server:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.({
        title: title.trim() || 'Untitled',
        description,
        id_categories: selectedCategoryId,
        create_at: formatYMD(noteDate),
        background_path: imageFile ?? undefined,
      });
      onBack();
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = formatYMD(noteDate);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-[#F5F8FF]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Top Navigation Bar */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="p-1 rounded-full"
          >
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>

          <View className="flex-row items-center gap-4">
            {/* AI Action Icon */}
            <TouchableOpacity activeOpacity={0.7} className="p-1 border border-slate-700 rounded-md px-1.5 py-0.5">
              <Text className="text-xs font-bold text-slate-700 tracking-tighter">
                AI
              </Text>
            </TouchableOpacity>

            {/* Pin */}
            <TouchableOpacity activeOpacity={0.7} className="p-1">
              <Pin size={22} color="#1E293B" />
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity activeOpacity={0.7} className="p-1">
              <Share2 size={22} color="#1E293B" />
            </TouchableOpacity>

            {/* More */}
            <View className="relative z-50">
              <TouchableOpacity
                onPress={() => setShowMoreMenu(!showMoreMenu)}
                activeOpacity={0.7}
                className="p-1"
              >
                <MoreVertical size={22} color="#1E293B" />
              </TouchableOpacity>

              {/* More Dropdown Menu */}
              {showMoreMenu && (
                <View className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50">
                  {initialNote?.id ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setShowMoreMenu(false);
                        setShowDeleteModal(true);
                      }}
                      className="flex-row items-center gap-2.5 px-4 py-3"
                    >
                      <Trash2 size={18} color="#EF4444" />
                      <Text className="text-sm font-semibold text-red-600">
                        Hapus Catatan
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="px-4 py-2.5">
                      <Text className="text-xs text-slate-400">
                        Belum tersimpan
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Backdrop for closing more menu when clicking outside */}
        {showMoreMenu && (
          <TouchableOpacity
            activeOpacity={1}
            className="absolute inset-0 z-40"
            onPress={() => setShowMoreMenu(false)}
          />
        )}

        {/* Sub Header: Date edited & Category */}
        <View className="flex-row items-center justify-between px-5 py-2">
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
            className="flex-row items-center gap-1.5"
          >
            <CalendarIcon size={14} color="#2563EB" />
            <Text className="text-xs text-blue-600 font-semibold">
              {formattedDate}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            activeOpacity={0.7}
            className="flex-row items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200"
          >
            <View className="w-2 h-2 rounded-full bg-blue-600" />
            <Text className="text-xs font-medium text-slate-700">
              {selectedCategoryName}
            </Text>
            <ChevronDown size={14} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Category Picker Dropdown Mini */}
        {showCategoryPicker && categories.length > 0 && (
          <View className="mx-5 p-2 bg-white rounded-2xl border border-slate-200 shadow-lg z-10 flex-row flex-wrap gap-2">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setSelectedCategoryId(cat.id);
                  setShowCategoryPicker(false);
                }}
                className={`px-3 py-1 rounded-full border ${
                  selectedCategoryId === cat.id
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs ${
                    selectedCategoryId === cat.id ? 'text-white font-bold' : 'text-slate-700'
                  }`}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Content Area */}
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          {/* Background Image Preview */}
          {backgroundImage ? (
            <View className="mx-5 mt-3 rounded-2xl overflow-hidden relative">
              <Image
                source={{ uri: backgroundImage }}
                className="w-full h-44 rounded-2xl"
                resizeMode="cover"
              />
              {/* Tombol hapus background */}
              <TouchableOpacity
                onPress={removeBackground}
                activeOpacity={0.7}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : null}

          <View className="px-5 pt-3">
            {/* Title row */}
            <View className="flex-row items-center justify-between pb-2 border-b border-slate-200/80">
              <TextInput
                placeholder="Title"
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={setTitle}
                className="text-2xl font-bold text-slate-800 flex-1 py-1"
              />
              {/* Calendar icon di kanan Title untuk edit created_at */}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
                className="p-1.5 ml-2 bg-blue-50 rounded-xl border border-blue-100"
              >
                <CalendarIcon size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {/* Body content */}
            <TextInput
              placeholder="Please enter content here..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              className="text-base text-slate-700 mt-4 leading-relaxed min-h-[300px]"
            />
          </View>
        </ScrollView>

        {/* Bottom Formatting Toolbar */}
        <View className="flex-row items-center justify-between px-6 py-3 border-t border-slate-200 bg-white">
          <View className="flex-row items-center gap-6">
            {/* Image picker button */}
            <TouchableOpacity className="p-1" onPress={pickImage} activeOpacity={0.7}>
              <ImageIcon
                size={22}
                color={backgroundImage ? '#2563EB' : '#1E293B'}
              />
            </TouchableOpacity>

            <TouchableOpacity className="p-1">
              <Type size={22} color="#1E293B" />
            </TouchableOpacity>

            <TouchableOpacity className="p-1">
              <Palette size={22} color="#1E293B" />
            </TouchableOpacity>

            <TouchableOpacity className="p-1">
              <Undo2 size={22} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity className="p-1">
              <Redo2 size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Done / Checkmark button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.7}
            className="p-1 rounded-full"
          >
            {saving ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Check size={24} color="#1E293B" strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        initialDate={noteDate}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={setNoteDate}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        visible={showDeleteModal}
        loading={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
};


