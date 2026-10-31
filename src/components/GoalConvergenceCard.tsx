import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { GoalConvergenceIndicator } from '../types/running';

interface GoalConvergenceCardProps {
  indicator: GoalConvergenceIndicator;
}

/**
 * 3e Point de l'Accueil : Indicateur de Performance & Progression vers l'Objectif Sub-1h30
 * "Indice de Convergence Sub-1h30" :
 * - Compare l'allure seuil actuelle (4'14"/km) à l'allure requise (4'15"/km)
 * - Calcule la marge chronométrique projetée sur 21,097 km (-22s sous 1h30)
 * - Évalue les 3 piliers physiologiques : Volume AS21, Stabilité Cardiaque (Pa:Hr) et Constance.
 */
export const GoalConvergenceCard: React.FC<GoalConvergenceCardProps> = ({ indicator }) => {
  const pillars = [
    indicator.metrics.specificPaceCompliance,
    indicator.metrics.aerobicStability,
    indicator.metrics.weeklyVolumeConsistency,
  ];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>INDICATEUR DE PROGRESSION OBJECTIF</Text>
          <Text style={styles.title}>Indice de Convergence Sub-1h30</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{indicator.overallScorePercent}% Prêt</Text>
        </View>
      </View>

      {/* Résumé Chrono Projeté vs Barrière 1h30 */}
      <View style={styles.summaryBanner}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>PROJECTION 21.1 KM</Text>
          <Text style={styles.summaryValue}>{indicator.estimatedHalfTime}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>ALLURE SEUIL ACTUELLE</Text>
          <Text style={[styles.summaryValue, { color: COLORS.accentCopper }]}>
            {indicator.currentThresholdPace}
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>MARGE SUR 1H30</Text>
          <Text style={[styles.summaryValue, { color: COLORS.accentSage }]}>
            {indicator.marginSecondsOn21Km} sec
          </Text>
        </View>
      </View>

      {/* Les 3 Piliers de Progression */}
      <View style={styles.pillarsContainer}>
        {pillars.map((pillar) => (
          <View key={pillar.label} style={styles.pillarRow}>
            <View style={styles.pillarHeader}>
              <Text style={styles.pillarLabel}>{pillar.label}</Text>
              <Text style={styles.pillarValues}>
                <Text style={styles.pillarCurrent}>{pillar.currentValue}</Text> / {pillar.targetValue}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${pillar.progressPercent}%`,
                    backgroundColor:
                      pillar.progressPercent >= 90 ? COLORS.accentSage : COLORS.accentCopper,
                  },
                ]}
              />
            </View>
          </View>
        ))}
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
    marginBottom: SPACING.md,
  },
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.9,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  scoreBadgeText: {
    color: COLORS.accentSage,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  summaryBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.md,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  pillarsContainer: {
    gap: 12,
  },
  pillarRow: {
    marginBottom: 2,
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pillarLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  pillarValues: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  pillarCurrent: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});
