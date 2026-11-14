import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Plus,
  X,
  FileText,
} from 'lucide-react-native';

import { ApiNote, Category } from '@/types/api';
import { notesApi } from '@/api/notes.api';
import { categoryApi } from '@/api/category.api';
import { CreateNoteModal } from '@/components/note/CreateNoteModal';
import { TXTnotes } from '@/components/note/TXTnotes';

const DAYS_HEADER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 1)); // November 2026 default atau bulan aktif
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ApiNote | null>(null);
  // Day notes modal (shown when a date has >2 notes)
  const [dayNotesModal, setDayNotesModal] = useState<{
    day: number;
    notes: ApiNote[];
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load notes & categories
  const fetchData = useCallback(async () => {
    try {
      const [notesRes, catRes] = await Promise.all([
        notesApi.getNotes().catch(() => ({ data: [] })),
        categoryApi.getCategories().catch(() => ({ data: [] })),
      ]);
      if (notesRes?.data) setNotes(notesRes.data);
      if (catRes?.data) setCategories(catRes.data);
    } catch (e) {
      console.warn('Gagal memuat catatan kalender:', e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  // Map notes by day of month (YYYY-MM-DD)
  const notesByDay = useMemo(() => {
    const map: { [day: number]: ApiNote[] } = {};

    notes.forEach((note) => {
      // Ambil tanggal dari create_at (format YYYY-MM-DD atau ISO string)
      const dateString = note.create_at || note.background_path;
      if (!dateString) return;

      const d = new Date(dateString);
      if (isNaN(d.getTime())) return;

      if (d.getFullYear() === year && d.getMonth() === month) {
        const dayNum = d.getDate();
        if (!map[dayNum]) map[dayNum] = [];
        map[dayNum].push(note);
      }
    });

    return map;
  }, [notes, year, month]);

  // Build grid weeks
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarGrid = useMemo(() => {
    const cells: {
      day: number;
      isCurrentMonth: boolean;
      notes: ApiNote[];
    }[] = [];

    // Hari dari bulan sebelumnya
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        notes: [],
      });
    }

    // Hari dari bulan saat ini
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        day: d,
        isCurrentMonth: true,
        notes: notesByDay[d] || [],
      });
    }

    // Hari dari bulan berikutnya untuk melengkapi baris terakhir (kelipatan 7)
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let next = 1; next <= remaining; next++) {
        cells.push({
          day: next,
          isCurrentMonth: false,
          notes: [],
        });
      }
    }

    // Pecah menjadi minggu-minggu
    const weeks: typeof cells[] = [];
    for (let w = 0; w < cells.length; w += 7) {
      weeks.push(cells.slice(w, w + 7));
    }

    return weeks;
  }, [firstDayOfWeek, daysInCurrentMonth, daysInPrevMonth, notesByDay]);

  const handleCreateOption = (type: 'txt' | 'checklist', selectedDate?: Date) => {
    setIsCreateModalOpen(false);
    const targetDate =
      selectedDate || new Date(year, month, selectedDay, 12, 0, 0);

    const formatYMD = (d: Date) => {
      const yr = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      return `${yr}-${mo}-${da}`;
    };

    if (type === 'txt') {
      setEditingNote(null);
      setIsEditorOpen(true);
    } else {
      notesApi
        .createNote({
          title: 'New Checklist',
          description: '[]',
          background_path: formatYMD(targetDate),
        })
        .then(() => fetchData());
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
    } catch (e) {
      console.warn('Gagal simpan note di kalender:', e);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header Top Controls */}
      <View className="flex-row items-center justify-between px-5 py-3">
        {/* Navigasi Bulan */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={prevMonth} className="p-1 active:opacity-60">
            <ChevronLeft size={22} color="#2563EB" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-slate-900">
            {MONTH_NAMES[month]} {year}
          </Text>

          <TouchableOpacity onPress={nextMonth} className="p-1 active:opacity-60">
            <ChevronRight size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* View Mode & Today Action */}
        <View className="flex-row items-center gap-3">
          {/* Ikon hari ini [14] */}
          <TouchableOpacity
            onPress={goToToday}
            className="flex-row items-center border border-blue-600 rounded-lg px-1.5 py-0.5 active:opacity-70"
          >
            <CalendarIcon size={14} color="#2563EB" />
            <Text className="text-[11px] font-bold text-blue-600 ml-1">
              {new Date().getDate()}
            </Text>
          </TouchableOpacity>

          {/* Month selector dropdown */}
          <TouchableOpacity className="flex-row items-center gap-1 active:opacity-70">
            <Text className="text-base font-bold text-slate-800">Month</Text>
            <ChevronDown size={18} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Days of Week Header */}
      <View className="flex-row px-2 py-2 border-b border-slate-100">
        {DAYS_HEADER.map((d, index) => {
          const isSaturday = index === 6;
          return (
            <View key={d} className="flex-1 items-center">
              <Text
                className={`text-xs font-semibold ${
                  isSaturday ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                {d}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Calendar Grid */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <View className="px-2">
            {calendarGrid.map((week, wIndex) => (
              <View
                key={`week-${wIndex}`}
                className="flex-row border-b border-slate-100 min-h-[96px] py-1"
              >
                {week.map((cell, cIndex) => {
                  const isCurrentDay =
                    cell.isCurrentMonth && cell.day === selectedDay;

                  return (
                    <TouchableOpacity
                      key={`cell-${wIndex}-${cIndex}`}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (cell.isCurrentMonth) {
                          setSelectedDay(cell.day);
                          if (cell.notes.length > 2) {
                            setDayNotesModal({ day: cell.day, notes: cell.notes });
                          }
                        }
                      }}
                      className="flex-1 items-center pt-1 px-0.5"
                    >
                      {/* Day Number */}
                      <View
                        className={`w-7 h-7 rounded-full items-center justify-center ${
                          isCurrentDay
                            ? 'bg-[#2563EB] shadow-sm'
                            : ''
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            !cell.isCurrentMonth
                              ? 'text-slate-300'
                              : isCurrentDay
                              ? 'text-white font-bold'
                              : 'text-slate-800'
                          }`}
                        >
                          {cell.day}
                        </Text>
                      </View>

                      {/* Notes Badge Pills — max 2 shown */}
                      {cell.isCurrentMonth && cell.notes.length > 0 && (
                        <View className="w-full mt-1 gap-1">
                          {cell.notes.slice(0, 2).map((n) => (
                            <TouchableOpacity
                              key={n.id}
                              onPress={() => {
                                setEditingNote(n);
                                setIsEditorOpen(true);
                              }}
                              className="bg-[#60A5FA] rounded-md px-1 py-0.5 w-full active:opacity-80 shadow-xs"
                            >
                              <Text
                                numberOfLines={1}
                                className="text-[10px] font-bold text-white text-center leading-tight"
                              >
                                {n.title}
                              </Text>
                            </TouchableOpacity>
                          ))}
                          {/* "+N more" badge jika notes > 2 */}
                          {cell.notes.length > 2 && (
                            <TouchableOpacity
                              onPress={() =>
                                setDayNotesModal({ day: cell.day, notes: cell.notes })
                              }
                              className="bg-slate-200 rounded-md px-1 py-0.5 w-full active:opacity-70"
                            >
                              <Text className="text-[9px] font-semibold text-slate-600 text-center leading-tight">
                                +{cell.notes.length - 2} more
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (+) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsCreateModalOpen(true)}
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-[#2563EB] items-center justify-center shadow-lg shadow-blue-500/40"
      >
        <Plus size={30} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Create Note Modal with Calendar Date Selector */}
      <CreateNoteModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSelectOption={handleCreateOption}
      />

      {/* TXTnotes Editor Modal */}
      <Modal
        visible={isEditorOpen}
        animationType="slide"
        onRequestClose={() => setIsEditorOpen(false)}
      >
        <TXTnotes
          initialNote={editingNote}
          categories={categories}
          defaultDate={new Date(year, month, selectedDay)}
          onBack={() => setIsEditorOpen(false)}
          onSave={handleSaveTXTNote}
        />
      </Modal>

      {/* Day Notes Modal — tampil saat tanggal punya >2 notes */}
      <Modal
        visible={dayNotesModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDayNotesModal(null)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setDayNotesModal(null)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl pt-5 pb-8 max-h-[70%]"
          >
            {/* Handle bar */}
            <View className="w-10 h-1 rounded-full bg-slate-200 self-center mb-4" />

            {/* Header Modal */}
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-lg font-bold text-slate-900">
                {dayNotesModal
                  ? `${dayNotesModal.day} ${MONTH_NAMES[month]} ${year}`
                  : ''}
              </Text>
              <TouchableOpacity
                onPress={() => setDayNotesModal(null)}
                className="p-1.5 rounded-full bg-slate-100 active:bg-slate-200"
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* List Notes */}
            <FlatList
              data={dayNotesModal?.notes ?? []}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    setDayNotesModal(null);
                    setEditingNote(item);
                    setIsEditorOpen(true);
                  }}
                  className="flex-row items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 active:bg-blue-50"
                >
                  <View className="w-9 h-9 rounded-xl bg-blue-100 items-center justify-center">
                    <FileText size={18} color="#2563EB" />
                  </View>
                  <View className="flex-1">
                    <Text
                      numberOfLines={1}
                      className="text-sm font-semibold text-slate-900"
                    >
                      {item.title || 'Tanpa Judul'}
                    </Text>
                    {item.description ? (
                      <Text
                        numberOfLines={1}
                        className="text-xs text-slate-400 mt-0.5"
                      >
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
