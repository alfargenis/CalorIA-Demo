/**
 * CalorIA - Confirmation Screen
 * Edit and confirm AI-detected food before saving
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { TextInput } from '../../components/UI/TextInput';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { CameraService } from '../../services/CameraService';
import { useFoodStore } from '../../store/foodStore';
import { useUserStore } from '../../store/userStore';
import { firebaseService } from '../../services/FirebaseService';
import { COLORS, SPACING } from '../../utils/constants';
import type { FoodRecognitionResult, MealType, FoodEntry } from '../../types';

type CameraStackParamList = {
  Camera: undefined;
  Processing: {
    imageUri: string;
  };
  Confirmation: {
    imageUri: string;
    recognitionResult: FoodRecognitionResult;
  };
};

type ConfirmationScreenRouteProp = RouteProp<CameraStackParamList, 'Confirmation'>;
type ConfirmationScreenNavigationProp = StackNavigationProp<CameraStackParamList, 'Confirmation'>;

interface Props {
  route: ConfirmationScreenRouteProp;
  navigation: ConfirmationScreenNavigationProp;
}

const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Desayuno', emoji: '🌅' },
  { value: 'lunch', label: 'Almuerzo', emoji: '☀️' },
  { value: 'dinner', label: 'Cena', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍪' },
];

export const ConfirmationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { imageUri, recognitionResult } = route.params;
  const { addFoodEntry } = useFoodStore();
  const { user } = useUserStore();
  
  const [selectedFood, setSelectedFood] = useState(recognitionResult.detectedFood);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [portionAmount, setPortionAmount] = useState(recognitionResult.suggestedPortion.amount.toString());
  const [portionUnit, setPortionUnit] = useState(recognitionResult.suggestedPortion.unit);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get food details from service
  const foodDetails = CameraService.getFoodById(selectedFood.id);
  const portionGrams = recognitionResult.suggestedPortion.grams;

  // Calculate nutrition based on portion
  const calculateNutrition = () => {
    if (!foodDetails) return recognitionResult.nutrition;
    
    const multiplier = (parseFloat(portionAmount) || 1) * portionGrams / 100; // Base nutrition is per 100g
    
    return {
      calories: foodDetails.nutrition.calories * multiplier,
      protein: foodDetails.nutrition.protein * multiplier,
      carbs: foodDetails.nutrition.carbs * multiplier,
      fat: foodDetails.nutrition.fat * multiplier,
      fiber: foodDetails.nutrition.fiber * multiplier,
      sugar: foodDetails.nutrition.sugar * multiplier,
      sodium: foodDetails.nutrition.sodium * multiplier,
      cholesterol: foodDetails.nutrition.cholesterol * multiplier,
      saturatedFat: foodDetails.nutrition.saturatedFat * multiplier,
      transFat: foodDetails.nutrition.transFat * multiplier,
      potassium: foodDetails.nutrition.potassium * multiplier,
      calcium: foodDetails.nutrition.calcium * multiplier,
      iron: foodDetails.nutrition.iron * multiplier,
      vitaminA: foodDetails.nutrition.vitaminA * multiplier,
      vitaminC: foodDetails.nutrition.vitaminC * multiplier,
    };
  };

  const currentNutrition = calculateNutrition();

  const handleSaveFood = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar alimentos');
      return;
    }

    setIsLoading(true);

    try {
      const foodEntry: Omit<FoodEntry, 'id'> = {
        userId: user.id,
        foodId: selectedFood.id,
        food: selectedFood,
        quantity: parseFloat(portionAmount) || 1,
        servingSize: {
          amount: parseFloat(portionAmount) || 1,
          unit: portionUnit,
          grams: portionGrams * (parseFloat(portionAmount) || 1),
        },
        nutrition: currentNutrition,
        mealType: selectedMealType,
        date: new Date(),
        imageUrl: imageUri,
        notes: notes.trim() || undefined,
      };

      const entryId = await firebaseService.saveFoodEntry(foodEntry);

      if (entryId) {
        addFoodEntry(foodEntry);

        await firebaseService.updateStreak(user.id);

        const stats = user.stats || {
          currentStreak: 0,
          longestStreak: 0,
          totalDaysTracked: 0,
          totalMealsLogged: 0,
          avgCaloriesPerDay: 0,
          lastActivityDate: new Date(),
        };

        await firebaseService.saveUserStats(user.id, {
          ...stats,
          totalMealsLogged: stats.totalMealsLogged + 1,
        });

        console.log('✅ Food entry saved successfully to Firestore');
      }

      Alert.alert(
        '¡Éxito! 🎉',
        `${selectedFood.name} ha sido agregado a tu historial nutricional.`,
        [
          {
            text: 'Ver Historial',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Camera' }],
              });
            },
          },
          {
            text: 'Agregar Más',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Camera' }],
              });
            },
            style: 'default',
          },
        ]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar el alimento. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternativeFood = (alternativeFood: any) => {
    setSelectedFood(alternativeFood.food);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return COLORS.success;
    if (confidence >= 0.8) return COLORS.primary;
    if (confidence >= 0.7) return COLORS.secondary;
    return COLORS.error;
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Muy Alta';
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.7) return 'Media';
    return 'Baja';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.title}>Confirma tu Comida</Heading2>
          <Caption color="textSecondary">
            Revisa y edita la información antes de guardar
          </Caption>
        </View>

        {/* Detection Result */}
        <Card style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Image
              source={{ uri: imageUri }}
              style={styles.resultImage}
              resizeMode="cover"
            />
            <View style={styles.resultInfo}>
              <View style={styles.detectionBadge}>
                <BodyText style={styles.detectionEmoji}>
                  {foodDetails?.emoji || '🍽️'}
                </BodyText>
                <BodyText style={styles.detectionName}>
                  {selectedFood.name}
                </BodyText>
              </View>
              <View style={styles.confidenceContainer}>
                <View style={[
                  styles.confidenceBadge,
                  { backgroundColor: getConfidenceColor(recognitionResult.confidence) }
                ]}>
                  <Caption style={styles.confidenceText}>
                    {getConfidenceLabel(recognitionResult.confidence)} • {Math.round(recognitionResult.confidence * 100)}%
                  </Caption>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Alternatives */}
        {recognitionResult.alternatives.length > 0 && (
          <Card style={styles.alternativesCard}>
            <Heading3 style={styles.sectionTitle}>
              ¿No es correcto? Prueba estas opciones:
            </Heading3>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.alternatives}>
                {recognitionResult.alternatives.map((alt, index) => {
                  const altDetails = CameraService.getFoodById(alt.food.id);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.alternativeItem}
                      onPress={() => handleAlternativeFood(alt)}
                    >
                      <BodyText style={styles.alternativeEmoji}>
                        {altDetails?.emoji || '🍽️'}
                      </BodyText>
                      <Caption style={styles.alternativeName}>
                        {alt.food.name}
                      </Caption>
                      <Caption color="textSecondary" style={styles.alternativeConfidence}>
                        {Math.round(alt.confidence * 100)}%
                      </Caption>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Card>
        )}

        {/* Portion Editor */}
        <Card style={styles.portionCard}>
          <Heading3 style={styles.sectionTitle}>Cantidad Consumida</Heading3>
          <View style={styles.portionEditor}>
            <View style={styles.portionInputs}>
              <View style={styles.portionInput}>
                <Caption color="textSecondary">Cantidad</Caption>
                <TextInput
                  value={portionAmount}
                  onChangeText={setPortionAmount}
                  placeholder="1"
                  keyboardType="numeric"
                  style={styles.amountInput}
                />
              </View>
              <View style={styles.portionUnit}>
                <Caption color="textSecondary">Unidad</Caption>
                <BodyText style={styles.unitText}>{portionUnit}</BodyText>
              </View>
            </View>
            <Caption color="textSecondary" style={styles.portionNote}>
              ≈ {Math.round(portionGrams * (parseFloat(portionAmount) || 1))}g total
            </Caption>
          </View>
        </Card>

        {/* Meal Type Selector */}
        <Card style={styles.mealTypeCard}>
          <Heading3 style={styles.sectionTitle}>Tipo de Comida</Heading3>
          <View style={styles.mealTypes}>
            {MEAL_TYPES.map((mealType) => (
              <TouchableOpacity
                key={mealType.value}
                style={[
                  styles.mealTypeButton,
                  selectedMealType === mealType.value && styles.mealTypeButtonActive
                ]}
                onPress={() => setSelectedMealType(mealType.value)}
              >
                <BodyText style={styles.mealTypeEmoji}>
                  {mealType.emoji}
                </BodyText>
                <Caption style={[
                  styles.mealTypeLabel,
                  selectedMealType === mealType.value && styles.mealTypeLabelActive
                ]}>
                  {mealType.label}
                </Caption>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Nutrition Summary */}
        <Card style={styles.nutritionCard}>
          <Heading3 style={styles.sectionTitle}>Información Nutricional</Heading3>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <BodyText style={styles.nutritionValue}>
                {Math.round(currentNutrition.calories)}
              </BodyText>
              <Caption color="textSecondary">Calorías</Caption>
            </View>
            <View style={styles.nutritionItem}>
              <BodyText style={styles.nutritionValue}>
                {Math.round(currentNutrition.protein)}g
              </BodyText>
              <Caption color="textSecondary">Proteína</Caption>
            </View>
            <View style={styles.nutritionItem}>
              <BodyText style={styles.nutritionValue}>
                {Math.round(currentNutrition.carbs)}g
              </BodyText>
              <Caption color="textSecondary">Carbos</Caption>
            </View>
            <View style={styles.nutritionItem}>
              <BodyText style={styles.nutritionValue}>
                {Math.round(currentNutrition.fat)}g
              </BodyText>
              <Caption color="textSecondary">Grasas</Caption>
            </View>
          </View>
          
          {currentNutrition.fiber > 0 && (
            <View style={styles.additionalNutrition}>
              <Caption color="textSecondary">
                Fibra: {Math.round(currentNutrition.fiber)}g • 
                Azúcar: {Math.round(currentNutrition.sugar)}g • 
                Sodio: {Math.round(currentNutrition.sodium)}mg
              </Caption>
            </View>
          )}
        </Card>

        {/* Notes */}
        <Card style={styles.notesCard}>
          <Heading3 style={styles.sectionTitle}>Notas (Opcional)</Heading3>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Agregar notas sobre esta comida..."
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Volver a Tomar Foto"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title={isLoading ? "Guardando..." : "Guardar Comida"}
            onPress={handleSaveFood}
            disabled={isLoading}
            style={[styles.actionButton, styles.saveButton]}
          />
        </View>
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
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  resultCard: {
    marginBottom: SPACING.md,
  },
  resultHeader: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detectionEmoji: {
    fontSize: 24,
  },
  detectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  confidenceContainer: {
    alignItems: 'flex-start',
  },
  confidenceBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  confidenceText: {
    color: COLORS.surface,
    fontWeight: '500',
    fontSize: 12,
  },
  alternativesCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  alternatives: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  alternativeItem: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    minWidth: 80,
  },
  alternativeEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  alternativeName: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontSize: 12,
  },
  alternativeConfidence: {
    fontSize: 10,
  },
  portionCard: {
    marginBottom: SPACING.md,
  },
  portionEditor: {
    gap: SPACING.md,
  },
  portionInputs: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  portionInput: {
    flex: 1,
  },
  amountInput: {
    marginTop: SPACING.xs,
  },
  portionUnit: {
    flex: 2,
  },
  unitText: {
    marginTop: SPACING.sm,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  portionNote: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mealTypeCard: {
    marginBottom: SPACING.md,
  },
  mealTypes: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  mealTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  mealTypeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  mealTypeEmoji: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  mealTypeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  mealTypeLabelActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  nutritionCard: {
    marginBottom: SPACING.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  additionalNutrition: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notesCard: {
    marginBottom: SPACING.lg,
  },
  notesInput: {
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});