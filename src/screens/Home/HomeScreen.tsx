/**
 * CalorIA - Home Screen (Dashboard)
 * Main dashboard with daily nutrition overview
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useFoodStore } from '../../store/foodStore';
import { useUserStore } from '../../store/userStore';
import { COLORS, SPACING } from '../../utils/constants';

export const HomeScreen = () => {
  const { user } = useUserStore();
  const { 
    todayStats, 
    calculateDailyNutrition, 
    getTodayEntries,
    isLoading 
  } = useFoodStore();

  useEffect(() => {
    calculateDailyNutrition();
  }, []);

  const handleRefresh = () => {
    calculateDailyNutrition();
  };

  const todayEntries = getTodayEntries();
  const hasEntries = todayEntries.length > 0;

  const getNutritionColor = (percentage: number) => {
    if (percentage < 90) return COLORS.error;
    if (percentage > 110) return COLORS.secondary;
    return COLORS.success;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Heading2>
            ¡Hola, {user?.displayName || 'Usuario'}! 👋
          </Heading2>
          <Caption color="textSecondary">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Caption>
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Heading3 style={styles.sectionTitle}>
            Acciones Rápidas
          </Heading3>
          <View style={styles.actionButtons}>
            <Button
              title="📸 Escanear Comida"
              onPress={() => {}}
              variant="primary"
              style={styles.actionButton}
            />
            <Button
              title="➕ Agregar Manual"
              onPress={() => {}}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </Card>

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
              <BodyText style={styles.emptyEmoji}>🍽️</BodyText>
              <Heading3 align="center" style={styles.emptyTitle}>
                ¡Registra tu primera comida!
              </Heading3>
              <BodyText align="center" color="textSecondary" style={styles.emptyDescription}>
                Usa la cámara para escanear tu comida o agrégala manualmente para comenzar a trackear tus calorías.
              </BodyText>
              <Button
                title="Comenzar Ahora"
                onPress={() => {}}
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
                onPress={() => {}}
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
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  quickActions: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  progressCard: {
    marginBottom: SPACING.md,
  },
  progressItem: {
    marginBottom: SPACING.md,
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
    marginBottom: SPACING.md,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 48,
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
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
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