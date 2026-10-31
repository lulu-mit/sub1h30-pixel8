import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { TargetRaceEvent } from '../types/running';

interface RaceCountdownProps {
  races: TargetRaceEvent[];
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeRemaining(targetDateIso: string): TimeRemaining {
  const diffMs = Math.max(0, new Date(targetDateIso).getTime() - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/**
 * 1er Point de l'Accueil : Compte à Rebours Minimaliste avant la prochaine course
 * + Rappel sobre de l'objectif directeur "Sub-1h30 • Allure < 4'15/km".
 */
export const RaceCountdown: React.FC<RaceCountdownProps> = ({ races }) => {
  const [selectedRaceIndex, setSelectedRaceIndex] = useState<number>(0);
  const activeRace = races[selectedRaceIndex] ?? races[0];
  const [countdown, setCountdown] = useState<TimeRemaining>(() =>
    computeTimeRemaining(activeRace.targetDateIso)
  );

  useEffect(() => {
    setCountdown(computeTimeRemaining(activeRace.targetDateIso));
    const timer = setInterval(() => {
      setCountdown(computeTimeRemaining(activeRace.targetDateIso));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeRace.targetDateIso]);

  return (
    <View style={styles.card}>
      {/* Fil directeur sobre en haut de carte */}
      <View style={styles.topGoalStrip}>
        <View style={styles.goalDot} />
        <Text style={styles.goalStripText}>
          FIL DIRECTEUR : <Text style={styles.goalStripStrong}>OBJECTIF SUB-1H30 (ALLURE &lt; 4&apos;15/KM)</Text>
        </Text>
      </View>

      {/* Sélecteur minimaliste entre la prochaine course et l'objectif majeur */}
      <View style={styles.tabsRow}>
        {races.map((race, idx) => {
          const isSelected = idx === selectedRaceIndex;
          return (
            <Pressable
              key={race.id}
              onPress={() => setSelectedRaceIndex(idx)}
              style={[styles.raceTab, isSelected && styles.raceTabActive]}
            >
              <Text style={[styles.raceTabText, isSelected && styles.raceTabTextActive]}>
                {idx === 0 ? `Prochaine : ${race.name}` : `Majeur : ${race.name}`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Détails de l'échéance */}
      <View style={styles.raceMetaRow}>
        <View>
          <Text style={styles.raceTitle}>{activeRace.name}</Text>
          <Text style={styles.raceLocation}>
            {activeRace.location} • {activeRace.distanceKm} km
          </Text>
        </View>
        <View style={styles.paceBadge}>
          <Text style={styles.paceBadgeLabel}>ALLURE CIBLE</Text>
          <Text style={styles.paceBadgeValue}>{activeRace.targetPaceFormatted}</Text>
        </View>
      </View>

      {/* Compte à rebours épuré */}
      <View style={styles.timerGrid}>
        <View style={styles.timerBox}>
          <Text style={styles.timerDigits}>{String(countdown.days).padStart(2, '0')}</Text>
          <Text style={styles.timerUnit}>JOURS</Text>
        </View>

        <View style={styles.timerBox}>
          <Text style={styles.timerDigits}>{String(countdown.hours).padStart(2, '0')}</Text>
          <Text style={styles.timerUnit}>HEURES</Text>
        </View>

        <View style={styles.timerBox}>
          <Text style={styles.timerDigits}>{String(countdown.minutes).padStart(2, '0')}</Text>
          <Text style={styles.timerUnit}>MINUTES</Text>
        </View>

        <View style={styles.timerBox}>
          <Text style={[styles.timerDigits, { color: COLORS.accentCopper }]}>
            {String(countdown.seconds).padStart(2, '0')}
          </Text>
          <Text style={styles.timerUnit}>SEC</Text>
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
  topGoalStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  goalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentCopper,
    marginRight: 8,
  },
  goalStripText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  goalStripStrong: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 3,
    marginBottom: SPACING.md,
  },
  raceTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  raceTabActive: {
    backgroundColor: COLORS.surfaceElevated,
  },
  raceTabText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  raceTabTextActive: {
    color: COLORS.textPrimary,
  },
  raceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  raceTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
  },
  raceLocation: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
  },
  paceBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paceBadgeLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  paceBadgeValue: {
    color: COLORS.accentCopper,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timerGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  timerBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  timerDigits: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timerUnit: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: 4,
  },
});
