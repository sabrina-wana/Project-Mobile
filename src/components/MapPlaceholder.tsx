/**
 * Civic Pulse & Community Disaster Management (SDG 11)
 * Lead Frontend & Performance Specialist: Naila (Anggota 2)
 *
 * MapPlaceholder Component
 * Area representasi peta visual interaktif (Placeholder).
 * Disiapkan khusus untuk integrasi react-native-maps, LBS engine, dan
 * Custom Marker spasial oleh Dilla (Anggota 3).
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Report } from '../types/report';

interface MapPlaceholderProps {
  totalPoints: number;
  selectedReport?: Report;
  onClearSelection?: () => void;
}

const MapPlaceholderComponent: React.FC<MapPlaceholderProps> = ({
  totalPoints,
  selectedReport,
  onClearSelection,
}) => {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  return (
    <View style={styles.container}>
      {/* Header Seksi Peta */}
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleIcon}>🗺️</Text>
          <View>
            <Text style={styles.title}>Peta Pantauan Spasial (GIS Hub)</Text>
            <Text style={styles.subtitle}>
              Kawasan Malang Raya (-7.9600, 112.6300)
            </Text>
          </View>
        </View>

        <View style={styles.badgeDilla}>
          <Text style={styles.badgeDillaText}>Area Kerja Dilla (A3)</Text>
        </View>
      </View>

      {/* Map Canvas Visual Area */}
      <View style={styles.canvas}>
        {/* Latar Belakang Garis Kisi Peta / Grid Simulation */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridLineHorizontal} />
          <View style={[styles.gridLineHorizontal, { top: '50%' }]} />
          <View style={[styles.gridLineHorizontal, { top: '75%' }]} />
          <View style={styles.gridLineVertical} />
          <View style={[styles.gridLineVertical, { left: '50%' }]} />
          <View style={[styles.gridLineVertical, { left: '75%' }]} />
        </View>

        {/* Simulasi Titik Marker Bencana & Fasilitas Warga */}
        <View style={[styles.markerPin, { top: '25%', left: '22%' }]}>
          <Text style={styles.markerEmoji}>🚧</Text>
        </View>
        <View style={[styles.markerPin, { top: '38%', left: '68%' }]}>
          <Text style={styles.markerEmoji}>🌊</Text>
        </View>
        <View style={[styles.markerPin, { top: '65%', left: '35%' }]}>
          <Text style={styles.markerEmoji}>⚠️</Text>
        </View>
        <View style={[styles.markerPin, { top: '60%', left: '80%' }]}>
          <Text style={styles.markerEmoji}>💡</Text>
        </View>

        {/* Radar Center Pulse / Compass */}
        <View style={styles.radarCenter}>
          <View style={styles.radarRing} />
          <View style={styles.radarDot} />
        </View>

        {/* Dummy Map Controls (Zoom buttons untuk feel GIS) */}
        <View style={styles.mapControls}>
          <View style={styles.controlButton}>
            <Text style={styles.controlButtonText}>+</Text>
          </View>
          <View style={[styles.controlButton, { marginTop: 4 }]}>
            <Text style={styles.controlButtonText}>−</Text>
          </View>
        </View>

        {/* Status Chip Titik Terpantau */}
        <View style={styles.pointsBadge}>
          <View style={styles.livePulse} />
          <Text style={styles.pointsBadgeText}>
            {totalPoints} Titik Laporan Terdeteksi
          </Text>
        </View>

        {/* Callout Detail Saat Ada Laporan yang Dipilih */}
        {selectedReport ? (
          <View style={styles.selectedCallout}>
            <View style={styles.calloutHeader}>
              <Text style={styles.calloutBadge}>🎯 FOKUS SPASIAL</Text>
              {onClearSelection && (
                <TouchableOpacity
                  onPress={onClearSelection}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Tutup fokus laporan"
                  style={styles.calloutClose}
                >
                  <Text style={styles.calloutCloseText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.calloutTitle} numberOfLines={1}>
              {selectedReport.title}
            </Text>
            <Text style={styles.calloutLocation} numberOfLines={1}>
              📍 {selectedReport.location.address || 'Koordinat Lapangan'}
            </Text>
            <Text style={styles.calloutCoords}>
              Lat: {selectedReport.location.latitude.toFixed(4)} | Lng:{' '}
              {selectedReport.location.longitude.toFixed(4)}
            </Text>
          </View>
        ) : (
          <View style={styles.defaultCallout}>
            <Text style={styles.defaultCalloutText}>
              Ketuk salah satu kartu laporan untuk memusatkan titik pada peta
            </Text>
          </View>
        )}
      </View>

      {/* Footer Info Integrasi Dilla */}
      <View style={styles.footerNote}>
        <Text style={styles.footerIcon}>ℹ️</Text>
        <Text style={[styles.footerText, isCompact && styles.footerTextCompact]}>
          Placeholder peta ini siap dihubungkan ke modul{' '}
          <Text style={styles.footerHighlight}>react-native-maps</Text>,{' '}
          <Text style={styles.footerHighlight}>GPS Geolocation</Text>, &{' '}
          <Text style={styles.footerHighlight}>Haversine Geofencing</Text> oleh
          Dilla pada Pertemuan 9/10.
        </Text>
      </View>
    </View>
  );
};

export const MapPlaceholder = React.memo(MapPlaceholderComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FAFAFC',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  badgeDilla: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  badgeDillaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
  },
  canvas: {
    height: 180,
    backgroundColor: '#0F172A',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '25%',
    height: 1,
    backgroundColor: '#38BDF8',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: 1,
    backgroundColor: '#38BDF8',
  },
  radarCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
  },
  radarDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
  },
  markerPin: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerEmoji: {
    fontSize: 14,
  },
  mapControls: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  controlButton: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  pointsBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  pointsBadgeText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '600',
  },
  selectedCallout: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#0284C7',
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  calloutBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  calloutClose: {
    padding: 2,
  },
  calloutCloseText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  calloutLocation: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
  calloutCoords: {
    fontSize: 9,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  defaultCallout: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  defaultCalloutText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  footerText: {
    fontSize: 10,
    color: '#64748B',
    flex: 1,
    lineHeight: 14,
  },
  footerTextCompact: {
    fontSize: 9,
  },
  footerHighlight: {
    fontWeight: '700',
    color: '#0F172A',
  },
});
