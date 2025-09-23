/**
 * CalorIA - Completion Screen
 * Onboarding completion and welcome to the app
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading1, Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useUserStore } from '../../store/userStore';
import { useFoodStore } from '../../store/foodStore';
import { COLORS, SPACING } from '../../utils/constants';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackNavigator';

type CompletionScreenRouteProp = RouteProp<OnboardingStackParamList, 'Completion'>;
type CompletionScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Completion'>;

interface Props {
  route: CompletionScreenRouteProp;
  navigation: CompletionScreenNavigationProp;
}

export const CompletionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userProfile, nutritionGoals } = route.params;
  const { completeOnboarding, updateProfile } = useUserStore();
  const { updateNutritionGoals } = useFoodStore();

  // Animations
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Scale animation for success icon
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Fade in animation for content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleGetStarted = async () => {
    console.log('🚀 handleGetStarted called!');
    try {
      console.log('📝 Saving user profile...');
      // Save user profile and goals
      await updateProfile({
        age: userProfile.age,
        weight: userProfile.weight,
        height: userProfile.height,
        gender: userProfile.gender,
        activityLevel: userProfile.activityLevel,
        goals: nutritionGoals,
        preferences: {
          units: 'metric',
          language: 'es',
          notifications: {
            mealReminders: true,
            waterReminders: true,
            goalAchievements: true,
            weeklyReports: true,
          },
          privacy: {
            shareData: false,
            analytics: true,
          },
        },
      });

      console.log('🎯 Updating nutrition goals...');
      updateNutritionGoals(nutritionGoals);
      
      console.log('✅ Completing onboarding...');
      // Mark onboarding as complete
      await completeOnboarding();
      console.log('🎉 Onboarding completed successfully!');
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
    }
  };

  const calculateBMI = () => {
    const heightInMeters = userProfile.height / 100;
    return (userProfile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F7FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}>
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00C896',
        marginBottom: 30,
        textAlign: 'center',
      }}>
        🎉 ¡Perfecto!
      </Text>
      
      <Text style={{
        fontSize: 18,
        color: '#718096',
        marginBottom: 40,
        textAlign: 'center',
      }}>
        Tu perfil nutricional personalizado está listo
      </Text>

      <TouchableOpacity
        onPress={handleGetStarted}
        style={{
          backgroundColor: '#00C896',
          paddingHorizontal: 40,
          paddingVertical: 15,
          borderRadius: 8,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Text style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          ¡Comenzar mi viaje saludable!
        </Text>
      </TouchableOpacity>
      
      <Text style={{
        fontSize: 12,
        color: '#718096',
        marginTop: 15,
        textAlign: 'center',
      }}>
        Puedes modificar estos objetivos en cualquier momento desde tu perfil
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60, // Add padding to account for status bar + notch
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  successEmoji: {
    fontSize: 48,
    color: COLORS.surface,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: 22,
  },
  summarySection: {
    gap: SPACING.sm,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
  },
  summaryTitle: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  profileStats: {
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  goalsCard: {
    backgroundColor: COLORS.primary,
  },
  goalsTitle: {
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.surface,
  },
  goalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  goalItem: {
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  nextStepsCard: {},
  nextStepsTitle: {
    marginBottom: SPACING.md,
  },
  stepsList: {
    gap: SPACING.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  stepEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  trialCard: {
    backgroundColor: COLORS.success,
  },
  trialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  trialEmoji: {
    fontSize: 28,
  },
  trialText: {
    flex: 1,
  },
  trialTitle: {
    fontWeight: '600',
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  actionSection: {
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  disclaimer: {
    fontSize: 12,
    paddingHorizontal: SPACING.md,
  },
});