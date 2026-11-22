/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * Custom Hook: useReports
 *
 * Mengabstraksi interaksi komponen UI (Naila) terhadap Zustand Store.
 * Memastikan pemisahan ketat antara Business Logic dan Presentational Component.
 */

import { useEffect, useMemo } from 'react';
import { useReportStore } from '../store/useReportStore';
import {
  CreateReportDTO,
  Report,
  ReportCategory,
  ReportFilter,
  ReportStats,
  ReportStatus,
} from '../types/report';

export interface UseReportsReturn {
  // State
  reports: Report[];
  filteredReports: Report[];
  selectedReport: Report | undefined;
  filter: ReportFilter;
  stats: ReportStats;
  isLoading: boolean;
  error: string | null;

  // Actions
  addReport: (payload: CreateReportDTO) => Promise<Report>;
  updateStatus: (id: string, status: ReportStatus) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  selectReport: (id: string | null) => void;
  setCategoryFilter: (category: ReportCategory | 'all') => void;
  setStatusFilter: (status: ReportStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export function useReports(autoFetch: boolean = true): UseReportsReturn {
  // Atomic Selectors dari Zustand untuk performa re-render optimal (Naila's requirement)
  const reports = useReportStore((state) => state.reports);
  const selectedReportId = useReportStore((state) => state.selectedReportId);
  const filter = useReportStore((state) => state.filter);
  const isLoading = useReportStore((state) => state.isLoading);
  const error = useReportStore((state) => state.error);

  const fetchReports = useReportStore((state) => state.fetchReports);
  const addReport = useReportStore((state) => state.addReport);
  const updateReportStatus = useReportStore((state) => state.updateReportStatus);
  const deleteReportAction = useReportStore((state) => state.deleteReport);
  const selectReport = useReportStore((state) => state.selectReport);
  const setCategoryFilter = useReportStore((state) => state.setCategoryFilter);
  const setStatusFilter = useReportStore((state) => state.setStatusFilter);
  const setSearchQuery = useReportStore((state) => state.setSearchQuery);
  const resetFilters = useReportStore((state) => state.resetFilters);
  const clearError = useReportStore((state) => state.clearError);
  const getFilteredReports = useReportStore((state) => state.getFilteredReports);
  const getSelectedReport = useReportStore((state) => state.getSelectedReport);
  const getReportStats = useReportStore((state) => state.getReportStats);

  // Auto-fetch data awal saat hook dipasang (mount)
  useEffect(() => {
    if (autoFetch && reports.length === 0) {
      fetchReports();
    }
  }, [autoFetch, reports.length, fetchReports]);

  // Memoized values untuk menjaga render performance (Performance Specialist: Naila)
  const filteredReports = useMemo(() => {
    return getFilteredReports();
  }, [reports, filter, getFilteredReports]);

  const selectedReport = useMemo(() => {
    return getSelectedReport();
  }, [reports, selectedReportId, getSelectedReport]);

  const stats = useMemo(() => {
    return getReportStats();
  }, [reports, getReportStats]);

  return {
    reports,
    filteredReports,
    selectedReport,
    filter,
    stats,
    isLoading,
    error,
    addReport,
    updateStatus: updateReportStatus,
    deleteReport: deleteReportAction,
    selectReport,
    setCategoryFilter,
    setStatusFilter,
    setSearchQuery,
    resetFilters,
    clearError,
    refresh: fetchReports,
  };
}
