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
import { SPACING, BORDER_RADIUS } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';

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
  padding = 'sm',
  shadow = true,
  borderRadius = 'md',
}) => {
  const { colors } = useTheme();

  const cardStyles = [
    styles.base,
    {
      padding: SPACING[padding],
      borderRadius: BORDER_RADIUS[borderRadius],
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    shadow && styles.shadow,
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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