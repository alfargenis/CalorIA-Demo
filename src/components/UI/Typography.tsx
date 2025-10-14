/**
 * CalorIA - Typography Components
 * Consistent text styling throughout the app with dark mode support
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';

interface TypographyProps {
  children: React.ReactNode;
  style?: TextStyle;
  color?: 'text' | 'textSecondary' | 'primary' | 'secondary' | 'success' | 'error';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
}

export const Heading1: React.FC<TypographyProps> = ({
  children,
  style,
  color = 'text',
  align = 'left',
  numberOfLines,
}) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        styles.h1,
        { color: colors[color], textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export const Heading2: React.FC<TypographyProps> = ({
  children,
  style,
  color = 'text',
  align = 'left',
  numberOfLines,
}) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        styles.h2,
        { color: colors[color], textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export const Heading3: React.FC<TypographyProps> = ({
  children,
  style,
  color = 'text',
  align = 'left',
  numberOfLines,
}) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        styles.h3,
        { color: colors[color], textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export const BodyText: React.FC<TypographyProps> = ({
  children,
  style,
  color = 'text',
  align = 'left',
  numberOfLines,
}) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        styles.body,
        { color: colors[color], textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export const Caption: React.FC<TypographyProps> = ({
  children,
  style,
  color = 'textSecondary',
  align = 'left',
  numberOfLines,
}) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        styles.caption,
        { color: colors[color], textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export const Label: React.FC<TypographyProps> = ({
  children,
  style,
  color = 'text',
  align = 'left',
  numberOfLines,
}) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        styles.label,
        { color: colors[color], textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 40,
  },
  h2: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 32,
  },
  h3: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 28,
  },
  body: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: 24,
  },
  caption: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: 20,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 20,
  },
});
