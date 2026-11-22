/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * Core Report Domain Models & Interfaces
 * Mengikuti prinsip Single Source of Truth dan Separation of Concerns.
 */

import { LocationCoordinate } from './location';

/**
 * Kategori laporan warga sesuai spesifikasi Milestone 1:
 * - road_damage: Kerusakan Jalan (lubang, amblas, retak)
 * - flood: Banjir (genangan, luapan sungai)
 * - landslide: Longsor (tebing runtuh, tanah bergerak)
 * - public_facility: Fasilitas Umum (PJU padam, jembatan rusak, drainase tersumbat)
 */
export type ReportCategory =
  | 'road_damage'
  | 'flood'
  | 'landslide'
  | 'public_facility';

/**
 * Status siklus hidup laporan:
 * - pending: Menunggu verifikasi tim lapangan/sistem
 * - in_progress: Dalam proses penanganan oleh instansi terkait
 * - resolved: Laporan telah selesai ditangani
 * - rejected: Laporan tidak valid atau duplikasi
 */
export type ReportStatus =
  | 'pending'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

/**
 * Tingkat urgensi / keparahan bencana atau kerusakan
 */
export type ReportUrgency = 'low' | 'medium' | 'high' | 'critical';

/**
 * Metadata pelapor
 */
export interface ReporterInfo {
  id?: string;
  name: string;
  phone?: string;
  isAnonymous: boolean;
}

/**
 * Entitas Utama Laporan Warga Civic Pulse
 * Memenuhi 7 elemen wajib spesifikasi sistem:
 * 1. ID laporan (id)
 * 2. Judul laporan (title)
 * 3. Deskripsi laporan (description)
 * 4. Kategori laporan (category)
 * 5. Latitude & Longitude (location)
 * 6. Waktu laporan (createdAt, updatedAt)
 * 7. Status laporan (status)
 */
export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  location: LocationCoordinate;
  createdAt: string; // ISO 8601 string (e.g. 2026-11-22T20:00:00.000Z)
  updatedAt: string;
  status: ReportStatus;
  urgency: ReportUrgency;
  reporter?: ReporterInfo;
  imageUrl?: string;
  upvotes?: number;
}

/**
 * Data Transfer Object (DTO) untuk pembuatan laporan baru oleh warga
 */
export interface CreateReportDTO {
  title: string;
  description: string;
  category: ReportCategory;
  location: LocationCoordinate;
  urgency?: ReportUrgency;
  reporter?: ReporterInfo;
  imageUrl?: string;
}

/**
 * Kriteria filter laporan untuk UI (Naila) dan Spasial (Dilla)
 */
export interface ReportFilter {
  category?: ReportCategory | 'all';
  status?: ReportStatus | 'all';
  urgency?: ReportUrgency | 'all';
  searchQuery?: string;
}

/**
 * Ringkasan statistik laporan untuk dashboard Civic Pulse
 */
export interface ReportStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  byCategory: Record<ReportCategory, number>;
}
