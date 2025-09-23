/**
 * CalorIA - Features Screen
 * Detailed app features and benefits
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading1, Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackNavigator';

type FeaturesScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Features'>;

interface Props {
  navigation: FeaturesScreenNavigationProp;
}

interface Feature {
  id: number;
  emoji: string;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: 1,
    emoji: '🧠',
    title: 'Inteligencia Artificial Avanzada',
    description: 'Reconocimiento instantáneo de alimentos con precisión superior al 90%',
    benefits: [
      'Identifica más de 1000 alimentos diferentes',
      'Calcula porciones automáticamente',
      'Mejora con cada escaneo que haces',
      'Funciona con cualquier tipo de comida'
    ],
    color: COLORS.primary,
  },
  {
    id: 2,
    emoji: '📊',
    title: 'Dashboard Inteligente',
    description: 'Visualiza tu progreso con charts profesionales y insights personalizados',
    benefits: [
      'Charts dinámicos de calorías y macros',
      'Tendencias semanales y mensuales',
      'Comparación con objetivos',
      'Insights nutricionales automáticos'
    ],
    color: COLORS.secondary,
  },
  {
    id: 3,
    emoji: '🎯',
    title: 'Objetivos Personalizados',
    description: 'Metas adaptadas a tu cuerpo, estilo de vida y objetivos específicos',
    benefits: [
      'Cálculo científico de necesidades calóricas',
      'Distribución óptima de macronutrientes',
      'Ajustes automáticos según progreso',
      'Recomendaciones personalizadas'
    ],
    color: COLORS.success,
  },
  {
    id: 4,
    emoji: '💰',
    title: 'Precio Accesible',
    description: 'La mejor relación calidad-precio del mercado',
    benefits: [
      '30 días completamente gratis',
      'Solo $1.50/mes después del trial',
      '70% más barato que la competencia',
      'Cancela en cualquier momento'
    ],
    color: COLORS.primary,
  },
];

const { width: screenWidth } = Dimensions.get('window');

export const FeaturesScreen: React.FC<Props> = ({ navigation }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentFeature < FEATURES.length - 1) {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentFeature(currentFeature + 1);
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      navigation.navigate('ProfileSetup');
    }
  };

  const handleSkip = () => {
    navigation.navigate('ProfileSetup');
  };

  const feature = FEATURES[currentFeature];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {FEATURES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentFeature && styles.progressDotActive
                ]}
              />
            ))}
          </View>
          <Button
            title="Saltar"
            onPress={handleSkip}
            variant="ghost"
            size="small"
          />
        </View>

        {/* Feature Content */}
        <Animated.View style={[styles.featureContainer, { opacity: fadeAnim }]}>
          <View style={styles.featureHeader}>
            <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
              <BodyText style={styles.featureEmoji}>{feature.emoji}</BodyText>
            </View>
            <Heading2 style={styles.featureTitle}>{feature.title}</Heading2>
            <BodyText align="center" color="textSecondary" style={styles.featureDescription}>
              {feature.description}
            </BodyText>
          </View>

          <Card style={styles.benefitsCard}>
            <Heading3 style={styles.benefitsTitle}>Beneficios clave:</Heading3>
            <View style={styles.benefitsList}>
              {feature.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={[styles.benefitBullet, { backgroundColor: feature.color }]}>
                    <BodyText style={styles.benefitBulletText}>✓</BodyText>
                  </View>
                  <BodyText style={styles.benefitText}>{benefit}</BodyText>
                </View>
              ))}
            </View>
          </Card>

          {/* Feature Demo */}
          {currentFeature === 0 && (
            <Card style={styles.demoCard}>
              <View style={styles.demoContent}>
                <BodyText style={styles.demoEmoji}>📸➡️🍎➡️📊</BodyText>
                <Caption align="center" color="textSecondary">
                  Toma foto → IA reconoce → Datos nutricionales listos
                </Caption>
              </View>
            </Card>
          )}

          {currentFeature === 1 && (
            <Card style={styles.demoCard}>
              <View style={styles.demoContent}>
                <BodyText style={styles.demoEmoji}>📈</BodyText>
                <Caption align="center" color="textSecondary">
                  Charts profesionales como apps premium de $10+/mes
                </Caption>
              </View>
            </Card>
          )}

          {currentFeature === 2 && (
            <Card style={styles.demoCard}>
              <View style={styles.demoContent}>
                <BodyText style={styles.demoEmoji}>🎯</BodyText>
                <Caption align="center" color="textSecondary">
                  Metas científicamente calculadas para TU cuerpo
                </Caption>
              </View>
            </Card>
          )}

          {currentFeature === 3 && (
            <Card style={[styles.demoCard, { backgroundColor: COLORS.success }]}>
              <View style={styles.demoContent}>
                <BodyText style={styles.demoEmoji}>💰</BodyText>
                <BodyText style={[styles.benefitText, { color: COLORS.surface }]}>
                  Cal AI: $5/mes • MyFitnessPal: $10/mes
                </BodyText>
                <Heading3 style={[styles.benefitsTitle, { color: COLORS.surface, marginTop: SPACING.xs }]}>
                  CalorIA: $1.50/mes 🎉
                </Heading3>
              </View>
            </Card>
          )}
        </Animated.View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <BodyText color="textSecondary">
            {currentFeature + 1} de {FEATURES.length}
          </BodyText>
          <Button
            title={currentFeature === FEATURES.length - 1 ? "¡Empezar Ahora!" : "Siguiente"}
            onPress={handleNext}
            size="large"
            fullWidth
            style={[styles.nextButton, { backgroundColor: feature.color }]}
          />
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
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  progressBar: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  featureContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  featureHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  featureIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  featureEmoji: {
    fontSize: 36,
    color: COLORS.surface,
  },
  featureTitle: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  featureDescription: {
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: 22,
  },
  benefitsCard: {
    marginBottom: SPACING.lg,
  },
  benefitsTitle: {
    marginBottom: SPACING.md,
  },
  benefitsList: {
    gap: SPACING.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  benefitBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  benefitBulletText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  benefitText: {
    flex: 1,
    lineHeight: 20,
  },
  demoCard: {
    marginBottom: SPACING.lg,
  },
  demoContent: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  demoEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  navigation: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  nextButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});