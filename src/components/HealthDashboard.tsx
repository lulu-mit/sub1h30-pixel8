import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { GarminDailyHealth } from '../types/running';

interface HealthDashboardProps {
  data: GarminDailyHealth;
}

/**
 * Module 1 : Dashboard Santé & Récupération (Synchronisé Garmin Health API)
 * Anneaux concentriques style Apple Fitness (Pas Quotidiens + Score de Sommeil Garmin)
 * Optimisé pour le contraste infini de l'écran OLED Actua du Google Pixel 8.
 */
export const HealthDashboard: React.FC<HealthDashboardProps> = ({ data }) => {
  const size = 168;
  const center = size / 2;

  // Anneau extérieur : Pas quotidiens (Néon Volt)
  const outerStroke = 13;
  const outerRadius = (size - outerStroke) / 2 - 4;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const stepsProgress = Math.min(data.steps / data.stepsGoal, 1);
  const outerStrokeDashoffset = outerCircumference * (1 - stepsProgress);

  // Anneau intérieur : Score de Sommeil Garmin (Néon Cyan)
  const innerStroke = 13;
  const innerRadius = outerRadius - outerStroke - 7;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const sleepProgress = Math.min(data.sleepScore / 100, 1);
  const innerStrokeDashoffset = innerCircumference * (1 - sleepProgress);

  const sleepHours = Math.floor(data.sleepDurationMinutes / 60);
  const sleepMins = data.sleepDurationMinutes % 60;

  return (
    <View style={styles.card}>
      {/* En-tête du module */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>GARMIN HEALTH SYNC • TEMPS RÉEL</Text>
          <Text style={styles.title}>Santé & Récupération</Text>
        </View>
        <View style={styles.syncBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.syncText}>Forerunner 965</Text>
        </View>
      </View>

      {/* Corps : Anneaux Concentriques + Métriques Détaillées */}
      <View style={styles.mainContent}>
        <View style={styles.ringsContainer}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="voltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={COLORS.neonVolt} />
                <Stop offset="100%" stopColor={COLORS.neonEmerald} />
              </LinearGradient>
              <LinearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={COLORS.neonCyan} />
                <Stop offset="100%" stopColor={COLORS.neonPurple} />
              </LinearGradient>
            </Defs>

            {/* Piste de fond - Pas quotidiens */}
            <Circle
              cx={center}
              cy={center}
              r={outerRadius}
              stroke="rgba(204, 255, 0, 0.14)"
              strokeWidth={outerStroke}
              fill="none"
            />
            {/* Progression - Pas quotidiens */}
            <Circle
              cx={center}
              cy={center}
              r={outerRadius}
              stroke="url(#voltGrad)"
              strokeWidth={outerStroke}
              strokeDasharray={`${outerCircumference} ${outerCircumference}`}
              strokeDashoffset={outerStrokeDashoffset}
              strokeLinecap="round"
              fill="none"
              rotation="-90"
              origin={`${center}, ${center}`}
            />

            {/* Piste de fond - Score de Sommeil */}
            <Circle
              cx={center}
              cy={center}
              r={innerRadius}
              stroke="rgba(0, 240, 255, 0.14)"
              strokeWidth={innerStroke}
              fill="none"
            />
            {/* Progression - Score de Sommeil */}
            <Circle
              cx={center}
              cy={center}
              r={innerRadius}
              stroke="url(#cyanGrad)"
              strokeWidth={innerStroke}
              strokeDasharray={`${innerCircumference} ${innerCircumference}`}
              strokeDashoffset={innerStrokeDashoffset}
              strokeLinecap="round"
              fill="none"
              rotation="-90"
              origin={`${center}, ${center}`}
            />
          </Svg>

          {/* Valeur centrale : Prêt à courir / Body Battery */}
          <View style={styles.centerOverlay}>
            <Text style={styles.centerScore}>{data.bodyBattery}%</Text>
            <Text style={styles.centerLabel}>BODY BATT.</Text>
          </View>
        </View>

        {/* Légende & Compteurs Tabulaires */}
        <View style={styles.metricsColumn}>
          {/* Pas Quotidiens */}
          <View style={styles.metricBlock}>
            <View style={styles.metricHeader}>
              <View style={[styles.colorIndicator, { backgroundColor: COLORS.neonVolt }]} />
              <Text style={styles.metricLabel}>PAS QUOTIDIENS</Text>
            </View>
            <Text style={[styles.metricValue, { color: COLORS.neonVolt }]}>
              {data.steps.toLocaleString('fr-FR')}
              <Text style={styles.metricGoal}> / {(data.stepsGoal / 1000).toFixed(0)}k</Text>
            </Text>
            <Text style={styles.metricSubtext}>
              {Math.round(stepsProgress * 100)}% de l&apos;objectif actif
            </Text>
          </View>

          {/* Score de Sommeil Garmin */}
          <View style={[styles.metricBlock, { marginTop: SPACING.md }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.colorIndicator, { backgroundColor: COLORS.neonCyan }]} />
              <Text style={styles.metricLabel}>SCORE SOMMEIL</Text>
            </View>
            <Text style={[styles.metricValue, { color: COLORS.neonCyan }]}>
              {data.sleepScore}
              <Text style={styles.metricGoal}> / 100</Text>
            </Text>
            <Text style={styles.metricSubtext}>
              {sleepHours}h{sleepMins.toString().padStart(2, '0')} • REM {data.remPercentage}%
            </Text>
          </View>
        </View>
      </View>

      {/* Barre inférieure : Biométrie de récupération */}
      <View style={styles.biometricsFooter}>
        <View style={styles.bioPill}>
          <Text style={styles.bioLabel}>FC REPOS</Text>
          <Text style={styles.bioValue}>{data.restingHeartRateBpm} bpm</Text>
        </View>
        <View style={styles.bioDivider} />
        <View style={styles.bioPill}>
          <Text style={styles.bioLabel}>STATUT VFC</Text>
          <Text style={[styles.bioValue, { color: COLORS.neonEmerald }]}>
            {data.hrvStatusMs} ms • Équilibré
          </Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.neonEmerald,
    marginRight: 6,
  },
  syncText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.xs,
  },
  ringsContainer: {
    width: 168,
    height: 168,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerScore: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  centerLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  metricsColumn: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  metricBlock: {
    backgroundColor: COLORS.surfaceElevated,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  metricValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  metricGoal: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
  },
  metricSubtext: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: 2,
  },
  biometricsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bioPill: {
    flex: 1,
  },
  bioDivider: {
    width: 1,
    height: 26,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  bioLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  bioValue: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
});
