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

import { Button, Card, TextInput, Heading1, Heading2, BodyText } from '../../components/UI';
import { useUserStore } from '../../store/userStore';
import { AuthServiceUnified as AuthService } from '../../services/AuthServiceUnified';
import { COLORS, SPACING } from '../../utils/constants';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

          {/* Login Form */}
          <Card style={styles.formCard}>
            <Heading2 style={styles.formTitle}>
              Iniciar Sesión
            </Heading2>

            {/* Email Input */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="demo@caloria.app"
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