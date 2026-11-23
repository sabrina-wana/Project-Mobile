import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FilterBar,
  MapPlaceholder,
  ReportCard,
  StatsOverview,
} from '../components';
import { useReports } from '../hooks/useReports';
import { Report, ReportCategory, ReportStatus, ReportUrgency } from '../types/report';
export default function CivicPulseDashboard() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  // Mengambil state & action dari Custom Hook (Clean Architecture Sabrina)
  const {
    reports,
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
    setStatusFilter,
    setSearchQuery,
    resetFilters,
    refresh,
  } = useReports(true);
  // Local state untuk Modal Tambah Laporan Warga
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ReportCategory>('road_damage');
  const [newUrgency, setNewUrgency] = useState<ReportUrgency>('high');
  const [newAddress, setNewAddress] = useState('');
  const [newLat, setNewLat] = useState('-7.9600');
  const [newLng, setNewLng] = useState('112.6300');
  const [reporterName, setReporterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Status apakah filter saat ini sedang aktif
  const isFilterActive = useMemo(() => {
    return Boolean(
      (filter.category && filter.category !== 'all') ||
      (filter.status && filter.status !== 'all') ||
      (filter.searchQuery && filter.searchQuery.trim().length > 0)
    );
  }, [filter]);
  // Menghitung jumlah laporan per kategori secara ter-memoize
  const categoryCounts = useMemo(() => {
    const counts: Record<ReportCategory | 'all', number> = {
      all: reports.length,
      road_damage: 0,
      flood: 0,
      landslide: 0,
      public_facility: 0,
    };
    reports.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category] += 1;
      }
    });
    return counts;
  }, [reports]);
  // Handler: Mengubah status laporan (UDF)
  const handleStatusChange = useCallback(
    async (id: string, nextStatus: ReportStatus) => {
      try {
        await updateStatus(id, nextStatus);
      } catch (err: any) {
        Alert.alert('Gagal Memperbarui Status', err?.message || 'Terjadi kesalahan sistem.');
      }
    },
    [updateStatus]
  );
  // Handler: Memilih laporan untuk sinkronisasi peta
  const handleSelectReport = useCallback(
    (id: string) => {
      if (selectedReport?.id === id) {
        selectReport(null); // Toggle off jika ditekan lagi
      } else {
        selectReport(id);
      }
    },
    [selectedReport?.id, selectReport]
  );
  // Handler: Reset fokus peta
  const handleClearSelection = useCallback(() => {
    selectReport(null);
  }, [selectReport]);
  // Handler: Pengiriman Laporan Baru
  const handleCreateReport = useCallback(async () => {
    if (!newTitle.trim()) {
      Alert.alert('Perhatian', 'Judul laporan warga wajib diisi.');
      return;
    }
    const lat = parseFloat(newLat);
    const lng = parseFloat(newLng);
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Format Salah', 'Koordinat Latitude dan Longitude harus berupa angka yang valid.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addReport({
        title: newTitle.trim(),
        description: newDesc.trim(),
        category: newCategory,
        urgency: newUrgency,
        location: {
          latitude: lat,
          longitude: lng,
          address: newAddress.trim() || 'Lokasi Laporan Warga',
        },
        reporter: {
          name: reporterName.trim() || 'Warga Peduli',
          isAnonymous: !reporterName.trim(),
        },
      });
      // Reset form input
      setNewTitle('');
      setNewDesc('');
      setNewAddress('');
      setReporterName('');
      setIsModalOpen(false);
      Alert.alert('Berhasil', 'Laporan warga berhasil dicatat dan dipublikasikan!');
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan', err?.message || 'Gagal mengirimkan laporan warga.');
    } finally {
      setIsSubmitting(false);
    }
  }, [newTitle, newDesc, newCategory, newUrgency, newLat, newLng, newAddress, reporterName, addReport]);
  // Key extractor ter-memoize untuk FlatList
  const keyExtractor = useCallback((item: Report) => item.id, []);
  // Item renderer ter-memoize untuk ReportCard
  const renderItem: ListRenderItem<Report> = useCallback(
    ({ item }) => (
      <View style={styles.cardItemWrapper}>
        <ReportCard
          report={item}
          isSelected={selectedReport?.id === item.id}
          onPress={() => handleSelectReport(item.id)}
          onStatusChange={handleStatusChange}
        />
      </View>
    ),
    [selectedReport?.id, handleSelectReport, handleStatusChange]
  );
  // Header gabungan FlatList (Banner, Stats, Map, Filter, List Title)
  const renderListHeader = useMemo(() => {
    return (
      <View>
        {/* 1. Header Banner & SDG 11 Context */}
        <View style={styles.heroBanner}>
          <View style={styles.bannerInfo}>
            <View style={styles.badgeSdgRow}>
              <View style={styles.sdgTag}>
                <Text style={styles.sdgTagText}>SDG 11</Text>
              </View>
              <Text style={styles.sdgSubText}>SUSTAINABLE CITIES & COMMUNITIES</Text>
            </View>
            <Text style={styles.heroTitle}>Civic Pulse Hub</Text>
            <Text style={styles.heroSubtitle}>
              Platform Pelaporan Warga Berbasis LBS & Real-time State
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsModalOpen(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Buat Laporan Baru"
            style={styles.heroAddButton}
          >
            <Text style={styles.heroAddButtonIcon}>＋</Text>
            <Text style={styles.heroAddButtonText}>Lapor</Text>
          </TouchableOpacity>
        </View>
        {/* 2. Ringkasan Status Laporan (Interactive Filter) */}
        <StatsOverview
          stats={stats}
          activeStatus={filter.status || 'all'}
          onSelectStatus={setStatusFilter}
        />
        {/* 3. Placeholder Area Peta GIS (Siap Diintegrasikan Dilla) */}
        <MapPlaceholder
          totalPoints={filteredReports.length}
          selectedReport={selectedReport}
          onClearSelection={handleClearSelection}
        />
        {/* 4. Bilah Pencarian & Chip Filter Kategori */}
        <FilterBar
          searchQuery={filter.searchQuery || ''}
          onSearchChange={setSearchQuery}
          activeCategory={filter.category || 'all'}
          onSelectCategory={setCategoryFilter}
          categoryCounts={categoryCounts}
          activeStatus={filter.status || 'all'}
          onSelectStatus={setStatusFilter}
          onResetFilters={resetFilters}
          isFilterActive={isFilterActive}
        />
        {/* 5. Header Seksi Daftar Laporan */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrapper}>
            <Text style={styles.sectionHeading}>Daftar Laporan Warga</Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{filteredReports.length}</Text>
            </View>
          </View>
          {isFilterActive && (
            <View style={styles.filterActiveBadge}>
              <Text style={styles.filterActiveBadgeText}>Filter Diterapkan</Text>
            </View>
          )}
        </View>
      </View>
    );
  }, [
    stats,
    filter.status,
    filter.category,
    filter.searchQuery,
    filteredReports.length,
    selectedReport,
    categoryCounts,
    isFilterActive,
    setStatusFilter,
    setCategoryFilter,
    setSearchQuery,
    resetFilters,
    handleClearSelection,
  ]);
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
      {/* State: Loading Data Awal */}
      {isLoading && reports.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingTitle}>Memuat Civic Pulse...</Text>
          <Text style={styles.loadingSubtitle}>
            Menghubungkan ke Service Layer dan Single Source of Truth
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refresh}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Muat ulang laporan"
          >
            <Text style={styles.retryButtonText}>Muat Ulang Data</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={[
            styles.listContent,
            isTablet && styles.listContentTablet,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshing={isLoading}
          onRefresh={refresh}
          // Optimasi performa FlatList (Naila - Performance Specialist)
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={Platform.OS === 'android'}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Laporan Tidak Ditemukan</Text>
              <Text style={styles.emptySubtitle}>
                Tidak ada laporan yang sesuai dengan kriteria filter atau pencarian Anda.
              </Text>
              {isFilterActive && (
                <TouchableOpacity
                  style={styles.emptyResetButton}
                  onPress={resetFilters}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Reset seluruh filter"
                >
                  <Text style={styles.emptyResetText}>Reset Seluruh Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
      {/* Modal Form: Buat Laporan Warga Baru (Responsive & Safe Area) */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalCard, isTablet && styles.modalCardTablet]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalHeading}>Buat Laporan Warga</Text>
                <Text style={styles.modalSubheading}>
                  Kontribusi untuk Ketangguhan Kota (SDG 11)
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsModalOpen(false)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Tutup formulir"
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            {/* Modal Body Scroll */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* 1. Judul Laporan */}
              <Text style={styles.formLabel}>Judul Laporan *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Contoh: Tanggul Jebol di Kawasan Blimbing"
                placeholderTextColor="#94A3B8"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              {/* 2. Deskripsi Detail */}
              <Text style={styles.formLabel}>Deskripsi Situasi / Kerusakan</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Jelaskan kondisi di lapangan secara spesifik..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={newDesc}
                onChangeText={setNewDesc}
              />
              {/* 3. Pilihan Kategori */}
              <Text style={styles.formLabel}>Kategori Bencana / Fasilitas *</Text>
              <View style={styles.formCategoryRow}>
                {(
                  [
                    { key: 'road_damage', label: '🚧 Jalan' },
                    { key: 'flood', label: '🌊 Banjir' },
                    { key: 'landslide', label: '⚠️ Longsor' },
                    { key: 'public_facility', label: '💡 Fasilitas' },
                  ] as { key: ReportCategory; label: string }[]
                ).map((cat) => {
                  const isSelected = newCategory === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.formCategoryChip,
                        isSelected && styles.formCategoryChipActive,
                      ]}
                      onPress={() => setNewCategory(cat.key)}
                    >
                      <Text
                        style={[
                          styles.formCategoryChipText,
                          isSelected && styles.formCategoryChipTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* 4. Tingkat Urgensi */}
              <Text style={styles.formLabel}>Tingkat Urgensi *</Text>
              <View style={styles.formUrgencyRow}>
                {(
                  [
                    { key: 'low', label: 'Rendah', color: '#64748B' },
                    { key: 'medium', label: 'Sedang', color: '#CA8A04' },
                    { key: 'high', label: 'Tinggi', color: '#EA580C' },
                    { key: 'critical', label: 'Kritis', color: '#DC2626' },
                  ] as { key: ReportUrgency; label: string; color: string }[]
                ).map((urg) => {
                  const isSelected = newUrgency === urg.key;
                  return (
                    <TouchableOpacity
                      key={urg.key}
                      style={[
                        styles.formUrgencyChip,
                        isSelected && {
                          backgroundColor: urg.color,
                          borderColor: urg.color,
                        },
                      ]}
                      onPress={() => setNewUrgency(urg.key)}
                    >
                      <Text
                        style={[
                          styles.formUrgencyText,
                          isSelected && styles.formUrgencyTextActive,
                        ]}
                      >
                        {urg.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* 5. Alamat / Patokan Lokasi */}
              <Text style={styles.formLabel}>Alamat / Patokan Lapangan</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Contoh: Jl. Soekarno Hatta No. 45"
                placeholderTextColor="#94A3B8"
                value={newAddress}
                onChangeText={setNewAddress}
              />
              {/* 6. Koordinat Spasial (Latitude, Longitude) */}
              <Text style={styles.formLabel}>Koordinat Spasial LBS (Lat, Lng) *</Text>
              <View style={styles.formCoordRow}>
                <View style={styles.formCoordCol}>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Latitude"
                    placeholderTextColor="#94A3B8"
                    value={newLat}
                    onChangeText={setNewLat}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formCoordCol}>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Longitude"
                    placeholderTextColor="#94A3B8"
                    value={newLng}
                    onChangeText={setNewLng}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              {/* 7. Nama Pelapor (Opsional) */}
              <Text style={styles.formLabel}>Nama Pelapor (Kosongkan jika Anonim)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Nama Anda atau Komunitas"
                placeholderTextColor="#94A3B8"
                value={reporterName}
                onChangeText={setReporterName}
              />
            </ScrollView>
            {/* Modal Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleCreateReport}
                disabled={isSubmitting}
              >
                <Text style={styles.modalSubmitText}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroBanner: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerInfo: {
    flex: 1,
    paddingRight: 12,
  },
  badgeSdgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sdgTag: {
    backgroundColor: '#FD9D24', // Warna resmi SDG
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  sdgTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sdgSubText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#E0F2FE',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 11,
    color: '#BAE6FD',
    marginTop: 2,
    lineHeight: 15,
  },
  heroAddButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  heroAddButtonIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284C7',
    marginRight: 4,
  },
  heroAddButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  sectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  countPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterActiveBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  filterActiveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  listContent: {
    paddingBottom: 24,
  },
  listContentTablet: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  cardItemWrapper: {
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  loadingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
  },
  errorDescription: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
    maxWidth: 280,
  },
  emptyResetButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyResetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalCardTablet: {
    maxWidth: 540,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubheading: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  modalScrollContent: {
    padding: 18,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  formTextArea: {
    height: 65,
    textAlignVertical: 'top',
  },
  formCategoryRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  formCategoryChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  formCategoryChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  formCategoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  formCategoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formUrgencyRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  formUrgencyChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  formUrgencyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  formUrgencyTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formCoordRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formCoordCol: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFAFC',
  },
  modalCancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSubmitButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modalSubmitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
