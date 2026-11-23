/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead Frontend & Performance Specialist: Naila (Anggota 2)
 *
 * StatsOverview Component
 * Menampilkan ringkasan jumlah laporan real-time berdasarkan status siklus hidup.
 * Dioptimasi dengan React.memo dan mendukung interaktivitas filter status.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { ReportStats, ReportStatus } from '../types/report';

interface StatsOverviewProps {
  stats: ReportStats;
  activeStatus?: ReportStatus | 'all';
  onSelectStatus?: (status: ReportStatus | 'all') => void;
}

interface StatItemConfig {
  key: ReportStatus | 'all';
  label: string;
  count: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const StatsOverviewComponent: React.FC<StatsOverviewProps> = ({
  stats,
  activeStatus = 'all',
  onSelectStatus,
}) => {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  const statItems: StatItemConfig[] = [
    {
      key: 'all',
      label: 'Total',
      count: stats.total,
      icon: '📊',
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
    },
    {
      key: 'pending',
      label: 'Menunggu',
      count: stats.pending,
      icon: '⏳',
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
    },
    {
      key: 'in_progress',
      label: 'Diproses',
      count: stats.inProgress,
      icon: '⚙️',
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
    },
    {
      key: 'resolved',
      label: 'Selesai',
      count: stats.resolved,
      icon: '✅',
      color: '#16A34A',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Ringkasan Status Laporan</Text>
        <Text style={styles.hintText}>Ketuk kartu untuk filter</Text>
      </View>

      <View style={styles.grid}>
        {statItems.map((item) => {
          const isSelected = activeStatus === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.7}
              onPress={() => onSelectStatus && onSelectStatus(item.key)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Filter status ${item.label}, ${item.count} laporan`}
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.card,
                { backgroundColor: item.bgColor, borderColor: item.borderColor },
                isSelected && styles.cardSelected,
                isCompact && styles.cardCompact,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
                {isSelected && (
                  <View style={[styles.activeIndicator, { backgroundColor: item.color }]}>
                    <Text style={styles.activeIndicatorText}>Aktif</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.countText, { color: item.color }]}>
                {item.count}
              </Text>
              <Text style={styles.labelText} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const StatsOverview = React.memo(StatsOverviewComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  hintText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cardCompact: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cardSelected: {
    borderColor: '#0284C7',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 2,
  },
  cardIcon: {
    fontSize: 14,
  },
  activeIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  activeIndicatorText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  countText: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 2,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
});
