/**
 * CalorIA - Login Screen
 * Authentication screen with email/password and social login
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { Heading1, Heading2, BodyText } from '../../components/UI/Typography';
import { useUserStore } from '../../store/userStore';
import { COLORS, SPACING } from '../../utils/constants';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setLoading, isLoading } = useUserStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement Firebase authentication
      // For now, we'll simulate a successful login
      setTimeout(() => {
        const mockUser = {
          id: 'user_1',
          email,
          displayName: 'Usuario Demo',
          createdAt: new Date(),
        };
        setUser(mockUser);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Error al iniciar sesión');
    }
  };

  const handleGoogleLogin = async () => {
    Alert.alert('Próximamente', 'Login con Google estará disponible pronto');
  };

  const handleAppleLogin = async () => {
    Alert.alert('Próximamente', 'Login con Apple estará disponible pronto');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Heading1 align="center" color="primary">
              CalorIA
            </Heading1>
            <BodyText align="center" color="textSecondary" style={styles.subtitle}>
              Tu asistente inteligente de nutrición
            </BodyText>
          </View>

          {/* Login Form */}
          <Card style={styles.formCard}>
            <Heading2 style={styles.formTitle}>
              Iniciar Sesión
            </Heading2>

            {/* Email Input - TODO: Create TextInput component */}
            <View style={styles.inputContainer}>
              <BodyText style={styles.inputLabel}>Email</BodyText>
              <View style={styles.input}>
                <BodyText>{email || 'demo@caloria.app'}</BodyText>
              </View>
            </View>

            {/* Password Input - TODO: Create TextInput component */}
            <View style={styles.inputContainer}>
              <BodyText style={styles.inputLabel}>Contraseña</BodyText>
              <View style={styles.input}>
                <BodyText>{password || '••••••••'}</BodyText>
              </View>
            </View>

            {/* Login Button */}
            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <BodyText color="textSecondary" style={styles.dividerText}>
                o continúa con
              </BodyText>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <Button
              title="Continuar con Google"
              onPress={handleGoogleLogin}
              variant="outline"
              fullWidth
              style={styles.socialButton}
            />

            <Button
              title="Continuar con Apple"
              onPress={handleAppleLogin}
              variant="outline"
              fullWidth
              style={styles.socialButton}
            />
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <BodyText align="center" color="textSecondary">
              ¿No tienes cuenta?{' '}
            </BodyText>
            <BodyText align="center" color="primary">
              Regístrate gratis
            </BodyText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  subtitle: {
    marginTop: SPACING.sm,
  },
  formCard: {
    marginBottom: SPACING.lg,
  },
  formTitle: {
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  loginButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
  },
  socialButton: {
    marginBottom: SPACING.sm,
  },
  footer: {
    alignItems: 'center',
  },
});