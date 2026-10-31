import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { TelemetrySplitPoint } from '../types/running';

interface PerformanceComparatorProps {
  splits: TelemetrySplitPoint[];
}

/**
 * Module 3 : Comparateur de Performance (Prévu Google Doc vs Réalisé Garmin)
 * Courbes superposées comparant l'allure et la fréquence cardiaque réalisées
 * avec les cibles fixées dans le document (ex: Plafond EF strictement < 150 bpm).
 */
export const PerformanceComparator: React.FC<PerformanceComparatorProps> = ({ splits }) => {
  const width = 340;
  const height = 145;
  const padX = 16;
  const padY = 18;

  const minHr = 125;
  const maxHr = 180;

  const getCoord = (index: number, bpm: number) => {
    const x = padX + (index / Math.max(1, splits.length - 1)) * (width - padX * 2);
    const y =
      height -
      padY -
      ((bpm - minHr) / (maxHr - minHr)) * (height - padY * 2);
    return { x, y };
  };

  // Construction du chemin SVG pour la FC réalisée et la FC plafond cible
  const actualHrPath = splits
    .map((pt, i) => {
      const { x, y } = getCoord(i, pt.actualHeartRateBpm);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const targetHrPath = splits
    .map((pt, i) => {
      const { x, y } = getCoord(i, pt.targetMaxHeartRateBpm);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const efThresholdY = getCoord(0, 150).y;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>GARMIN FIT VS DOC &quot;PROJET SUB-1H30&quot;</Text>
          <Text style={styles.title}>Comparateur Prévu / Réalisé</Text>
        </View>
        <View style={styles.complianceBadge}>
          <Text style={styles.complianceText}>92% CIBLE</Text>
        </View>
      </View>

      {/* Graphique en courbes superposées */}
      <View style={styles.chartWrapper}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Ligne plafond EF stricte < 150 bpm */}
          <Line
            x1={padX}
            y1={efThresholdY}
            x2={width - padX}
            y2={efThresholdY}
            stroke={COLORS.neonCrimson}
            strokeWidth={1}
            strokeDasharray="4,4"
          />

          {/* Courbe Cible issue du Google Doc (Pointillés Néon Volt) */}
          <Path
            d={targetHrPath}
            stroke={COLORS.neonVolt}
            strokeWidth={2}
            strokeDasharray="5,4"
            fill="none"
          />

          {/* Courbe Réalisée issue de Garmin (Continue Néon Cyan) */}
          <Path
            d={actualHrPath}
            stroke={COLORS.neonCyan}
            strokeWidth={3}
            fill="none"
          />

          {/* Points de mesure + Alerte dépassement plafond EF */}
          {splits.map((pt, i) => {
            const { x, y } = getCoord(i, pt.actualHeartRateBpm);
            const isOverTarget = pt.actualHeartRateBpm > pt.targetMaxHeartRateBpm;
            return (
              <Circle
                key={pt.kilometer}
                cx={x}
                cy={y}
                r={isOverTarget ? 5 : 3.5}
                fill={isOverTarget ? COLORS.neonCrimson : COLORS.neonCyan}
              />
            );
          })}
        </Svg>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: COLORS.neonCyan }]} />
            <Text style={styles.legendLabel}>FC & Allure Garmin</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: COLORS.neonVolt }]} />
            <Text style={styles.legendLabel}>Cible Google Doc</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: COLORS.neonCrimson }]} />
            <Text style={styles.legendLabel}>Plafond EF 150 bpm</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  complianceBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  complianceText: {
    color: COLORS.neonVolt,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '800',
  },
  chartWrapper: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendLine: {
    width: 10,
    height: 3,
    borderRadius: 2,
    marginRight: 5,
  },
  legendLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
});
