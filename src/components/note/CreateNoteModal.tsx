import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { FileText, CheckSquare, X, Calendar as CalendarIcon } from 'lucide-react-native';
import { DatePickerModal } from '../calendar/DatePickerModal';

interface CreateNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (type: 'txt' | 'checklist', selectedDate?: Date) => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  visible,
  onClose,
  onSelectOption,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formattedDate = selectedDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 bg-black/40 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl p-6 pb-10 shadow-2xl">
                {/* Header handle & close */}
                <View className="items-center mb-4">
                  <View className="w-12 h-1.5 bg-slate-200 rounded-full mb-2" />
                  <View className="flex-row items-center justify-between w-full mt-2">
                    <Text className="text-xl font-bold text-slate-800">
                      Create New Note
                    </Text>
                    <TouchableOpacity
                      onPress={onClose}
                      className="p-1 rounded-full bg-slate-100"
                    >
                      <X size={20} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Tanggal Created_at Selector */}
                <View className="mb-4 flex-row items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <View className="flex-row items-center gap-2">
                    <CalendarIcon size={18} color="#2563EB" />
                    <Text className="text-xs font-medium text-slate-500">
                      Tanggal Catatan:
                    </Text>
                    <Text className="text-xs font-bold text-slate-800">
                      {formattedDate}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="px-2.5 py-1 bg-white rounded-xl border border-slate-200"
                  >
                    <Text className="text-xs font-semibold text-blue-600">
                      Ubah
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Options */}
                <View className="flex-row gap-4 mt-1">
                  {/* TXT Option */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onSelectOption('txt', selectedDate)}
                    className="flex-1 items-center justify-center p-5 rounded-2xl bg-[#EEF4FF] border border-blue-100"
                  >
                    <View className="w-14 h-14 rounded-full bg-[#2563EB] items-center justify-center mb-3 shadow-md shadow-blue-500/20">
                      <FileText size={26} color="#FFFFFF" />
                    </View>
                    <Text className="text-base font-bold text-slate-800">
                      TXT
                    </Text>
                    <Text className="text-xs text-slate-500 mt-1 text-center">
                      Plain text note
                    </Text>
                  </TouchableOpacity>

                  {/* Checklist Option */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onSelectOption('checklist', selectedDate)}
                    className="flex-1 items-center justify-center p-5 rounded-2xl bg-amber-50/70 border border-amber-100"
                  >
                    <View className="w-14 h-14 rounded-full bg-amber-500 items-center justify-center mb-3 shadow-md shadow-amber-500/20">
                      <CheckSquare size={26} color="#FFFFFF" />
                    </View>
                    <Text className="text-base font-bold text-slate-800">
                      Checklist
                    </Text>
                    <Text className="text-xs text-slate-500 mt-1 text-center">
                      To-do list
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        initialDate={selectedDate}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={setSelectedDate}
      />
    </>
  );
};
