/**
 * CalorIA - TypeScript Type Definitions
 */

// Auth Types
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  profile?: UserProfile;
  subscription?: Subscription;
  onboardingCompleted?: boolean;
  stats?: UserStats;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysTracked: number;
  totalMealsLogged: number;
  avgCaloriesPerDay: number;
  lastActivityDate: Date;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  targetWeight: number; // kg - peso objetivo
  bmi: number;
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  activityLevel: keyof typeof import('../utils/constants').ACTIVITY_LEVELS;
  goalType: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'gain_muscle' | 'improve_health';
  weeklyGoal: number; // kg per week (0.25, 0.5, 0.75)
  targetDate: Date; // fecha objetivo proyectada
  goals: NutritionGoals;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  language: 'es' | 'en';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  mealReminders: boolean;
  waterReminders: boolean;
  goalAchievements: boolean;
  weeklyReports: boolean;
}

export interface PrivacySettings {
  shareData: boolean;
  analytics: boolean;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'annual';
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  trialEndsAt?: Date;
  isActive: boolean;
}

// Food and Nutrition Types
export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  nutrition: NutritionData;
  servingSize: ServingSize;
  category: FoodCategory;
  imageUrl?: string;
  verified: boolean;
}

export interface NutritionData {
  calories: number;
  protein: number;     // grams
  carbs: number;       // grams
  fat: number;         // grams
  fiber: number;       // grams
  sugar: number;       // grams
  sodium: number;      // mg
  cholesterol: number; // mg
  saturatedFat: number; // grams
  transFat: number;    // grams
  potassium: number;   // mg
  calcium: number;     // mg
  iron: number;        // mg
  vitaminA: number;    // IU
  vitaminC: number;    // mg
}

export interface ServingSize {
  amount: number;
  unit: string;
  grams: number;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number; // mg
}

export interface FoodEntry {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  quantity: number;
  servingSize: ServingSize;
  mealType: MealType;
  date: Date;
  nutrition: NutritionData;
  imageUrl?: string;
  notes?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'supplement';

export type FoodCategory =
  | 'fruits'
  | 'vegetables'
  | 'grains'
  | 'protein'
  | 'dairy'
  | 'fats'
  | 'beverages'
  | 'snacks'
  | 'prepared'
  | 'supplement'
  | 'unknown';

// Supplement Types
export interface SupplementEntry extends Omit<FoodEntry, 'mealType'> {
  mealType: 'supplement';
  supplement: SupplementInfo;
}

export interface SupplementInfo {
  type: SupplementType;
  brand: string;
  dosage: SupplementDosage;
  frequency: SupplementFrequency;
  timing: SupplementTiming;
  warnings?: SupplementWarning[];
  cycleInfo?: CycleInfo;
}

export type SupplementType =
  | 'protein_powder'      // Proteína en polvo
  | 'creatine'            // Creatina
  | 'pre_workout'         // Pre-entreno
  | 'post_workout'        // Post-entreno
  | 'bcaa'                // Aminoácidos ramificados
  | 'vitamins'            // Vitaminas
  | 'minerals'            // Minerales
  | 'omega3'              // Omega 3
  | 'testosterone'        // Testosterona (⚠️)
  | 'anabolic_steroid'    // Esteroides anabólicos (⚠️⚠️)
  | 'sarm'                // SARMs (⚠️⚠️)
  | 'growth_hormone'      // Hormona de crecimiento (⚠️⚠️)
  | 'other';

export interface SupplementDosage {
  amount: number;
  unit: 'g' | 'mg' | 'mcg' | 'ml' | 'iu' | 'scoop' | 'capsule' | 'tablet';
  perServing: boolean;
}

export type SupplementFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'before_workout'
  | 'after_workout'
  | 'as_needed'
  | 'cycling';

export type SupplementTiming =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'before_bed'
  | 'pre_workout'
  | 'post_workout'
  | 'with_meal'
  | 'empty_stomach';

export interface SupplementWarning {
  level: 'info' | 'caution' | 'danger' | 'critical';
  message: string;
  recommendation: string;
  learnMoreUrl?: string;
}

export interface CycleInfo {
  isOnCycle: boolean;
  cycleStartDate: Date;
  cycleEndDate?: Date;
  cycleDuration: number; // weeks
  offCycleDuration?: number; // weeks
  pct?: boolean; // Post Cycle Therapy
}

// AI Recognition Types
export interface FoodRecognitionResult {
  confidence: number;
  foods: RecognizedFood[];
  imageUrl: string;
  processingTime: number;
}

export interface RecognizedFood {
  name: string;
  confidence: number;
  boundingBox?: BoundingBox;
  nutrition?: NutritionData;
  servingSize?: ServingSize;
  alternatives?: string[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Dashboard and Analytics Types
export interface DailyStats {
  date: Date;
  nutrition: NutritionData;
  goals: NutritionGoals;
  progress: NutritionProgress;
  meals: FoodEntry[];
  waterIntake: number; // ml
}

export interface NutritionProgress {
  calories: ProgressData;
  protein: ProgressData;
  carbs: ProgressData;
  fat: ProgressData;
  fiber: ProgressData;
}

export interface ProgressData {
  current: number;
  goal: number;
  percentage: number;
  status: 'under' | 'on-track' | 'over';
}

export interface WeeklyReport {
  startDate: Date;
  endDate: Date;
  averageCalories: number;
  averageWeight?: number;
  adherenceRate: number; // percentage
  achievements: Achievement[];
  trends: NutritionTrend[];
}

export interface Achievement {
  id: string;
  type: 'goal_met' | 'streak' | 'milestone';
  title: string;
  description: string;
  iconName: string;
  unlockedAt: Date;
}

export interface NutritionTrend {
  nutrient: keyof NutritionData;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number; // percentage
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Camera: undefined;
  History: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  AddFood: { mealType?: MealType };
  FoodDetails: { foodId: string };
  EditEntry: { entryId: string };
};

export type CameraStackParamList = {
  CameraView: undefined;
  FoodRecognition: { imageUri: string };
  ConfirmFood: { recognitionResult: FoodRecognitionResult };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditGoals: undefined;
  Notifications: undefined;
  Subscription: undefined;
  Support: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export type ErrorCode = 
  | 'AUTH_ERROR'
  | 'NETWORK_ERROR'
  | 'PERMISSION_ERROR'
  | 'SUBSCRIPTION_ERROR'
  | 'AI_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';