/**
 * CalorIA - Subscription Management Screen
 * Manage Premium subscription and billing
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';

export const SubscriptionScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons
            name="arrow-back"
            size={28}
            color={COLORS.text}
            onPress={() => navigation.goBack()}
          />
          <Heading2 style={styles.screenTitle}>Suscripción</Heading2>
        </View>

        {/* Current Plan */}
        <Card style={styles.currentPlanCard}>
          <View style={styles.planBadge}>
            <MaterialIcons name="workspace-premium" size={24} color={COLORS.primary} />
            <Heading3 style={styles.planTitle}>Plan Premium</Heading3>
          </View>
          <View style={styles.planDetails}>
            <View style={styles.planRow}>
              <Caption color="textSecondary">Estado</Caption>
              <BodyText style={[styles.planValue, { color: COLORS.success }]}>Activo</BodyText>
            </View>
            <View style={styles.planRow}>
              <Caption color="textSecondary">Próxima renovación</Caption>
              <BodyText style={styles.planValue}>15 Nov 2025</BodyText>
            </View>
            <View style={styles.planRow}>
              <Caption color="textSecondary">Precio</Caption>
              <BodyText style={styles.planValue}>$1.50/mes</BodyText>
            </View>
          </View>
        </Card>

        {/* Features */}
        <Card style={styles.featuresCard}>
          <Heading3 style={styles.featuresTitle}>Beneficios Premium</Heading3>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              <BodyText style={styles.featureText}>Escaneo ilimitado de alimentos</BodyText>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              <BodyText style={styles.featureText}>Reconocimiento por IA avanzado</BodyText>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              <BodyText style={styles.featureText}>Análisis nutricional detallado</BodyText>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              <BodyText style={styles.featureText}>Reportes semanales personalizados</BodyText>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              <BodyText style={styles.featureText}>Sin anuncios</BodyText>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
              <BodyText style={styles.featureText}>Soporte prioritario</BodyText>
            </View>
          </View>
        </Card>

        {/* Pricing Comparison */}
        <Card style={styles.pricingCard}>
          <Heading3 style={styles.pricingTitle}>¿Por qué CalorIA?</Heading3>
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Caption color="textSecondary">CalorIA</Caption>
              <BodyText style={[styles.comparisonPrice, { color: COLORS.primary }]}>$1.50/mes</BodyText>
            </View>
            <View style={styles.comparisonDivider} />
            <View style={styles.comparisonItem}>
              <Caption color="textSecondary">Competencia</Caption>
              <BodyText style={styles.comparisonPrice}>$5-7/mes</BodyText>
            </View>
          </View>
          <View style={styles.savingsBadge}>
            <MaterialIcons name="savings" size={20} color={COLORS.success} />
            <BodyText style={styles.savingsText}>Ahorra hasta 70% con CalorIA</BodyText>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Cambiar Plan"
            onPress={() => {}}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
          <TouchableOpacity style={styles.cancelButton}>
            <Caption color="error">Cancelar Suscripción</Caption>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <Card style={styles.infoCard}>
          <MaterialIcons name="info-outline" size={20} color={COLORS.textSecondary} />
          <Caption color="textSecondary" style={styles.infoText}>
            Puedes cancelar tu suscripción en cualquier momento. Seguirás teniendo acceso Premium hasta el final del período de facturación actual.
          </Caption>
        </Card>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  screenTitle: {
    flex: 1,
  },
  currentPlanCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  planTitle: {
    color: COLORS.primary,
  },
  planDetails: {
    gap: SPACING.sm,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  planValue: {
    fontWeight: '600',
  },
  featuresCard: {
    marginBottom: SPACING.md,
  },
  featuresTitle: {
    marginBottom: SPACING.md,
  },
  featuresList: {
    gap: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureText: {
    flex: 1,
  },
  pricingCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#F3E5F5',
  },
  pricingTitle: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  comparisonPrice: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  savingsText: {
    fontWeight: '600',
    color: COLORS.success,
  },
  actionsSection: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#FFF9E6',
  },
  infoText: {
    flex: 1,
  },
});
