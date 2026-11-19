import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { ApiNote } from '@/types/api';
import { NoteItem } from './NoteItem';

interface NoteListProps {
  notes: ApiNote[];
  onSelectNote?: (note: ApiNote) => void;
  onLongPressNote?: (note: ApiNote) => void;
  selectedNoteId?: number | null;
  sectionTitle?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  onSelectNote,
  onLongPressNote,
  selectedNoteId,
  sectionTitle,
  refreshing = false,
  onRefresh,
}) => {
  return (
    <View className="flex-1 px-4">
      {sectionTitle ? (
        <Text className="text-base font-semibold text-slate-500 mb-3">
          {sectionTitle}
        </Text>
      ) : null}

      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            isSelected={selectedNoteId === item.id}
            onPress={() => onSelectNote?.(item)}
            onLongPress={() => onLongPressNote?.(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        ListEmptyComponent={
          <View className="py-16 items-center justify-center">
            <Text className="text-slate-400 text-sm">Belum ada catatan.</Text>
          </View>
        }
      />
    </View>
  );
};

