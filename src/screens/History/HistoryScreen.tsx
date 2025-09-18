/**
 * CalorIA - History Screen
 * Food history and nutrition analytics
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useFoodStore } from '../../store/foodStore';
import { COLORS, SPACING } from '../../utils/constants';
import type { FoodEntry } from '../../types';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export const HistoryScreen = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const { foodEntries, getTodayEntries } = useFoodStore();

  const todayEntries = getTodayEntries();

  const renderEntry = ({ item }: { item: FoodEntry }) => (
    <Card style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.entryInfo}>
          <BodyText style={styles.entryName}>
            {item.food.name}
          </BodyText>
          <Caption color="textSecondary">
            {item.mealType} • {new Date(item.date).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Caption>
        </View>
        <View style={styles.entryStats}>
          <BodyText style={styles.entryCalories}>
            {Math.round(item.nutrition.calories)} cal
          </BodyText>
        </View>
      </View>
      
      <View style={styles.entryMacros}>
        <View style={styles.macroItem}>
          <Caption color="textSecondary">P</Caption>
          <Caption>{Math.round(item.nutrition.protein)}g</Caption>
        </View>
        <View style={styles.macroItem}>
          <Caption color="textSecondary">C</Caption>
          <Caption>{Math.round(item.nutrition.carbs)}g</Caption>
        </View>
        <View style={styles.macroItem}>
          <Caption color="textSecondary">G</Caption>
          <Caption>{Math.round(item.nutrition.fat)}g</Caption>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
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

        {/* Summary Stats */}
        <Card style={styles.summaryCard}>
          <Heading3 style={styles.summaryTitle}>
            Resumen de Hoy
          </Heading3>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {todayEntries.reduce((total, entry) => total + entry.nutrition.calories, 0).toFixed(0)}
              </BodyText>
              <Caption color="textSecondary">Calorías</Caption>
            </View>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {todayEntries.length}
              </BodyText>
              <Caption color="textSecondary">Comidas</Caption>
            </View>
            <View style={styles.summaryItem}>
              <BodyText style={styles.summaryValue}>
                {todayEntries.reduce((total, entry) => total + entry.nutrition.protein, 0).toFixed(0)}g
              </BodyText>
              <Caption color="textSecondary">Proteína</Caption>
            </View>
          </View>
        </Card>

        {/* Entries List */}
        <View style={styles.entriesContainer}>
          <View style={styles.entriesHeader}>
            <Heading3>
              {viewMode === 'daily' ? 'Hoy' : viewMode === 'weekly' ? 'Esta Semana' : 'Este Mes'}
            </Heading3>
            <Caption color="textSecondary">
              {todayEntries.length} {todayEntries.length === 1 ? 'entrada' : 'entradas'}
            </Caption>
          </View>

          {todayEntries.length > 0 ? (
            <FlatList
              data={todayEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
              renderItem={renderEntry}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.entriesList}
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
  entryName: {
    fontWeight: '500',
    marginBottom: 2,
  },
  entryStats: {
    alignItems: 'flex-end',
  },
  entryCalories: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  entryMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroItem: {
    alignItems: 'center',
    gap: 2,
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