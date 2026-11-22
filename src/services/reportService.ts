/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * Report Service Abstraction Layer
 * Bertanggung jawab terhadap I/O data (mock memory untuk saat ini,
 * siap dihubungkan ke Secure Storage / SQLite / REST API pada Pertemuan 10).
 */

import { CreateReportDTO, Report, ReportStatus } from '../types/report';
import { INITIAL_MOCK_REPORTS } from './mockData';

class ReportService {
  // In-memory data store yang aman dan terisolasi di service layer
  private reports: Report[] = [...INITIAL_MOCK_REPORTS];

  /**
   * Mengambil seluruh daftar laporan warga (dengan simulasi latency async)
   */
  async fetchReports(): Promise<Report[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return deep copy untuk mencegah direct mutation dari luar
        resolve(JSON.parse(JSON.stringify(this.reports)));
      }, 300);
    });
  }

  /**
   * Menyimpan laporan baru dari warga
   */
  async createReport(payload: CreateReportDTO): Promise<Report> {
    return new Promise((resolve, reject) => {
      try {
        if (!payload.title || !payload.category || !payload.location) {
          throw new Error('Data laporan tidak lengkap. Judul, kategori, dan koordinat wajib diisi.');
        }

        const now = new Date().toISOString();
        const newReport: Report = {
          id: `rep-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          title: payload.title.trim(),
          description: payload.description?.trim() || '',
          category: payload.category,
          location: {
            latitude: payload.location.latitude,
            longitude: payload.location.longitude,
            address: payload.location.address || 'Lokasi tidak bernama',
          },
          createdAt: now,
          updatedAt: now,
          status: 'pending', // Default status untuk laporan baru
          urgency: payload.urgency || 'medium',
          reporter: payload.reporter || { name: 'Anonim', isAnonymous: true },
          imageUrl: payload.imageUrl,
          upvotes: 0,
        };

        // Simpan immutably di memori service
        this.reports = [newReport, ...this.reports];
        resolve(JSON.parse(JSON.stringify(newReport)));
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Memperbarui status laporan (misal: pending -> in_progress -> resolved)
   */
  async updateReportStatus(id: string, status: ReportStatus): Promise<Report> {
    return new Promise((resolve, reject) => {
      const index = this.reports.findIndex((r) => r.id === id);
      if (index === -1) {
        return reject(new Error(`Laporan dengan ID "${id}" tidak ditemukan.`));
      }

      const updatedReport: Report = {
        ...this.reports[index],
        status,
        updatedAt: new Date().toISOString(),
      };

      this.reports = [
        ...this.reports.slice(0, index),
        updatedReport,
        ...this.reports.slice(index + 1),
      ];

      resolve(JSON.parse(JSON.stringify(updatedReport)));
    });
  }

  /**
   * Menghapus laporan berdasarkan ID
   */
  async deleteReport(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const initialLength = this.reports.length;
      this.reports = this.reports.filter((r) => r.id !== id);
      resolve(this.reports.length < initialLength);
    });
  }
}

// Export singleton instance
export const reportService = new ReportService();
