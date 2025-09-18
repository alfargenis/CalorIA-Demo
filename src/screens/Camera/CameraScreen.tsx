// 🚀 DEMO VERSION - Limited functionality for portfolio showcase
/**
 * CalorIA - Camera Screen
 * Food scanning and recognition interface
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, BodyText } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';

export const CameraScreen = () => {
  const handleTakePhoto = () => {
    Alert.alert('Demo Mode', 'La funcionalidad de cámara estará disponible pronto');
  };

  const handlePickFromGallery = () => {
    Alert.alert('Demo Mode', 'Seleccionar desde galería estará disponible pronto');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Camera Preview Placeholder */}
        <Card style={styles.cameraCard}>
          <View style={styles.cameraPlaceholder}>
            <BodyText style={styles.cameraEmoji}>📷</BodyText>
            <Heading2 align="center" style={styles.cameraTitle}>
              Escanear Comida
            </Heading2>
            <BodyText align="center" color="textSecondary" style={styles.cameraDescription}>
              Toma una foto de tu comida y nuestra IA identificará automáticamente los alimentos y calculará las calorías.
            </BodyText>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="📸 Tomar Foto"
            onPress={handleTakePhoto}
            size="large"
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title="🖼️ Desde Galería"
            onPress={handlePickFromGallery}
            variant="outline"
            size="large"
            fullWidth
            style={styles.actionButton}
          />
        </View>

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <Heading2 style={styles.tipsTitle}>
            💡 Consejos para mejores resultados
          </Heading2>
          <View style={styles.tipsList}>
            <BodyText style={styles.tipItem}>
              • Asegúrate de tener buena iluminación
            </BodyText>
            <BodyText style={styles.tipItem}>
              • Coloca la comida sobre un fondo claro
            </BodyText>
            <BodyText style={styles.tipItem}>
              • Incluye toda la porción en la foto
            </BodyText>
            <BodyText style={styles.tipItem}>
              • Evita sombras sobre los alimentos
            </BodyText>
          </View>
        </Card>
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
  cameraCard: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  cameraEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  cameraTitle: {
    marginBottom: SPACING.md,
  },
  cameraDescription: {
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
  tipsCard: {},
  tipsTitle: {
    marginBottom: SPACING.md,
    fontSize: 18,
  },
  tipsList: {
    gap: SPACING.xs,
  },
  tipItem: {
    lineHeight: 22,
  },
});