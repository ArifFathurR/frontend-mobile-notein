import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  ArrowUpDown,
  MoreVertical,
  Pencil,
  FileEdit,
} from 'lucide-react-native';

import { ApiNote, Category } from '@/types/api';
import { NoteList } from '@/components/note/NoteList';
import { CategoryPills } from '@/components/note/CategoryPills';
import { CreateNoteModal } from '@/components/note/CreateNoteModal';
import { TXTnotes } from '@/components/note/TXTnotes';
import { CategoryManageModal } from '@/components/note/CategoryManageModal';
import { notesApi } from '@/api/notes.api';
import { categoryApi } from '@/api/category.api';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'All'>('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ApiNote | null>(null);

  // Fetch Notes & Categories dari backend
  const fetchData = useCallback(async () => {
    try {
      const [notesRes, categoriesRes] = await Promise.all([
        notesApi.getNotes().catch(() => ({ data: [] })),
        categoryApi.getCategories().catch(() => ({ data: [] })),
      ]);

      if (notesRes?.data) setNotes(notesRes.data);
      if (categoriesRes?.data) setCategories(categoriesRes.data);
    } catch (err) {
      console.warn('Gagal memuat data dari backend:', err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleSelectOption = (type: 'txt' | 'checklist', selectedDate?: Date) => {
    setIsCreateModalOpen(false);
    if (type === 'txt') {
      setEditingNote(null);
      setIsEditorOpen(true);
    } else {
      // Buat note checklist baru
      notesApi
        .createNote({
          title: 'New Checklist',
          description: '[]',
          id_categories: selectedCategoryId === 'All' ? undefined : selectedCategoryId,
        })
        .then(() => fetchData())
        .catch((e) => console.warn('Gagal buat checklist:', e));
    }
  };

  const handleSaveTXTNote = async (data: {
    title: string;
    description: string;
    id_categories?: number | null;
    create_at?: string;
  }) => {
    try {
      if (editingNote) {
        await notesApi.updateNote(editingNote.id, {
          title: data.title,
          description: data.description,
          id_categories: data.id_categories,
        });
      } else {
        await notesApi.createNote({
          title: data.title,
          description: data.description,
          id_categories: data.id_categories,
        });
      }
      await fetchData();
    } catch (err) {
      console.warn('Gagal menyimpan note ke server:', err);
    }
  };

  // Filter notes berdasarkan kategori terpilih
  const filteredNotes = notes.filter((n) => {
    if (selectedCategoryId === 'All') return true;
    return n.id_categories === selectedCategoryId;
  });

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F8FAFC]">
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-5 py-3">
        {/* App Title + Crown */}
        <View className="flex-row items-center gap-1.5">
          <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notein
          </Text>
          <Text className="text-xl">👑</Text>
        </View>

        {/* Action Icons */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity activeOpacity={0.7} className="p-1">
            <Search size={23} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} className="p-1">
            <ArrowUpDown size={23} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} className="p-1">
            <MoreVertical size={23} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills Bar */}
      <View className="flex-row items-center pr-3">
        <View className="flex-1">
          <CategoryPills
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsCategoryModalOpen(true)}
          className="p-2 ml-1"
        >
          <FileEdit size={22} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <View className="flex-1 mt-2">
        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <NoteList
            notes={filteredNotes}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onSelectNote={(note) => {
              setEditingNote(note);
              setIsEditorOpen(true);
            }}
          />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsCreateModalOpen(true)}
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-[#2563EB] items-center justify-center shadow-lg shadow-blue-500/40"
      >
        <Pencil size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Create Note Modal (Bottom Sheet TXT & Checklist) */}
      <CreateNoteModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSelectOption={handleSelectOption}
      />

      {/* Category Manage Modal */}
      <CategoryManageModal
        visible={isCategoryModalOpen}
        categories={categories}
        onClose={() => setIsCategoryModalOpen(false)}
        onRefresh={fetchData}
      />

      {/* TXTnotes Screen Modal */}
      <Modal
        visible={isEditorOpen}
        animationType="slide"
        onRequestClose={() => setIsEditorOpen(false)}
      >
        <TXTnotes
          initialNote={editingNote}
          categories={categories}
          onBack={() => setIsEditorOpen(false)}
          onSave={handleSaveTXTNote}
        />
      </Modal>
    </SafeAreaView>
  );
}

