/**
 * Design System "Minimalist Carbon & Mineral"
 * Esthétique sobre, éditoriale et haut de gamme (inspirée de Tracksmith / Whoop / Linear)
 * Optimisée pour la dalle OLED 120Hz du Google Pixel 8.
 */

export const PIXEL_8_SPECS = {
  logicalWidthDp: 412,
  logicalHeightDp: 915,
  aspectRatio: 20 / 9,
  statusBarCutoutDp: 36,
  bottomNavHeightDp: 68,
  refreshRateHz: 120,
} as const;

export const COLORS = {
  // Surfaces Sombres Minimalistes (Carbone mat & Ardoise minérale)
  background: '#0A0B0E',       // Noir Carbone doux (OLED)
  surface: '#12141A',          // Carte principale mate
  surfaceElevated: '#181B22',  // Sous-carte subtile
  border: '#232730',           // Filet de séparation 1px discret
  borderSubtle: '#1B1E26',

  // Accents Minimalistes & Naturels (Zéro néon criard)
  accentPrimary: '#E2E8F0',    // Blanc Platine (Focus principal)
  accentCopper: '#D97757',     // Terre de Sienne / Cuivre (Objectif Sub-1h30, Allure cible)
  accentSteel: '#60A5FA',      // Bleu Acier doux (Données Garmin, Sommeil, Cardio)
  accentSage: '#34D399',       // Vert Sauge (Progression validée, Chaussure en bon état)
  accentAmber: '#FBBF24',      // Ambre doux (Usure chaussure modérée 65-85%, Vigilance)
  accentRose: '#F87171',       // Rouge Brique doux (Fin de vie chaussure > 85%, Seuil dépassé)

  // Rétro-compatibilité nommage interne
  neonVolt: '#D97757',
  neonCyan: '#60A5FA',
  neonEmerald: '#34D399',
  neonAmber: '#FBBF24',
  neonCrimson: '#F87171',
  neonPurple: '#A78BFA',
  borderGlow: 'rgba(217, 119, 87, 0.28)',

  // Typographie Haute Lisibilité
  textPrimary: '#F3F4F6',      // Blanc Craie (non éblouissant la nuit)
  textSecondary: '#9CA3AF',    // Gris Platine
  textMuted: '#6B7280',        // Gris Pierre (labels techniques)
} as const;

export const TYPOGRAPHY = {
  families: {
    display: 'Inter-SemiBold',
    sans: 'Inter-Regular',
    mono: 'JetBrainsMono-Medium',
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 34,
  },
} as const;

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  cardRadius: 18, // Coins plus sobres et architecturaux
} as const;

/**
 * Retourne la palette minimaliste associée à l'usure d'une chaussure
 */
export function getShoeWearColor(wearPercentage: number): {
  primary: string;
  background: string;
  statusLabel: string;
} {
  if (wearPercentage >= 85) {
    return {
      primary: COLORS.accentRose,
      background: 'rgba(248, 113, 113, 0.12)',
      statusLabel: 'Fin de vie imminente',
    };
  }
  if (wearPercentage >= 65) {
    return {
      primary: COLORS.accentAmber,
      background: 'rgba(251, 191, 36, 0.12)',
      statusLabel: 'Usure avancée',
    };
  }
  return {
    primary: COLORS.accentSage,
    background: 'rgba(52, 211, 153, 0.12)',
    statusLabel: 'Amorti intègre',
  };
}
