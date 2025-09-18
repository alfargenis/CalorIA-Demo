// 🚀 DEMO VERSION - Mock data and limited persistence
/**
 * CalorIA - Food Store (Zustand)
 * Manages food entries, daily stats, and nutrition tracking
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  FoodEntry, 
  DailyStats, 
  NutritionGoals, 
  MealType,
  FoodRecognitionResult 
} from '../types';
import { DEFAULT_NUTRITION_GOALS } from '../utils/constants';

interface FoodState {
  // State
  todayStats: DailyStats | null;
  foodEntries: FoodEntry[];
  nutritionGoals: NutritionGoals;
  isLoading: boolean;
  error: string | null;
  lastRecognitionResult: FoodRecognitionResult | null;

  // Actions
  addFoodEntry: (entry: Omit<FoodEntry, 'id'>) => void;
  updateFoodEntry: (id: string, updates: Partial<FoodEntry>) => void;
  deleteFoodEntry: (id: string) => void;
  setTodayStats: (stats: DailyStats) => void;
  updateNutritionGoals: (goals: Partial<NutritionGoals>) => void;
  setRecognitionResult: (result: FoodRecognitionResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Helper functions
  getTodayEntries: () => FoodEntry[];
  getEntriesByMeal: (mealType: MealType) => FoodEntry[];
  calculateDailyNutrition: () => void;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      // Initial state
      todayStats: null,
      foodEntries: [],
      nutritionGoals: DEFAULT_NUTRITION_GOALS,
      isLoading: false,
      error: null,
      lastRecognitionResult: null,

      // Actions
      addFoodEntry: (entryData) => {
        const entry: FoodEntry = {
          ...entryData,
          id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        set((state) => ({
          foodEntries: [...state.foodEntries, entry],
        }));

        // Recalculate daily stats
        get().calculateDailyNutrition();
      },

      updateFoodEntry: (id, updates) => {
        set((state) => ({
          foodEntries: state.foodEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));

        get().calculateDailyNutrition();
      },

      deleteFoodEntry: (id) => {
        set((state) => ({
          foodEntries: state.foodEntries.filter((entry) => entry.id !== id),
        }));

        get().calculateDailyNutrition();
      },

      setTodayStats: (todayStats) => {
        set({ todayStats });
      },

      updateNutritionGoals: (goalUpdates) => {
        set((state) => ({
          nutritionGoals: {
            ...state.nutritionGoals,
            ...goalUpdates,
          },
        }));

        get().calculateDailyNutrition();
      },

      setRecognitionResult: (lastRecognitionResult) => {
        set({ lastRecognitionResult });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      // Helper functions
      getTodayEntries: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return get().foodEntries.filter((entry) => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime();
        });
      },

      getEntriesByMeal: (mealType) => {
        return get().getTodayEntries().filter((entry) => entry.mealType === mealType);
      },

      calculateDailyNutrition: () => {
        const todayEntries = get().getTodayEntries();
        const goals = get().nutritionGoals;

        if (todayEntries.length === 0) {
          set({ todayStats: null });
          return;
        }

        // Calculate total nutrition for today
        const totalNutrition = todayEntries.reduce(
          (total, entry) => ({
            calories: total.calories + entry.nutrition.calories,
            protein: total.protein + entry.nutrition.protein,
            carbs: total.carbs + entry.nutrition.carbs,
            fat: total.fat + entry.nutrition.fat,
            fiber: total.fiber + entry.nutrition.fiber,
            sugar: total.sugar + entry.nutrition.sugar,
            sodium: total.sodium + entry.nutrition.sodium,
            cholesterol: total.cholesterol + entry.nutrition.cholesterol,
            saturatedFat: total.saturatedFat + entry.nutrition.saturatedFat,
            transFat: total.transFat + entry.nutrition.transFat,
            potassium: total.potassium + entry.nutrition.potassium,
            calcium: total.calcium + entry.nutrition.calcium,
            iron: total.iron + entry.nutrition.iron,
            vitaminA: total.vitaminA + entry.nutrition.vitaminA,
            vitaminC: total.vitaminC + entry.nutrition.vitaminC,
          }),
          {
            calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0,
            sodium: 0, cholesterol: 0, saturatedFat: 0, transFat: 0,
            potassium: 0, calcium: 0, iron: 0, vitaminA: 0, vitaminC: 0,
          }
        );

        // Calculate progress
        const progress = {
          calories: {
            current: totalNutrition.calories,
            goal: goals.calories,
            percentage: Math.round((totalNutrition.calories / goals.calories) * 100),
            status: totalNutrition.calories < goals.calories * 0.9 
              ? 'under' 
              : totalNutrition.calories > goals.calories * 1.1 
                ? 'over' 
                : 'on-track',
          },
          protein: {
            current: totalNutrition.protein,
            goal: goals.protein,
            percentage: Math.round((totalNutrition.protein / goals.protein) * 100),
            status: totalNutrition.protein < goals.protein * 0.9 
              ? 'under' 
              : totalNutrition.protein > goals.protein * 1.1 
                ? 'over' 
                : 'on-track',
          },
          carbs: {
            current: totalNutrition.carbs,
            goal: goals.carbs,
            percentage: Math.round((totalNutrition.carbs / goals.carbs) * 100),
            status: totalNutrition.carbs < goals.carbs * 0.9 
              ? 'under' 
              : totalNutrition.carbs > goals.carbs * 1.1 
                ? 'over' 
                : 'on-track',
          },
          fat: {
            current: totalNutrition.fat,
            goal: goals.fat,
            percentage: Math.round((totalNutrition.fat / goals.fat) * 100),
            status: totalNutrition.fat < goals.fat * 0.9 
              ? 'under' 
              : totalNutrition.fat > goals.fat * 1.1 
                ? 'over' 
                : 'on-track',
          },
          fiber: {
            current: totalNutrition.fiber,
            goal: goals.fiber,
            percentage: Math.round((totalNutrition.fiber / goals.fiber) * 100),
            status: totalNutrition.fiber < goals.fiber * 0.9 
              ? 'under' 
              : totalNutrition.fiber > goals.fiber * 1.1 
                ? 'over' 
                : 'on-track',
          },
        } as const;

        const dailyStats: DailyStats = {
          date: new Date(),
          nutrition: totalNutrition,
          goals,
          progress,
          meals: todayEntries,
          waterIntake: 0, // TODO: Implement water tracking
        };

        set({ todayStats: dailyStats });
      },
    }),
    {
      name: 'caloria-demo-food-store',
      partialize: (state) => ({
        foodEntries: state.foodEntries,
        nutritionGoals: state.nutritionGoals,
        todayStats: state.todayStats,
      }),
    }
  )
);