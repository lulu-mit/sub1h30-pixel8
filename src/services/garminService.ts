import {
  GarminDailyHealth,
  GoalConvergenceIndicator,
  RunningActivity,
  RunningShoe,
  TelemetrySplitPoint,
} from '../types/running';
import { extractKeywordsFromDocNotes } from './googleDocsParser';

/**
 * Calcule la date estimée à laquelle une chaussure "rendra l'âme" (atteindra son kilométrage max)
 * à partir de son kilométrage restant et de son utilisation hebdomadaire moyenne.
 */
export function estimateShoeEndOfLife(shoe: RunningShoe, referenceDate = new Date('2026-10-31')): {
  remainingKm: number;
  weeksRemaining: number;
  estimatedDeathDateFormatted: string;
  willSurviveParisHalf: boolean; // Semi de Paris : 7 mars 2027
} {
  const remainingKm = Math.max(0, shoe.maxLifespanKm - shoe.currentDistanceKm);
  const weeklyKm = Math.max(1, shoe.weeklyUsageKm);
  const weeksRemaining = remainingKm / weeklyKm;
  const daysRemaining = Math.round(weeksRemaining * 7);

  const deathDate = new Date(referenceDate.getTime() + daysRemaining * 24 * 3600 * 1000);
  const parisHalfDate = new Date('2027-03-07T08:00:00+01:00');

  const monthsFr = [
    'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
  ];
  const formatted = `${deathDate.getDate()} ${monthsFr[deathDate.getMonth()]} ${deathDate.getFullYear()}`;

  return {
    remainingKm,
    weeksRemaining: Math.round(weeksRemaining * 10) / 10,
    estimatedDeathDateFormatted: formatted,
    willSurviveParisHalf: deathDate.getTime() >= parisHalfDate.getTime(),
  };
}

/**
 * Indicateur de Performance & Progression vers l'Objectif Sub-1h30 (< 4'15"/km)
 * Calibré sur les vraies données de Lubin Queyroi ("Projet Sub-1h30" + Garmin Run in Lyon) :
 * - Point de départ (Run in Lyon 4 oct. 2026) : 1h 37m 38s (4'37"/km)
 * - Seuil lactique actuel (Brassard Coros) : 4'25"/km @ 189 bpm -> Cible Fév : 4'05"-4'10"/km
 * - EF Zone 2 (139-154 bpm) : passée de 7'15"/km (11 oct) à 6'37"/km (19 oct) -> Cible : 5'45"-6'00"/km
 * - Volume hebdomadaire : montée de 30 km/sem vers 50-55 km/sem (Phase 2 : Développement & Force)
 */
export const GOAL_CONVERGENCE_DATA: GoalConvergenceIndicator = {
  overallScorePercent: 64,
  estimatedHalfTime: '1h 34m 50s',
  currentThresholdPace: '4\'25"/km',
  targetRacePace: '< 4\'15"/km',
  marginSecondsOn21Km: +290, // Il reste 4m50s (sur 7m38s initiaux) à gagner d'ici le 7 mars 2027
  metrics: {
    specificPaceCompliance: {
      label: 'Seuil Lactique @ 189 bpm (Départ 4\'25" → Cible 4\'08"/km)',
      currentValue: '4\'25"/km',
      targetValue: '4\'05" - 4\'10"/km',
      progressPercent: 58,
    },
    aerobicStability: {
      label: 'Rendement EF Zone 2 < 154 bpm (7\'15" → 6\'37"/km)',
      currentValue: '6\'37"/km',
      targetValue: '5\'45" - 6\'00"/km',
      progressPercent: 68,
    },
    weeklyVolumeConsistency: {
      label: 'Montée en Charge Phase 2 (4 Courses + 3 Basic-Fit)',
      currentValue: '32.0 km/sem',
      targetValue: '50 - 55 km/sem',
      progressPercent: 62,
    },
  },
};

/**
 * Santé Garmin réelle du 31 octobre 2026 (extraite d'Intervals.icu i778652)
 * - Sommeil : 32 520 s = 9h02m (542 min)
 * - FC au repos : 51 bpm
 * - SpO2 : 96.8 %
 * - Ratio de charge ACWR : ATL (13.95) / CTL (11.56) = 1.21
 */
export const GARMIN_MOCK_HEALTH: GarminDailyHealth = {
  date: '2026-10-31',
  steps: 10450,
  stepsGoal: 12000,
  sleepScore: 92,
  sleepDurationMinutes: 542, // 9h02 réelles sur Garmin la nuit du 31 oct !
  remPercentage: 24,
  deepSleepPercentage: 22,
  restingHeartRateBpm: 51,   // 51 bpm réels ce matin sur Garmin Forerunner 255
  hrvStatusMs: 85,           // 85 ms RMSSD (réf Journal d'entraînement)
  bodyBattery: 94,
};

/**
 * Comparaison Prévu (Google Doc Zone 2 : 139-154 bpm, cible 150 bpm) vs Réalisé (Garmin)
 * Basée sur les sorties réelles d'octobre de Lubin (Marsaz 144 bpm, Quais de Saône 152 bpm, Côtes 161 bpm)
 */
export const TELEMETRY_COMPARISON_SPLITS: TelemetrySplitPoint[] = [
  { kilometer: 1, actualPaceSecPerKm: 412, targetPaceSecPerKm: 400, actualHeartRateBpm: 141, targetMaxHeartRateBpm: 154 },
  { kilometer: 2, actualPaceSecPerKm: 402, targetPaceSecPerKm: 400, actualHeartRateBpm: 146, targetMaxHeartRateBpm: 154 },
  { kilometer: 3, actualPaceSecPerKm: 398, targetPaceSecPerKm: 395, actualHeartRateBpm: 149, targetMaxHeartRateBpm: 154 },
  { kilometer: 4, actualPaceSecPerKm: 395, targetPaceSecPerKm: 395, actualHeartRateBpm: 151, targetMaxHeartRateBpm: 154 },
  { kilometer: 5, actualPaceSecPerKm: 396, targetPaceSecPerKm: 395, actualHeartRateBpm: 152, targetMaxHeartRateBpm: 154 },
  { kilometer: 6, actualPaceSecPerKm: 394, targetPaceSecPerKm: 395, actualHeartRateBpm: 153, targetMaxHeartRateBpm: 154 },
  { kilometer: 7, actualPaceSecPerKm: 391, targetPaceSecPerKm: 395, actualHeartRateBpm: 156, targetMaxHeartRateBpm: 154 },
];

/**
 * Activités réelles de Lubin extraites du Google Doc "Journal d'entraînement" + Garmin Intervals.icu
 */
export const RECENT_ACTIVITIES: RunningActivity[] = [
  {
    id: 'i204127046',
    title: 'Côtes (Montée St Barthélémy) : 25\' EF + 2×8×45s',
    dateIso: 'Mardi 27 Oct • Phase 2',
    distanceKm: 11.06, // 11.056 km Garmin (dont 5.75 km bloc spécifique)
    durationFormatted: '1h 09m 45s',
    avgPaceFormatted: '6\'19"/km',
    elevationGainM: 145,
    avgHeartRateBpm: 161,
    maxHeartRateBpm: 192,
    paceSparklineSec: [410, 402, 365, 355, 360, 395, 352, 348, 355, 405],
    googleDocRawNotes:
      'Séance Côte (25min EF + 2x8x45s + 10min recup). Température douce (21°C). Impact aérobie de 4.6 (Tempo) et anaérobie de 3.3. Cadence moyenne à 162 spm.',
    synthesizedKeywords: ['Impact Aérobie 4.6', 'Force Côtes (3.3)', 'FC Max 192 bpm'],
    shoeId: 'shoe-saucony-speed5',
  },
  {
    id: 'i204126993',
    title: 'Lyon Quais de Saône — EF 45 min (Zone 2)',
    dateIso: 'Lundi 19 Oct • Phase 1',
    distanceKm: 7.31,
    durationFormatted: '48m 22s',
    avgPaceFormatted: '6\'37"/km',
    elevationGainM: 12,
    avgHeartRateBpm: 152,
    maxHeartRateBpm: 161,
    paceSparklineSec: [405, 399, 397, 396, 395, 397, 394],
    googleDocRawNotes:
      'Sortie EF sur les quais de Saône sous la pluie (11°C). Progression notable de l\'allure (6\'37/km contre 7\'01/km le 13 oct.) pour un coût cardiaque identique. Valide le plafond Zone 2 Garmin (139-154 bpm). TE 3.2.',
    synthesizedKeywords: ['Zone 2 Validée', 'Gain -24s/km', 'Impact Base 3.2'],
    shoeId: 'shoe-nike-vomero18',
  },
  {
    id: 'i204126936',
    title: 'Run in Lyon — Semi-Marathon (Référence Départ)',
    dateIso: 'Dim. 4 Oct • Course Réf.',
    distanceKm: 21.34,
    durationFormatted: '1h 37m 38s',
    avgPaceFormatted: '4\'37"/km',
    elevationGainM: 118,
    avgHeartRateBpm: 183,
    maxHeartRateBpm: 195,
    paceSparklineSec: [275, 274, 276, 277, 276, 278, 277, 279, 276, 275],
    googleDocRawNotes:
      'Point de départ officiel du Projet Sub-1h30 : 1h37m38s (4\'37"/km). Seuil lactique mesuré à 189 bpm pour 4\'25"/km.',
    synthesizedKeywords: ['Chrono 1h37m38s', 'Seuil 189 bpm', 'Base Sub-1h30'],
    shoeId: 'shoe-saucony-speed5',
  },
];

/**
 * Garage à chaussures avec les VRAIS kilométrages et rôles du Google Doc "Projet Sub-1h30" :
 * - Nike Vomero 18 : 387 km réels (cible 800 km, remplacement prévu dans le Doc entre mi-nov et début janv 2027)
 * - Saucony Endorphin Speed 5 : 170 km réels (cible 600 km, dédiées VMA, Seuil & Courses Montmartre / Paris)
 * - Hoka Speedgoat 6 : rotación Trail / Renfo nature
 */
export const SHOE_GARAGE_DATA: RunningShoe[] = [
  {
    id: 'shoe-nike-vomero18',
    brand: 'Nike',
    model: 'Vomero 18',
    category: 'Daily Trainer',
    primaryUtility:
      'Dédiées aux footings de récupération et sorties longues (EF Zone 2 < 154 bpm). L\'amorti protège des chocs sur le béton des Quais de Saône.',
    recommendedSessions: 'EF Jeudi (50-60 min), Sortie longue Dimanche (1h15-1h40)',
    foamTechnology: 'ZoomX + Cushlon 3.0 • Note Doc : Remplacement prévu déc. 2026 / janv. 2027',
    currentDistanceKm: 387, // Vrai kilométrage du Google Doc !
    maxLifespanKm: 650,     // Seuil de remplacement préventif amorti (décembre 2026 / début janvier 2027)
    weeklyUsageKm: 28,
    purchaseDateLabel: '387 km au compteur (Doc Projet Sub-1h30)',
    dropMm: 10,
    weightGrams: 278,
    efficiency: {
      avgHrAtTargetPaceBpm: 152,
      hrSavingsVsBaselineBpm: 0,
      groundContactTimeMs: 242,
      strideLengthMeters: 1.25,
      energyReturnScore: 84,
    },
  },
  {
    id: 'shoe-saucony-speed5',
    brand: 'Saucony',
    model: 'Endorphin Speed 5',
    category: 'Tempo / Plaque Nylon',
    primaryUtility:
      'Dédiées exclusivement aux séances de VMA, Côtes, Seuil lactique (4\'25" → 4\'15"/km) et aux courses officielles (10k Montmartre & Semi de Paris).',
    recommendedSessions: 'Mardi (VMA/Côtes), Samedi (Seuil 4×1500m), Compétitions',
    foamTechnology: 'Mousse PWRRUN PB + Plaque Nylon ailée',
    currentDistanceKm: 170, // Vrai kilométrage du Google Doc !
    maxLifespanKm: 600,
    weeklyUsageKm: 16,      // ~26.8 semaines restantes -> Tiendra largement jusqu'au Semi de Paris !
    purchaseDateLabel: '170 km au compteur (Doc Projet Sub-1h30)',
    dropMm: 8,
    weightGrams: 204,
    efficiency: {
      avgHrAtTargetPaceBpm: 161,
      hrSavingsVsBaselineBpm: -5,
      groundContactTimeMs: 218,
      strideLengthMeters: 1.38,
      energyReturnScore: 95,
    },
  },
  {
    id: 'shoe-hoka-speedgoat6',
    brand: 'Hoka',
    model: 'Speedgoat 6',
    category: 'Trail Technique',
    primaryUtility:
      'Sorties nature vallonnées, chemins humides et travail de proprioception cheville/mollets.',
    recommendedSessions: 'Trail, Sous-bois, Renforcement vallonné',
    foamTechnology: 'CMEVA + Semelle Vibram Megagrip (Crampons 5mm)',
    currentDistanceKm: 210,
    maxLifespanKm: 650,
    weeklyUsageKm: 8,
    purchaseDateLabel: 'Rotation Complémentaire Trail',
    dropMm: 5,
    weightGrams: 278,
    efficiency: {
      avgHrAtTargetPaceBpm: 158,
      hrSavingsVsBaselineBpm: +3,
      groundContactTimeMs: 248,
      strideLengthMeters: 1.22,
      energyReturnScore: 76,
    },
  },
];
