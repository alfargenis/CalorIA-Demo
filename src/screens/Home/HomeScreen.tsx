/**
 * CalorIA - Home Screen (Dashboard)
 * Main dashboard with daily nutrition overview
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../types';

import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { CalorieProgressChart, WeeklyCaloriesChart, MacroDistributionChart } from '../../components/UI/CaloriaChart';
import { WaterIntakeWidget } from '../../components/UI/WaterIntakeWidget';
import { StreakCard } from '../../components/UI/StreakCard';
import { DashboardSkeleton } from '../../components/UI/LoadingSkeleton';
import { useFoodStore } from '../../store/foodStore';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, SPACING } from '../../utils/constants';
import { selectionFeedback } from '../../utils/haptics';

type HomeScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useUserStore();
  const { colors } = useTheme();
  const {
    todayStats,
    calculateDailyNutrition,
    getTodayEntries,
    waterIntake,
    addWaterIntake,
    isLoading,
    addFoodEntry
  } = useFoodStore();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    calculateDailyNutrition();
    // Add some mock data if none exists
    if (getTodayEntries().length === 0) {
      addMockData();
    }
  }, []);

  const addMockData = () => {
    const mockEntries = [
      {
        food: {
          id: 'mock1',
          name: 'Desayuno Saludable',
          brand: 'Casero',
          barcode: null,
        },
        portion: {
          amount: 1,
          unit: 'porción',
          grams: 250,
        },
        nutrition: {
          calories: 420,
          protein: 25,
          carbs: 45,
          fat: 12,
          fiber: 8,
          sugar: 5,
          sodium: 300,
          cholesterol: 0,
          saturatedFat: 3,
          transFat: 0,
          potassium: 400,
          calcium: 150,
          iron: 4,
          vitaminA: 25,
          vitaminC: 60,
        },
        mealType: 'breakfast' as const,
        date: new Date(),
        notes: 'Avena con frutas',
        source: 'manual' as const,
      },
      {
        food: {
          id: 'mock2',
          name: 'Almuerzo Balanceado',
          brand: 'Casero',
          barcode: null,
        },
        portion: {
          amount: 1,
          unit: 'plato',
          grams: 400,
        },
        nutrition: {
          calories: 650,
          protein: 35,
          carbs: 55,
          fat: 18,
          fiber: 12,
          sugar: 8,
          sodium: 450,
          cholesterol: 50,
          saturatedFat: 6,
          transFat: 0,
          potassium: 600,
          calcium: 200,
          iron: 6,
          vitaminA: 30,
          vitaminC: 40,
        },
        mealType: 'lunch' as const,
        date: new Date(),
        notes: 'Pollo con verduras',
        source: 'camera' as const,
      },
    ];

    mockEntries.forEach(entry => addFoodEntry(entry));
  };

  const handleRefresh = () => {
    calculateDailyNutrition();
  };

  const todayEntries = getTodayEntries();
  const hasEntries = todayEntries.length > 0;

  // Mock weekly data for charts
  const weeklyData = {
    labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    calories: [1800, 2100, 1950, 2200, 1750, 2300, 1900],
    target: 2000,
  };

  const getNutritionColor = (percentage: number) => {
    if (percentage < 90) return colors.error;
    if (percentage > 110) return colors.secondary;
    return colors.success;
  };

  // Show skeleton on initial load
  if (isLoading && !todayStats && todayEntries.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 0 + 20 }]}
        >
          <DashboardSkeleton
            showWaterWidget={true}
            showStreakCard={!!user?.stats}
          />
        </ScrollView>
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 0 + 20 }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Heading2>
              ¡Hola, {user?.displayName || 'Usuario'}!
            </Heading2>
            <MaterialIcons name="waving-hand" size={28} color={colors.primary} />
          </View>
          <Caption color="textSecondary">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Caption>
        </View>

        {/* View Mode Toggle */}
        <Card style={styles.viewModeCard}>
          <View style={styles.viewModeContainer}>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'daily' && styles.viewModeButtonActive
              ]}
              onPress={() => {
                selectionFeedback();
                setViewMode('daily');
              }}
            >
              <BodyText style={[
                styles.viewModeText,
                viewMode === 'daily' && styles.viewModeTextActive
              ]}>
                Diario
              </BodyText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'weekly' && styles.viewModeButtonActive
              ]}
              onPress={() => {
                selectionFeedback();
                setViewMode('weekly');
              }}
            >
              <BodyText style={[
                styles.viewModeText,
                viewMode === 'weekly' && styles.viewModeTextActive
              ]}>
                Semanal
              </BodyText>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Heading3 style={styles.sectionTitle}>
            Acciones Rápidas
          </Heading3>
          <View style={styles.actionButtons}>
            <Button
              title="Escanear Comida"
              onPress={() => navigation.navigate('Camera')}
              variant="primary"
              style={styles.actionButton}
              icon={<MaterialIcons name="photo-camera" size={20} color={COLORS.surface} />}
            />
            <Button
              title="Ver Historial"
              onPress={() => navigation.navigate('History')}
              variant="outline"
              style={styles.actionButton}
              icon={<MaterialIcons name="history" size={20} color={COLORS.primary} />}
            />
          </View>
        </Card>

        {/* Streak Card */}
        {user?.stats && (
          <StreakCard
            currentStreak={user.stats.currentStreak}
            longestStreak={user.stats.longestStreak}
            lastActivityDate={user.stats.lastActivityDate}
          />
        )}

        {/* Water Intake Tracker */}
        <WaterIntakeWidget
          currentIntake={waterIntake}
          goalIntake={2000}
          onAddWater={addWaterIntake}
        />

        {/* Charts Section */}
        {viewMode === 'daily' && hasEntries && todayStats ? (
          <>
            <CalorieProgressChart 
              data={{
                calories: todayStats.progress.calories,
                protein: todayStats.progress.protein,
                carbs: todayStats.progress.carbs,
                fat: todayStats.progress.fat,
              }}
            />
            <MacroDistributionChart 
              data={{
                protein: todayStats.nutrition.protein,
                carbs: todayStats.nutrition.carbs,
                fat: todayStats.nutrition.fat,
              }}
            />
          </>
        ) : viewMode === 'weekly' ? (
          <WeeklyCaloriesChart weeklyData={weeklyData} />
        ) : null}

        {/* Daily Progress */}
        {hasEntries && todayStats ? (
          <Card style={styles.progressCard}>
            <Heading3 style={styles.sectionTitle}>
              Progreso de Hoy
            </Heading3>
            
            {/* Calories */}
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <BodyText style={styles.progressLabel}>Calorías</BodyText>
                <BodyText style={[
                  styles.progressValue,
                  { color: getNutritionColor(todayStats.progress.calories.percentage) }
                ] as any}>
                  {Math.round(todayStats.progress.calories.current)} / {todayStats.goals.calories}
                </BodyText>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(todayStats.progress.calories.percentage, 100)}%`,
                      backgroundColor: getNutritionColor(todayStats.progress.calories.percentage),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Macros */}
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <Caption color="textSecondary">Proteína</Caption>
                <BodyText style={[
                  styles.macroValue,
                  { color: getNutritionColor(todayStats.progress.protein.percentage) }
                ] as any}>
                  {Math.round(todayStats.progress.protein.current)}g
                </BodyText>
              </View>
              <View style={styles.macroItem}>
                <Caption color="textSecondary">Carbos</Caption>
                <BodyText style={[
                  styles.macroValue,
                  { color: getNutritionColor(todayStats.progress.carbs.percentage) }
                ] as any}>
                  {Math.round(todayStats.progress.carbs.current)}g
                </BodyText>
              </View>
              <View style={styles.macroItem}>
                <Caption color="textSecondary">Grasas</Caption>
                <BodyText style={[
                  styles.macroValue,
                  { color: getNutritionColor(todayStats.progress.fat.percentage) }
                ] as any}>
                  {Math.round(todayStats.progress.fat.current)}g
                </BodyText>
              </View>
            </View>
          </Card>
        ) : (
          /* Empty State */
          <Card style={styles.emptyState}>
            <View style={styles.emptyContent}>
              <MaterialIcons name="restaurant" size={64} color={COLORS.textSecondary} style={styles.emptyIcon} />
              <Heading3 align="center" style={styles.emptyTitle}>
                ¡Registra tu primera comida!
              </Heading3>
              <BodyText align="center" color="textSecondary" style={styles.emptyDescription}>
                Usa la cámara para escanear tu comida o agrégala manualmente para comenzar a trackear tus calorías.
              </BodyText>
              <Button
                title="Comenzar Ahora"
                onPress={() => navigation.navigate('Camera')}
                style={styles.emptyButton}
              />
            </View>
          </Card>
        )}

        {/* Recent Meals */}
        {hasEntries && (
          <Card style={styles.recentMeals}>
            <View style={styles.sectionHeader}>
              <Heading3>Comidas Recientes</Heading3>
              <Button
                title="Ver Todo"
                onPress={() => navigation.navigate('History')}
                variant="ghost"
                size="small"
              />
            </View>
            {todayEntries.slice(0, 3).map((entry, index) => (
              <View key={entry.id} style={styles.mealItem}>
                <View style={styles.mealInfo}>
                  <BodyText style={styles.mealName}>
                    {entry.food.name}
                  </BodyText>
                  <Caption color="textSecondary">
                    {entry.mealType} • {Math.round(entry.nutrition.calories)} cal
                  </Caption>
                </View>
                <BodyText style={styles.mealCalories}>
                  {Math.round(entry.nutrition.calories)}
                </BodyText>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.sm,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  viewModeCard: {
    marginBottom: SPACING.sm,
    padding: SPACING.xs,
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.xs,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  viewModeTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  progressCard: {
    marginBottom: SPACING.sm,
  },
  progressItem: {
    marginBottom: SPACING.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  progressLabel: {
    fontWeight: '500',
  },
  progressValue: {
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  emptyState: {
    marginBottom: SPACING.sm,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  emptyButton: {
    minWidth: 150,
  },
  recentMeals: {
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontWeight: '500',
    marginBottom: 2,
  },
  mealCalories: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});