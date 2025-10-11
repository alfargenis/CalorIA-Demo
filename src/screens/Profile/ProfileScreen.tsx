// 🚀 DEMO VERSION - Limited functionality for portfolio showcase
/**
 * CalorIA - Profile Screen
 * User profile management and app settings
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { useUserStore } from '../../store/userStore';
import { firebaseService } from '../../services/FirebaseService';
import { StorageService } from '../../services/StorageServiceFallback';
import { IS_DEVELOPMENT } from '../../../config/environment';
import { COLORS, SPACING } from '../../utils/constants';

export const ProfileScreen = () => {
  const { user, logout } = useUserStore();

  const handleEditProfile = () => {
    Alert.alert('Demo Mode', 'Editar perfil estará disponible pronto');
  };

  const handleNutritionGoals = () => {
    Alert.alert('Demo Mode', 'Configurar metas nutricionales estará disponible pronto');
  };

  const handleNotifications = () => {
    Alert.alert('Demo Mode', 'Configurar notificaciones estará disponible pronto');
  };

  const handleSubscription = () => {
    Alert.alert('Demo Mode', 'Gestionar suscripción estará disponible pronto');
  };

  const handleSupport = () => {
    Alert.alert('Demo Mode', 'Soporte estará disponible pronto');
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
      '🗑️ Eliminar Cuenta (DEV)',
      '⚠️ ESTO ELIMINARÁ:\n\n• Usuario de Firebase Auth\n• Datos en Firestore (si conecta)\n• Datos locales\n\nÚsalo solo para testing.',
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* User Info */}
        <Card style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={styles.avatar}>
              <BodyText style={styles.avatarText}>
                {user?.displayName?.charAt(0) || 'U'}
              </BodyText>
            </View>
            <View style={styles.userInfo}>
              <Heading3>{user?.displayName || 'Usuario'}</Heading3>
              <Caption color="textSecondary">{user?.email}</Caption>
              <Caption color="primary">Plan Premium - 25 días restantes</Caption>
            </View>
          </View>
          <Button
            title="Editar Perfil"
            onPress={handleEditProfile}
            variant="outline"
            size="small"
            style={styles.editButton}
          />
        </Card>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Heading3 style={styles.statsTitle}>Estadísticas</Heading3>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <BodyText style={styles.statValue}>7</BodyText>
              <Caption color="textSecondary">Días activo</Caption>
            </View>
            <View style={styles.statItem}>
              <BodyText style={styles.statValue}>42</BodyText>
              <Caption color="textSecondary">Comidas registradas</Caption>
            </View>
            <View style={styles.statItem}>
              <BodyText style={styles.statValue}>2.1kg</BodyText>
              <Caption color="textSecondary">Meta de peso</Caption>
            </View>
            <View style={styles.statItem}>
              <BodyText style={styles.statValue}>85%</BodyText>
              <Caption color="textSecondary">Adherencia</Caption>
            </View>
          </View>
        </Card>

        {/* Settings Menu */}
        <Card style={styles.menuCard}>
          <Heading3 style={styles.menuTitle}>Configuración</Heading3>
          
          <View style={styles.menuItems}>
            <Button
              title="🎯 Metas Nutricionales"
              onPress={handleNutritionGoals}
              variant="ghost"
              style={styles.menuItem}
            />
            
            <Button
              title="🔔 Notificaciones"
              onPress={handleNotifications}
              variant="ghost"
              style={styles.menuItem}
            />
            
            <Button
              title="💳 Suscripción"
              onPress={handleSubscription}
              variant="ghost"
              style={styles.menuItem}
            />
            
            <Button
              title="❓ Soporte"
              onPress={handleSupport}
              variant="ghost"
              style={styles.menuItem}
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
            <Heading3 style={styles.devTitle}>🛠️ Dev Tools</Heading3>
            <BodyText color="textSecondary" style={styles.devWarning}>
              Estas opciones solo están disponibles en desarrollo
            </BodyText>
            <Button
              title="🗑️ Eliminar Cuenta de Firebase"
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
    padding: SPACING.md,
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
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
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
  devTitle: {
    marginBottom: SPACING.sm,
  },
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
});