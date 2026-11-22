# Civic Pulse & Community Disaster Management (SDG 11)

Aplikasi mobile tanggap bencana dan pelaporan fasilitas warga berbasis **React Native Expo** untuk mendukung **SDG 11: Sustainable Cities and Communities (Kota dan Komunitas yang Berkelanjutan)**.

---

## 👥 Tim Pengembang

| Peran | Nama | Tanggung Jawab Utama |
|---|---|---|
| **Anggota 1** | **Sabrina** | **Lead System Architect & Security Engineer** (Fondasi Arsitektur, Domain Models, UDF Zustand Store, Service Isolation) |
| **Anggota 2** | **Naila** | **Lead Frontend & Performance Specialist** (Desain UI/UX, Animasi, Re-render Optimization, Card & Form Components) |
| **Anggota 3** | **Dilla** | **Lead Hardware & Spatial/Network Engineer** (Modul GPS, LBS, Haversine Calculation, Interactive Map Engine & Custom Markers) |

---

## 🏛️ Arsitektur Sistem (Milestone 1 — Pertemuan 9)

Aplikasi ini menerapkan **Clean Layered Architecture** dengan **Unidirectional Data Flow (UDF)** dan **Single Source of Truth** untuk memastikan skalabilitas, kemudahan pengujian, serta pemisahan tanggung jawab (*Separation of Concerns*) yang ketat.

```
                  ┌──────────────────────────────────────────┐
                  │          UI Layer (Naila / View)         │
                  │   FlatList, Filter Chips, Modal Form     │
                  └─────────────────────▲────────────────────┘
                                        │ (Subscribes / Renders)
                                        │
                  ┌─────────────────────┴────────────────────┐
                  │             Custom Hook Layer            │
                  │              src/hooks/useReports        │
                  └─────────────────────▲────────────────────┘
                                        │ (Selects State & Dispatches)
                                        │
┌───────────────────────────────────────┴──────────────────────────────────────┐
│                     ZUSTAND STORE (Single Source of Truth)                  │
│                            src/store/useReportStore                          │
│                                                                              │
│  State: reports, selectedReportId, filter, isLoading, error                  │
│  Selectors: getFilteredReports, getSelectedReport, getReportStats            │
│  Actions (Immutable Updates): fetchReports, addReport, updateStatus, etc.    │
└───────────────────────────────────────▲──────────────────────────────────────┘
                                        │ (Calls Business Logic)
                                        │
                  ┌─────────────────────┴────────────────────┐
                  │               Service Layer              │
                  │        src/services/reportService        │
                  │ (Abstraksi I/O, Mock Memory, Persiapan   │
                  │   SecureStore/API pada Pertemuan 10)     │
                  └─────────────────────▲────────────────────┘
                                        │ (Implements Contracts)
                                        │
                  ┌─────────────────────┴────────────────────┐
                  │                Types Layer               │
                  │        src/types/report & location       │
                  │  (Report, Category, Status, Coordinates) │
                  └──────────────────────────────────────────┘
```

---

## 📋 Struktur Data Laporan Warga

Sesuai spesifikasi, setiap laporan warga memiliki 7 elemen wajib:

```typescript
export interface Report {
  id: string; // ID unik laporan (e.g. "rep-001")
  title: string; // Judul laporan
  description: string; // Rincian insiden/kerusakan
  category: ReportCategory; // 'road_damage' | 'flood' | 'landslide' | 'public_facility'
  location: LocationCoordinate; // { latitude: number, longitude: number, address?: string }
  createdAt: string; // Waktu pembuatan laporan (ISO 8601)
  updatedAt: string; // Waktu pembaruan status (ISO 8601)
  status: ReportStatus; // 'pending' | 'in_progress' | 'resolved' | 'rejected'
  urgency: ReportUrgency; // 'low' | 'medium' | 'high' | 'critical'
  reporter?: ReporterInfo; // { name: string, isAnonymous: boolean }
  imageUrl?: string;
  upvotes?: number;
}
```

---

## 📁 Struktur Direktori

```
Civic_Pulse/
├── package.json                 # Dependency React Native, Expo, Zustand
├── app.json                     # Konfigurasi Expo Router & SDG 11 branding
├── tsconfig.json                # TypeScript config dengan path alias (@/*)
├── scripts/
│   └── verify-architecture.js   # Script verifikasi otomatis integritas arsitektur
├── src/
│   ├── types/                   # Kontrak antarmuka data
│   │   ├── location.ts          # Koordinat, MapRegion, BoundingBox (Untuk Dilla)
│   │   ├── report.ts            # Report entity, DTO, Categories, Statuses
│   │   └── index.ts
│   ├── services/                # Abstraksi data I/O
│   │   ├── mockData.ts          # Dataset awal realistis bencana & fasilitas
│   │   ├── reportService.ts     # CRUD async service (isolasi I/O)
│   │   └── index.ts
│   ├── store/                   # State Management terpusat
│   │   ├── useReportStore.ts    # Zustand store dengan UDF & immutable updates
│   │   └── index.ts
│   ├── hooks/                   # Business Logic Hooks untuk UI
│   │   ├── useReports.ts        # Hook yang mengabstraksi store untuk Naila
│   │   └── index.ts
│   ├── components/              # Komponen Presentasional Murni
│   │   ├── CategoryBadge.tsx    # Badge kategori berdasar SDG 11
│   │   ├── StatusBadge.tsx      # Badge status siklus laporan
│   │   ├── ReportCard.tsx       # Kartu laporan warga
│   │   └── index.ts
│   └── app/                     # Halaman & Routing
│       ├── _layout.tsx          # Root Stack navigation
│       └── index.tsx            # Dashboard Civic Pulse
```

---

## 🤝 Panduan Integrasi Antar-Anggota

### Untuk Anggota 2: Naila (Lead Frontend & Performance Specialist)
1. **Gunakan Custom Hook**: Cukup import `useReports` dari `@/hooks/useReports`. Tidak perlu memanggil Zustand store secara langsung.
2. **Atomic Selectors**: Hook sudah menggunakan atomic selectors untuk meminimalkan re-render.
3. **Kustomisasi Komponen**: Komponen `ReportCard.tsx`, `CategoryBadge.tsx`, dan `StatusBadge.tsx` di `src/components/` dapat dipercantik styling dan animasinya tanpa perlu mengubah struktur state.

### Untuk Anggota 3: Dilla (Lead Hardware & Spatial/Network Engineer)
1. **Model Koordinat**: Gunakan `LocationCoordinate` dan `MapRegion` dari `@/types/location`.
2. **Sinkronisasi Marker Peta**:
   - Panggil `selectReport(id)` dari `useReports` saat user mengetuk marker pada `react-native-maps`.
   - Gunakan `selectedReport` untuk menampilkan bottom sheet atau callout detail laporan.
3. **Filter Spasial**: Ketika formula Haversine diimplementasikan pada Milestone 2, Dilla cukup memanggil `reports` dari store dan memfilternya berdasarkan jarak dari posisi GPS user.
