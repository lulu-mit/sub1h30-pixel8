import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ActivityHistoryCard } from './src/components/ActivityHistoryCard';
import { GoalConvergenceCard } from './src/components/GoalConvergenceCard';
import { HealthDashboard } from './src/components/HealthDashboard';
import { MacrocyclePhases } from './src/components/MacrocyclePhases';
import { NextWorkoutCard } from './src/components/NextWorkoutCard';
import { PerformanceComparator } from './src/components/PerformanceComparator';
import { RaceCountdown } from './src/components/RaceCountdown';
import { RacePacingSimulator } from './src/components/RacePacingSimulator';
import { ShoeGarage } from './src/components/ShoeGarage';
import { UpcomingAgenda } from './src/components/UpcomingAgenda';
import {
  GARMIN_MOCK_HEALTH,
  GOAL_CONVERGENCE_DATA,
  RECENT_ACTIVITIES,
  SHOE_GARAGE_DATA,
  TELEMETRY_COMPARISON_SPLITS,
} from './src/services/garminService';
import {
  MACROCYCLE_PHASES_FROM_DOC,
  SEMI_PARIS_PACING_STRATEGIES,
  TARGET_RACES_FROM_DOC,
  UPCOMING_AGENDA_FROM_DOC,
} from './src/services/googleDocsParser';
import { COLORS, PIXEL_8_SPECS, SPACING } from './src/theme/theme';

type AppPage = 'home' | 'phases' | 'training' | 'shoes' | 'strategy';

/**
 * APEX // SUB-1H30 — Architecture Multi-Pages Minimaliste
 * Optimisée pour Google Pixel 8 (Dark Mode Carbone Mat)
 *
 * Page 1 (Accueil) :
 *   1. Countdown avant la prochaine course
 *   2. Prochaine séance
 *   3. Indicateur de performance / progression vers l'objectif Sub-1h30
 *   4. Synthèse Santé Garmin
 * Page 2 (Phases) : Macrocycle 22 semaines (5 Phases, phase actuelle, avancement & semaine type de chaque phase)
 * Page 3 (Séances) : Agenda complet, Comparateur Prévu/Réalisé & Historique
 * Page 4 (Chaussures) : Kilométrage, Utilité, Données techniques & Date estimée de fin de vie
 * Page 5 (Stratégie) : Simulateur de temps de passage Semi de Paris
 */
export default function App() {
  const [activePage, setActivePage] = useState<AppPage>('home');

  const pages: Array<{ id: AppPage; label: string; subtitle: string }> = [
    { id: 'home', label: 'Accueil', subtitle: 'SYNTHÈSE & PROGRESSION' },
    { id: 'phases', label: 'Phases', subtitle: 'MACROCYCLE 22 SEMAINES (5 PHASES)' },
    { id: 'training', label: 'Séances', subtitle: 'AGENDA & ANALYSE GARMIN' },
    { id: 'shoes', label: 'Chaussures', subtitle: 'PARC MATÉRIEL & LONGÉVITÉ' },
    { id: 'strategy', label: 'Course', subtitle: 'STRATÉGIE & TEMPS DE PASSAGE' },
  ];

  const currentMeta = pages.find((p) => p.id === activePage) ?? pages[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête minimaliste */}
        <View style={styles.appHeader}>
          <View>
            <Text style={styles.brandSubtitle}>{currentMeta.subtitle}</Text>
            <Text style={styles.brandTitle}>Sub-1h30 • Journal</Text>
          </View>
          <View style={styles.syncPill}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>Garmin × Docs</Text>
          </View>
        </View>

        {/* PAGE 1 : ACCUEIL (Ordre strict : 1. Countdown, 2. Prochaine séance, 3. Indicateur Objectif, 4. Santé) */}
        {activePage === 'home' && (
          <View>
            <RaceCountdown races={TARGET_RACES_FROM_DOC} />
            <NextWorkoutCard session={UPCOMING_AGENDA_FROM_DOC[0]} />
            <GoalConvergenceCard indicator={GOAL_CONVERGENCE_DATA} />
            <HealthDashboard data={GARMIN_MOCK_HEALTH} />
          </View>
        )}

        {/* PAGE 2 : PHASES DU MACROCYCLE (22 SEMAINES — 5 PHASES) */}
        {activePage === 'phases' && (
          <View>
            <MacrocyclePhases phases={MACROCYCLE_PHASES_FROM_DOC} />
          </View>
        )}

        {/* PAGE 3 : SÉANCES & ANALYSE */}
        {activePage === 'training' && (
          <View>
            <UpcomingAgenda sessions={UPCOMING_AGENDA_FROM_DOC} />
            <PerformanceComparator splits={TELEMETRY_COMPARISON_SPLITS} />
            <ActivityHistoryCard activities={RECENT_ACTIVITIES} />
          </View>
        )}

        {/* PAGE 3 : CHAUSSURES (Kilométrage, Utilité, Specs & Date où elles "rendront l'âme") */}
        {activePage === 'shoes' && (
          <View>
            <ShoeGarage shoes={SHOE_GARAGE_DATA} />
          </View>
        )}

        {/* PAGE 4 : STRATÉGIE COURSE */}
        {activePage === 'strategy' && (
          <View>
            <RacePacingSimulator strategies={SEMI_PARIS_PACING_STRATEGIES} />
          </View>
        )}
      </ScrollView>

      {/* Barre de navigation multi-pages fixe en bas de l'écran Pixel 8 */}
      <View style={styles.bottomTabBar}>
        {pages.map((page) => {
          const isActive = page.id === activePage;
          return (
            <Pressable
              key={page.id}
              onPress={() => setActivePage(page.id)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <View
                style={[
                  styles.tabIndicator,
                  isActive && { backgroundColor: COLORS.accentCopper },
                ]}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {page.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: PIXEL_8_SPECS.statusBarCutoutDp,
    paddingHorizontal: SPACING.md,
    paddingBottom: PIXEL_8_SPECS.bottomNavHeightDp + 24,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  brandSubtitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  brandTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentSage,
    marginRight: 6,
  },
  syncText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PIXEL_8_SPECS.bottomNavHeightDp,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {},
  tabIndicator: {
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
    marginBottom: 6,
  },
  tabLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});
