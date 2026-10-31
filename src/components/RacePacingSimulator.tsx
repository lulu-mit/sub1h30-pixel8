import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { RaceStrategyPlan } from '../types/running';

interface RacePacingSimulatorProps {
  strategies: RaceStrategyPlan[];
}

/**
 * Module 9 : Simulateur de Pacing & Temps de Passage (Semi de Paris 21.097 km)
 * Permet de basculer entre :
 * 1. Ajusté au D+ (GAP Côte de Gravelle / Bois de Vincennes)
 * 2. Negative Split (4'18" -> 4'11"/km)
 * 3. Métronome (4'14"/km constant)
 */
export const RacePacingSimulator: React.FC<RacePacingSimulatorProps> = ({ strategies }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeStrategy = strategies[selectedIdx] ?? strategies[0];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>STRATÉGIE JOUR J • SEMI DE PARIS</Text>
          <Text style={styles.title}>Simulateur Pacing & D+ (GAP)</Text>
        </View>
        <View style={styles.finishBadge}>
          <Text style={styles.finishLabel}>TEMPS FINAL</Text>
          <Text style={styles.finishValue}>{activeStrategy.finishTimeFormatted}</Text>
        </View>
      </View>

      {/* Sélecteur de stratégie */}
      <View style={styles.strategyTabs}>
        {strategies.map((strat, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <Pressable
              key={strat.strategyId}
              onPress={() => setSelectedIdx(idx)}
              style={[styles.strategyTab, isSelected && styles.strategyTabActive]}
            >
              <Text style={[styles.strategyTabText, isSelected && styles.strategyTabTextActive]}>
                {strat.strategyName}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.strategyDescription}>{activeStrategy.description}</Text>

      {/* Résumé 1er Semi vs 2e Semi */}
      <View style={styles.halvesSummaryRow}>
        <View style={styles.halfBox}>
          <Text style={styles.halfLabel}>PASSAGE AU KM 10.55</Text>
          <Text style={styles.halfValue}>{activeStrategy.firstHalfSplit}</Text>
        </View>
        <View style={styles.halfBox}>
          <Text style={styles.halfLabel}>DEUXIÈME MOITIÉ</Text>
          <Text style={[styles.halfValue, { color: COLORS.neonVolt }]}>
            {activeStrategy.secondHalfSplit}
          </Text>
        </View>
      </View>

      {/* Tableau des temps de passage par tranche de 5 km */}
      {activeStrategy.checkpoints.map((cp) => (
        <View key={cp.segmentLabel} style={styles.checkpointRow}>
          <View style={styles.checkpointTop}>
            <Text style={styles.segmentTitle}>{cp.segmentLabel}</Text>
            <Text
              style={[
                styles.elevationPill,
                {
                  color: cp.elevationDeltaM > 15 ? COLORS.neonAmber : COLORS.neonEmerald,
                },
              ]}
            >
              {cp.elevationDeltaM >= 0 ? `+${cp.elevationDeltaM}m D+` : `${cp.elevationDeltaM}m D-`}
            </Text>
          </View>

          <View style={styles.checkpointMetrics}>
            <View>
              <Text style={styles.cpMetaLabel}>ALLURE CIBLE</Text>
              <Text style={styles.cpPaceValue}>{cp.targetPaceFormatted}</Text>
            </View>
            <View>
              <Text style={styles.cpMetaLabel}>TEMPS CUMULÉ</Text>
              <Text style={styles.cpTimeValue}>{cp.cumulativeTimeFormatted}</Text>
            </View>
            <View>
              <Text style={styles.cpMetaLabel}>ZONE CARDIO</Text>
              <Text style={styles.cpHrValue}>{cp.targetHrZone}</Text>
            </View>
          </View>

          {cp.nutritionCue ? (
            <View style={styles.nutritionBanner}>
              <Text style={styles.nutritionText}>⚡ RAVITO : {cp.nutritionCue}</Text>
            </View>
          ) : null}
        </View>
      ))}
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
  finishBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderGlow,
    alignItems: 'flex-end',
  },
  finishLabel: {
    color: COLORS.textMuted,
    fontSize: 8,
    fontWeight: '700',
  },
  finishValue: {
    color: COLORS.neonVolt,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  strategyTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  strategyTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 9,
  },
  strategyTabActive: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  strategyTabText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  strategyTabTextActive: {
    color: COLORS.neonCyan,
  },
  strategyDescription: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  halvesSummaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  halfBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  halfLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  halfValue: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '900',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  checkpointRow: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkpointTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  segmentTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  elevationPill: {
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  checkpointMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cpMetaLabel: {
    color: COLORS.textMuted,
    fontSize: 8,
    fontWeight: '700',
  },
  cpPaceValue: {
    color: COLORS.neonVolt,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '900',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  cpTimeValue: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '800',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  cpHrValue: {
    color: COLORS.neonCyan,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  nutritionBanner: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nutritionText: {
    color: COLORS.neonPurple,
    fontSize: 10,
    fontWeight: '700',
  },
});
