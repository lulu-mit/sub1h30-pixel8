import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { PlannedWorkoutSession } from '../types/running';

interface NextWorkoutCardProps {
  session: PlannedWorkoutSession;
}

/**
 * 2e Point de l'Accueil : La Prochaine Séance (extraite du Google Doc)
 * Présentation minimaliste et structurée : Date, Phase, Détail du bloc, Allure cible & Chaussure conseillée.
 */
export const NextWorkoutCard: React.FC<NextWorkoutCardProps> = ({ session }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>PROCHAINE SÉANCE • AGENDA GOOGLE DOC</Text>
          <Text style={styles.dateLabel}>{session.dateLabel}</Text>
        </View>
        <View style={styles.phasePill}>
          <Text style={styles.phaseText}>{session.phase}</Text>
        </View>
      </View>

      <Text style={styles.workoutTitle}>{session.title}</Text>

      {session.structureDetail ? (
        <Text style={styles.structureDescription}>{session.structureDetail}</Text>
      ) : null}

      {/* Métriques clés de la séance */}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>DISTANCE</Text>
          <Text style={styles.metricValue}>{session.targetDistanceKm.toFixed(1)} km</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>ALLURE CIBLE</Text>
          <Text style={[styles.metricValue, { color: COLORS.accentCopper }]}>
            {session.targetPaceRange}
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>PLAFOND CARDIO</Text>
          <Text style={styles.metricValue}>
            {session.hrCapBpm ? `< ${session.hrCapBpm} bpm` : session.recoveryTarget}
          </Text>
        </View>
      </View>

      {/* Pied de carte : Consigne récup & rotation chaussure */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Consigne : {session.recoveryTarget}</Text>
        {session.recommendedShoeModel ? (
          <Text style={styles.shoeRecommendation}>👟 {session.recommendedShoeModel}</Text>
        ) : null}
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.9,
  },
  dateLabel: {
    color: COLORS.accentSteel,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  phasePill: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  phaseText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  workoutTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    marginBottom: 6,
  },
  structureDescription: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 19,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  metricLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 3,
  },
  metricValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  shoeRecommendation: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
});
