/**
 * CalorIA - Loading Skeleton Component
 * Elegant loading placeholders for better perceived performance
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BORDER_RADIUS.sm,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

interface DashboardSkeletonProps {
  showWaterWidget?: boolean;
  showStreakCard?: boolean;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  showWaterWidget = true,
  showStreakCard = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width={200} height={32} />
        <Skeleton width={150} height={16} style={{ marginTop: 8 }} />
      </View>

      {/* View Mode Toggle */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <Skeleton width={100} height={36} borderRadius={8} />
          <Skeleton width={100} height={36} borderRadius={8} />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Skeleton width={140} height={20} style={{ marginBottom: 16 }} />
        <View style={styles.buttonRow}>
          <Skeleton width="48%" height={44} borderRadius={8} />
          <Skeleton width="48%" height={44} borderRadius={8} />
        </View>
      </View>

      {/* Streak Card */}
      {showStreakCard && (
        <View style={styles.card}>
          <Skeleton width={180} height={24} style={{ marginBottom: 16 }} />
          <View style={styles.streakContent}>
            <Skeleton width={80} height={80} borderRadius={40} />
            <View style={{ marginLeft: 20 }}>
              <Skeleton width={60} height={48} />
              <Skeleton width={100} height={16} style={{ marginTop: 8 }} />
            </View>
          </View>
        </View>
      )}

      {/* Water Intake Widget */}
      {showWaterWidget && (
        <View style={styles.card}>
          <View style={styles.waterHeader}>
            <Skeleton width={140} height={24} />
            <Skeleton width={40} height={24} />
          </View>
          <View style={styles.glassesRow}>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} width={32} height={32} borderRadius={6} />
            ))}
          </View>
          <Skeleton width="100%" height={12} borderRadius={6} style={{ marginTop: 16 }} />
        </View>
      )}

      {/* Charts Placeholder */}
      <View style={styles.card}>
        <Skeleton width={120} height={20} style={{ marginBottom: 16 }} />
        <Skeleton width="100%" height={200} borderRadius={12} />
      </View>

      {/* Progress Card */}
      <View style={styles.card}>
        <Skeleton width={140} height={20} style={{ marginBottom: 16 }} />
        <View style={styles.progressItem}>
          <View style={styles.progressHeader}>
            <Skeleton width={80} height={16} />
            <Skeleton width={100} height={16} />
          </View>
          <Skeleton width="100%" height={8} borderRadius={4} style={{ marginTop: 8 }} />
        </View>
        <View style={styles.macrosRow}>
          <View style={styles.macroItem}>
            <Skeleton width={60} height={14} />
            <Skeleton width={50} height={20} style={{ marginTop: 8 }} />
          </View>
          <View style={styles.macroItem}>
            <Skeleton width={60} height={14} />
            <Skeleton width={50} height={20} style={{ marginTop: 8 }} />
          </View>
          <View style={styles.macroItem}>
            <Skeleton width={60} height={14} />
            <Skeleton width={50} height={20} style={{ marginTop: 8 }} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.border,
  },
  container: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  glassesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    justifyContent: 'center',
  },
  progressItem: {
    marginBottom: SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroItem: {
    alignItems: 'center',
  },
});
