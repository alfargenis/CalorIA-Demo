/**
 * CalorIA - Edit Nutrition Goals Screen
 * Allow users to customize their daily nutrition targets
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useUserStore } from '../../store/userStore';
import { firebaseService } from '../../services/FirebaseService';
import { COLORS, SPACING } from '../../utils/constants';

export const EditGoalsScreen = () => {
  const navigation = useNavigation();
  const { user } = useUserStore();

  const [calories, setCalories] = useState(user?.profile?.goals.calories?.toString() || '2000');
  const [protein, setProtein] = useState(user?.profile?.goals.protein?.toString() || '150');
  const [carbs, setCarbs] = useState(user?.profile?.goals.carbs?.toString() || '250');
  const [fat, setFat] = useState(user?.profile?.goals.fat?.toString() || '65');

  const handleSave = async () => {
    if (!user) return;

    const updatedGoals = {
      calories: parseInt(calories) || 2000,
      protein: parseInt(protein) || 150,
      carbs: parseInt(carbs) || 250,
      fat: parseInt(fat) || 65,
      fiber: user.profile?.goals.fiber || 30,
      sugar: user.profile?.goals.sugar || 50,
      sodium: user.profile?.goals.sodium || 2300,
    };

    try {
      const updatedProfile = {
        ...user.profile,
        goals: updatedGoals,
      };

      await firebaseService.saveUserProfile(user.id, updatedProfile);

      Alert.alert(
        'Éxito',
        'Tus objetivos nutricionales han sido actualizados',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating goals:', error);
      Alert.alert('Error', 'No se pudieron actualizar los objetivos');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons
            name="arrow-back"
            size={28}
            color={COLORS.text}
            onPress={() => navigation.goBack()}
          />
          <Heading2 style={styles.screenTitle}>Editar Objetivos</Heading2>
        </View>

        <Card style={styles.infoCard}>
          <BodyText color="textSecondary">
            Personaliza tus objetivos nutricionales diarios según tus necesidades y metas.
          </BodyText>
        </Card>

        {/* Calories */}
        <Card style={styles.goalCard}>
          <Heading3 style={styles.goalLabel}>Calorías Diarias</Heading3>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              keyboardType="number-pad"
              placeholder="2000"
            />
            <Caption color="textSecondary">kcal</Caption>
          </View>
          <Caption color="textSecondary">Basado en tu TDEE: {user?.profile?.tdee?.toFixed(0) || '2000'} kcal</Caption>
        </Card>

        {/* Macros */}
        <Card style={styles.macrosCard}>
          <Heading3 style={styles.sectionTitle}>Macronutrientes</Heading3>

          {/* Protein */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <MaterialIcons name="fitness-center" size={20} color={COLORS.primary} />
              <BodyText style={styles.macroLabel}>Proteína</BodyText>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                keyboardType="number-pad"
                placeholder="150"
              />
              <Caption color="textSecondary">g</Caption>
            </View>
          </View>

          {/* Carbs */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <MaterialIcons name="grain" size={20} color="#FF9800" />
              <BodyText style={styles.macroLabel}>Carbohidratos</BodyText>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="number-pad"
                placeholder="250"
              />
              <Caption color="textSecondary">g</Caption>
            </View>
          </View>

          {/* Fat */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <MaterialIcons name="opacity" size={20} color="#FFC107" />
              <BodyText style={styles.macroLabel}>Grasas</BodyText>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={fat}
                onChangeText={setFat}
                keyboardType="number-pad"
                placeholder="65"
              />
              <Caption color="textSecondary">g</Caption>
            </View>
          </View>
        </Card>

        {/* Save Button */}
        <Button
          title="Guardar Cambios"
          onPress={handleSave}
          size="large"
          fullWidth
          style={styles.saveButton}
        />
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.background }} />
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  screenTitle: {
    flex: 1,
  },
  infoCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#E3F2FD',
  },
  goalCard: {
    marginBottom: SPACING.md,
  },
  goalLabel: {
    marginBottom: SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  macrosCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  macroItem: {
    marginBottom: SPACING.md,
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  macroLabel: {
    fontWeight: '600',
  },
  saveButton: {
    marginBottom: SPACING.xl,
  },
});
