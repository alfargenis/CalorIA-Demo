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
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, TextInput, Heading1, Heading2, BodyText } from '../../components/UI';
import { useUserStore } from '../../store/userStore';
import { AuthServiceUnified as AuthService } from '../../services/AuthServiceUnified';
import { COLORS, SPACING } from '../../utils/constants';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const { setUser, setLoading, setError, isLoading } = useUserStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.signInWithEmail(email, password);

      if (result.success && result.user) {
        setUser(result.user);
        console.log('✅ Login successful for:', result.user.email);
      } else {
        Alert.alert('Error de Login', result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      Alert.alert('Error', 'Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!displayName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.signUpWithEmail(email, password, displayName.trim());

      if (result.success && result.user) {
        setUser(result.user);
        console.log('✅ Registration successful for:', result.user.email);
      } else {
        Alert.alert('Error de Registro', result.error || 'Error al registrarse');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      Alert.alert('Error', 'Error inesperado al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AuthService.signInWithGoogle();
      
      if (result.success && result.user) {
        setUser(result.user);
        console.log('✅ Google login successful for:', result.user.email);
      } else {
        Alert.alert('Error de Login', result.error || 'Error al iniciar sesión con Google');
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      Alert.alert('Error', 'Error inesperado al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AuthService.signInWithApple();
      
      if (result.success && result.user) {
        setUser(result.user);
        console.log('✅ Apple login successful for:', result.user.email);
      } else {
        Alert.alert('Error de Login', result.error || 'Error al iniciar sesión con Apple');
      }
    } catch (error) {
      console.error('❌ Apple login error:', error);
      Alert.alert('Error', 'Error inesperado al iniciar sesión con Apple');
    } finally {
      setLoading(false);
    }
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

          {/* Login/Register Form */}
          <Card style={styles.formCard}>
            <Heading2 style={styles.formTitle}>
              {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </Heading2>

            {/* Display Name Input (Register only) */}
            {isRegisterMode && (
              <TextInput
                label="Nombre"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Tu nombre"
                autoCapitalize="words"
                autoCorrect={false}
              />
            )}

            {/* Email Input */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder={isRegisterMode ? "tu-email@ejemplo.com" : "demo@caloria.app"}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password Input */}
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Login/Register Button */}
            <Button
              title={isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
              onPress={isRegisterMode ? handleRegister : handleLogin}
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
              {isRegisterMode ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            </BodyText>
            <TouchableOpacity onPress={() => {
              setIsRegisterMode(!isRegisterMode);
              setEmail('');
              setPassword('');
              setDisplayName('');
            }}>
              <BodyText align="center" color="primary">
                {isRegisterMode ? 'Inicia sesión' : 'Regístrate gratis'}
              </BodyText>
            </TouchableOpacity>
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