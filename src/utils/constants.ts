/**
 * CalorIA - Constants and Configuration
 * Colors, sizes, and app configuration
 */

// Color Palette
export const COLORS = {
  primary: '#00C896',      // Verde Esmeralda
  secondary: '#FF6B35',    // Naranja Vibrante
  success: '#38A169',      // Verde Éxito
  error: '#E53E3E',        // Rojo Alerta
  text: '#2D3748',         // Gris Oscuro
  textSecondary: '#718096', // Gris Medio
  background: '#F7FAFC',   // Gris Muy Claro
  surface: '#FFFFFF',      // Blanco
  border: '#E2E8F0',       // Gris Borde
  
  // Additional UI colors
  disabled: '#A0AEC0',
  placeholder: '#9CA3AF',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

// Typography
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// App Configuration
export const APP_CONFIG = {
  name: 'CalorIA',
  version: '1.0.0',
  trialDays: 30,
  pricing: {
    monthly: 1.50,
    annual: 10.00,
  },
  limits: {
    freePhotosPerDay: 5,
    maxHistoryDays: 7,
  },
} as const;

// Nutrition Goals (default values)
export const DEFAULT_NUTRITION_GOALS = {
  calories: 2000,
  protein: 150,  // grams
  carbs: 250,    // grams
  fat: 67,       // grams
  fiber: 25,     // grams
  sugar: 50,     // grams
  sodium: 2300,  // mg (recommended daily limit)
} as const;

// User Activity Levels
export const ACTIVITY_LEVELS = {
  sedentary: { multiplier: 1.2, label: 'Sedentario' },
  lightlyActive: { multiplier: 1.375, label: 'Ligeramente activo' },
  moderatelyActive: { multiplier: 1.55, label: 'Moderadamente activo' },
  veryActive: { multiplier: 1.725, label: 'Muy activo' },
  extraActive: { multiplier: 1.9, label: 'Extremadamente activo' },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  nutritionix: 'https://trackapi.nutritionix.com/v2',
  edamam: 'https://api.edamam.com/api/food-database/v2',
  vision: 'https://vision.googleapis.com/v1',
} as const;

// Screen Dimensions (responsive breakpoints)
export const SCREEN_BREAKPOINTS = {
  sm: 320,
  md: 375,
  lg: 414,
  xl: 768,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;