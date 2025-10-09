/**
 * CalorIA - Processing Screen
 * AI food recognition loading screen with animations
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { CameraService } from '../../services/CameraService';
import { useFoodStore } from '../../store/foodStore';
import { COLORS, SPACING } from '../../utils/constants';

type CameraStackParamList = {
  Camera: undefined;
  Processing: {
    imageUri: string;
  };
  Confirmation: {
    imageUri: string;
    recognitionResult: any;
  };
};

type ProcessingScreenRouteProp = RouteProp<CameraStackParamList, 'Processing'>;
type ProcessingScreenNavigationProp = StackNavigationProp<CameraStackParamList, 'Processing'>;

interface Props {
  route: ProcessingScreenRouteProp;
  navigation: ProcessingScreenNavigationProp;
}

const LOADING_MESSAGES = [
  'Analizando imagen...',
  'Identificando alimento...',
  'Calculando nutrición...',
  'Preparando resultados...',
];

export const ProcessingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { imageUri } = route.params;
  const { setRecognitionResult, setError } = useFoodStore();
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Animations
  const scaleAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    startProcessing();
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Rotating animation for the main icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing animation for the image
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Message cycling
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 600);

    // Progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 95));
    }, 200);

    // Cleanup
    setTimeout(() => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    }, 2500);
  };

  const startProcessing = async () => {
    try {
      const result = await CameraService.processImage(imageUri);
      setRecognitionResult(result);
      setProgress(100);
      
      // Small delay for UX
      setTimeout(() => {
        navigation.navigate('Confirmation', {
          imageUri,
          recognitionResult: {
            ...result,
            timestamp: result.timestamp.toISOString(), // Serialize Date to string
          },
        });
      }, 500);
    } catch (error) {
      console.error('Processing error:', error);
      setError('Error al procesar la imagen. Inténtalo de nuevo.');
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Heading2 style={styles.title}>Analizando Imagen</Heading2>
          <Caption color="textSecondary" style={styles.subtitle}>
            CalorIA está identificando tu comida usando inteligencia artificial
          </Caption>
        </View>

        {/* Image Preview */}
        <Card style={styles.imageCard}>
          <Animated.View style={[
            styles.imageContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            
            {/* Processing Overlay */}
            <View style={styles.processingOverlay}>
              <Animated.View style={[
                styles.processingIcon,
                { transform: [{ rotate }] }
              ]}>
                <BodyText style={styles.processingEmoji}>🧠</BodyText>
              </Animated.View>
            </View>
          </Animated.View>
        </Card>

        {/* Progress Section */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <BodyText style={styles.progressMessage}>
              {LOADING_MESSAGES[currentMessageIndex]}
            </BodyText>
            <Caption color="textSecondary">
              {Math.round(progress)}%
            </Caption>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]}
            />
          </View>

          {/* Processing Steps */}
          <View style={styles.stepsContainer}>
            {LOADING_MESSAGES.map((message, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={[
                  styles.stepIndicator,
                  index <= currentMessageIndex && styles.stepIndicatorActive
                ]}>
                  {index < currentMessageIndex ? (
                    <BodyText style={styles.stepCheckmark}>✓</BodyText>
                  ) : index === currentMessageIndex ? (
                    <Animated.View style={[
                      styles.stepLoader,
                      { transform: [{ rotate }] }
                    ]}>
                      <BodyText style={styles.stepLoaderText}>⟳</BodyText>
                    </Animated.View>
                  ) : (
                    <View style={styles.stepDot} />
                  )}
                </View>
                <Caption 
                  color={index <= currentMessageIndex ? "text" : "textSecondary"}
                  style={styles.stepText}
                >
                  {message}
                </Caption>
              </View>
            ))}
          </View>
        </Card>

        {/* AI Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoContent}>
            <BodyText style={styles.infoEmoji}>🎯</BodyText>
            <View style={styles.infoText}>
              <BodyText style={styles.infoTitle}>Reconocimiento Inteligente</BodyText>
              <Caption color="textSecondary">
                Utilizamos IA avanzada para identificar alimentos y calcular sus valores nutricionales automáticamente.
              </Caption>
            </View>
          </View>
        </Card>

        {/* Cancel Button */}
        <Button
          title="Cancelar"
          onPress={handleCancel}
          variant="outline"
          style={styles.cancelButton}
        />
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
  imageCard: {
    marginBottom: SPACING.lg,
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  processingEmoji: {
    fontSize: 28,
    color: COLORS.surface,
  },
  progressCard: {
    marginBottom: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressMessage: {
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  stepsContainer: {
    gap: SPACING.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  stepIndicatorActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  stepCheckmark: {
    fontSize: 12,
    color: COLORS.surface,
    fontWeight: '600',
  },
  stepLoader: {
    width: 16,
    height: 16,
  },
  stepLoaderText: {
    fontSize: 14,
    color: COLORS.surface,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
  },
  infoCard: {
    marginBottom: SPACING.lg,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  cancelButton: {
    marginTop: 'auto',
  },
});