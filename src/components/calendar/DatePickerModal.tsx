import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react-native';

interface DatePickerModalProps {
  visible: boolean;
  initialDate?: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  initialDate = new Date(),
  onClose,
  onSelectDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Generate days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleDayPress = (day: number) => {
    const newDate = new Date(year, month, day, initialDate.getHours(), initialDate.getMinutes());
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onSelectDate(selectedDate);
    onClose();
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
            <View className="bg-white rounded-3xl p-6 w-full max-w-[360px] shadow-2xl">
              {/* Header */}
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
                <Text className="text-lg font-bold text-slate-800">
                  Pilih Tanggal
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1 rounded-full bg-slate-100">
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Month Navigator */}
              <View className="flex-row items-center justify-between my-4">
                <TouchableOpacity onPress={prevMonth} className="p-2 rounded-xl bg-slate-50">
                  <ChevronLeft size={20} color="#1E293B" />
                </TouchableOpacity>

                <Text className="text-base font-bold text-slate-800">
                  {MONTH_NAMES[month]} {year}
                </Text>

                <TouchableOpacity onPress={nextMonth} className="p-2 rounded-xl bg-slate-50">
                  <ChevronRight size={20} color="#1E293B" />
                </TouchableOpacity>
              </View>

              {/* Day headers */}
              <View className="flex-row justify-between mb-2">
                {DAYS.map((d, idx) => (
                  <Text
                    key={d}
                    className={`w-10 text-center text-xs font-semibold ${
                      idx === 6 ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              {/* Day cells */}
              <View className="flex-row flex-wrap">
                {calendarDays.map((day, idx) => {
                  if (day === null) {
                    return <View key={`empty-${idx}`} className="w-[14.28%] h-10" />;
                  }

                  const isSelected =
                    selectedDate.getFullYear() === year &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getDate() === day;

                  return (
                    <TouchableOpacity
                      key={`day-${day}`}
                      onPress={() => handleDayPress(day)}
                      className="w-[14.28%] h-10 items-center justify-center my-0.5"
                    >
                      <View
                        className={`w-9 h-9 items-center justify-center rounded-full ${
                          isSelected ? 'bg-blue-600' : ''
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            isSelected ? 'text-white font-bold' : 'text-slate-700'
                          }`}
                        >
                          {day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Confirm Action Button */}
              <TouchableOpacity
                onPress={handleConfirm}
                className="mt-5 flex-row items-center justify-center p-3.5 bg-blue-600 rounded-2xl gap-2 shadow-md shadow-blue-500/20"
              >
                <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text className="text-white font-bold text-sm">Pilih Tanggal</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
