/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * StatusBadge Component
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ReportStatus } from '../types/report';

interface StatusBadgeProps {
  status: ReportStatus;
}

const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: 'Menunggu',
    bg: '#FEF9C3',
    text: '#854D0E',
    dot: '#CA8A04',
  },
  in_progress: {
    label: 'Diproses',
    bg: '#E0F2FE',
    text: '#075985',
    dot: '#0284C7',
  },
  resolved: {
    label: 'Selesai',
    bg: '#DCFCE7',
    text: '#166534',
    dot: '#16A34A',
  },
  rejected: {
    label: 'Ditolak',
    bg: '#F3F4F6',
    text: '#4B5563',
    dot: '#9CA3AF',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: '#F3F4F6',
    text: '#374151',
    dot: '#9CA3AF',
  };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
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
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
