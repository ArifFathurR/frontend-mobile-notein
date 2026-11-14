import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Category } from '@/types/api';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: number | 'All';
  onSelectCategory: (id: number | 'All') => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <View className="py-2.5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {/* All Pill */}
        <TouchableOpacity
          onPress={() => onSelectCategory('All')}
          activeOpacity={0.8}
          className={`px-5 py-2 rounded-full border ${
            selectedCategoryId === 'All'
              ? 'bg-[#2563EB] border-blue-600'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <Text
            className={`text-sm font-bold ${
              selectedCategoryId === 'All' ? 'text-white' : 'text-slate-600'
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Dynamic Categories from Backend */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.8}
              className={`px-5 py-2 rounded-full border ${
                isSelected
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-blue-50/80 border-blue-100'
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  isSelected ? 'text-white' : 'text-blue-700'
                }`}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

