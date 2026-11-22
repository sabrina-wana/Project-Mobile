/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * ReportCard Component
 * Komponen kartu presentasional murni.
 * Siap dipercantik dan dioptimasi performanya oleh Naila (Frontend Specialist).
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Report, ReportStatus } from '../types/report';
import { CategoryBadge } from './CategoryBadge';
import { StatusBadge } from './StatusBadge';

interface ReportCardProps {
  report: Report;
  isSelected?: boolean;
  onPress?: () => void;
  onStatusChange?: (id: string, nextStatus: ReportStatus) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  isSelected = false,
  onPress,
  onStatusChange,
}) => {
  const formattedDate = new Date(report.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      {/* Header Kartu: Kategori & Status */}
      <View style={styles.header}>
        <CategoryBadge category={report.category} />
        <StatusBadge status={report.status} />
      </View>

      {/* Konten Utama */}
      <Text style={styles.title} numberOfLines={2}>
        {report.title}
      </Text>
      <Text style={styles.description} numberOfLines={3}>
        {report.description}
      </Text>

      {/* Informasi Lokasi Spasial (Lat, Lng) - Kesiapan LBS Dilla */}
      <View style={styles.locationContainer}>
        <Text style={styles.locationIcon}>📍</Text>
        <View style={styles.locationTextWrapper}>
          <Text style={styles.locationAddress} numberOfLines={1}>
            {report.location.address || 'Koordinat Spasial Warga'}
          </Text>
          <Text style={styles.locationCoords}>
            Lat: {report.location.latitude.toFixed(4)}, Lng:{' '}
            {report.location.longitude.toFixed(4)}
          </Text>
        </View>
      </View>

      {/* Footer Kartu: Timestamp & Action Button */}
      <View style={styles.footer}>
        <Text style={styles.timestamp}>🕒 {formattedDate}</Text>
        {onStatusChange && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNextStatus}
          >
            <Text style={styles.actionButtonText}>Ubah Status</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#0284C7',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
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
    color: '#374151',
  },
  locationCoords: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  actionButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
});
