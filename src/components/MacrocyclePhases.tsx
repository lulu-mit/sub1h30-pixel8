import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { MacrocyclePhase } from '../types/running';

interface MacrocyclePhasesProps {
  phases: MacrocyclePhase[];
}

/**
 * Page dédiée au Macrocycle (22 Semaines — 5 Phases)
 * Affiche :
 * 1. La position exacte aujourd'hui dans le plan global (Semaine 4/22) et dans la phase active (Phase 2 : Développement & Force)
 * 2. Une frise chronologique interactive des 5 phases
 * 3. Le détail complet de toutes les phases (statut, dates, objectifs, allures cibles, semaine type et échéances)
 */
export const MacrocyclePhases: React.FC<MacrocyclePhasesProps> = ({ phases }) => {
  const currentPhase = phases.find((p) => p.status === 'current') ?? phases[1];
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | 'all'>('all');

  const getStatusStyle = (status: MacrocyclePhase['status']) => {
    if (status === 'completed') {
      return {
        color: COLORS.accentSage,
        bg: 'rgba(52, 211, 153, 0.12)',
        border: 'rgba(52, 211, 153, 0.35)',
        label: 'TERMINÉE ✓',
      };
    }
    if (status === 'current') {
      return {
        color: COLORS.accentCopper,
        bg: 'rgba(217, 119, 87, 0.15)',
        border: COLORS.accentCopper,
        label: 'EN COURS ● SEMAINE 1/8',
      };
    }
    return {
      color: COLORS.textMuted,
      bg: COLORS.surfaceElevated,
      border: COLORS.border,
      label: 'À VENIR',
    };
  };

  const displayedPhases =
    selectedPhaseId === 'all'
      ? phases
      : phases.filter((p) => p.id === selectedPhaseId);

  return (
    <View style={styles.container}>
      {/* 1. CARTE DE POSITIONNEMENT ACTUEL DANS LE MACROCYCLE (22 SEMAINES) */}
      <View style={[styles.card, styles.spotlightCard]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>POSITION ACTUELLE • 31 OCT. 2026</Text>
            <Text style={styles.mainTitle}>
              Phase {currentPhase.phaseNumber}/5 : {currentPhase.name}
            </Text>
          </View>
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>Sem. 4 / 22</Text>
          </View>
        </View>

        <Text style={styles.spotlightObjective}>{currentPhase.objective}</Text>

        {/* Barre de progression dans la Phase 2 actuelle */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>
              Avancement Phase 2 ({currentPhase.dateRangeLabel})
            </Text>
            <Text style={styles.progressValue}>
              Jour 6 / 56 • {currentPhase.progressPercent}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${currentPhase.progressPercent}%` },
              ]}
            />
          </View>
        </View>

        {/* Frise chronologique des 5 Phases (proportionnelle aux 22 semaines) */}
        <View style={styles.timelineWrapper}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineLabel}>
              FRISE DU MACROCYCLE (5 OCT. 2026 → 7 MARS 2027)
            </Text>
            <Text style={styles.timelinePct}>18% du plan total</Text>
          </View>

          <View style={styles.segmentedBar}>
            {phases.map((p) => {
              const isCurrent = p.status === 'current';
              const isDone = p.status === 'completed';
              return (
                <Pressable
                  key={p.id}
                  onPress={() =>
                    setSelectedPhaseId(selectedPhaseId === p.id ? 'all' : p.id)
                  }
                  style={[
                    styles.segmentBlock,
                    { flex: p.durationWeeks },
                    isDone && styles.segmentDone,
                    isCurrent && styles.segmentCurrent,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      (isDone || isCurrent) && styles.segmentTextActive,
                    ]}
                  >
                    P{p.phaseNumber}
                  </Text>
                  <Text style={styles.segmentWeeks}>{p.durationWeeks}s</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Filtre rapide par phase */}
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setSelectedPhaseId('all')}
            style={[
              styles.filterChip,
              selectedPhaseId === 'all' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedPhaseId === 'all' && styles.filterChipTextActive,
              ]}
            >
              Toutes (5)
            </Text>
          </Pressable>
          {phases.map((p) => {
            const active = selectedPhaseId === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelectedPhaseId(p.id)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  P{p.phaseNumber} {p.status === 'current' ? '●' : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 2. LISTE DÉTAILLÉE DES 5 PHASES DU GOOGLE DOC */}
      {displayedPhases.map((phase) => {
        const st = getStatusStyle(phase.status);
        const isCurrent = phase.status === 'current';

        return (
          <View
            key={phase.id}
            style={[
              styles.card,
              isCurrent && {
                borderColor: COLORS.accentCopper,
                borderWidth: 1.5,
              },
            ]}
          >
            {/* En-tête de la Phase */}
            <View style={styles.phaseHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.phaseMeta}>
                  PHASE {phase.phaseNumber} • {phase.weekRangeLabel.toUpperCase()} ({phase.durationWeeks} SEM.)
                </Text>
                <Text style={styles.phaseTitle}>{phase.name}</Text>
                <Text style={styles.phaseDates}>{phase.dateRangeLabel}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: st.bg, borderColor: st.border },
                ]}
              >
                <Text style={[styles.statusBadgeText, { color: st.color }]}>
                  {st.label}
                </Text>
              </View>
            </View>

            {/* Objectif de la phase */}
            <View style={styles.objectiveBox}>
              <Text style={styles.objectiveLabel}>OBJECTIF DE LA PHASE</Text>
              <Text style={styles.objectiveText}>{phase.objective}</Text>
            </View>

            {/* Cibles Volume & Allures */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiLabel}>VOLUME HEBDO</Text>
                <Text style={styles.kpiValue}>{phase.volumeTargetKm}</Text>
              </View>
              <View style={[styles.kpiBox, { flex: 1.4 }]}>
                <Text style={styles.kpiLabel}>ALLURES & ZONES CLÉS</Text>
                <Text style={[styles.kpiValue, { color: COLORS.accentCopper }]}>
                  {phase.keyPacesLabel}
                </Text>
              </View>
            </View>

            {/* Contenu / Semaine type de la phase */}
            <Text style={styles.sectionSubheader}>
              CONTENU TYPE DE LA PHASE (DOC PROJET SUB-1H30)
            </Text>
            <View style={styles.workoutsList}>
              {phase.typicalWeek.map((w, idx) => (
                <View key={idx} style={styles.workoutRow}>
                  <View style={styles.workoutTopLine}>
                    <Text style={styles.workoutDay}>{w.day}</Text>
                    <Text style={styles.workoutFocus}>{w.focus}</Text>
                  </View>
                  <Text style={styles.workoutDetail}>{w.detail}</Text>
                  {w.shoe && (
                    <Text style={styles.workoutShoe}>Chaussure : {w.shoe}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Bilan ou Échéance clé */}
            <View
              style={[
                styles.milestoneFooter,
                { borderLeftColor: st.color },
              ]}
            >
              <Text style={styles.milestoneText}>
                {phase.milestoneOrSummary}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  spotlightCard: {
    borderColor: COLORS.borderSubtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  eyebrow: {
    color: COLORS.accentCopper,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  mainTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 2,
  },
  weekBadge: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  weekBadgeText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  spotlightObjective: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  progressSection: {
    marginBottom: SPACING.md,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  progressValue: {
    color: COLORS.accentCopper,
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 7,
    backgroundColor: COLORS.background,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accentCopper,
    borderRadius: 999,
  },
  timelineWrapper: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timelineLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  timelinePct: {
    color: COLORS.accentSage,
    fontSize: 10,
    fontWeight: '700',
  },
  segmentedBar: {
    flexDirection: 'row',
    gap: 4,
  },
  segmentBlock: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentDone: {
    backgroundColor: 'rgba(52, 211, 153, 0.16)',
    borderColor: COLORS.accentSage,
  },
  segmentCurrent: {
    backgroundColor: 'rgba(217, 119, 87, 0.22)',
    borderColor: COLORS.accentCopper,
  },
  segmentText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: COLORS.textPrimary,
  },
  segmentWeeks: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.accentCopper,
  },
  filterChipText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.textPrimary,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  phaseMeta: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  phaseTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  phaseDates: {
    color: COLORS.accentSteel,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  objectiveBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  objectiveLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 3,
  },
  objectiveText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 17,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kpiLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 3,
  },
  kpiValue: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionSubheader: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  workoutsList: {
    gap: 6,
    marginBottom: SPACING.sm,
  },
  workoutRow: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workoutTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  workoutDay: {
    color: COLORS.accentCopper,
    fontSize: 11,
    fontWeight: '700',
  },
  workoutFocus: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  workoutDetail: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  workoutShoe: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
    fontStyle: 'italic',
  },
  milestoneFooter: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
  },
  milestoneText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
});
