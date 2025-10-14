/**
 * CalorIA - Main App Navigator
 * Root navigation structure with authentication flow
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { LiquidGlassView, LiquidGlassContainerView, isLiquidGlassSupported } from '@callstack/liquid-glass';

import { useUserStore } from '../store/userStore';
import { COLORS } from '../utils/constants';
import type { RootStackParamList, MainTabParamList } from '../types';

// Import screens
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { OnboardingStackNavigator } from './OnboardingStackNavigator';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { CameraStackNavigator } from './CameraStackNavigator';
import { HistoryScreen } from '../screens/History/HistoryScreen';
import { ProfileStackNavigator } from './ProfileStackNavigator';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Camera':
              iconName = 'camera-alt';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: Platform.OS === 'ios' ? 8 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 65 : 65,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? 20 : 10,
          borderRadius: 20,
        },
        tabBarBackground: () => (
          <LiquidGlassContainerView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <LiquidGlassView
              style={{
                flex: 1,
                borderRadius: 20,
                ...(!isLiquidGlassSupported() && {
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                }),
              }}
            />
          </LiquidGlassContainerView>
        ),
        headerStyle: {
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraStackNavigator}
        options={{
          title: 'Escanear',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Historial',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          title: 'Perfil',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isOnboardingCompleted, isLoading, isInitialized, initialize } = useUserStore();

  useEffect(() => {
    console.log('🔄 AppNavigator state changed:', {
      isAuthenticated,
      isOnboardingCompleted,
      isLoading,
      isInitialized,
    });
  }, [isAuthenticated, isOnboardingCompleted, isLoading, isInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Show loading screen while initializing or loading
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Iniciando CalorIA...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            // User not authenticated - show login
            <Stack.Screen 
              name="Auth" 
              component={LoginScreen}
            />
          ) : !isOnboardingCompleted ? (
            // User authenticated but onboarding not completed
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingStackNavigator}
            />
          ) : (
            // User authenticated and onboarding completed - show main app
            <Stack.Screen 
              name="Main" 
              component={MainTabNavigator}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});