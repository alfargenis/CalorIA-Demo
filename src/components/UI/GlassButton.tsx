/**
 * CalorIA - Glass Button Component
 * Liquid glass button with iOS 18 effect
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { BodyText } from './Typography';
import { COLORS, SPACING } from '../../utils/constants';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  glassEffect?: 'clear' | 'regular';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  glassEffect = 'clear',
}) => {
  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 56;
      default:
        return 44;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const getVariantStyles = () => {
    const isGlassSupported = isLiquidGlassSupported();

    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: isGlassSupported ? 'transparent' : COLORS.primary,
          },
          text: { color: COLORS.surface },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: isGlassSupported ? 'transparent' : COLORS.secondary,
          },
          text: { color: COLORS.surface },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: isGlassSupported ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1.5,
            borderColor: COLORS.primary,
          },
          text: { color: COLORS.primary },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: { color: COLORS.primary },
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isGlassSupported = isLiquidGlassSupported();
  const shouldShowGlass = isGlassSupported && variant !== 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.container,
        {
          height: getButtonHeight(),
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          overflow: 'hidden',
        },
        variantStyles.container,
        style,
      ]}
    >
      {shouldShowGlass && (
        <LiquidGlassView
          style={StyleSheet.absoluteFill}
        />
      )}

      <BodyText
        style={[
          styles.text,
          {
            fontSize: getTextSize(),
            fontWeight: '600',
          },
          variantStyles.text,
          textStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variantStyles.text.color}
            size="small"
          />
        ) : (
          <>
            {icon && icon}
            {icon && ' '}
            {title}
          </>
        )}
      </BodyText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  text: {
    textAlign: 'center',
  },
});
