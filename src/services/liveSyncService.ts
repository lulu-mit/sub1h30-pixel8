/**
 * Service de Synchronisation Temps Réel pré-configuré pour Lubin Queyroi
 * - Projet Sub-1h30 : 10KqDb6Kt6Il5QgDdxofpIre3hw-WdLttjfHvcLOfXus
 * - Journal d'entraînement : 1Bhpmuy-BPofD08MUbSry2O7rMSOOU3az-MPsHd-VzYM
 * - Intervals.icu (Garmin Bridge) : Athlete i778652
 */

export const LUBIN_LIVE_CONFIG = {
  athleteName: 'Lubin Queyroi',
  athleteWeightKg: 66.0,
  sub130ProjectDocId: '10KqDb6Kt6Il5QgDdxofpIre3hw-WdLttjfHvcLOfXus',
  trainingLogDocId: '1Bhpmuy-BPofD08MUbSry2O7rMSOOU3az-MPsHd-VzYM',
  intervalsAthleteId: 'i778652',
  intervalsApiKey: '5fd9rx3qxxyk2qv7nvlbt20oc',
} as const;

export interface IntervalsAthleteResponse {
  id: string;
  name: string;
  icu_weight: number;
  gear?: Array<{
    id: string;
    name: string;
    distance: number; // en mètres
    retired?: boolean;
  }>;
}

export interface IntervalsWellnessRecord {
  id: string; // YYYY-MM-DD
  restingHR?: number;
  hrv?: number;
  sleepSecs?: number;
  sleepScore?: number;
  steps?: number;
  readiness?: number;
  ctl?: number;
  atl?: number;
}

export interface IntervalsActivityRecord {
  id: string;
  start_date_local: string;
  name: string;
  type: string;
  distance: number; // en mètres
  moving_time: number; // en secondes
  average_heartrate?: number;
  max_heartrate?: number;
  total_elevation_gain?: number;
  gear_id?: string;
  decoupling?: number;
  icu_training_load?: number;
}

function getIntervalsAuthHeader(): string {
  const credentials = `API_KEY:${LUBIN_LIVE_CONFIG.intervalsApiKey}`;
  // Encodage Base64 compatible React Native & Web
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  for (
    let block = 0, charCode, i = 0, map = chars;
    credentials.charAt(i | 0) || ((map = '='), i % 1);
    output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
  ) {
    charCode = credentials.charCodeAt((i += 3 / 4));
    block = (block << 8) | charCode;
  }
  return `Basic ${output}`;
}

/**
 * Synchronise en direct le profil, la santé Garmin et les activités depuis Intervals.icu (i778652)
 */
export async function fetchLubinGarminData(): Promise<{
  athlete: IntervalsAthleteResponse;
  wellness: IntervalsWellnessRecord[];
  activities: IntervalsActivityRecord[];
}> {
  const headers = { Authorization: getIntervalsAuthHeader() };
  const baseUrl = `https://intervals.icu/api/v1/athlete/${LUBIN_LIVE_CONFIG.intervalsAthleteId}`;

  const [athleteRes, wellnessRes, activitiesRes] = await Promise.all([
    fetch(baseUrl, { headers }),
    fetch(`${baseUrl}/wellness?oldest=2025-01-01&newest=2027-12-31`, { headers }),
    fetch(`${baseUrl}/activities?oldest=2025-01-01&newest=2027-12-31`, { headers }),
  ]);

  if (!athleteRes.ok) {
    throw new Error(`Erreur API Intervals.icu (${athleteRes.status})`);
  }

  return {
    athlete: await athleteRes.json(),
    wellness: wellnessRes.ok ? await wellnessRes.json() : [],
    activities: activitiesRes.ok ? await activitiesRes.json() : [],
  };
}

/**
 * Récupère le texte brut d'un Google Doc (une fois partagé en "Tous les utilisateurs disposant du lien")
 */
export async function fetchGoogleDocText(docId: string): Promise<string> {
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  try {
    const res = await fetch(exportUrl);
    if (res.ok) return await res.text();
  } catch {
    // Fallback via proxy CORS pour les navigateurs mobiles
  }
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(exportUrl)}`;
  const proxyRes = await fetch(proxyUrl);
  if (!proxyRes.ok) {
    throw new Error(`Document Google Doc en accès restreint (${proxyRes.status})`);
  }
  return proxyRes.text();
}
