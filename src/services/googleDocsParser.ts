import {
  MacrocyclePhase,
  PlannedWorkoutSession,
  RaceStrategyPlan,
  TargetRaceEvent,
} from '../types/running';

const KEYWORD_TAXONOMY: Array<{ pattern: RegExp; tag: string }> = [
  { pattern: /cardio|fc|dérive|pulsation|148 bpm|150 bpm|zone 2/i, tag: 'Zone 2 Maîtrisée' },
  { pattern: /aérobie|souffle|vo2|te 3|te 4/i, tag: 'Impact Aérobie' },
  { pattern: /cadence|spm|foulée|fluide/i, tag: 'Cadence & Foulée' },
  { pattern: /relâchement|musculaire|mollets|prévention/i, tag: 'Prévention Tendons' },
  { pattern: /côte|barthélémy|pliométrie|force/i, tag: 'Force & Puissance' },
  { pattern: /seuil|lactate|4'15|4'25/i, tag: 'Travail au Seuil' },
];

export function extractKeywordsFromDocNotes(rawNotes: string): [string, string, string] {
  const matched: string[] = [];

  for (const rule of KEYWORD_TAXONOMY) {
    if (rule.pattern.test(rawNotes) && !matched.includes(rule.tag)) {
      matched.push(rule.tag);
    }
    if (matched.length === 3) break;
  }

  const fallbacks = ['Zone 2 Maîtrisée', 'Impact Aérobie', 'Force & Puissance'];
  for (const fb of fallbacks) {
    if (matched.length >= 3) break;
    if (!matched.includes(fb)) matched.push(fb);
  }

  return [matched[0], matched[1], matched[2]];
}

/**
 * Vraies dates clés extraites du Google Doc "Projet Sub-1h30 : Préparation Semi-Marathon de Paris 2027"
 * 1. Course intermédiaire (24 janvier 2027) : 10k de Montmartre
 * 2. Objectif principal (7 mars 2027) : Semi-Marathon de Paris (Sub-1h30 • < 4'15"/km)
 */
export const TARGET_RACES_FROM_DOC: TargetRaceEvent[] = [
  {
    id: 'race-10k-montmartre',
    name: '10k de Montmartre',
    location: 'Dim. 24 Janv. 2027 • Relance & D+',
    targetDateIso: '2027-01-24T09:00:00+01:00',
    distanceKm: 10.0,
    targetTimeFormatted: '00:41:00',
    targetPaceFormatted: '4\'05"/km',
    isPrimaryGoal: false,
  },
  {
    id: 'race-semi-paris',
    name: 'Semi-Marathon de Paris',
    location: 'Dim. 7 Mars 2027 • Objectif Principal',
    targetDateIso: '2027-03-07T08:00:00+01:00',
    distanceKm: 21.097,
    targetTimeFormatted: '01:29:59',
    targetPaceFormatted: '< 4\'15"/km',
    isPrimaryGoal: true,
  },
];

/**
 * Séances à venir extraites de la Phase 2 (Développement & Force : 26 oct. – 20 déc.)
 * du Google Doc "Projet Sub-1h30" (incluant la note d'indisponibilité du 3 nov : Concert GIMS).
 */
export const UPCOMING_AGENDA_FROM_DOC: PlannedWorkoutSession[] = [
  {
    id: 'plan-next-dim',
    dateLabel: 'Demain • Dimanche 1 Nov • Phase 2',
    phase: 'Sortie Longue',
    title: 'Sortie Longue Zone 2 (1h15 à 1h40) + Test Ravito',
    structureDetail:
      'Quais de Saône ou Parc de la Tête d\'Or. Strictement en Zone 2 Garmin (139–154 bpm, moy. cible 150 bpm). 2-3 gorgées d\'eau toutes les 20-25 min + apport glucidique (gel/pâte de fruit) à 45-50 min.',
    targetDistanceKm: 14.0,
    targetDurationMin: 90,
    targetPaceRange: '6\'15" - 6\'35"/km',
    recoveryTarget: 'Zone 2 stricte (139-154 bpm)',
    hrCapBpm: 154,
    recommendedShoeModel: 'Nike Vomero 18',
  },
  {
    id: 'plan-mer-cotes',
    dateLabel: 'Mercredi 4 Nov • (Mardi 3 Nov : Concert GIMS)',
    phase: 'VMA Courte',
    title: 'Côtes Montée St-Barthélémy (45s) ou VMA 30"/30"',
    structureDetail:
      'Séance décalée du mardi (Concert GIMS le 3 nov). 25 min échauffement EF + répétitions de 45s en côte (Montée St-Barthélémy, Lyon 5) pour la puissance de foulée + 10 min retour au calme.',
    targetDistanceKm: 8.5,
    targetDurationMin: 65,
    targetPaceRange: 'Effort 45s Côte / VMA',
    recoveryTarget: 'Descente trottinée souple',
    hrCapBpm: 192,
    recommendedShoeModel: 'Saucony Endorphin Speed 5',
  },
  {
    id: 'plan-jeu-ef',
    dateLabel: 'Jeudi 5 Nov • Phase 2 (Développement)',
    phase: 'Endurance Fondamentale',
    title: 'Footing 50–60 min Zone 2 + Lignes Droites',
    structureDetail:
      'Quais de Saône ou Tête d\'Or. 50 min d\'aisance respiratoire en Zone 2 Garmin (< 154 bpm) suivies de 5 à 6 lignes droites de 80m.',
    targetDistanceKm: 8.5,
    targetDurationMin: 55,
    targetPaceRange: '6\'20" - 6\'35"/km',
    recoveryTarget: 'FC moyenne cible ~150 bpm',
    hrCapBpm: 154,
    recommendedShoeModel: 'Nike Vomero 18',
  },
  {
    id: 'plan-sam-seuil',
    dateLabel: 'Samedi 7 Nov • Phase 2 (Développement)',
    phase: 'Seuil Sub-1h30',
    title: 'Seuil Lactique : 4 × 1500m @ 4\'25"/km',
    structureDetail:
      '20 min échauffement Z2 + 4 × 1500m calés sur le seuil lactique actuel (4\'25"/km, FC plafond ~189 bpm avec brassard Coros) + 10 min retour au calme.',
    targetDistanceKm: 11.0,
    targetDurationMin: 60,
    targetPaceRange: '4\'25"/km (Seuil)',
    recoveryTarget: '2\'00" trot lent entre les 1500m',
    hrCapBpm: 189,
    recommendedShoeModel: 'Saucony Endorphin Speed 5',
  },
];

export const SEMI_PARIS_PACING_STRATEGIES: RaceStrategyPlan[] = [
  {
    strategyId: 'gap_adjusted',
    strategyName: 'Ajusté D+ (GAP)',
    description: 'Adapte l\'allure aux faux-plats montants du Bois de Vincennes (Km 10-15) + stratégie ravito du Doc (eau toutes les 20-25 min, glucides dès 45 min).',
    finishTimeFormatted: '1h 29m 24s',
    firstHalfSplit: '44m 52s',
    secondHalfSplit: '44m 32s',
    checkpoints: [
      {
        segmentLabel: 'Km 0 → 5 (Boulevard St-Germain / Quais)',
        elevationDeltaM: -6,
        targetPaceFormatted: '4\'15"/km',
        cumulativeTimeFormatted: '00:21:15',
        targetHrZone: '175-180 bpm',
        nutritionCue: '2-3 gorgées d\'eau (21 min)',
      },
      {
        segmentLabel: 'Km 5 → 10 (Bastille → Daumesnil)',
        elevationDeltaM: +14,
        targetPaceFormatted: '4\'15"/km',
        cumulativeTimeFormatted: '00:42:30',
        targetHrZone: '182-186 bpm',
        nutritionCue: 'Gel / Pâte de fruit au Km 10 (~42 min) + Eau',
      },
      {
        segmentLabel: 'Km 10 → 15 (Côte Gravelle / Vincennes)',
        elevationDeltaM: +32,
        targetPaceFormatted: '4\'18"/km',
        cumulativeTimeFormatted: '01:04:00',
        targetHrZone: '187-189 bpm (Seuil)',
        nutritionCue: '2e Gel glucidique + 2-3 gorgées d\'eau (Km 15)',
      },
      {
        segmentLabel: 'Km 15 → 21.1 (Descente Château → Bastille)',
        elevationDeltaM: -28,
        targetPaceFormatted: '4\'10"/km',
        cumulativeTimeFormatted: '01:29:24',
        targetHrZone: '189-193 bpm (Finish)',
        nutritionCue: 'Relance progressive sur les quais',
      },
    ],
  },
  {
    strategyId: 'negative_split',
    strategyName: 'Negative Split',
    description: 'Départ prudent à 4\'18"/km sur les 5 premiers kilomètres puis accélération jusqu\'à 4\'11"/km.',
    finishTimeFormatted: '1h 29m 31s',
    firstHalfSplit: '45m 08s',
    secondHalfSplit: '44m 23s',
    checkpoints: [
      {
        segmentLabel: 'Km 0 → 5 (Mise en action contrôlée)',
        elevationDeltaM: -6,
        targetPaceFormatted: '4\'18"/km',
        cumulativeTimeFormatted: '00:21:30',
        targetHrZone: '174-179 bpm',
        nutritionCue: '2-3 gorgées d\'eau (21 min)',
      },
      {
        segmentLabel: 'Km 5 → 10 (Stabilisation AS21)',
        elevationDeltaM: +14,
        targetPaceFormatted: '4\'16"/km',
        cumulativeTimeFormatted: '00:42:50',
        targetHrZone: '181-185 bpm',
        nutritionCue: 'Gel / Pâte de fruit au Km 10 (~43 min)',
      },
      {
        segmentLabel: 'Km 10 → 15 (Passage à 4\'13"/km)',
        elevationDeltaM: +32,
        targetPaceFormatted: '4\'13"/km',
        cumulativeTimeFormatted: '01:03:55',
        targetHrZone: '186-189 bpm',
        nutritionCue: '2e apport glucidique + Eau Km 15',
      },
      {
        segmentLabel: 'Km 15 → 21.1 (Finish en 4\'11"/km)',
        elevationDeltaM: -28,
        targetPaceFormatted: '4\'11"/km',
        cumulativeTimeFormatted: '01:29:31',
        targetHrZone: '189-194 bpm',
      },
    ],
  },
  {
    strategyId: 'even_pace',
    strategyName: 'Métronome 4\'14"',
    description: 'Allure strictement constante à 4\'14"/km du premier au dernier kilomètre.',
    finishTimeFormatted: '1h 29m 19s',
    firstHalfSplit: '44m 39s',
    secondHalfSplit: '44m 40s',
    checkpoints: [
      {
        segmentLabel: 'Km 0 → 5',
        elevationDeltaM: -6,
        targetPaceFormatted: '4\'14"/km',
        cumulativeTimeFormatted: '00:21:10',
        targetHrZone: '176-181 bpm',
        nutritionCue: '2-3 gorgées d\'eau (21 min)',
      },
      {
        segmentLabel: 'Km 5 → 10',
        elevationDeltaM: +14,
        targetPaceFormatted: '4\'14"/km',
        cumulativeTimeFormatted: '00:42:20',
        targetHrZone: '182-186 bpm',
        nutritionCue: 'Gel / Pâte de fruit au Km 10 (~42 min)',
      },
      {
        segmentLabel: 'Km 10 → 15',
        elevationDeltaM: +32,
        targetPaceFormatted: '4\'14"/km',
        cumulativeTimeFormatted: '01:03:30',
        targetHrZone: '187-189 bpm',
        nutritionCue: 'Eau + Glucides Km 15',
      },
      {
        segmentLabel: 'Km 15 → 21.1',
        elevationDeltaM: -28,
        targetPaceFormatted: '4\'14"/km',
        cumulativeTimeFormatted: '01:29:19',
        targetHrZone: '189-193 bpm',
      },
    ],
  },
];

/**
 * Les 5 Phases du Macrocycle de Préparation (22 Semaines : 5 oct. 2026 -> 7 mars 2027)
 * Extraites de la Section 5 du Google Doc "Projet Sub-1h30 : Préparation Semi-Marathon de Paris 2027"
 * et croisées avec le "Journal d'entraînement".
 */
export const MACROCYCLE_PHASES_FROM_DOC: MacrocyclePhase[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    name: 'Régénération & Reprise',
    shortName: 'Régénération',
    dateRangeLabel: '5 oct. – 25 oct. 2026',
    startDateIso: '2026-10-05T00:00:00+02:00',
    endDateIso: '2026-10-25T23:59:59+02:00',
    durationWeeks: 3,
    weekRangeLabel: 'Semaines 1 à 3',
    status: 'completed',
    progressPercent: 100,
    objective:
      'Éliminer la fatigue du semi-marathon de Lyon (1h37m38s le 4 oct.) et assimiler le don de sang du 8 octobre.',
    volumeTargetKm: '15 → 28 km/sem',
    keyPacesLabel: '100% Zone 2 Garmin (139–154 bpm) • Aucun effort lactique',
    typicalWeek: [
      {
        day: 'Semaine 1',
        focus: 'Repos post-don & Marche',
        detail: 'Repos complet post-don du sang (VFC 85 ms, SpO2 100%) + footing lent 10×2\'/1\' et EF 40 min à Marsaz (7\'15"/km @ 144 bpm).',
        shoe: 'Nike Vomero 18',
      },
      {
        day: 'Semaines 2 & 3',
        focus: 'Réintroduction 4 Runs + 3 Basic-Fit',
        detail: 'Footing EF 45 min Quais de Saône : progression rapide de 7\'01"/km (13 oct.) à 6\'37"/km (19 oct.) à FC identique (~152 bpm).',
        shoe: 'Nike Vomero 18',
      },
      {
        day: 'Renforcement',
        focus: 'Reprise PPL & Prévention Tendons',
        detail: 'PULL (Lat Pulldown 41–45 kg), LEGS (Walk Toes Up 8 kg, mollets lourds 20 kg), PUSH (Seated Dip 50 kg, Pec Fly 59 kg).',
      },
    ],
    milestoneOrSummary:
      '✓ Bilan validé (10 séances dans le Journal) : Don de sang assimilé et gain de +38"/km en EF Zone 2.',
    completedSessionsCount: 10,
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    name: 'Développement & Force',
    shortName: 'Développement',
    dateRangeLabel: '26 oct. – 20 déc. 2026',
    startDateIso: '2026-10-26T00:00:00+01:00',
    endDateIso: '2026-12-20T23:59:59+01:00',
    durationWeeks: 8,
    weekRangeLabel: 'Semaines 4 à 11',
    status: 'current',
    progressPercent: 11,
    objective:
      'Construction de la « cylindrée » aérobie, hausse progressive du volume global et développement de la force musculaire (côtes + pliométrie).',
    volumeTargetKm: '32 → 45 km/sem (+ 3 Basic-Fit)',
    keyPacesLabel: 'EF Z2 (139–154 bpm) • Seuil 4\'25"→4\'18"/km (189 bpm)',
    typicalWeek: [
      {
        day: 'Mardi',
        focus: 'VMA Courte ou Côtes',
        detail: 'Côtes Montée St-Barthélémy (2×8×45s, validé le 27 oct. TE 4.6) ou VMA 30"/30". (Note : indisponibilité Mardi 3 nov. Concert GIMS).',
        shoe: 'Saucony Endorphin Speed 5',
      },
      {
        day: 'Jeudi',
        focus: 'Footing Zone 2 + Lignes Droites',
        detail: '50 à 60 min en Zone 2 indiquée par Garmin (139–154 bpm, moy. cible 150 bpm) sur Quais de Saône / Tête d\'Or + 5×80m.',
        shoe: 'Nike Vomero 18',
      },
      {
        day: 'Samedi',
        focus: 'Seuil Lactique (Coros 189 bpm)',
        detail: 'Séance clé au seuil lactique : ex. 4 × 1500m à 4\'25"/km (progressant vers 4\'18"/km en décembre).',
        shoe: 'Saucony Endorphin Speed 5',
      },
      {
        day: 'Dimanche',
        focus: 'Sortie Longue Z2 + Test Ravito',
        detail: '1h15 à 1h40 strictement en Zone 2 + entraînement digestif (2–3 gorgées d\'eau / 20 min + glucides au 10e km / 45 min).',
        shoe: 'Nike Vomero 18',
      },
      {
        day: '3× / sem.',
        focus: 'Basic-Fit (PULL / LEGS Plio / PUSH)',
        detail: 'Box Jumps (51/61 cm), Fentes Bulgares (20 kg), RDL (20 kg), Walk Toes Up (9 kg) & Calf Raise (20 kg).',
      },
    ],
    milestoneOrSummary:
      '● En cours (Semaine 1/8 • S4/22) : 2 séances déjà validées (Côtes St-Barthélémy + LEGS Plio). Remplacement Nike Vomero 18 prévu dès mi-novembre / déc.',
    completedSessionsCount: 2,
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    name: 'Spécifique 10k Montmartre',
    shortName: 'Spé 10k Montmartre',
    dateRangeLabel: '21 déc. 2026 – 24 janv. 2027',
    startDateIso: '2026-12-21T00:00:00+01:00',
    endDateIso: '2027-01-24T23:59:59+01:00',
    durationWeeks: 5,
    weekRangeLabel: 'Semaines 12 à 16',
    status: 'upcoming',
    progressPercent: 0,
    objective:
      'Travailler le relâchement à haute vitesse et se préparer au profil accidenté et aux relances du 10k de Montmartre.',
    volumeTargetKm: '42 → 48 km/sem',
    keyPacesLabel: 'AS10 ~4\'05"/km • Seuil 4\'15"/km • EF < 150 bpm',
    typicalWeek: [
      {
        day: 'Mardi',
        focus: 'Intervalles Longs AS10',
        detail: 'Exemple type : 6 × 1000m vers 4\'05"/km pour développer la VO2max et l\'économie à haute vitesse.',
        shoe: 'Saucony Endorphin Speed 5',
      },
      {
        day: 'Jeudi',
        focus: 'Footing Assimilation',
        detail: '50 min strictement < 150 bpm en aisance respiratoire.',
        shoe: 'Nike Vomero 18 (Nouvelle paire)',
      },
      {
        day: 'Samedi',
        focus: 'Alternance Rappels Côtes / Seuil',
        detail: 'Rappels de côtes (relance musculaire) ou Seuil long : ex. 3 × 2000m à 4\'15"/km.',
        shoe: 'Saucony Endorphin Speed 5',
      },
      {
        day: 'Dimanche',
        focus: 'Sortie Longue Raccourcie',
        detail: '1h15 à 1h20 en Zone 2 pour préserver la fraîcheur nerveuse et l\'explosivité.',
        shoe: 'Nike Vomero 18 (Nouvelle paire)',
      },
    ],
    milestoneOrSummary:
      '🏁 Échéance intermédiaire : Dimanche 24 janvier 2027 — Course 10k de Montmartre (préparation relance & D+).',
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    name: 'Spécifique Semi de Paris',
    shortName: 'Spé Semi Paris',
    dateRangeLabel: '25 janv. – 21 fév. 2027',
    startDateIso: '2027-01-25T00:00:00+01:00',
    endDateIso: '2027-02-21T23:59:59+01:00',
    durationWeeks: 4,
    weekRangeLabel: 'Semaines 17 à 20',
    status: 'upcoming',
    progressPercent: 0,
    objective:
      'Mémorisation mécanique et cardiaque de l\'allure cible Sub-1h30 (4\'15"/km) sur la fatigue et pic de volume kilométrique.',
    volumeTargetKm: '50 – 55 km/sem (Pic du cycle)',
    keyPacesLabel: 'AS21 4\'12"–4\'15"/km • Seuil 4\'05"–4\'10"/km • EF 5\'45"–6\'00"',
    typicalWeek: [
      {
        day: 'Mardi',
        focus: 'Rappels VMA Courte',
        detail: 'Exemple type : 10 × 400m à 4\'00"/km pour entretenir la réserve de vitesse.',
        shoe: 'Saucony Endorphin Speed 5',
      },
      {
        day: 'Jeudi',
        focus: 'Footing Aérobie Solide',
        detail: '1h00 < 150 bpm (allure EF attendue entre 5\'45" et 6\'00"/km grâce au développement aérobie).',
        shoe: 'Nike Vomero 18',
      },
      {
        day: 'Samedi',
        focus: 'Blocs d\'Allure Cible Sub-1h30',
        detail: 'Séance spécifique clé : 3 × 3000m ou 2 × 4000m calés exactement à 4\'12" – 4\'15"/km.',
        shoe: 'Saucony Endorphin Speed 5',
      },
      {
        day: 'Dimanche',
        focus: 'Sortie Longue Spécifique + Bloc Final',
        detail: '1h30 à 1h45 incluant un bloc final de 15 min à allure marathon (4\'30"/km) + protocole ravito complet.',
        shoe: 'Nike Vomero 18',
      },
    ],
    milestoneOrSummary:
      '🎯 Cible fin de Phase 4 : Seuil lactique (189 bpm) repoussé à 4\'05"–4\'10"/km et validation du 3×3000m à 4\'13"/km.',
  },
  {
    id: 'phase-5',
    phaseNumber: 5,
    name: 'Affûtage & Compétition',
    shortName: 'Affûtage & Jour J',
    dateRangeLabel: '22 fév. – 7 mars 2027',
    startDateIso: '2027-02-22T00:00:00+01:00',
    endDateIso: '2027-03-07T23:59:59+01:00',
    durationWeeks: 2,
    weekRangeLabel: 'Semaines 21 à 22',
    status: 'upcoming',
    progressPercent: 0,
    objective:
      'Surcompensation physiologique et création d\'une fraîcheur nerveuse et musculaire maximale avant le départ du Semi de Paris.',
    volumeTargetKm: '-30% (S21 ~35 km) puis -50% (S22 ~22 km)',
    keyPacesLabel: 'Rappels courts à 4\'15"/km • Surcharge glycogénique (7g/kg)',
    typicalWeek: [
      {
        day: 'Semaine 21',
        focus: 'Baisse du volume (-30%)',
        detail: 'Allègement des durées de footing, arrêt des charges lourdes LEGS en musculation, dernier rappel AS21 (ex: 3×1500m @ 4\'14"/km).',
        shoe: 'Saucony Endorphin Speed 5',
      },
      {
        day: 'Semaine 22',
        focus: 'Affûtage Terminal (-50%) & Surcompensation',
        detail: '2 courts footings d\'activation + quelques lignes droites à 4\'15"/km. Majoration glucidique (380–460 g/j) à J-3.',
        shoe: 'Saucony Endorphin Speed 5',
      },
      {
        day: 'Dim. 7 Mars',
        focus: 'COURSE OBJECTIF : SEMI-MARATHON DE PARIS',
        detail: 'Départ 08h00 • 21.097 km à < 4\'15"/km • Objectif Sub-1h30 (1h 29m 24s).',
        shoe: 'Saucony Endorphin Speed 5',
      },
    ],
    milestoneOrSummary:
      '🏆 Dimanche 7 mars 2027 : Objectif Sub-1h30 au Semi-Marathon de Paris (< 4\'15"/km).',
  },
];

