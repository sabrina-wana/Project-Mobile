/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead Frontend & Performance Specialist: Naila (Anggota 2)
 *
 * ReportCard Component
 * Komponen kartu presentasional untuk menampilkan detail laporan warga.
 * Dioptimasi dengan React.memo untuk meminimalkan re-render FlatList.
 */

import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Report, ReportStatus, ReportUrgency } from '../types/report';
import { CategoryBadge } from './CategoryBadge';
import { StatusBadge } from './StatusBadge';

export interface ReportCardProps {
  report: Report;
  isSelected?: boolean;
  onPress?: () => void;
  onStatusChange?: (id: string, nextStatus: ReportStatus) => void;
}

const URGENCY_CONFIG: Record<
  ReportUrgency,
  { label: string; bg: string; text: string; icon: string }
> = {
  critical: {
    label: 'Kritis',
    bg: '#FEF2F2',
    text: '#991B1B',
    icon: '⚡',
  },
  high: {
    label: 'Tinggi',
    bg: '#FFF7ED',
    text: '#C2410C',
    icon: '🔥',
  },
  medium: {
    label: 'Sedang',
    bg: '#FEFCE8',
    text: '#854D0E',
    icon: '⚠️',
  },
  low: {
    label: 'Rendah',
    bg: '#F8FAFC',
    text: '#475569',
    icon: '🟢',
  },
};

const ReportCardComponent: React.FC<ReportCardProps> = ({
  report,
  isSelected = false,
  onPress,
  onStatusChange,
}) => {
  // Format tanggal ter-memoize untuk efisiensi
  const formattedDate = useMemo(() => {
    try {
      return new Date(report.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return report.createdAt;
    }
  }, [report.createdAt]);

  const urgency = URGENCY_CONFIG[report.urgency || 'medium'] || URGENCY_CONFIG.medium;

  const handleNextStatus = () => {
    if (!onStatusChange) return;
    if (report.status === 'pending') {
      onStatusChange(report.id, 'in_progress');
    } else if (report.status === 'in_progress') {
      onStatusChange(report.id, 'resolved');
    } else if (report.status === 'resolved') {
      onStatusChange(report.id, 'pending');
    }
  };

  const nextStatusLabel = useMemo(() => {
    if (report.status === 'pending') return 'Proses ➜';
    if (report.status === 'in_progress') return 'Selesaikan ➜';
    return 'Buka Ulang ↺';
  }, [report.status]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Laporan ${report.title}, status ${report.status}, urgensi ${urgency.label}`}
      accessibilityHint="Ketuk untuk melihat detail dan fokus pada peta"
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      {/* 1. Header Kartu: Kategori, Urgensi, & Status */}
      <View style={styles.header}>
        <View style={styles.headerLeftBadges}>
          <CategoryBadge category={report.category} />
          <View style={[styles.urgencyBadge, { backgroundColor: urgency.bg }]}>
            <Text style={styles.urgencyIcon}>{urgency.icon}</Text>
            <Text style={[styles.urgencyText, { color: urgency.text }]}>
              {urgency.label}
            </Text>
          </View>
        </View>
        <StatusBadge status={report.status} />
      </View>

      {/* 2. Judul & Rincian Laporan */}
      <Text style={styles.title} numberOfLines={2}>
        {report.title}
      </Text>
      <Text style={styles.description} numberOfLines={3}>
        {report.description}
      </Text>

      {/* 3. Informasi Lokasi Spasial (Disiapkan untuk LBS Dilla) */}
      <View style={styles.locationContainer}>
        <Text style={styles.locationIcon}>📍</Text>
        <View style={styles.locationTextWrapper}>
          <Text style={styles.locationAddress} numberOfLines={1}>
            {report.location.address || 'Koordinat Lapangan Warga'}
          </Text>
          <View style={styles.coordsRow}>
            <Text style={styles.coordsLabel}>GIS:</Text>
            <Text style={styles.locationCoords}>
              {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
            </Text>
          </View>
        </View>
      </View>

      {/* 4. Metadata Pelapor & Dukungan Warga (Upvotes) */}
      <View style={styles.metaRow}>
        <Text style={styles.reporterText} numberOfLines={1}>
          👤 {report.reporter?.name || (report.reporter?.isAnonymous ? 'Warga Anonim' : 'Warga Peduli')}
        </Text>
        {report.upvotes !== undefined && (
          <View style={styles.upvoteBadge}>
            <Text style={styles.upvoteText}>▲ {report.upvotes} Dukungan</Text>
          </View>
        )}
      </View>

      {/* 5. Footer Kartu: Timestamp & Action Button */}
      <View style={styles.footer}>
        <Text style={styles.timestamp}>🕒 {formattedDate}</Text>

        {onStatusChange && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNextStatus}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Ubah status laporan ${report.title}`}
          >
            <Text style={styles.actionButtonText}>{nextStatusLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Optimasi Re-render dengan React.memo
export const ReportCard = React.memo(ReportCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#0284C7',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgencyIcon: {
    fontSize: 10,
    marginRight: 3,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 10,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
    marginTop: 1,
  },
  locationTextWrapper: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  coordsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 4,
  },
  locationCoords: {
    fontSize: 10,
    color: '#0284C7',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reporterText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  upvoteBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  upvoteText: {
    fontSize: 10,
    color: '#1D4ED8',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
  },
  actionButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
});
