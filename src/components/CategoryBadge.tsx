/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * CategoryBadge Component
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ReportCategory } from '../types/report';

interface CategoryBadgeProps {
  category: ReportCategory;
}

const CATEGORY_CONFIG: Record<
  ReportCategory,
  { label: string; bg: string; text: string; icon: string }
> = {
  road_damage: {
    label: 'Kerusakan Jalan',
    bg: '#FEF3C7',
    text: '#92400E',
    icon: '🚧',
  },
  flood: {
    label: 'Banjir',
    bg: '#DBEAFE',
    text: '#1E40AF',
    icon: '🌊',
  },
  landslide: {
    label: 'Longsor',
    bg: '#FEE2E2',
    text: '#991B1B',
    icon: '⚠️',
  },
  public_facility: {
    label: 'Fasilitas Umum',
    bg: '#E0E7FF',
    text: '#3730A3',
    icon: '💡',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const config = CATEGORY_CONFIG[category] || {
    label: category,
    bg: '#F3F4F6',
    text: '#374151',
    icon: '📌',
  };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
