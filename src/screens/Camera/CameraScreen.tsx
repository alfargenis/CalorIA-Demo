// 🚀 DEMO VERSION - Limited functionality for portfolio showcase
/**
 * CalorIA - Camera Screen
 * Food scanning and recognition interface
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import type { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, BodyText } from '../../components/UI/Typography';
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

type CameraScreenNavigationProp = StackNavigationProp<CameraStackParamList, 'Camera'>;

interface Props {
  navigation: CameraScreenNavigationProp;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Necesitamos acceso a tu galería para seleccionar fotos'
      );
    }
  };

  const handleTakePhoto = async () => {
    if (!permission) {
      Alert.alert('Error', 'No se pudieron verificar los permisos de cámara');
      return;
    }

    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Cámara requerida',
          'Necesitamos acceso a tu cámara para tomar fotos de la comida'
        );
        return;
      }
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        setCapturedPhoto(photo.uri);
        setShowCamera(false);
        
        // Navigate directly to processing
        navigation.navigate('Processing', { imageUri: photo.uri });
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setCapturedPhoto(imageUri);

        // Navigate directly to processing
        navigation.navigate('Processing', { imageUri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleManualEntry = () => {
    Alert.alert(
      'Entrada Manual',
      'La entrada manual de comidas estará disponible pronto. Esta función te permitirá buscar alimentos en nuestra base de datos o crear entradas personalizadas.'
    );
  };

  // Function is no longer needed - navigation handles the flow

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const closeCameraView = () => {
    setShowCamera(false);
  };

  if (showCamera) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeCameraView}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.flipButtonText}>🔄</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.cameraFooter}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Camera Preview or Captured Photo */}
        <Card style={styles.cameraCard}>
          {capturedPhoto ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setCapturedPhoto(null)}
              >
                <Text style={styles.removePhotoText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <MaterialIcons name="photo-camera" size={64} color={COLORS.textSecondary} />
              <Heading2 style={styles.cameraTitle}>
                Escanear Comida
              </Heading2>
              <BodyText align="center" color="textSecondary" style={styles.cameraDescription}>
                Toma una foto de tu comida y nuestra IA identificará automáticamente los alimentos y calculará las calorías.
              </BodyText>
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Tomar Foto"
            onPress={handleTakePhoto}
            size="large"
            fullWidth
            style={styles.actionButton}
            icon={<MaterialIcons name="photo-camera" size={24} color={COLORS.surface} />}
          />

          <Button
            title="Desde Galería"
            onPress={handlePickFromGallery}
            variant="outline"
            size="large"
            fullWidth
            style={styles.actionButton}
            icon={<MaterialIcons name="photo-library" size={24} color={COLORS.primary} />}
          />

          <Button
            title="Entrada Manual"
            onPress={handleManualEntry}
            variant="outline"
            size="large"
            fullWidth
            style={styles.actionButton}
            icon={<MaterialIcons name="edit" size={24} color={COLORS.primary} />}
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
    height: 240,
    marginBottom: SPACING.md,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  cameraEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  cameraTitle: {
    marginBottom: 0,
    textAlign: 'center',
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
  
  // Camera View Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    color: 'white',
    fontSize: 20,
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
  },
  
  // Captured Photo Styles
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  capturedImage: {
    flex: 1,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});