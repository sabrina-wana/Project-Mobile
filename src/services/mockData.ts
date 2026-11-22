/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * Mock Dataset Laporan Warga
 * Menyediakan data awal realistis untuk pengujian sistem, visualisasi UI Naila,
 * dan titik spasial untuk modul peta Dilla.
 */

import { Report } from '../types/report';

export const INITIAL_MOCK_REPORTS: Report[] = [
  {
    id: 'rep-001',
    title: 'Jalan Amblas dan Berlubang Parah',
    description:
      'Terdapat lubang berdiameter 1 meter dengan kedalaman 25cm di lajur kiri. Sangat membahayakan pengendara motor saat malam hari.',
    category: 'road_damage',
    location: {
      latitude: -7.9525,
      longitude: 112.6145,
      address: 'Jl. Soekarno Hatta No. 45, Lowokwaru, Malang',
    },
    createdAt: '2026-11-22T08:30:00.000Z',
    updatedAt: '2026-11-22T08:30:00.000Z',
    status: 'pending',
    urgency: 'high',
    reporter: {
      name: 'Ahmad Fauzi',
      isAnonymous: false,
    },
    upvotes: 14,
  },
  {
    id: 'rep-002',
    title: 'Genangan Banjir 50cm Pasca Hujan Lebat',
    description:
      'Air luapan saluran drainase merendam ruas jalan hingga setinggi lutut orang dewasa. Arus lalu lintas tersendat dan mogok.',
    category: 'flood',
    location: {
      latitude: -7.9658,
      longitude: 112.6321,
      address: 'Jl. Borobudur Depan Pasar Blimbing, Malang',
    },
    createdAt: '2026-11-22T14:15:00.000Z',
    updatedAt: '2026-11-22T15:00:00.000Z',
    status: 'in_progress',
    urgency: 'critical',
    reporter: {
      name: 'Warga Blimbing',
      isAnonymous: true,
    },
    upvotes: 38,
  },
  {
    id: 'rep-003',
    title: 'Tebing Longsor Menutup Separuh Akses Jalan',
    description:
      'Material tanah dan bebatuan kecil longsor dari tebing samping jalan setelah hujan lebat terus menerus.',
    category: 'landslide',
    location: {
      latitude: -7.8824,
      longitude: 112.5298,
      address: 'Jl. Raya Payung KM 4, Batu, Jawa Timur',
    },
    createdAt: '2026-11-21T19:40:00.000Z',
    updatedAt: '2026-11-22T07:20:00.000Z',
    status: 'in_progress',
    urgency: 'high',
    reporter: {
      name: 'Budi Santoso',
      isAnonymous: false,
    },
    upvotes: 27,
  },
  {
    id: 'rep-004',
    title: 'Lampu PJU Padam Sepanjang 300 Meter',
    description:
      'Tiga tiang penerangan jalan umum mati total sejak 3 hari yang lalu, menyebabkan area tikungan gelap dan rawan kecelakaan.',
    category: 'public_facility',
    location: {
      latitude: -7.9784,
      longitude: 112.6288,
      address: 'Jl. Ijen Boulevard No. 12, Klojen, Malang',
    },
    createdAt: '2026-11-20T21:10:00.000Z',
    updatedAt: '2026-11-22T10:00:00.000Z',
    status: 'resolved',
    urgency: 'medium',
    reporter: {
      name: 'Dewi Lestari',
      isAnonymous: false,
    },
    upvotes: 9,
  },
];
