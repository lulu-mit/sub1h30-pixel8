/**
 * Modèles de données — Version Minimaliste Multi-Pages
 */

export interface GarminDailyHealth {
  date: string;
  steps: number;
  stepsGoal: number;
  sleepScore: number;
  sleepDurationMinutes: number;
  remPercentage: number;
  deepSleepPercentage: number;
  restingHeartRateBpm: number;
  hrvStatusMs: number;
  bodyBattery: number;
}

export interface TelemetrySplitPoint {
  kilometer: number;
  actualPaceSecPerKm: number;
  targetPaceSecPerKm: number;
  actualHeartRateBpm: number;
  targetMaxHeartRateBpm: number;
}

export interface RunningActivity {
  id: string;
  title: string;
  dateIso: string;
  distanceKm: number;
  durationFormatted: string;
  avgPaceFormatted: string;
  elevationGainM: number;
  avgHeartRateBpm: number;
  maxHeartRateBpm: number;
  paceSparklineSec: number[];
  googleDocRawNotes: string;
  synthesizedKeywords: [string, string, string];
  shoeId: string;
}

export interface TargetRaceEvent {
  id: string;
  name: string;
  location: string;
  targetDateIso: string;
  distanceKm: number;
  targetTimeFormatted: string;
  targetPaceFormatted: string;
  isPrimaryGoal?: boolean;
}

export interface PlannedWorkoutSession {
  id: string;
  dateLabel: string;
  phase: 'Développement' | 'VMA Courte' | 'Seuil Sub-1h30' | 'Sortie Longue' | 'Endurance Fondamentale';
  title: string;
  structureDetail?: string;
  targetDistanceKm: number;
  targetDurationMin?: number;
  targetPaceRange: string;
  recoveryTarget: string;
  hrCapBpm?: number;
  recommendedShoeModel?: string;
}

/**
 * Indicateur de Performance & Convergence vers l'Objectif Sub-1h30
 * Déterminé sur 3 axes : Allure Seuil Actuelle vs 4'15"/km, Stabilité Cardiaque et Volume Spécifique
 */
export interface GoalConvergenceIndicator {
  overallScorePercent: number;       // Ex: 84% de convergence vers 1h29m35s
  estimatedHalfTime: string;         // Ex: "1h 29m 38s"
  currentThresholdPace: string;      // Ex: "4'14\"/km"
  targetRacePace: string;            // "4'15\"/km"
  marginSecondsOn21Km: number;       // Ex: -22s sous la barre des 1h30
  metrics: {
    specificPaceCompliance: {
      label: string;
      currentValue: string;
      targetValue: string;
      progressPercent: number;
    };
    aerobicStability: {
      label: string;
      currentValue: string;
      targetValue: string;
      progressPercent: number;
    };
    weeklyVolumeConsistency: {
      label: string;
      currentValue: string;
      targetValue: string;
      progressPercent: number;
    };
  };
}

export interface ShoeEfficiencyMetrics {
  avgHrAtTargetPaceBpm: number;
  hrSavingsVsBaselineBpm: number;
  groundContactTimeMs: number;
  strideLengthMeters: number;
  energyReturnScore: number;
}

/**
 * Modèle enrichi pour la page dédiée aux Chaussures :
 * Kilométrage, Utilité précise, Données techniques et Estimation de la date où elles "rendront l'âme"
 */
export interface RunningShoe {
  id: string;
  brand: string;
  model: string;
  category: 'Daily Trainer' | 'Tempo / Plaque Nylon' | 'Trail Technique';
  primaryUtility: string;           // Ex: "Sorties longues, footing de récupération & EF (< 150 bpm)"
  recommendedSessions: string;      // Ex: "EF, Sortie longue progressive"
  foamTechnology: string;           // Ex: "ZoomX + Cushlon 3.0" / "PWRRUN PB + Plaque Nylon"
  currentDistanceKm: number;
  maxLifespanKm: number;
  weeklyUsageKm: number;            // Kilométrage hebdomadaire moyen sur cette paire
  purchaseDateLabel: string;        // Date de mise en service
  dropMm: number;
  weightGrams: number;
  efficiency: ShoeEfficiencyMetrics;
}

export type PacingStrategyType = 'negative_split' | 'even_pace' | 'gap_adjusted';

export interface RaceSplitCheckpoint {
  segmentLabel: string;
  elevationDeltaM: number;
  targetPaceFormatted: string;
  cumulativeTimeFormatted: string;
  targetHrZone: string;
  nutritionCue?: string;
}

export interface RaceStrategyPlan {
  strategyId: PacingStrategyType;
  strategyName: string;
  description: string;
  finishTimeFormatted: string;
  firstHalfSplit: string;
  secondHalfSplit: string;
  checkpoints: RaceSplitCheckpoint[];
}

export type MacrocyclePhaseStatus = 'completed' | 'current' | 'upcoming';

export interface MacrocycleWorkoutTemplate {
  day: string;
  focus: string;
  detail: string;
  shoe?: string;
}

export interface MacrocyclePhase {
  id: string;
  phaseNumber: number;
  name: string;
  shortName: string;
  dateRangeLabel: string;
  startDateIso: string;
  endDateIso: string;
  durationWeeks: number;
  weekRangeLabel: string;
  status: MacrocyclePhaseStatus;
  progressPercent: number;
  objective: string;
  volumeTargetKm: string;
  keyPacesLabel: string;
  typicalWeek: MacrocycleWorkoutTemplate[];
  milestoneOrSummary: string;
  completedSessionsCount?: number;
}
