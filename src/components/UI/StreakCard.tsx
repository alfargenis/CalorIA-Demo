/**
 * CalorIA - Streak Card
 * Displays user's current and longest streak with visual representation
 */

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from './Card';
import { Heading3, BodyText, Caption } from './Typography';
import { COLORS, SPACING } from '../../utils/constants';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  lastActivityDate,
}) => {
  const isNewRecord = currentStreak > 0 && currentStreak === longestStreak;
  const isActive = lastActivityDate
    ? new Date().toDateString() === new Date(lastActivityDate).toDateString()
    : false;

  const getStreakIcon = (streak: number) => {
    if (streak === 0) {
      return { name: 'eco' as const, size: 48, color: COLORS.success };
    }
    if (streak < 7) {
      return { name: 'local-fire-department' as const, size: 48, color: COLORS.secondary };
    }
    if (streak < 30) {
      return { name: 'local-fire-department' as const, size: 56, color: COLORS.secondary };
    }
    if (streak < 100) {
      return { name: 'local-fire-department' as const, size: 64, color: '#FF4500' };
    }
    return { name: 'local-fire-department' as const, size: 72, color: '#FF0000' };
  };

  const getMotivationMessage = () => {
    if (currentStreak === 0) {
      return '¡Comienza tu racha hoy!';
    }
    if (currentStreak === 1) {
      return '¡Gran comienzo!';
    }
    if (currentStreak < 7) {
      return `¡${currentStreak} días seguidos! Sigue así`;
    }
    if (currentStreak < 30) {
      return `¡${currentStreak} días! Estás en racha`;
    }
    if (currentStreak < 100) {
      return `¡${currentStreak} días! ¡Eres imparable!`;
    }
    return `¡${currentStreak} días! ¡Eres una leyenda!`;
  };

  return (
    <Card style={[styles.container, isNewRecord && styles.recordContainer]}>
      <View style={styles.header}>
        <Heading3 style={styles.title}>Racha de Seguimiento</Heading3>
        {isActive && (
          <View style={styles.activeBadge}>
            <Caption style={styles.activeBadgeText}>Activo hoy</Caption>
          </View>
        )}
      </View>

      {/* Main streak display */}
      <View style={styles.mainStreak}>
        <View style={styles.streakIconContainer}>
          <MaterialIcons {...getStreakIcon(currentStreak)} />
        </View>
        <View style={styles.streakInfo}>
          <BodyText style={styles.streakNumber}>
            {currentStreak}
          </BodyText>
          <Caption color="textSecondary">
            {currentStreak === 1 ? 'día' : 'días'} seguidos
          </Caption>
        </View>
      </View>

      {/* Motivation message */}
      <View style={styles.motivationSection}>
        <BodyText style={styles.motivationText}>
          {getMotivationMessage()}
        </BodyText>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Caption color="textSecondary">Mejor racha</Caption>
          <View style={styles.statValueRow}>
            <BodyText style={styles.statValue}>
              {longestStreak}
            </BodyText>
            <MaterialIcons name="emoji-events" size={20} color={COLORS.primary} />
          </View>
        </View>

        {isNewRecord && currentStreak > 0 && (
          <View style={styles.recordBadge}>
            <MaterialIcons name="stars" size={16} color={COLORS.surface} style={styles.recordIcon} />
            <Caption style={styles.recordText}>¡Nuevo récord!</Caption>
          </View>
        )}
      </View>

      {/* Progress to milestones */}
      {currentStreak > 0 && currentStreak < 100 && (
        <View style={styles.milestoneSection}>
          {currentStreak < 7 && (
            <View style={styles.milestone}>
              <Caption color="textSecondary">
                {7 - currentStreak} días para una semana completa
              </Caption>
              <View style={styles.milestoneProgress}>
                <View
                  style={[
                    styles.milestoneProgressFill,
                    { width: `${(currentStreak / 7) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}
          {currentStreak >= 7 && currentStreak < 30 && (
            <View style={styles.milestone}>
              <Caption color="textSecondary">
                {30 - currentStreak} días para un mes completo
              </Caption>
              <View style={styles.milestoneProgress}>
                <View
                  style={[
                    styles.milestoneProgressFill,
                    { width: `${(currentStreak / 30) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}
          {currentStreak >= 30 && currentStreak < 100 && (
            <View style={styles.milestone}>
              <Caption color="textSecondary">
                {100 - currentStreak} días para el hito de 100 días
              </Caption>
              <View style={styles.milestoneProgress}>
                <View
                  style={[
                    styles.milestoneProgressFill,
                    { width: `${(currentStreak / 100) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  recordContainer: {
    borderWidth: 2,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {},
  activeBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 10,
  },
  mainStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  streakIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
    lineHeight: 56,
  },
  motivationSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#FCD34D',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
  },
  recordIcon: {
    marginTop: -2,
  },
  recordText: {
    color: '#78350F',
    fontWeight: '700',
    fontSize: 12,
  },
  milestoneSection: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  milestone: {
    marginBottom: SPACING.xs,
  },
  milestoneProgress: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginTop: SPACING.xs,
    overflow: 'hidden',
  },
  milestoneProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});
