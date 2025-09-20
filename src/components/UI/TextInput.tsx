/**
 * CalorIA - Base TextInput Component
 * Standardized text input with theme integration
 */

import React from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '../../utils/constants';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  fullWidth = true,
  style,
  inputStyle,
  labelStyle,
  variant = 'outline',
  size = 'medium',
  ...props
}) => {
  const containerStyles = [
    styles.container,
    fullWidth && styles.fullWidth,
    style,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    error && styles.error,
  ];

  const textInputStyles = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles],
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    styles[`${size}Label` as keyof typeof styles],
    error && styles.errorLabel,
    labelStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}
        </Text>
      )}
      <View style={inputContainerStyles}>
        <RNTextInput
          style={textInputStyles}
          placeholderTextColor={COLORS.textSecondary}
          {...props}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  fullWidth: {
    width: '100%',
  },

  // Label styles
  label: {
    marginBottom: SPACING.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  errorLabel: {
    color: COLORS.error,
  },

  // Input container variants
  inputContainer: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  default: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  outline: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filled: {
    borderColor: 'transparent',
    backgroundColor: COLORS.background,
  },
  error: {
    borderColor: COLORS.error,
  },

  // Input container sizes
  small: {
    minHeight: 36,
  },
  medium: {
    minHeight: 44,
  },
  large: {
    minHeight: 52,
  },

  // Input styles
  input: {
    flex: 1,
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  // Input sizes
  smallInput: {
    fontSize: FONT_SIZES.sm,
    paddingVertical: SPACING.xs,
  },
  mediumInput: {
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.sm,
  },
  largeInput: {
    fontSize: FONT_SIZES.lg,
    paddingVertical: SPACING.md,
  },

  // Label sizes
  smallLabel: {
    fontSize: FONT_SIZES.xs,
  },
  mediumLabel: {
    fontSize: FONT_SIZES.sm,
  },
  largeLabel: {
    fontSize: FONT_SIZES.md,
  },

  // Error text
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
});