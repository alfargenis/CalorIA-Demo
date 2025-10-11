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
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading1, Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useUserStore } from '../../store/userStore';
import { useFoodStore } from '../../store/foodStore';
import { firebaseService } from '../../services/FirebaseService';
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
  const [isLoading, setIsLoading] = React.useState(false);

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
    setIsLoading(true);

    try {
      const user = useUserStore.getState().user;
      if (!user) {
        console.error('❌ No user found in store');
        Alert.alert('Error', 'No se encontró el usuario. Por favor inicia sesión nuevamente.');
        setIsLoading(false);
        return;
      }

      console.log('👤 User found:', user.email, 'ID:', user.id);
      console.log('📊 Current onboardingCompleted:', user.onboardingCompleted);

      console.log('📝 Attempting to save to Firestore (with 5s timeout)...');

      const firestorePromise = (async () => {
        try {
          const profileSaved = await firebaseService.saveUserProfile(user.id, {
            age: userProfile.age,
            weight: userProfile.weight,
            height: userProfile.height,
            targetWeight: userProfile.targetWeight,
            bmi: userProfile.bmi,
            bmr: userProfile.bmr,
            tdee: userProfile.tdee,
            gender: userProfile.gender,
            activityLevel: userProfile.activityLevel,
            goalType: userProfile.goalType,
            weeklyGoal: userProfile.weeklyGoal,
            targetDate: userProfile.targetDate,
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
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const statsSaved = await firebaseService.saveUserStats(user.id, {
            currentStreak: 0,
            longestStreak: 0,
            totalDaysTracked: 0,
            totalMealsLogged: 0,
            avgCaloriesPerDay: 0,
            lastActivityDate: new Date(),
          });

          return { profileSaved, statsSaved };
        } catch (error) {
          console.error('⚠️  Firestore save failed:', error);
          return null;
        }
      })();

      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve(null), 5000)
      );

      const result = await Promise.race([firestorePromise, timeoutPromise]);

      if (result) {
        console.log('✅ Firestore sync successful:', result);
      } else {
        console.warn('⚠️  Firestore sync skipped (timeout or error). Continuing with local storage only.');
      }

      console.log('💾 Updating local store (CRITICAL - must succeed)...');
      await updateProfile({
        age: userProfile.age,
        weight: userProfile.weight,
        height: userProfile.height,
        targetWeight: userProfile.targetWeight,
        bmi: userProfile.bmi,
        bmr: userProfile.bmr,
        tdee: userProfile.tdee,
        gender: userProfile.gender,
        activityLevel: userProfile.activityLevel,
        goalType: userProfile.goalType,
        weeklyGoal: userProfile.weeklyGoal,
        targetDate: userProfile.targetDate,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Local profile updated');

      console.log('🎯 Updating nutrition goals...');
      updateNutritionGoals(nutritionGoals);
      console.log('✅ Nutrition goals updated');

      console.log('✅ Completing onboarding (CRITICAL)...');
      await completeOnboarding();

      const updatedUser = useUserStore.getState().user;
      console.log('🔍 After completeOnboarding - user:', updatedUser?.email);
      console.log('🔍 After completeOnboarding - onboardingCompleted:', updatedUser?.onboardingCompleted);
      console.log('🔍 After completeOnboarding - isOnboardingCompleted from store:', useUserStore.getState().isOnboardingCompleted);

      console.log('🎉 Onboarding completed successfully!');
      console.log('🔄 Navigation should auto-trigger to dashboard');

      setIsLoading(false);

    } catch (error) {
      console.error('❌ CRITICAL ERROR completing onboarding:', error);
      Alert.alert('Error', 'Hubo un problema al completar el onboarding. Por favor intenta nuevamente.');
      setIsLoading(false);
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
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#A0A0A0' : '#00C896',
          paddingHorizontal: 40,
          paddingVertical: 15,
          borderRadius: 8,
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        {isLoading && <ActivityIndicator color="white" />}
        <Text style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          {isLoading ? 'Guardando...' : '¡Comenzar mi viaje saludable!'}
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