import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { PlannedWorkoutSession } from '../types/running';

interface UpcomingAgendaProps {
  sessions: PlannedWorkoutSession[];
}

/**
 * Module 5 : Agenda et Séances à Venir
 * Liste chronologique extraite du Google Doc affichant les prochains entraînements
 * (Phase de développement, VMA, Sortie longue) et leurs objectifs chiffrés.
 */
export const UpcomingAgenda: React.FC<UpcomingAgendaProps> = ({ sessions }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>PLANNING EXTRAIT DU GOOGLE DOC</Text>
      <Text style={styles.title}>Agenda & Séances à Venir</Text>

      {sessions.map((session) => (
        <View key={session.id} style={styles.sessionItem}>
          <View style={styles.topRow}>
            <Text style={styles.dateLabel}>{session.dateLabel}</Text>
            <View style={styles.phaseBadge}>
              <Text style={styles.phaseText}>{session.phase.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.sessionTitle}>{session.title}</Text>

          <View style={styles.targetsGrid}>
            <View style={styles.targetPill}>
              <Text style={styles.targetLabel}>VOLUME</Text>
              <Text style={styles.targetValue}>{session.targetDistanceKm} km</Text>
            </View>
            <View style={styles.targetPill}>
              <Text style={styles.targetLabel}>ALLURE CIBLE</Text>
              <Text style={[styles.targetValue, { color: COLORS.neonVolt }]}>
                {session.targetPaceRange}
              </Text>
            </View>
            <View style={styles.targetPill}>
              <Text style={styles.targetLabel}>RÉCUP / CONSIGNE</Text>
              <Text style={[styles.targetValue, { color: COLORS.neonCyan }]}>
                {session.recoveryTarget}
              </Text>
            </View>
          </View>
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
    marginBottom: SPACING.md,
  },
  sessionItem: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 16,
    padding: 14,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
  },
  phaseBadge: {
    backgroundColor: 'rgba(179, 136, 255, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  phaseText: {
    color: COLORS.neonPurple,
    fontSize: 10,
    fontWeight: '800',
  },
  sessionTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    marginBottom: 10,
  },
  targetsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  targetPill: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 10,
  },
  targetLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  targetValue: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
});
