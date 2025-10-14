/**
 * CalorIA - Water Intake Widget
 * Track daily water consumption with native progress visualization
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from './Card';
import { Heading3, BodyText, Caption } from './Typography';
import { COLORS, SPACING } from '../../utils/constants';
import { mediumImpact, successFeedback } from '../../utils/haptics';

interface WaterIntakeWidgetProps {
  currentIntake: number; // ml
  goalIntake?: number; // ml (default 2000ml = 2L)
  onAddWater: (amount: number) => void;
}

export const WaterIntakeWidget: React.FC<WaterIntakeWidgetProps> = ({
  currentIntake,
  goalIntake = 2000,
  onAddWater,
}) => {
  const percentage = Math.min((currentIntake / goalIntake) * 100, 100);
  const glassesConsumed = Math.floor(currentIntake / 250);
  const totalGlasses = Math.ceil(goalIntake / 250);

  const quickAmounts = [250, 500, 750];

  const handleAddWater = (amount: number) => {
    const newIntake = currentIntake + amount;
    const wasCompleted = currentIntake >= goalIntake;
    const isNowCompleted = newIntake >= goalIntake;

    if (!wasCompleted && isNowCompleted) {
      successFeedback();
    } else {
      mediumImpact();
    }

    onAddWater(amount);
  };

  const getWaterColor = () => {
    if (percentage < 50) return '#60A5FA';
    if (percentage < 80) return '#3B82F6';
    return '#2563EB';
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialIcons name="water-drop" size={24} color={COLORS.primary} style={styles.icon} />
          <Heading3>Hidratación</Heading3>
        </View>
        <BodyText style={styles.percentage}>
          {Math.round(percentage)}%
        </BodyText>
      </View>

      {/* Stats Display */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <MaterialIcons name="water-drop" size={32} color={getWaterColor()} />
          <BodyText style={[styles.statValue, { color: getWaterColor() }]}>
            {(currentIntake / 1000).toFixed(1)}L
          </BodyText>
          <Caption color="textSecondary">Consumido</Caption>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <MaterialIcons name="flag" size={32} color={COLORS.textSecondary} />
          <BodyText style={styles.statValue}>
            {(goalIntake / 1000).toFixed(1)}L
          </BodyText>
          <Caption color="textSecondary">Meta</Caption>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <MaterialIcons name="local-drink" size={32} color={COLORS.textSecondary} />
          <BodyText style={styles.statValue}>
            {glassesConsumed}/{totalGlasses}
          </BodyText>
          <Caption color="textSecondary">Vasos</Caption>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: getWaterColor(),
              },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Caption color="textSecondary">
            {Math.round(currentIntake)}ml de {goalIntake}ml
          </Caption>
          {currentIntake < goalIntake && (
            <Caption color="textSecondary">
              Faltan {Math.round(goalIntake - currentIntake)}ml
            </Caption>
          )}
        </View>
      </View>

      {/* Quick add buttons */}
      <View style={styles.actionsSection}>
        <Caption color="textSecondary" style={styles.actionsLabel}>
          Agregar agua rápido:
        </Caption>
        <View style={styles.quickButtons}>
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.quickButton}
              onPress={() => handleAddWater(amount)}
            >
              <MaterialIcons name="add" size={20} color={COLORS.surface} />
              <BodyText style={styles.quickButtonText}>
                {amount < 1000 ? `${amount}ml` : `${amount / 1000}L`}
              </BodyText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Motivation message */}
      {percentage >= 100 ? (
        <View style={[styles.motivationSection, styles.successBanner]}>
          <MaterialIcons name="check-circle" size={20} color={COLORS.success} />
          <BodyText style={styles.successText}>
            ¡Meta de hidratación alcanzada!
          </BodyText>
        </View>
      ) : percentage >= 80 ? (
        <View style={styles.motivationSection}>
          <MaterialIcons name="trending-up" size={16} color={COLORS.primary} style={styles.motivationIcon} />
          <Caption color="textSecondary" style={styles.motivationCaption}>
            ¡Casi llegas! Solo faltan {Math.round((goalIntake - currentIntake) / 1000 * 10) / 10}L
          </Caption>
        </View>
      ) : (
        <View style={styles.motivationSection}>
          <MaterialIcons name="lightbulb" size={16} color={COLORS.textSecondary} style={styles.motivationIcon} />
          <Caption color="textSecondary" style={styles.motivationCaption}>
            Tip: Toma agua regularmente durante el día
          </Caption>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  icon: {},
  percentage: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressSection: {
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  actionsSection: {
    marginBottom: SPACING.sm,
  },
  actionsLabel: {
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  quickButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  quickButtonText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  motivationSection: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  successBanner: {
    backgroundColor: '#F0FDF4',
    borderTopColor: COLORS.success,
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  successText: {
    fontWeight: '600',
    color: COLORS.success,
  },
  motivationIcon: {
    marginRight: 4,
  },
  motivationCaption: {
    textAlign: 'center',
    flex: 1,
  },
});
