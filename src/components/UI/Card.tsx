/**
 * CalorIA - Base Card Component
 * Reusable card container with shadow and styling
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof SPACING;
  shadow?: boolean;
  borderRadius?: keyof typeof BORDER_RADIUS;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = true,
  borderRadius = 'lg',
}) => {
  const cardStyles = [
    styles.base,
    {
      padding: SPACING[padding],
      borderRadius: BORDER_RADIUS[borderRadius],
    },
    shadow && styles.shadow,
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: COLORS.text,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});