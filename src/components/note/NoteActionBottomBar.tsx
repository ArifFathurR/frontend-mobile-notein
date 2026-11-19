import React from 'react';
import { View, TouchableOpacity, Pressable, Modal } from 'react-native';
import { Archive, Trash2, FolderInput, MoreHorizontal } from 'lucide-react-native';

interface NoteActionBottomBarProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  onMove?: () => void;
  onMore?: () => void;
}

export const NoteActionBottomBar: React.FC<NoteActionBottomBarProps> = ({
  visible,
  onClose,
  onDelete,
  onArchive,
  onMove,
  onMore,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/30 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-t-3xl border-t border-slate-100 shadow-2xl px-6 pt-3 pb-8"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Subtle drag handle */}
          <View className="w-10 h-1 bg-slate-200 rounded-full self-center mb-4" />

          {/* 4 Action Icons matching user design */}
          <View className="flex-row items-center justify-around py-2">
            {/* 1. Archive / Box icon */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onArchive?.();
                onClose();
              }}
              className="p-3 rounded-2xl"
            >
              <Archive size={26} color="#2563EB" strokeWidth={2.2} />
            </TouchableOpacity>

            {/* 2. Trash / Delete icon */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onDelete();
              }}
              className="p-3 rounded-2xl"
            >
              <Trash2 size={26} color="#2563EB" strokeWidth={2.2} />
            </TouchableOpacity>

            {/* 3. Folder icon */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onMove?.();
                onClose();
              }}
              className="p-3 rounded-2xl"
            >
              <FolderInput size={26} color="#2563EB" strokeWidth={2.2} />
            </TouchableOpacity>

            {/* 4. More / 3 dots icon */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onMore?.();
                onClose();
              }}
              className="p-3 rounded-2xl"
            >
              <MoreHorizontal size={26} color="#2563EB" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
