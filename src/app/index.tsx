/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * Main Screen: Dashboard Laporan Warga
 *
 * Menguji dan mendemonstrasikan:
 * 1. Unidirectional Data Flow dari useReports()
 * 2. Single Source of Truth dari Zustand Store
 * 3. Filter berdasarkan kategori ('road_damage', 'flood', 'landslide', 'public_facility')
 * 4. Penambahan laporan baru secara realtime & immutable
 * 5. Visualisasi kesiapan koordinat spasial (LBS Engine Dilla)
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ReportCard } from '../components/ReportCard';
import { useReports } from '../hooks/useReports';
import { ReportCategory } from '../types/report';

const CATEGORY_FILTERS: { key: ReportCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'road_damage', label: '🚧 Jalan' },
  { key: 'flood', label: '🌊 Banjir' },
  { key: 'landslide', label: '⚠️ Longsor' },
  { key: 'public_facility', label: '💡 Fasilitas' },
];

export default function CivicPulseScreen() {
  const {
    filteredReports,
    selectedReport,
    filter,
    stats,
    isLoading,
    error,
    addReport,
    updateStatus,
    selectReport,
    setCategoryFilter,
    setSearchQuery,
    refresh,
  } = useReports(true);

  // Local state untuk modal form tambah laporan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ReportCategory>('road_damage');
  const [newAddress, setNewAddress] = useState('');
  const [newLat, setNewLat] = useState('-7.9600');
  const [newLng, setNewLng] = useState('112.6300');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateReport = async () => {
    if (!newTitle.trim()) {
      alert('Judul laporan wajib diisi!');
      return;
    }

    const lat = parseFloat(newLat);
    const lng = parseFloat(newLng);
    if (isNaN(lat) || isNaN(lng)) {
      alert('Format koordinat tidak valid!');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReport({
        title: newTitle,
        description: newDesc,
        category: newCategory,
        location: {
          latitude: lat,
          longitude: lng,
          address: newAddress.trim() || 'Lokasi Laporan Warga',
        },
        urgency: 'high',
        reporter: {
          name: 'Warga Peduli (Sabrina)',
          isAnonymous: false,
        },
      });

      // Reset form
      setNewTitle('');
      setNewDesc('');
      setNewAddress('');
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim laporan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header Banner & SDG 11 Context */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerBadge}>SDG 11: SUSTAINABLE CITIES</Text>
          <Text style={styles.bannerTitle}>Civic Pulse & Disaster Hub</Text>
          <Text style={styles.bannerSubtitle}>
            Sistem Pelaporan Warga Berbasis LBS & Realtime State
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={styles.addButtonText}>+ Lapor</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Stats Bar: Single Source of Truth dari Zustand Store */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#CA8A04' }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Menunggu</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#0284C7' }]}>
            {stats.inProgress}
          </Text>
          <Text style={styles.statLabel}>Diproses</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#16A34A' }]}>
            {stats.resolved}
          </Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </View>
      </View>

      {/* 3. Search & Category Filters (UDF) */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari laporan berdasarkan judul, lokasi..."
          value={filter.searchQuery || ''}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScrollView}
          contentContainerStyle={styles.chipContainer}
        >
          {CATEGORY_FILTERS.map((item) => {
            const isActive = (filter.category || 'all') === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setCategoryFilter(item.key)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, isActive && styles.chipTextActive]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Notification Active Report / Map Sync Hint */}
      {selectedReport && (
        <View style={styles.selectedBanner}>
          <Text style={styles.selectedBannerText} numberOfLines={1}>
            📌 Laporan Terpilih: {selectedReport.title} (
            {selectedReport.location.latitude.toFixed(4)},{' '}
            {selectedReport.location.longitude.toFixed(4)})
          </Text>
          <TouchableOpacity onPress={() => selectReport(null)}>
            <Text style={styles.selectedBannerClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. Daftar Laporan Warga */}
      {isLoading && filteredReports.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingText}>Memuat laporan warga...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ReportCard
              report={item}
              isSelected={selectedReport?.id === item.id}
              onPress={() => selectReport(item.id)}
              onStatusChange={(id, nextStatus) => updateStatus(id, nextStatus)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                Tidak ada laporan yang sesuai dengan filter.
              </Text>
            </View>
          }
        />
      )}

      {/* 6. Modal Form Lapor Cepat (Simulasi Masukan Warga) */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buat Laporan Warga Baru</Text>
            <Text style={styles.modalSubtitle}>
              Mendukung SDG 11: Kota & Komunitas Berkelanjutan
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Judul insiden (contoh: Jalan Amblas)"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Deskripsi detail situasi/kerusakan"
              multiline
              numberOfLines={3}
              value={newDesc}
              onChangeText={setNewDesc}
            />

            <Text style={styles.inputLabel}>Kategori:</Text>
            <View style={styles.categoryPickerRow}>
              {(['road_damage', 'flood', 'landslide', 'public_facility'] as ReportCategory[]).map(
                (cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.pickerChip,
                      newCategory === cat && styles.pickerChipActive,
                    ]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.pickerChipText,
                        newCategory === cat && styles.pickerChipTextActive,
                      ]}
                    >
                      {cat === 'road_damage'
                        ? 'Jalan'
                        : cat === 'flood'
                        ? 'Banjir'
                        : cat === 'landslide'
                        ? 'Longsor'
                        : 'Fasilitas'}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Alamat / Patokan lokasi"
              value={newAddress}
              onChangeText={setNewAddress}
            />

            <View style={styles.coordRow}>
              <TextInput
                style={[styles.input, styles.coordInput]}
                placeholder="Latitude"
                value={newLat}
                onChangeText={setNewLat}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.coordInput]}
                placeholder="Longitude"
                value={newLng}
                onChangeText={setNewLng}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateReport}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Menyimpan...' : 'Kirim Laporan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  banner: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BAE6FD',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#E0F2FE',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonText: {
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    marginBottom: 8,
  },
  chipScrollView: {
    flexDirection: 'row',
  },
  chipContainer: {
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  chipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  selectedBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  selectedBannerText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '600',
    flex: 1,
  },
  selectedBannerClose: {
    fontSize: 14,
    color: '#1D4ED8',
    fontWeight: '800',
    marginLeft: 8,
  },
  listContent: {
    padding: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  pickerChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  pickerChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  pickerChipText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  pickerChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  coordRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  coordInput: {
    flex: 1,
    marginBottom: 0,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
