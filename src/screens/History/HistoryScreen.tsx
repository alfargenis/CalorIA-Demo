/**
 * CalorIA - History Screen
 * Food history and nutrition analytics
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useFoodStore } from '../../store/foodStore';
import { COLORS, SPACING } from '../../utils/constants';
import type { FoodEntry, MealType } from '../../types';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export const HistoryScreen = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    foodEntries, 
    getTodayEntries, 
    calculateDailyNutrition,
    isLoading 
  } = useFoodStore();

  const mealTypes: { value: MealType | 'all'; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'breakfast', label: 'Desayuno' },
    { value: 'lunch', label: 'Almuerzo' },
    { value: 'dinner', label: 'Cena' },
    { value: 'snack', label: 'Snack' },
  ];

  // Get entries based on view mode and filters
  const filteredEntries = useMemo(() => {
    let entries: FoodEntry[] = [];
    const now = new Date();

    switch (viewMode) {
      case 'daily':
        entries = getTodayEntries();
        break;
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        entries = foodEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= weekStart;
        });
        break;
      case 'monthly':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        entries = foodEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= monthStart;
        });
        break;
    }

    // Filter by meal type
    if (selectedMealType !== 'all') {
      entries = entries.filter(entry => entry.mealType === selectedMealType);
    }

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [viewMode, selectedMealType, foodEntries, getTodayEntries]);

  // Calculate summary stats for filtered entries
  const summaryStats = useMemo(() => {
    const totalCalories = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0);
    const totalProtein = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.protein, 0);
    const totalCarbs = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.carbs, 0);
    const totalFat = filteredEntries.reduce((sum, entry) => sum + entry.nutrition.fat, 0);

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      meals: filteredEntries.length,
    };
  }, [filteredEntries]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    calculateDailyNutrition();
    // Simulate API call delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getMealTypeIcon = (mealType: MealType) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍪';
      default: return '🍽️';
    }
  };

  const getMealTypeLabel = (mealType: MealType) => {
    switch (mealType) {
      case 'breakfast': return 'Desayuno';
      case 'lunch': return 'Almuerzo';
      case 'dinner': return 'Cena';
      case 'snack': return 'Snack';
      default: return 'Comida';
    }
  };

  const renderEntry = ({ item }: { item: FoodEntry }) => (
    <Card style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.entryInfo}>
          <View style={styles.entryTitleRow}>
            <BodyText style={styles.entryIcon}>
              {getMealTypeIcon(item.mealType)}
            </BodyText>
            <BodyText style={styles.entryName}>
              {item.food.name}
            </BodyText>
          </View>
          <Caption color="textSecondary">
            {getMealTypeLabel(item.mealType)} • {new Date(item.date).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })} • {item.portion.amount} {item.portion.unit}
          </Caption>
        </View>
        <View style={styles.entryStats}>
          <BodyText style={styles.entryCalories}>
            {Math.round(item.nutrition.calories)}
          </BodyText>
          <Caption color="textSecondary">cal</Caption>
        </View>
      </View>
      
      <View style={styles.entryMacros}>
        <View style={styles.macroItem}>
          <View style={styles.macroHeader}>
            <Caption color="textSecondary">Proteína</Caption>
            <BodyText style={styles.macroValue}>
              {Math.round(item.nutrition.protein)}g
            </BodyText>
          </View>
        </View>
        <View style={styles.macroItem}>
          <View style={styles.macroHeader}>
            <Caption color="textSecondary">Carbos</Caption>
            <BodyText style={styles.macroValue}>
              {Math.round(item.nutrition.carbs)}g
            </BodyText>
          </View>
        </View>
        <View style={styles.macroItem}>
          <View style={styles.macroHeader}>
            <Caption color="textSecondary">Grasas</Caption>
            <BodyText style={styles.macroValue}>
              {Math.round(item.nutrition.fat)}g
            </BodyText>
          </View>
        </View>
      </View>

      {item.nutrition.fiber > 0 && (
        <View style={styles.additionalNutrition}>
          <Caption color="textSecondary">
            Fibra: {Math.round(item.nutrition.fiber)}g • 
            Azúcar: {Math.round(item.nutrition.sugar)}g •
            Sodio: {Math.round(item.nutrition.sodium)}mg
          </Caption>
        </View>
      )}

      {item.notes && (
        <View style={styles.notesSection}>
          <Caption color="textSecondary" style={styles.notes}>
            💭 {item.notes}
          </Caption>
        </View>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        {/* View Mode Selector */}
        <Card style={styles.selectorCard}>
          <View style={styles.selectorButtons}>
            <Button
              title="Diario"
              onPress={() => setViewMode('daily')}
              variant={viewMode === 'daily' ? 'primary' : 'outline'}
              size="small"
              style={styles.selectorButton}
            />
            <Button
              title="Semanal"
              onPress={() => setViewMode('weekly')}
              variant={viewMode === 'weekly' ? 'primary' : 'outline'}
              size="small"
              style={styles.selectorButton}
            />
            <Button
              title="Mensual"
              onPress={() => setViewMode('monthly')}
              variant={viewMode === 'monthly' ? 'primary' : 'outline'}
              size="small"
              style={styles.selectorButton}
            />
          </View>
        </Card>

        {/* Meal Type Filter */}
        <Card style={styles.filterCard}>
          <Heading3 style={styles.filterTitle}>Filtrar por Comida</Heading3>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mealFilters}
          >
            {mealTypes.map((mealType) => (
              <TouchableOpacity
                key={mealType.value}
                style={[
                  styles.mealFilterButton,
                  selectedMealType === mealType.value && styles.mealFilterButtonActive
                ]}
                onPress={() => setSelectedMealType(mealType.value)}
              >
                <BodyText style={[
                  styles.mealFilterText,
                  selectedMealType === mealType.value && styles.mealFilterTextActive
                ]}>
                  {mealType.label}
                </BodyText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>

        {/* Summary Stats */}
        <Card style={styles.summaryCard}>
          <Heading3 style={styles.summaryTitle}>
            Resumen {viewMode === 'daily' ? 'de Hoy' : viewMode === 'weekly' ? 'Semanal' : 'Mensual'}
          </Heading3>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {summaryStats.calories}
              </BodyText>
              <Caption color="textSecondary">Calorías</Caption>
            </View>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {summaryStats.meals}
              </BodyText>
              <Caption color="textSecondary">Comidas</Caption>
            </View>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {summaryStats.protein}g
              </BodyText>
              <Caption color="textSecondary">Proteína</Caption>
            </View>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {summaryStats.carbs}g
              </BodyText>
              <Caption color="textSecondary">Carbos</Caption>
            </View>
          </View>
        </Card>

        {/* Entries List */}
        <View style={styles.entriesContainer}>
          <View style={styles.entriesHeader}>
            <Heading3>
              {viewMode === 'daily' ? 'Hoy' : viewMode === 'weekly' ? 'Esta Semana' : 'Este Mes'}
              {selectedMealType !== 'all' && ` • ${mealTypes.find(m => m.value === selectedMealType)?.label}`}
            </Heading3>
            <Caption color="textSecondary">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entrada' : 'entradas'}
            </Caption>
          </View>

          {filteredEntries.length > 0 ? (
            <FlatList
              data={filteredEntries}
              renderItem={renderEntry}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.entriesList}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
            />
          ) : (
            <Card style={styles.emptyState}>
              <View style={styles.emptyContent}>
                <BodyText style={styles.emptyEmoji}>📝</BodyText>
                <Heading3 align="center" style={styles.emptyTitle}>
                  No hay registros
                </Heading3>
                <BodyText align="center" color="textSecondary">
                  Comienza a registrar tus comidas para ver tu historial aquí.
                </BodyText>
              </View>
            </Card>
          )}
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
    padding: SPACING.md,
  },
  selectorCard: {
    marginBottom: SPACING.md,
  },
  selectorButtons: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  selectorButton: {
    flex: 1,
  },
  filterCard: {
    marginBottom: SPACING.md,
  },
  filterTitle: {
    marginBottom: SPACING.md,
  },
  mealFilters: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  mealFilterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealFilterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mealFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  mealFilterTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  summaryCard: {
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    marginBottom: SPACING.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  entriesContainer: {
    flex: 1,
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  entriesList: {
    gap: SPACING.sm,
  },
  entryCard: {
    padding: SPACING.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  entryIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  entryName: {
    fontWeight: '500',
    marginBottom: 2,
  },
  entryStats: {
    alignItems: 'flex-end',
  },
  entryCalories: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  entryMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroHeader: {
    alignItems: 'center',
  },
  macroValue: {
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  additionalNutrition: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notesSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notes: {
    fontStyle: 'italic',
  },
  emptyState: {},
  emptyContent: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    marginBottom: SPACING.sm,
  },
});