/**
 * CalorIA - Welcome Screen
 * First onboarding screen with app introduction
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading1, Heading2, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackNavigator';

type WelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const { width: screenWidth } = Dimensions.get('window');

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleGetStarted = () => {
    console.log('🚀 handleGetStarted called - skipping onboarding!');
    // Skip onboarding completely and go directly to main app
    const { completeOnboarding } = require('../../store/userStore').useUserStore.getState();
    completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <BodyText style={styles.logoEmoji}>🍎</BodyText>
            <Heading1 style={styles.appName}>CalorIA</Heading1>
          </View>
          
          <Heading2 style={styles.tagline}>
            Tu nutricionista personal con inteligencia artificial
          </Heading2>
          
          <BodyText align="center" color="textSecondary" style={styles.description}>
            Escanea tu comida, trackea calorías automáticamente y alcanza tus objetivos de salud de forma inteligente.
          </BodyText>
        </View>

        {/* Feature Highlights */}
        <View style={styles.highlights}>
          <Card style={styles.highlightCard}>
            <View style={styles.highlightItem}>
              <BodyText style={styles.highlightEmoji}>📸</BodyText>
              <View style={styles.highlightText}>
                <BodyText style={styles.highlightTitle}>Escaneo Inteligente</BodyText>
                <Caption color="textSecondary">
                  Solo toma una foto y la IA identifica tu comida automáticamente
                </Caption>
              </View>
            </View>
          </Card>

          <Card style={styles.highlightCard}>
            <View style={styles.highlightItem}>
              <BodyText style={styles.highlightEmoji}>📊</BodyText>
              <View style={styles.highlightText}>
                <BodyText style={styles.highlightTitle}>Tracking Automático</BodyText>
                <Caption color="textSecondary">
                  Calorías, macros y micronutrientes calculados al instante
                </Caption>
              </View>
            </View>
          </Card>

          <Card style={styles.highlightCard}>
            <View style={styles.highlightItem}>
              <BodyText style={styles.highlightEmoji}>🎯</BodyText>
              <View style={styles.highlightText}>
                <BodyText style={styles.highlightTitle}>Metas Personalizadas</BodyText>
                <Caption color="textSecondary">
                  Objetivos adaptados a tu estilo de vida y necesidades
                </Caption>
              </View>
            </View>
          </Card>
        </View>

        {/* Value Proposition */}
        <Card style={styles.valueCard}>
          <View style={styles.valueContent}>
            <BodyText style={styles.valueEmoji}>💪</BodyText>
            <View style={styles.valueText}>
              <BodyText style={styles.valueTitle}>
                Más accesible que la competencia
              </BodyText>
              <Caption color="textSecondary" style={styles.valueDescription}>
                30 días gratis completos. Luego solo $1.50/mes vs $5/mes de otras apps.
              </Caption>
            </View>
          </View>
        </Card>

        {/* Action Button */}
        <View style={styles.actions}>
          <Button
            title="🚀 BOTÓN DE TEST 🚀"
            onPress={handleGetStarted}
            size="large"
            fullWidth
            style={styles.startButton}
          />
          
          <Caption align="center" color="textSecondary" style={styles.disclaimer}>
            30 días gratis. Sin compromisos. Cancela cuando quieras.
          </Caption>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    lineHeight: 28,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    lineHeight: 22,
  },
  highlights: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  highlightCard: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  highlightEmoji: {
    fontSize: 28,
  },
  highlightText: {
    flex: 1,
  },
  highlightTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  valueCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  valueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  valueEmoji: {
    fontSize: 28,
  },
  valueText: {
    flex: 1,
  },
  valueTitle: {
    fontWeight: '600',
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  valueDescription: {
    color: COLORS.surface,
  },
  actions: {
    gap: SPACING.md,
  },
  startButton: {
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disclaimer: {
    fontSize: 12,
    paddingHorizontal: SPACING.md,
  },
});