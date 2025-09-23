/**
 * CalorIA - Profile Setup Screen
 * User personal information setup
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { TextInput } from '../../components/UI/TextInput';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStackNavigator';

type ProfileSetupScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'ProfileSetup'>;

interface Props {
  navigation: ProfileSetupScreenNavigationProp;
}

type Gender = 'male' | 'female' | 'other';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
}

const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'male', label: 'Masculino', emoji: '👨' },
  { value: 'female', label: 'Femenino', emoji: '👩' },
  { value: 'other', label: 'Otro', emoji: '🏳️‍⚧️' },
];

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { 
    value: 'sedentary', 
    label: 'Sedentario', 
    description: 'Poco o nada de ejercicio'
  },
  { 
    value: 'light', 
    label: 'Ligero', 
    description: 'Ejercicio ligero 1-3 días/semana'
  },
  { 
    value: 'moderate', 
    label: 'Moderado', 
    description: 'Ejercicio moderado 3-5 días/semana'
  },
  { 
    value: 'active', 
    label: 'Activo', 
    description: 'Ejercicio intenso 6-7 días/semana'
  },
  { 
    value: 'very_active', 
    label: 'Muy Activo', 
    description: 'Ejercicio muy intenso, trabajo físico'
  },
];

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 0,
    weight: 0,
    height: 0,
    gender: 'male',
    activityLevel: 'moderate',
  });

  const [ageText, setAgeText] = useState('');
  const [weightText, setWeightText] = useState('');
  const [heightText, setHeightText] = useState('');

  const handleNext = () => {
    // Validation
    const age = parseInt(ageText);
    const weight = parseFloat(weightText);
    const height = parseInt(heightText);

    if (!age || age < 13 || age > 120) {
      Alert.alert('Edad inválida', 'Por favor ingresa una edad entre 13 y 120 años');
      return;
    }

    if (!weight || weight < 30 || weight > 300) {
      Alert.alert('Peso inválido', 'Por favor ingresa un peso entre 30 y 300 kg');
      return;
    }

    if (!height || height < 100 || height > 250) {
      Alert.alert('Altura inválida', 'Por favor ingresa una altura entre 100 y 250 cm');
      return;
    }

    const userProfile: UserProfile = {
      age,
      weight,
      height,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
    };

    navigation.navigate('GoalsSetup', { userProfile });
  };

  const calculateBMI = () => {
    const weight = parseFloat(weightText);
    const height = parseInt(heightText);
    
    if (weight && height) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: COLORS.secondary };
    if (bmi < 25) return { label: 'Peso normal', color: COLORS.success };
    if (bmi < 30) return { label: 'Sobrepeso', color: COLORS.secondary };
    return { label: 'Obesidad', color: COLORS.error };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.title}>Cuéntanos sobre ti</Heading2>
          <Caption color="textSecondary" style={styles.subtitle}>
            Esta información nos ayuda a personalizar tus objetivos nutricionales
          </Caption>
        </View>

        {/* Basic Info */}
        <Card style={styles.section}>
          <Heading3 style={styles.sectionTitle}>Información Básica</Heading3>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Caption color="textSecondary">Edad</Caption>
              <TextInput
                value={ageText}
                onChangeText={setAgeText}
                placeholder="25"
                keyboardType="numeric"
                maxLength={3}
                style={styles.input}
              />
              <Caption color="textSecondary" style={styles.inputHint}>años</Caption>
            </View>
            
            <View style={styles.inputHalf}>
              <Caption color="textSecondary">Peso</Caption>
              <TextInput
                value={weightText}
                onChangeText={setWeightText}
                placeholder="70"
                keyboardType="decimal-pad"
                style={styles.input}
              />
              <Caption color="textSecondary" style={styles.inputHint}>kg</Caption>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Caption color="textSecondary">Altura</Caption>
            <TextInput
              value={heightText}
              onChangeText={setHeightText}
              placeholder="170"
              keyboardType="numeric"
              maxLength={3}
              style={styles.input}
            />
            <Caption color="textSecondary" style={styles.inputHint}>cm</Caption>
          </View>

          {/* BMI Display */}
          {bmi && bmiCategory && (
            <Card style={[styles.bmiCard, { borderColor: bmiCategory.color }]}>
              <View style={styles.bmiContent}>
                <BodyText style={styles.bmiLabel}>Tu IMC:</BodyText>
                <BodyText style={[styles.bmiValue, { color: bmiCategory.color }]}>
                  {bmi}
                </BodyText>
                <Caption style={[styles.bmiCategory, { color: bmiCategory.color }]}>
                  {bmiCategory.label}
                </Caption>
              </View>
            </Card>
          )}
        </Card>

        {/* Gender Selection */}
        <Card style={styles.section}>
          <Heading3 style={styles.sectionTitle}>Género</Heading3>
          <View style={styles.optionsContainer}>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  profile.gender === option.value && styles.optionButtonActive
                ]}
                onPress={() => setProfile(prev => ({ ...prev, gender: option.value }))}
              >
                <BodyText style={styles.optionEmoji}>{option.emoji}</BodyText>
                <BodyText style={[
                  styles.optionLabel,
                  profile.gender === option.value && styles.optionLabelActive
                ]}>
                  {option.label}
                </BodyText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Activity Level */}
        <Card style={styles.section}>
          <Heading3 style={styles.sectionTitle}>Nivel de Actividad</Heading3>
          <Caption color="textSecondary" style={styles.sectionDescription}>
            Esto nos ayuda a calcular tus necesidades calóricas diarias
          </Caption>
          
          <View style={styles.activityContainer}>
            {ACTIVITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.activityOption,
                  profile.activityLevel === level.value && styles.activityOptionActive
                ]}
                onPress={() => setProfile(prev => ({ ...prev, activityLevel: level.value }))}
              >
                <View style={styles.activityHeader}>
                  <BodyText style={[
                    styles.activityLabel,
                    profile.activityLevel === level.value && styles.activityLabelActive
                  ]}>
                    {level.label}
                  </BodyText>
                  {profile.activityLevel === level.value && (
                    <BodyText style={styles.checkmark}>✓</BodyText>
                  )}
                </View>
                <Caption style={[
                  styles.activityDescription,
                  profile.activityLevel === level.value && styles.activityDescriptionActive
                ]}>
                  {level.description}
                </Caption>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Privacy Note */}
        <Card style={styles.privacyCard}>
          <View style={styles.privacyContent}>
            <BodyText style={styles.privacyEmoji}>🔒</BodyText>
            <View style={styles.privacyText}>
              <BodyText style={styles.privacyTitle}>Tu privacidad es importante</BodyText>
              <Caption color="textSecondary">
                Esta información se almacena de forma segura en tu dispositivo y se usa únicamente para calcular tus objetivos nutricionales personalizados.
              </Caption>
            </View>
          </View>
        </Card>

        {/* Continue Button */}
        <Button
          title="Continuar"
          onPress={handleNext}
          size="large"
          fullWidth
          disabled={!ageText || !weightText || !heightText}
          style={styles.continueButton}
        />
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
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  sectionDescription: {
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  inputHalf: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  input: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  inputHint: {
    fontSize: 12,
  },
  bmiCard: {
    borderWidth: 2,
    backgroundColor: COLORS.surface,
  },
  bmiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  bmiLabel: {
    fontWeight: '500',
  },
  bmiValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  bmiCategory: {
    fontWeight: '600',
    fontSize: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  optionButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  optionLabel: {
    fontWeight: '500',
    color: COLORS.text,
  },
  optionLabelActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  activityContainer: {
    gap: SPACING.sm,
  },
  activityOption: {
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  activityOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  activityLabel: {
    fontWeight: '600',
    color: COLORS.text,
  },
  activityLabelActive: {
    color: COLORS.surface,
  },
  checkmark: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  activityDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  activityDescriptionActive: {
    color: COLORS.surface,
  },
  privacyCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  privacyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  privacyEmoji: {
    fontSize: 20,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  continueButton: {
    marginBottom: SPACING.xl,
  },
});