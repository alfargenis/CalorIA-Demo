/**
 * CalorIA - Chart Components
 * Professional charts for nutrition data visualization
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart, ProgressChart, BarChart } from 'react-native-chart-kit';
import { BodyText, Caption } from './Typography';
import { COLORS, SPACING } from '../../utils/constants';

const screenWidth = Dimensions.get('window').width;

interface CalorieProgressChartProps {
  data: {
    calories: { current: number; goal: number; percentage: number };
    protein: { current: number; goal: number; percentage: number };
    carbs: { current: number; goal: number; percentage: number };
    fat: { current: number; goal: number; percentage: number };
  };
}

interface WeeklyChartProps {
  weeklyData: {
    labels: string[];
    calories: number[];
    target: number;
  };
}

interface MacroDistributionProps {
  data: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const CalorieProgressChart: React.FC<CalorieProgressChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Cal', 'Prot', 'Carb', 'Gras'],
    data: [
      Math.min(data.calories.percentage / 100, 1),
      Math.min(data.protein.percentage / 100, 1),
      Math.min(data.carbs.percentage / 100, 1),
      Math.min(data.fat.percentage / 100, 1),
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
  };

  return (
    <View style={styles.chartContainer}>
      <BodyText style={styles.chartTitle}>Progreso Nutricional Diario</BodyText>
      <ProgressChart
        data={chartData}
        width={screenWidth - 60}
        height={180}
        strokeWidth={8}
        radius={25}
        chartConfig={chartConfig}
        hideLegend={false}
        style={styles.chart}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Caption>Calorías: {Math.round(data.calories.current)}/{data.calories.goal}</Caption>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
          <Caption>Proteína: {Math.round(data.protein.current)}g</Caption>
        </View>
      </View>
    </View>
  );
};

export const WeeklyCaloriesChart: React.FC<WeeklyChartProps> = ({ weeklyData }) => {
  const chartData = {
    labels: weeklyData.labels,
    datasets: [
      {
        data: weeklyData.calories,
        color: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: Array(7).fill(weeklyData.target),
        color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
        strokeWidth: 2,
        strokeDashArray: [5, 5],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(113, 128, 150, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  return (
    <View style={styles.chartContainer}>
      <BodyText style={styles.chartTitle}>Calorías Esta Semana</BodyText>
      <LineChart
        data={chartData}
        width={screenWidth - 60}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        fromZero
        segments={4}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Caption>Consumido</Caption>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.secondary }]} />
          <Caption>Meta Diaria</Caption>
        </View>
      </View>
    </View>
  );
};

export const MacroDistributionChart: React.FC<MacroDistributionProps> = ({ data }) => {
  const total = data.protein + data.carbs + data.fat;
  
  const chartData = {
    labels: ['Proteína', 'Carbohidratos', 'Grasas'],
    datasets: [
      {
        data: [
          Math.round((data.protein / total) * 100),
          Math.round((data.carbs / total) * 100),
          Math.round((data.fat / total) * 100),
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1, index?: number) => {
      const colors = [COLORS.primary, COLORS.secondary, COLORS.success];
      return colors[index || 0] || `rgba(0, 200, 150, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(113, 128, 150, ${opacity})`,
  };

  return (
    <View style={styles.chartContainer}>
      <BodyText style={styles.chartTitle}>Distribución de Macros</BodyText>
      <BarChart
        data={chartData}
        width={screenWidth - 60}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
        verticalLabelRotation={0}
        showValuesOnTopOfBars
        fromZero
      />
      <View style={styles.macroStats}>
        <View style={styles.macroStatItem}>
          <Caption color="textSecondary">Proteína</Caption>
          <BodyText style={styles.macroValue}>{Math.round(data.protein)}g</BodyText>
        </View>
        <View style={styles.macroStatItem}>
          <Caption color="textSecondary">Carbos</Caption>
          <BodyText style={styles.macroValue}>{Math.round(data.carbs)}g</BodyText>
        </View>
        <View style={styles.macroStatItem}>
          <Caption color="textSecondary">Grasas</Caption>
          <BodyText style={styles.macroValue}>{Math.round(data.fat)}g</BodyText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontWeight: '600',
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.text,
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  macroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroStatItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontWeight: '600',
    marginTop: SPACING.xs,
    color: COLORS.primary,
  },
});