/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * Central Zustand Store for Civic Pulse Reports
 *
 * Arsitektur:
 * 1. Single Source of Truth: Seluruh status laporan, filter, dan active report disimpan terpusat.
 * 2. Unidirectional Data Flow (UDF): View -> Action -> Service -> State Update -> View.
 * 3. Immutable State Updates: Mencegah direct state mutation melalui object/array cloning.
 * 4. Modular Separation: Mengonsumsi types dan services tanpa ketergantungan langsung ke UI framework spesifik.
 */

import { create } from 'zustand';
import { reportService } from '../services/reportService';
import {
  CreateReportDTO,
  Report,
  ReportCategory,
  ReportFilter,
  ReportStats,
  ReportStatus,
} from '../types/report';

/**
 * State Interface (Data yang dikelola)
 */
export interface ReportState {
  reports: Report[];
  selectedReportId: string | null;
  filter: ReportFilter;
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions Interface (Operasi & Transisi State)
 */
export interface ReportActions {
  // Data Lifecycle Actions
  fetchReports: () => Promise<void>;
  addReport: (payload: CreateReportDTO) => Promise<Report>;
  updateReportStatus: (id: string, status: ReportStatus) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;

  // Selection & Navigation Actions (Integrasi dengan Map Dilla & Detail Screen Naila)
  selectReport: (id: string | null) => void;

  // Filter & Search Actions (Integrasi dengan Filter Bar Naila)
  setCategoryFilter: (category: ReportCategory | 'all') => void;
  setStatusFilter: (status: ReportStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;

  // Error & Status Management
  clearError: () => void;

  // Selectors (Computed Values / Derived State)
  getFilteredReports: () => Report[];
  getSelectedReport: () => Report | undefined;
  getReportStats: () => ReportStats;
}

export type ReportStore = ReportState & ReportActions;

const initialFilter: ReportFilter = {
  category: 'all',
  status: 'all',
  urgency: 'all',
  searchQuery: '',
};

export const useReportStore = create<ReportStore>((set, get) => ({
  // --- INITIAL STATE ---
  reports: [],
  selectedReportId: null,
  filter: { ...initialFilter },
  isLoading: false,
  error: null,

  // --- ACTIONS (UDF & IMMUTABLE UPDATES) ---

  /**
   * Mengambil data laporan dari Service Layer
   */
  fetchReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await reportService.fetchReports();
      set({
        reports: data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err?.message || 'Gagal mengambil data laporan warga.',
        isLoading: false,
      });
    }
  },

  /**
   * Menambahkan laporan baru warga ke dalam store secara immutable
   */
  addReport: async (payload: CreateReportDTO): Promise<Report> => {
    set({ isLoading: true, error: null });
    try {
      const newReport = await reportService.createReport(payload);

      // IMMUTABLE UPDATE: Jangan gunakan push(), buat array baru dengan spread operator
      set((state) => ({
        reports: [newReport, ...state.reports],
        selectedReportId: newReport.id, // Otomatis highlight laporan baru
        isLoading: false,
      }));

      return newReport;
    } catch (err: any) {
      const errorMessage = err?.message || 'Gagal menyimpan laporan warga.';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  /**
   * Memperbarui status laporan secara immutable
   */
  updateReportStatus: async (id: string, status: ReportStatus) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await reportService.updateReportStatus(id, status);

      // IMMUTABLE UPDATE: map() menghasilkan array baru tanpa memutasi array lama
      set((state) => ({
        reports: state.reports.map((item) =>
          item.id === id ? { ...item, status: updated.status, updatedAt: updated.updatedAt } : item
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err?.message || `Gagal memperbarui status laporan ${id}.`,
        isLoading: false,
      });
    }
  },

  /**
   * Menghapus laporan secara immutable
   */
  deleteReport: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await reportService.deleteReport(id);

      // IMMUTABLE UPDATE: filter() menghasilkan array baru
      set((state) => ({
        reports: state.reports.filter((item) => item.id !== id),
        selectedReportId: state.selectedReportId === id ? null : state.selectedReportId,
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err?.message || 'Gagal menghapus laporan.',
        isLoading: false,
      });
    }
  },

  /**
   * Memilih laporan aktif (untuk sinkronisasi tap marker peta Dilla <-> card UI Naila)
   */
  selectReport: (id: string | null) => {
    set({ selectedReportId: id });
  },

  /**
   * Mengatur filter kategori
   */
  setCategoryFilter: (category: ReportCategory | 'all') => {
    set((state) => ({
      filter: { ...state.filter, category },
    }));
  },

  /**
   * Mengatur filter status laporan
   */
  setStatusFilter: (status: ReportStatus | 'all') => {
    set((state) => ({
      filter: { ...state.filter, status },
    }));
  },

  /**
   * Mengatur kata kunci pencarian teks
   */
  setSearchQuery: (searchQuery: string) => {
    set((state) => ({
      filter: { ...state.filter, searchQuery },
    }));
  },

  /**
   * Reset seluruh filter ke nilai default
   */
  resetFilters: () => {
    set({ filter: { ...initialFilter } });
  },

  /**
   * Menghapus pesan error
   */
  clearError: () => {
    set({ error: null });
  },

  // --- DERIVED SELECTORS (SINGLE SOURCE OF TRUTH) ---

  /**
   * Mendapatkan daftar laporan yang sudah difilter berdasarkan kriteria aktif
   */
  getFilteredReports: () => {
    const { reports, filter } = get();
    return reports.filter((item) => {
      // 1. Filter Kategori
      if (filter.category && filter.category !== 'all' && item.category !== filter.category) {
        return false;
      }
      // 2. Filter Status
      if (filter.status && filter.status !== 'all' && item.status !== filter.status) {
        return false;
      }
      // 3. Filter Urgensi
      if (filter.urgency && filter.urgency !== 'all' && item.urgency !== filter.urgency) {
        return false;
      }
      // 4. Pencarian Teks
      if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchAddr = item.location.address?.toLowerCase().includes(query);
        return matchTitle || matchDesc || matchAddr;
      }
      return true;
    });
  },

  /**
   * Mendapatkan laporan yang sedang dipilih/aktif
   */
  getSelectedReport: () => {
    const { reports, selectedReportId } = get();
    if (!selectedReportId) return undefined;
    return reports.find((r) => r.id === selectedReportId);
  },

  /**
   * Menghitung statistik laporan real-time
   */
  getReportStats: (): ReportStats => {
    const { reports } = get();
    const stats: ReportStats = {
      total: reports.length,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0,
      byCategory: {
        road_damage: 0,
        flood: 0,
        landslide: 0,
        public_facility: 0,
      },
    };

    reports.forEach((item) => {
      // Hitung per status
      if (item.status === 'pending') stats.pending += 1;
      else if (item.status === 'in_progress') stats.inProgress += 1;
      else if (item.status === 'resolved') stats.resolved += 1;
      else if (item.status === 'rejected') stats.rejected += 1;

      // Hitung per kategori
      if (stats.byCategory[item.category] !== undefined) {
        stats.byCategory[item.category] += 1;
      }
    });

    return stats;
  },
}));
