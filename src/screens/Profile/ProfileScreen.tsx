// 🚀 DEMO VERSION - Limited functionality for portfolio showcase
/**
 * CalorIA - Profile Screen
 * User profile management and app settings
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useUserStore } from '../../store/userStore';
import { firebaseService } from '../../services/FirebaseService';
import { StorageService } from '../../services/StorageServiceFallback';
import { IS_DEVELOPMENT } from '../../../config/environment';
import { COLORS, SPACING } from '../../utils/constants';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout, updateUser } = useUserStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');

  const handleEditProfile = () => {
    setIsEditingName(true);
    setEditedName(user?.displayName || '');
  };

  const handleSaveName = async () => {
    if (!user || !editedName.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    try {
      await firebaseService.updateUserProfile(user.id, {
        displayName: editedName.trim()
      });

      await updateUser({ displayName: editedName.trim() });

      setIsEditingName(false);
      Alert.alert('Éxito', 'Nombre actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(user?.displayName || '');
  };

  const handleNutritionGoals = () => {
    navigation.navigate('EditGoals');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleSubscription = () => {
    navigation.navigate('Subscription');
  };

  const handleSupport = () => {
    navigation.navigate('Support');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Eliminar Cuenta (DEV)',
      'ADVERTENCIA: ESTO ELIMINARÁ:\n\n• Usuario de Firebase Auth\n• Datos en Firestore (si conecta)\n• Datos locales\n\nÚsalo solo para testing.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user) return;

              console.log('🗑️ Starting account deletion...');

              console.log('🗑️ Attempting to delete Firestore data (5s timeout)...');
              const deleteDataPromise = firebaseService.deleteUserData(user.id);
              const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(false), 5000));

              const dataDeleted = await Promise.race([deleteDataPromise, timeoutPromise]);
              if (dataDeleted) {
                console.log('✅ Firestore data deleted');
              } else {
                console.warn('⚠️  Firestore data deletion skipped (timeout)');
              }

              console.log('🗑️ Attempting to delete Firebase Auth user (5s timeout)...');
              const deleteAuthPromise = firebaseService.deleteCurrentUser();
              const authTimeoutPromise = new Promise((resolve) => setTimeout(() => resolve(false), 5000));

              const authDeleted = await Promise.race([deleteAuthPromise, authTimeoutPromise]);
              if (authDeleted) {
                console.log('✅ Firebase Auth user deleted');
              } else {
                console.warn('⚠️  Firebase Auth deletion skipped (timeout or already logged out)');
              }

              console.log('🗑️ Clearing local storage...');
              await StorageService.removeUser();
              console.log('✅ Local storage cleared');

              console.log('✅ Account cleanup completed');
              Alert.alert(
                'Cuenta Eliminada',
                dataDeleted && authDeleted
                  ? 'Cuenta eliminada completamente de Firebase y local'
                  : 'Datos locales eliminados. Firebase puede requerir limpieza manual en la consola.'
              );

              logout();
            } catch (error) {
              console.error('❌ Error deleting account:', error);
              Alert.alert('Error', 'Hubo un problema eliminando la cuenta. Limpieza parcial realizada.');
              logout();
            }
          },
        },
      ]
    );
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
          <Heading2 style={styles.screenTitle}>Perfil</Heading2>
        </View>

        {/* User Info */}
        <Card style={styles.userCard}>
          <View style={styles.userHeader}>
              <View style={styles.avatar}>
                <BodyText style={styles.avatarText}>
                  {user?.displayName?.charAt(0) || 'U'}
                </BodyText>
              </View>
              <View style={styles.userInfo}>
                {isEditingName ? (
                  <View style={styles.editNameContainer}>
                    <TextInput
                      style={styles.nameInput}
                      value={editedName}
                      onChangeText={setEditedName}
                      placeholder="Ingresa tu nombre"
                      autoFocus
                      maxLength={50}
                    />
                    <View style={styles.editActions}>
                      <TouchableOpacity onPress={handleCancelEdit} style={styles.editActionButton}>
                        <MaterialIcons name="close" size={20} color={COLORS.error} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleSaveName} style={styles.editActionButton}>
                        <MaterialIcons name="check" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Heading3>{user?.displayName || 'Usuario'}</Heading3>
                )}
                <Caption color="textSecondary">{user?.email}</Caption>
                <Caption color="primary">Plan Premium - 25 días restantes</Caption>
              </View>
            </View>
            {!isEditingName && (
              <Button
                title="Editar Perfil"
                onPress={handleEditProfile}
                variant="outline"
                size="small"
                style={styles.editButton}
              />
            )}
        </Card>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Heading3 style={styles.statsTitle}>Estadísticas</Heading3>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.currentStreak || 0}
                  </BodyText>
                  <MaterialIcons name="local-fire-department" size={20} color={COLORS.secondary} />
                </View>
                <Caption color="textSecondary">Racha actual</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.totalMealsLogged || 0}
                  </BodyText>
                  <MaterialIcons name="restaurant" size={20} color={COLORS.primary} />
                </View>
                <Caption color="textSecondary">Comidas registradas</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.profile?.targetWeight
                      ? `${Math.abs((user.profile.weight - user.profile.targetWeight)).toFixed(1)}kg`
                      : 'N/A'}
                  </BodyText>
                  <MaterialIcons name="flag" size={20} color="#FF6B35" />
                </View>
                <Caption color="textSecondary">Por alcanzar</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.totalDaysTracked || 0}
                  </BodyText>
                  <MaterialIcons name="calendar-today" size={20} color={COLORS.success} />
                </View>
                <Caption color="textSecondary">Días rastreados</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.longestStreak || 0}
                  </BodyText>
                  <MaterialIcons name="emoji-events" size={20} color={COLORS.primary} />
                </View>
                <Caption color="textSecondary">Mejor racha</Caption>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statValueRow}>
                  <BodyText style={styles.statValue}>
                    {user?.stats?.avgCaloriesPerDay
                      ? Math.round(user.stats.avgCaloriesPerDay)
                      : 0}
                  </BodyText>
                  <MaterialIcons name="trending-up" size={20} color="#9C27B0" />
                </View>
                <Caption color="textSecondary">Prom. calorías/día</Caption>
              </View>
            </View>
        </Card>

        {/* Achievements/Logros */}
        <Card style={styles.achievementsCard}>
          <Heading3 style={styles.achievementsTitle}>Logros Desbloqueados</Heading3>
            <View style={styles.achievementsGrid}>
              {/* Primera comida registrada */}
              <View style={[styles.achievementBadge, (user?.stats?.totalMealsLogged || 0) >= 1 && styles.achievementUnlocked]}>
                <MaterialIcons
                  name="restaurant-menu"
                  size={32}
                  color={(user?.stats?.totalMealsLogged || 0) >= 1 ? COLORS.primary : COLORS.border}
                />
                <Caption style={styles.achievementLabel}>Primera comida</Caption>
              </View>

              {/* Racha de 3 días */}
              <View style={[styles.achievementBadge, (user?.stats?.currentStreak || 0) >= 3 && styles.achievementUnlocked]}>
                <MaterialIcons
                  name="whatshot"
                  size={32}
                  color={(user?.stats?.currentStreak || 0) >= 3 ? COLORS.secondary : COLORS.border}
                />
                <Caption style={styles.achievementLabel}>Racha 3 días</Caption>
              </View>

              {/* 10 comidas registradas */}
              <View style={[styles.achievementBadge, (user?.stats?.totalMealsLogged || 0) >= 10 && styles.achievementUnlocked]}>
                <MaterialIcons
                  name="emoji-events"
                  size={32}
                  color={(user?.stats?.totalMealsLogged || 0) >= 10 ? '#FFD700' : COLORS.border}
                />
                <Caption style={styles.achievementLabel}>10 comidas</Caption>
              </View>

              {/* Racha de 7 días */}
              <View style={[styles.achievementBadge, (user?.stats?.currentStreak || 0) >= 7 && styles.achievementUnlocked]}>
                <MaterialIcons
                  name="local-fire-department"
                  size={32}
                  color={(user?.stats?.currentStreak || 0) >= 7 ? '#FF4500' : COLORS.border}
                />
                <Caption style={styles.achievementLabel}>Semana perfecta</Caption>
              </View>
            </View>
        </Card>

        {/* Nutrition Goals */}
        {user?.profile && (
          <Card style={styles.goalsCard}>
            <Heading3 style={styles.goalsTitle}>Tu Perfil Nutricional</Heading3>
              <View style={styles.goalsGrid}>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">Peso Actual</Caption>
                  <BodyText style={styles.goalValue}>{user.profile.weight} kg</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">Peso Objetivo</Caption>
                  <BodyText style={styles.goalValue}>{user.profile.targetWeight} kg</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">Altura</Caption>
                  <BodyText style={styles.goalValue}>{user.profile.height} cm</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">IMC</Caption>
                  <BodyText style={styles.goalValue}>{user.profile.bmi.toFixed(1)}</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">TMB</Caption>
                  <BodyText style={styles.goalValue}>{Math.round(user.profile.bmr)} cal</BodyText>
                </View>
                <View style={styles.goalRow}>
                  <Caption color="textSecondary">TDEE</Caption>
                  <BodyText style={styles.goalValue}>{Math.round(user.profile.tdee)} cal</BodyText>
                </View>
              </View>

              <View style={styles.macroGoalsSection}>
                <Caption color="textSecondary" style={styles.macroGoalsTitle}>
                  Objetivos Diarios
                </Caption>
                <View style={styles.macroGoalsRow}>
                  <View style={styles.macroGoalItem}>
                    <BodyText style={styles.macroGoalValue}>
                      {user.profile.goals.calories}
                    </BodyText>
                    <Caption color="textSecondary">Calorías</Caption>
                  </View>
                  <View style={styles.macroGoalItem}>
                    <BodyText style={styles.macroGoalValue}>
                      {user.profile.goals.protein}g
                    </BodyText>
                    <Caption color="textSecondary">Proteína</Caption>
                  </View>
                  <View style={styles.macroGoalItem}>
                    <BodyText style={styles.macroGoalValue}>
                      {user.profile.goals.carbs}g
                    </BodyText>
                    <Caption color="textSecondary">Carbos</Caption>
                  </View>
                  <View style={styles.macroGoalItem}>
                    <BodyText style={styles.macroGoalValue}>
                      {user.profile.goals.fat}g
                    </BodyText>
                    <Caption color="textSecondary">Grasas</Caption>
                  </View>
                </View>
              </View>
          </Card>
        )}

        {/* Settings Menu */}
        <Card style={styles.menuCard}>
          <Heading3 style={styles.menuTitle}>Configuración</Heading3>
          
          <View style={styles.menuItems}>
            <Button
              title="Metas Nutricionales"
              onPress={handleNutritionGoals}
              variant="ghost"
              style={styles.menuItem}
              icon={<MaterialIcons name="track-changes" size={20} color={COLORS.primary} />}
            />

            <Button
              title="Notificaciones"
              onPress={handleNotifications}
              variant="ghost"
              style={styles.menuItem}
              icon={<MaterialIcons name="notifications" size={20} color={COLORS.primary} />}
            />

            <Button
              title="Suscripción"
              onPress={handleSubscription}
              variant="ghost"
              style={styles.menuItem}
              icon={<MaterialIcons name="card-membership" size={20} color={COLORS.primary} />}
            />
            
            <Button
              title="Soporte"
              onPress={handleSupport}
              variant="ghost"
              style={styles.menuItem}
              icon={<MaterialIcons name="help-outline" size={20} color={COLORS.primary} />}
            />
          </View>
        </Card>

        {/* App Info */}
        <Card style={styles.infoCard}>
          <Heading3 style={styles.infoTitle}>Información</Heading3>
          <View style={styles.infoItems}>
            <View style={styles.infoItem}>
              <Caption color="textSecondary">Versión</Caption>
              <Caption>1.0.0</Caption>
            </View>
            <View style={styles.infoItem}>
              <Caption color="textSecondary">Última sincronización</Caption>
              <Caption>Hace 2 minutos</Caption>
            </View>
          </View>
        </Card>

        {/* Development Tools */}
        {IS_DEVELOPMENT && (
          <Card style={styles.devCard}>
            <View style={styles.devTitleRow}>
              <MaterialIcons name="build" size={24} color={COLORS.error} />
              <Heading3 style={styles.devTitle}>Dev Tools</Heading3>
            </View>
            <BodyText color="textSecondary" style={styles.devWarning}>
              Estas opciones solo están disponibles en desarrollo
            </BodyText>
            <Button
              title="Eliminar Cuenta de Firebase"
              onPress={handleDeleteAccount}
              variant="outline"
              style={[styles.devButton, { borderColor: COLORS.error }] as any}
              textStyle={{ color: COLORS.error }}
            />
          </Card>
        )}

        {/* Logout */}
        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          variant="outline"
          style={[styles.logoutButton, { borderColor: COLORS.error }] as any}
          textStyle={{ color: COLORS.error }}
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
    marginBottom: SPACING.md,
  },
  screenTitle: {
    textAlign: 'left',
  },
  userCard: {
    marginBottom: SPACING.md,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 24,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  statsCard: {
    marginBottom: SPACING.md,
  },
  statsTitle: {
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  achievementsCard: {
    marginBottom: SPACING.md,
  },
  achievementsTitle: {
    marginBottom: SPACING.md,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-around',
  },
  achievementBadge: {
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    minWidth: 80,
    opacity: 0.4,
  },
  achievementUnlocked: {
    opacity: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  achievementLabel: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontSize: 11,
  },
  goalsCard: {
    marginBottom: SPACING.md,
  },
  goalsTitle: {
    marginBottom: SPACING.md,
  },
  goalsGrid: {
    gap: SPACING.sm,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  goalValue: {
    fontWeight: '600',
    color: COLORS.text,
  },
  macroGoalsSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
  },
  macroGoalsTitle: {
    marginBottom: SPACING.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  macroGoalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroGoalItem: {
    alignItems: 'center',
  },
  macroGoalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  menuCard: {
    marginBottom: SPACING.md,
  },
  menuTitle: {
    marginBottom: SPACING.md,
  },
  menuItems: {
    gap: SPACING.xs,
  },
  menuItem: {
    justifyContent: 'flex-start',
    paddingLeft: 0,
  },
  infoCard: {
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    marginBottom: SPACING.md,
  },
  infoItems: {
    gap: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  devCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#FFF5F5',
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  devTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  devTitle: {},
  devWarning: {
    marginBottom: SPACING.md,
    fontSize: 12,
  },
  devButton: {
    marginTop: SPACING.sm,
  },
  logoutButton: {
    marginBottom: SPACING.xl,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  nameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  editActionButton: {
    padding: SPACING.xs,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
});