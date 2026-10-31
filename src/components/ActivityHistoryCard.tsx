import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import { RunningActivity } from '../types/running';

interface ActivityHistoryCardProps {
  activities: RunningActivity[];
}

/**
 * Module 4 : Analyse Historique des Activités
 * Affiche un mini-graphique d'allure (sparkline) et génère 3 mots-clés synthétiques
 * à partir de la section "Ressenti & Remarques" du Google Doc "Journal d'entraînement".
 */
export const ActivityHistoryCard: React.FC<ActivityHistoryCardProps> = ({ activities }) => {
  const renderSparkline = (pacesSec: number[]) => {
    const w = 110;
    const h = 36;
    const min = Math.min(...pacesSec) - 5;
    const max = Math.max(...pacesSec) + 5;

    // Allure plus rapide (moins de sec/km) = plus haut sur le graphique
    const path = pacesSec
      .map((val, idx) => {
        const x = (idx / Math.max(1, pacesSec.length - 1)) * w;
        const y = ((val - min) / (max - min)) * (h - 8) + 4;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <Svg width={w} height={h}>
        <Path d={path} stroke={COLORS.neonVolt} strokeWidth={2.2} fill="none" />
      </Svg>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>HISTORIQUE GARMIN + NLP GOOGLE DOCS</Text>
      <Text style={styles.title}>Dernières Activités & Ressentis</Text>

      {activities.map((act) => (
        <View key={act.id} style={styles.activityItem}>
          <View style={styles.topRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.dateText}>{act.dateIso}</Text>
              <Text style={styles.activityTitle}>{act.title}</Text>
            </View>
            <View style={styles.sparklineBox}>
              {renderSparkline(act.paceSparklineSec)}
              <Text style={styles.sparklineCaption}>Profil Allure</Text>
            </View>
          </View>

          {/* Métriques clés de la sortie */}
          <View style={styles.statsGrid}>
            <View>
              <Text style={styles.statLabel}>DISTANCE</Text>
              <Text style={styles.statValue}>{act.distanceKm.toFixed(1)} km</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>ALLURE MOY.</Text>
              <Text style={[styles.statValue, { color: COLORS.neonVolt }]}>
                {act.avgPaceFormatted}
              </Text>
            </View>
            <View>
              <Text style={styles.statLabel}>FC MOY / MAX</Text>
              <Text style={[styles.statValue, { color: COLORS.neonCyan }]}>
                {act.avgHeartRateBpm} / {act.maxHeartRateBpm}
              </Text>
            </View>
            <View>
              <Text style={styles.statLabel}>D+</Text>
              <Text style={styles.statValue}>+{act.elevationGainM}m</Text>
            </View>
          </View>

          {/* 3 Mots-clés synthétiques extraits de "Ressenti & Remarques" */}
          <View style={styles.keywordsRow}>
            {act.synthesizedKeywords.map((kw, idx) => (
              <View
                key={kw}
                style={[
                  styles.keywordBadge,
                  idx === 0 && styles.keywordBadgeVolt,
                  idx === 1 && styles.keywordBadgeCyan,
                ]}
              >
                <Text
                  style={[
                    styles.keywordText,
                    idx === 0 && { color: COLORS.neonVolt },
                    idx === 1 && { color: COLORS.neonCyan },
                  ]}
                >
                  #{kw}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
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
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  activityItem: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 16,
    padding: 14,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  activityTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    marginTop: 2,
  },
  sparklineBox: {
    alignItems: 'flex-end',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  sparklineCaption: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '800',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keywordBadgeVolt: {
    borderColor: 'rgba(204, 255, 0, 0.35)',
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
  },
  keywordBadgeCyan: {
    borderColor: 'rgba(0, 240, 255, 0.35)',
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
  },
  keywordText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
});
