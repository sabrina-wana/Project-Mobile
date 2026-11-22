/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead System Architect: Sabrina (Anggota 1)
 *
 * Location & Spatial Types
 * Disiapkan untuk integrasi dengan modul LBS & Interactive Mapping Engine oleh Dilla (Anggota 3).
 */

/**
 * Koordinat geografis dasar (Latitude & Longitude)
 */
export interface LocationCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  address?: string; // Alamat terbaca (reverse geocoded)
}

/**
 * Representasi Region untuk Map View (kompatibel dengan react-native-maps)
 */
export interface MapRegion extends LocationCoordinate {
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * Batas area peta (Bounding Box) untuk query spasial / viewport filtering
 */
export interface BoundingBox {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
}

/**
 * Kontrak marker peta untuk Anggota 3 (Dilla)
 */
export interface ReportMapMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  category: string;
  status: string;
}
