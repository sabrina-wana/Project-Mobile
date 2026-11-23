/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead Frontend & Performance Specialist: Naila (Anggota 2)
 *
 * FilterBar Component
 * Bilah pencarian teks dan filter kategori responsif yang terhubung
 * secara langsung ke Custom Hook useReports().
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ReportCategory, ReportStatus } from '../types/report';

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  activeCategory: ReportCategory | 'all';
  onSelectCategory: (category: ReportCategory | 'all') => void;
  categoryCounts?: Record<ReportCategory | 'all', number>;
  activeStatus: ReportStatus | 'all';
  onSelectStatus: (status: ReportStatus | 'all') => void;
  onResetFilters: () => void;
  isFilterActive: boolean;
}

interface CategoryFilterOption {
  key: ReportCategory | 'all';
  label: string;
  icon: string;
}

const CATEGORY_OPTIONS: CategoryFilterOption[] = [
  { key: 'all', label: 'Semua Kategori', icon: '🌐' },
  { key: 'road_damage', label: 'Jalan Rusak', icon: '🚧' },
  { key: 'flood', label: 'Banjir', icon: '🌊' },
  { key: 'landslide', label: 'Longsor', icon: '⚠️' },
  { key: 'public_facility', label: 'Fasilitas Umum', icon: '💡' },
];

const FilterBarComponent: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  activeStatus,
  onSelectStatus,
  onResetFilters,
  isFilterActive,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. Search Bar Input */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari laporan, lokasi, atau kata kunci..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={onSearchChange}
          accessible={true}
          accessibilityLabel="Kolom pencarian laporan"
          accessibilityHint="Ketik untuk memfilter judul, deskripsi, atau alamat laporan warga"
          returnKeyType="search"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Hapus pencarian"
            style={styles.clearSearchButton}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Horizontal Category Chips */}
      <View style={styles.chipsSection}>
        <View style={styles.chipsHeader}>
          <Text style={styles.chipsSectionLabel}>Filter Kategori Bencana & Fasilitas</Text>
          {isFilterActive && (
            <TouchableOpacity
              onPress={onResetFilters}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Reset seluruh filter"
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>↺ Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScrollContent}
        >
          {CATEGORY_OPTIONS.map((item) => {
            const isSelected = activeCategory === item.key;
            const count = categoryCounts ? categoryCounts[item.key] : undefined;

            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => onSelectCategory(item.key)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Kategori ${item.label}, ${count !== undefined ? count + ' laporan' : ''}`}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
              >
                <Text style={styles.categoryChipIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
                {count !== undefined && (
                  <View
                    style={[
                      styles.categoryCountBadge,
                      isSelected && styles.categoryCountBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryCountText,
                        isSelected && styles.categoryCountTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export const FilterBar = React.memo(FilterBarComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  clearSearchText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
  },
  chipsSection: {
    marginTop: 10,
  },
  chipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chipsSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  resetButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  resetButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  chipsScrollContent: {
    paddingVertical: 2,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryChipIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryCountBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    marginLeft: 6,
  },
  categoryCountBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryCountTextActive: {
    color: '#FFFFFF',
  },
});
