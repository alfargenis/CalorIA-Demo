/**
 * CalorIA - Goals Setup Screen
 * Nutrition goals and objectives configuration
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackNavigator';
import type { NutritionGoals } from '../../types';

type GoalsSetupScreenRouteProp = RouteProp<OnboardingStackParamList, 'GoalsSetup'>;
type GoalsSetupScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'GoalsSetup'>;

interface Props {
  route: GoalsSetupScreenRouteProp;
  navigation: GoalsSetupScreenNavigationProp;
}

type GoalType = 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'gain_muscle' | 'improve_health';
type WeightGoalRate = 'slow' | 'moderate' | 'fast';

interface GoalOption {
  id: GoalType;
  title: string;
  description: string;
  emoji: string;
  calorieModifier: number; // Multiplier for calorie needs
}

interface WeightRateOption {
  id: WeightGoalRate;
  title: string;
  description: string;
  calorieAdjustment: number; // Daily calorie adjustment
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'lose_weight',
    title: 'Perder Peso',
    description: 'Crear déficit calórico para perder grasa corporal',
    emoji: '📉',
    calorieModifier: 0.85, // 15% reduction
  },
  {
    id: 'maintain_weight',
    title: 'Mantener Peso',
    description: 'Equilibrar calorías para mantener peso actual',
    emoji: '⚖️',
    calorieModifier: 1.0, // No change
  },
  {
    id: 'gain_weight',
    title: 'Ganar Peso',
    description: 'Crear superávit calórico para ganar masa',
    emoji: '📈',
    calorieModifier: 1.15, // 15% increase
  },
  {
    id: 'gain_muscle',
    title: 'Ganar Músculo',
    description: 'Optimizar proteína para desarrollo muscular',
    emoji: '💪',
    calorieModifier: 1.1, // 10% increase + high protein
  },
  {
    id: 'improve_health',
    title: 'Mejorar Salud',
    description: 'Enfoque en nutrición balanceada y bienestar',
    emoji: '🌱',
    calorieModifier: 1.0, // Maintain with balanced macros
  },
];

const WEIGHT_RATE_OPTIONS: WeightRateOption[] = [
  {
    id: 'slow',
    title: 'Lento y Sostenible',
    description: '0.25kg por semana',
    calorieAdjustment: 250, // ±250 calories
  },
  {
    id: 'moderate',
    title: 'Moderado',
    description: '0.5kg por semana',
    calorieAdjustment: 500, // ±500 calories
  },
  {
    id: 'fast',
    title: 'Rápido',
    description: '0.75kg por semana',
    calorieAdjustment: 750, // ±750 calories
  },
];

export const GoalsSetupScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userProfile } = route.params;
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('maintain_weight');
  const [selectedRate, setSelectedRate] = useState<WeightGoalRate>('moderate');

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    const { weight, height, age, gender } = userProfile;
    
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    return bmr * activityMultipliers[userProfile.activityLevel];
  };

  const calculateWeeklyGoal = () => {
    const selectedRateOption = WEIGHT_RATE_OPTIONS.find(r => r.id === selectedRate)!;
    const rateMap = { slow: 0.25, moderate: 0.5, fast: 0.75 };
    return rateMap[selectedRate];
  };

  const calculateTargetDate = () => {
    const { weight, targetWeight } = userProfile;
    const weightDifference = Math.abs(targetWeight - weight);
    const weeklyGoal = calculateWeeklyGoal();
    const weeksNeeded = Math.ceil(weightDifference / weeklyGoal);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (weeksNeeded * 7));
    return targetDate;
  };

  const nutritionGoals = useMemo((): NutritionGoals => {
    const tdee = calculateTDEE();
    const selectedGoalOption = GOAL_OPTIONS.find(g => g.id === selectedGoal)!;
    const selectedRateOption = WEIGHT_RATE_OPTIONS.find(r => r.id === selectedRate)!;

    let targetCalories = tdee * selectedGoalOption.calorieModifier;

    if (selectedGoal === 'lose_weight') {
      targetCalories -= selectedRateOption.calorieAdjustment;
    } else if (selectedGoal === 'gain_weight' || selectedGoal === 'gain_muscle') {
      targetCalories += selectedRateOption.calorieAdjustment;
    }

    targetCalories = Math.max(targetCalories, 1200);

    let proteinPercentage = 0.25;
    let carbPercentage = 0.45;
    let fatPercentage = 0.30;

    if (selectedGoal === 'gain_muscle') {
      proteinPercentage = 0.30;
      carbPercentage = 0.40;
      fatPercentage = 0.30;
    } else if (selectedGoal === 'lose_weight') {
      proteinPercentage = 0.30;
      carbPercentage = 0.35;
      fatPercentage = 0.35;
    }

    const proteinCalories = targetCalories * proteinPercentage;
    const carbCalories = targetCalories * carbPercentage;
    const fatCalories = targetCalories * fatPercentage;

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbCalories / 4),
      fat: Math.round(fatCalories / 9),
      fiber: Math.round(targetCalories / 1000 * 14),
      sugar: Math.round(targetCalories / 1000 * 25),
      sodium: 2300,
    };
  }, [selectedGoal, selectedRate, userProfile]);

  const handleComplete = () => {
    const enhancedProfile = {
      ...userProfile,
      goalType: selectedGoal,
      weeklyGoal: calculateWeeklyGoal(),
      targetDate: calculateTargetDate(),
      bmi: parseFloat(((userProfile.weight / Math.pow(userProfile.height / 100, 2))).toFixed(1)),
      bmr: calculateBMR(),
      tdee: calculateTDEE(),
    };

    navigation.navigate('Completion', {
      userProfile: enhancedProfile,
      nutritionGoals,
    });
  };

  const showWeightRateOptions = selectedGoal === 'lose_weight' || selectedGoal === 'gain_weight' || selectedGoal === 'gain_muscle';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.title}>¿Cuál es tu objetivo?</Heading2>
          <Caption color="textSecondary" style={styles.subtitle}>
            Basaremos tus recomendaciones nutricionales en tu objetivo principal
          </Caption>
        </View>

        {/* Goal Selection */}
        <Card style={styles.section}>
          <Heading3 style={styles.sectionTitle}>Objetivo Principal</Heading3>
          <View style={styles.goalsContainer}>
            {GOAL_OPTIONS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  selectedGoal === goal.id && styles.goalOptionActive
                ]}
                onPress={() => setSelectedGoal(goal.id)}
              >
                <View style={styles.goalHeader}>
                  <BodyText style={styles.goalEmoji}>{goal.emoji}</BodyText>
                  <View style={styles.goalInfo}>
                    <BodyText style={[
                      styles.goalTitle,
                      selectedGoal === goal.id && styles.goalTitleActive
                    ]}>
                      {goal.title}
                    </BodyText>
                    <Caption style={[
                      styles.goalDescription,
                      selectedGoal === goal.id && styles.goalDescriptionActive
                    ]}>
                      {goal.description}
                    </Caption>
                  </View>
                  {selectedGoal === goal.id && (
                    <BodyText style={styles.checkmark}>✓</BodyText>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Weight Change Rate (conditional) */}
        {showWeightRateOptions && (
          <Card style={styles.section}>
            <Heading3 style={styles.sectionTitle}>
              Velocidad de {selectedGoal === 'lose_weight' ? 'Pérdida' : 'Ganancia'}
            </Heading3>
            <Caption color="textSecondary" style={styles.sectionDescription}>
              Una velocidad más lenta es más sostenible y saludable
            </Caption>
            
            <View style={styles.ratesContainer}>
              {WEIGHT_RATE_OPTIONS.map((rate) => (
                <TouchableOpacity
                  key={rate.id}
                  style={[
                    styles.rateOption,
                    selectedRate === rate.id && styles.rateOptionActive
                  ]}
                  onPress={() => setSelectedRate(rate.id)}
                >
                  <View style={styles.rateHeader}>
                    <BodyText style={[
                      styles.rateTitle,
                      selectedRate === rate.id && styles.rateTitleActive
                    ]}>
                      {rate.title}
                    </BodyText>
                    {selectedRate === rate.id && (
                      <BodyText style={styles.checkmark}>✓</BodyText>
                    )}
                  </View>
                  <Caption style={[
                    styles.rateDescription,
                    selectedRate === rate.id && styles.rateDescriptionActive
                  ]}>
                    {rate.description}
                  </Caption>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Calculated Goals Preview */}
        <Card style={styles.previewCard}>
          <Heading3 style={styles.previewTitle}>Tus Objetivos Nutricionales</Heading3>
          <Caption color="textSecondary" style={styles.previewDescription}>
            Calculados científicamente basados en tu perfil y objetivos
          </Caption>
          
          <View style={styles.goalsGrid}>
            <View style={styles.goalStat}>
              <BodyText style={styles.goalStatValue}>
                {nutritionGoals.calories}
              </BodyText>
              <Caption color="textSecondary">Calorías diarias</Caption>
            </View>
            <View style={styles.goalStat}>
              <BodyText style={styles.goalStatValue}>
                {nutritionGoals.protein}g
              </BodyText>
              <Caption color="textSecondary">Proteína</Caption>
            </View>
            <View style={styles.goalStat}>
              <BodyText style={styles.goalStatValue}>
                {nutritionGoals.carbs}g
              </BodyText>
              <Caption color="textSecondary">Carbohidratos</Caption>
            </View>
            <View style={styles.goalStat}>
              <BodyText style={styles.goalStatValue}>
                {nutritionGoals.fat}g
              </BodyText>
              <Caption color="textSecondary">Grasas</Caption>
            </View>
          </View>

          <View style={styles.macroDistribution}>
            <Caption color="textSecondary" style={styles.distributionTitle}>
              Distribución de macronutrientes:
            </Caption>
            <View style={styles.macroBar}>
              <View style={[styles.macroSegment, styles.proteinSegment, { 
                flex: nutritionGoals.protein * 4 
              }]} />
              <View style={[styles.macroSegment, styles.carbSegment, { 
                flex: nutritionGoals.carbs * 4 
              }]} />
              <View style={[styles.macroSegment, styles.fatSegment, { 
                flex: nutritionGoals.fat * 9 
              }]} />
            </View>
            <View style={styles.macroLabels}>
              <Caption style={styles.proteinLabel}>
                Proteína ({Math.round((nutritionGoals.protein * 4 / nutritionGoals.calories) * 100)}%)
              </Caption>
              <Caption style={styles.carbLabel}>
                Carbos ({Math.round((nutritionGoals.carbs * 4 / nutritionGoals.calories) * 100)}%)
              </Caption>
              <Caption style={styles.fatLabel}>
                Grasas ({Math.round((nutritionGoals.fat * 9 / nutritionGoals.calories) * 100)}%)
              </Caption>
            </View>
          </View>
        </Card>

        {/* Info Note */}
        <Card style={styles.infoCard}>
          <View style={styles.infoContent}>
            <BodyText style={styles.infoEmoji}>💡</BodyText>
            <View style={styles.infoText}>
              <BodyText style={styles.infoTitle}>Ajustes automáticos</BodyText>
              <Caption color="textSecondary">
                Estos objetivos se ajustarán automáticamente según tu progreso y podrás modificarlos en cualquier momento desde tu perfil.
              </Caption>
            </View>
          </View>
        </Card>

        {/* Complete Button */}
        <Button
          title="Completar Configuración"
          onPress={handleComplete}
          size="large"
          fullWidth
          style={styles.completeButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  sectionDescription: {
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  goalsContainer: {
    gap: SPACING.sm,
  },
  goalOption: {
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  goalOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  goalEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  goalTitleActive: {
    color: COLORS.surface,
  },
  goalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  goalDescriptionActive: {
    color: COLORS.surface,
  },
  checkmark: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  ratesContainer: {
    gap: SPACING.sm,
  },
  rateOption: {
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  rateOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  rateTitle: {
    fontWeight: '600',
    color: COLORS.text,
  },
  rateTitleActive: {
    color: COLORS.surface,
  },
  rateDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  rateDescriptionActive: {
    color: COLORS.surface,
  },
  previewCard: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  previewTitle: {
    marginBottom: SPACING.xs,
    color: COLORS.primary,
  },
  previewDescription: {
    marginBottom: SPACING.lg,
  },
  goalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  goalStat: {
    alignItems: 'center',
  },
  goalStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  macroDistribution: {
    marginTop: SPACING.md,
  },
  distributionTitle: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  macroBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  macroSegment: {
    height: '100%',
  },
  proteinSegment: {
    backgroundColor: COLORS.primary,
  },
  carbSegment: {
    backgroundColor: COLORS.secondary,
  },
  fatSegment: {
    backgroundColor: COLORS.success,
  },
  macroLabels: {
    gap: SPACING.xs,
  },
  proteinLabel: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  carbLabel: {
    color: COLORS.secondary,
    fontWeight: '500',
  },
  fatLabel: {
    color: COLORS.success,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  infoEmoji: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  completeButton: {
    marginBottom: SPACING.xl,
  },
});