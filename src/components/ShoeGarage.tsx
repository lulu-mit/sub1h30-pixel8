import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { estimateShoeEndOfLife } from '../services/garminService';
import { COLORS, getShoeWearColor, SPACING, TYPOGRAPHY } from '../theme/theme';
import { RunningShoe } from '../types/running';

interface ShoeGarageProps {
  shoes: RunningShoe[];
}

/**
 * Page Dédiée : Garage à Chaussures (État du matériel, Utilité, Données techniques & Date de fin de vie)
 * Affiche pour chaque modèle (Nike Vomero 18, Saucony Endorphin Speed 5, Hoka Speedgoat 6) :
 * 1. Son kilométrage actuel / maximum et son pourcentage d'usure
 * 2. Son utilité précise et les séances recommandées dans la rotation
 * 3. Ses caractéristiques techniques (mousse, drop, poids, économie cardiaque à 4'15"/km)
 * 4. L'estimation précise de la date à laquelle elle "rendra l'âme" selon le rythme hebdomadaire.
 */
export const ShoeGarage: React.FC<ShoeGarageProps> = ({ shoes }) => {
  const totalKmAllShoes = shoes.reduce((acc, s) => acc + s.currentDistanceKm, 0);

  return (
    <View>
      {/* En-tête de la page Chaussures */}
      <View style={styles.summaryHeaderCard}>
        <View>
          <Text style={styles.eyebrow}>PARC MATÉRIEL • ROTATION 3 PAIRES</Text>
          <Text style={styles.pageTitle}>Garage & Longévité Chaussures</Text>
        </View>
        <View style={styles.totalKmBadge}>
          <Text style={styles.totalKmLabel}>TOTAL CUMULÉ</Text>
          <Text style={styles.totalKmValue}>{totalKmAllShoes} km</Text>
        </View>
      </View>

      {shoes.map((shoe) => {
        const rawPercentage = (shoe.currentDistanceKm / shoe.maxLifespanKm) * 100;
        const clampedPercentage = Math.min(100, Math.max(0, rawPercentage));
        const wearTheme = getShoeWearColor(rawPercentage);
        const eol = estimateShoeEndOfLife(shoe);
        const eff = shoe.efficiency;

        return (
          <View key={shoe.id} style={styles.shoeCard}>
            {/* 1. Modèle & Jauge de kilométrage */}
            <View style={styles.shoeTopRow}>
              <View>
                <Text style={styles.brandCategory}>
                  {shoe.brand.toUpperCase()} • {shoe.category.toUpperCase()}
                </Text>
                <Text style={styles.modelName}>{shoe.model}</Text>
                <Text style={styles.purchaseDate}>{shoe.purchaseDateLabel}</Text>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: wearTheme.background }]}>
                <Text style={[styles.statusBadgeText, { color: wearTheme.primary }]}>
                  {Math.round(rawPercentage)}% • {wearTheme.statusLabel}
                </Text>
              </View>
            </View>

            {/* Jauge horizontale minimaliste */}
            <View style={styles.gaugeTrack}>
              <View
                style={[
                  styles.gaugeFill,
                  {
                    width: `${clampedPercentage}%`,
                    backgroundColor: wearTheme.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.kmRow}>
              <Text style={styles.kmText}>
                <Text style={styles.kmStrong}>{shoe.currentDistanceKm} km</Text> parcourus sur{' '}
                {shoe.maxLifespanKm} km
              </Text>
              <Text style={styles.kmRemainingText}>{eol.remainingKm} km restants</Text>
            </View>

            {/* 2. Utilité dans la rotation */}
            <View style={styles.utilityBox}>
              <Text style={styles.sectionMiniTitle}>UTILITÉ & RÔLE DANS LA ROTATION</Text>
              <Text style={styles.utilityDescription}>{shoe.primaryUtility}</Text>
              <Text style={styles.recommendedSessions}>
                Séances types : <Text style={styles.whiteText}>{shoe.recommendedSessions}</Text>
              </Text>
            </View>

            {/* 3. Données techniques & biomécaniques utiles */}
            <View style={styles.specsGrid}>
              <View style={styles.specCell}>
                <Text style={styles.specLabel}> ARCHITECTURE</Text>
                <Text style={styles.specValue}>{shoe.foamTechnology}</Text>
              </View>
            </View>

            <View style={styles.metricsFourGrid}>
              <View style={styles.metricMiniBox}>
                <Text style={styles.metricMiniLabel}>POIDS / DROP</Text>
                <Text style={styles.metricMiniValue}>
                  {shoe.weightGrams}g • {shoe.dropMm}mm
                </Text>
              </View>

              <View style={styles.metricMiniBox}>
                <Text style={styles.metricMiniLabel}>CADENCE USAGE</Text>
                <Text style={styles.metricMiniValue}>{shoe.weeklyUsageKm} km/sem</Text>
              </View>

              <View style={styles.metricMiniBox}>
                <Text style={styles.metricMiniLabel}>FC @ 4&apos;15&quot;/KM</Text>
                <Text
                  style={[
                    styles.metricMiniValue,
                    {
                      color:
                        eff.hrSavingsVsBaselineBpm < 0
                          ? COLORS.accentSage
                          : COLORS.textPrimary,
                    },
                  ]}
                >
                  {eff.avgHrAtTargetPaceBpm} bpm
                </Text>
              </View>

              <View style={styles.metricMiniBox}>
                <Text style={styles.metricMiniLabel}>CONTACT SOL</Text>
                <Text style={styles.metricMiniValue}>{eff.groundContactTimeMs} ms</Text>
              </View>
            </View>

            {/* 4. Estimation de la date à laquelle elles "rendront l'âme" */}
            <View style={styles.deathDateBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.deathLabel}>
                  ESTIMATION FIN DE VIE (« RENDRA L&apos;ÂME »)
                </Text>
                <Text style={styles.deathSubtext}>
                  Dans ~{eol.weeksRemaining} semaines (au rythme de {shoe.weeklyUsageKm} km/sem)
                </Text>
              </View>

              <View style={styles.deathRightCol}>
                <Text style={[styles.deathDateValue, { color: wearTheme.primary }]}>
                  {eol.estimatedDeathDateFormatted}
                </Text>
                <Text
                  style={[
                    styles.parisSurvivalTag,
                    {
                      color: eol.willSurviveParisHalf ? COLORS.accentSage : COLORS.accentRose,
                    },
                  ]}
                >
                  {eol.willSurviveParisHalf
                    ? '✓ Tiendra jusqu\'au Semi de Paris'
                    : '⚠ À remplacer avant le Semi de Paris'}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryHeaderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.9,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    marginTop: 2,
  },
  totalKmBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  totalKmLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  totalKmValue: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  shoeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shoeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  brandCategory: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  modelName: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    marginTop: 2,
  },
  purchaseDate: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  gaugeTrack: {
    height: 7,
    backgroundColor: COLORS.background,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 999,
  },
  kmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  kmText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontVariant: ['tabular-nums'],
  },
  kmStrong: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  kmRemainingText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontVariant: ['tabular-nums'],
  },
  utilityBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  sectionMiniTitle: {
    color: COLORS.accentCopper,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  utilityDescription: {
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  recommendedSessions: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  whiteText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  specsGrid: {
    marginBottom: 8,
  },
  specCell: {
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  specLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  specValue: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  metricsFourGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  metricMiniBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  metricMiniLabel: {
    color: COLORS.textMuted,
    fontSize: 8,
    fontWeight: '600',
    marginBottom: 3,
  },
  metricMiniValue: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  deathDateBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deathLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  deathSubtext: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  deathRightCol: {
    alignItems: 'flex-end',
  },
  deathDateValue: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  parisSurvivalTag: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
