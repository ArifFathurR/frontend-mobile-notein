import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Calendar, Clock, CheckSquare } from 'lucide-react-native';
import { ApiNote } from '@/types/api';
import { getImageUrl } from '@/constants/api';

interface NoteItemProps {
  note: ApiNote;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onPress,
  onLongPress,
  isSelected = false,
}) => {
  // Ambil tanggal YYYY-MM-DD dari create_at
  const dateStr = note.create_at ? note.create_at.split('T')[0] : '';

  const hasTasks = note.tasks && note.tasks.length > 0;
  const backgroundUri = getImageUrl(note.background_path);
  const hasBackground = !!backgroundUri;

  const cardContent = (
    <View className="flex-1 p-4">
      {/* Title */}
      <Text
        className={`text-lg font-bold ${
          hasBackground ? 'text-white' : 'text-slate-800'
        } ${note.status ? 'line-through opacity-70' : ''}`}
      >
        {note.title}
      </Text>

      {/* Category badge jika ada */}
      {note.category ? (
        <View
          className={`self-start px-2 py-0.5 rounded-md mt-1 mb-1 ${
            hasBackground ? 'bg-white/30' : 'bg-blue-100/60'
          }`}
        >
          <Text
            className={`text-[11px] font-semibold ${
              hasBackground ? 'text-white' : 'text-blue-700'
            }`}
          >
            {note.category.name}
          </Text>
        </View>
      ) : null}

      {/* Content Preview Checklist */}
      {hasTasks && (
        <View className="mt-1.5 space-y-1">
          {note.tasks!.map((task) => (
            <View key={task.id} className="flex-row items-center gap-1.5">
              <CheckSquare size={13} color={hasBackground ? '#fff' : '#94A3B8'} />
              <Text
                className={`text-xs ${
                  task.is_completed
                    ? 'line-through opacity-60'
                    : hasBackground
                    ? 'text-white'
                    : 'text-slate-500'
                }`}
              >
                {task.title || task.text}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Content Preview TXT (description) */}
      {!hasTasks && note.description ? (
        <Text
          numberOfLines={2}
          className={`mt-1 text-sm ${hasBackground ? 'text-white/90' : 'text-slate-500'}`}
        >
          {note.description}
        </Text>
      ) : null}

      {/* Meta info (Calendar, Date YYYY-MM-DD) */}
      <View className="flex-row items-center gap-2 mt-3 pt-1">
        <Calendar size={14} color={hasBackground ? '#fff' : '#64748B'} />
        {hasTasks && <Clock size={14} color={hasBackground ? '#fff' : '#64748B'} />}
        <Text
          className={`text-xs font-medium ${
            hasBackground ? 'text-white/80' : 'text-slate-500'
          }`}
        >
          {dateStr}
        </Text>
      </View>
    </View>
  );

  if (hasBackground) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        onLongPress={onLongPress}
        className={`overflow-hidden rounded-2xl mb-3 shadow-sm ${
          isSelected ? 'border-2 border-blue-600 scale-[0.98]' : ''
        }`}
      >
        <ImageBackground
          source={{ uri: backgroundUri! }}
          className="flex-row overflow-hidden rounded-2xl"
          imageStyle={{ borderRadius: 16 }}
          resizeMode="cover"
        >
          {/* Dark overlay agar teks tetap terbaca */}
          <View className="absolute inset-0 bg-black/40 rounded-2xl" />
          {/* Blue left indicator stripe */}
          <View className="w-2.5 bg-[#2563EB]/80" />
          {cardContent}
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      className={`flex-row overflow-hidden rounded-2xl bg-[#EEF4FF] mb-3 shadow-sm border ${
        isSelected ? 'border-2 border-blue-600 scale-[0.98]' : 'border-blue-50/50'
      }`}
    >
      {/* Blue left indicator stripe */}
      <View className="w-2.5 bg-[#2563EB]" />
      {cardContent}
    </TouchableOpacity>
  );
};

