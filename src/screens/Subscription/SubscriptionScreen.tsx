/**
 * CalorIA - Subscription Screen
 * Premium plans and subscription management
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Heading1, Heading2, BodyText, Caption } from '../../components/UI';
import { subscriptionService, SubscriptionPlan, SubscriptionStatus } from '../../services/SubscriptionService';
import { COLORS, SPACING } from '../../utils/constants';

export const SubscriptionScreen = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      await subscriptionService.initialize();
      
      const [availablePlans, subscriptionStatus] = await Promise.all([
        subscriptionService.getAvailablePlans(),
        subscriptionService.getSubscriptionStatus(),
      ]);

      setPlans(availablePlans);
      setStatus(subscriptionStatus);
    } catch (error) {
      console.error('❌ Error loading subscription data:', error);
      Alert.alert('Error', 'No se pudieron cargar los planes de suscripción');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    try {
      setPurchasing(true);
      const result = await subscriptionService.purchasePlan(planId);
      
      if (result.success) {
        Alert.alert(
          '¡Suscripción exitosa!', 
          'Ya tienes acceso a todas las funciones premium de CalorIA',
          [{ text: 'Continuar', onPress: () => loadSubscriptionData() }]
        );
      } else {
        Alert.alert('Error', result.error || 'No se pudo procesar la compra');
      }
    } catch (error) {
      console.error('❌ Purchase error:', error);
      Alert.alert('Error', 'Error al procesar la compra');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setPurchasing(true);
      const result = await subscriptionService.restorePurchases();
      
      if (result.success) {
        Alert.alert('Compras restauradas', 'Se han restaurado tus compras anteriores');
        loadSubscriptionData();
      } else {
        Alert.alert('Error', result.error || 'No se pudieron restaurar las compras');
      }
    } catch (error) {
      console.error('❌ Restore error:', error);
      Alert.alert('Error', 'Error al restaurar compras');
    } finally {
      setPurchasing(false);
    }
  };

  const formatPrice = (price: number, currency: string, period: 'monthly' | 'yearly') => {
    const periodText = period === 'monthly' ? '/mes' : '/año';
    return `$${price.toFixed(2)} ${periodText}`;
  };

  const getTrialInfo = () => {
    if (!status?.isInTrial || !status.trialEndDate) return null;
    
    const daysLeft = Math.max(0, Math.ceil(
      (status.trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    ));
    
    return `${daysLeft} días restantes de prueba gratuita`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <BodyText>Cargando planes...</BodyText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Heading1 style={styles.title}>Desbloquea CalorIA</Heading1>
          
          {status?.isInTrial && (
            <Card style={styles.trialCard}>
              <BodyText style={styles.trialText}>
                🎉 {getTrialInfo()}
              </BodyText>
            </Card>
          )}
          
          <BodyText align="center" color="textSecondary" style={styles.subtitle}>
            Accede a todas las funciones premium y transforma tu relación con la comida
          </BodyText>
        </View>

        {/* Pricing Comparison */}
        <Card style={styles.comparisonCard}>
          <Heading2 style={styles.comparisonTitle}>
            💰 Más accesible que la competencia
          </Heading2>
          <BodyText style={styles.comparisonText}>
            • <Text style={styles.bold}>Cal AI</Text>: $5/mes → CalorIA: $1.50/mes (70% menos)
          </BodyText>
          <BodyText style={styles.comparisonText}>
            • <Text style={styles.bold}>MyFitnessPal</Text>: $9.99/mes → CalorIA: $1.50/mes (85% menos)
          </BodyText>
        </Card>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              style={[
                styles.planCard,
                plan.isPopular && styles.popularPlan
              ]}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Caption style={styles.popularText}>MÁS POPULAR</Caption>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Heading2 style={styles.planName}>{plan.name}</Heading2>
                <BodyText style={styles.planPrice}>
                  {formatPrice(plan.price, plan.currency, plan.period)}
                </BodyText>
                <Caption color="textSecondary">{plan.description}</Caption>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <BodyText style={styles.featureIcon}>✅</BodyText>
                    <BodyText style={styles.featureText}>{feature}</BodyText>
                  </View>
                ))}
              </View>

              {plan.trialDays && (
                <BodyText style={styles.trialInfo}>
                  🎁 {plan.trialDays} días gratis, luego {plan.priceString}/{plan.period === 'monthly' ? 'mes' : 'año'}
                </BodyText>
              )}

              <Button
                title={status?.isActive ? 'Plan Actual' : 'Comenzar Prueba Gratuita'}
                onPress={() => handlePurchase(plan.id)}
                disabled={purchasing || status?.isActive}
                style={[
                  styles.planButton,
                  plan.isPopular && styles.popularButton
                ]}
              />
            </Card>
          ))}
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <Heading2 style={styles.featuresTitle}>¿Qué incluye CalorIA Premium?</Heading2>
          
          <View style={styles.featuresRow}>
            <Card style={styles.featureCard}>
              <BodyText style={styles.featureEmoji}>📸</BodyText>
              <BodyText style={styles.featureCardTitle}>Escaneo Ilimitado</BodyText>
              <Caption>Reconoce cualquier alimento con IA</Caption>
            </Card>
            
            <Card style={styles.featureCard}>
              <BodyText style={styles.featureEmoji}>📊</BodyText>
              <BodyText style={styles.featureCardTitle}>Análisis Avanzado</BodyText>
              <Caption>Reportes nutricionales detallados</Caption>
            </Card>
          </View>

          <View style={styles.featuresRow}>
            <Card style={styles.featureCard}>
              <BodyText style={styles.featureEmoji}>☁️</BodyText>
              <BodyText style={styles.featureCardTitle}>Sync en la Nube</BodyText>
              <Caption>Tus datos seguros y sincronizados</Caption>
            </Card>
            
            <Card style={styles.featureCard}>
              <BodyText style={styles.featureEmoji}>🎯</BodyText>
              <BodyText style={styles.featureCardTitle}>Metas Personalizadas</BodyText>
              <Caption>Objetivos adaptados a ti</Caption>
            </Card>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            title="Restaurar Compras"
            onPress={handleRestorePurchases}
            disabled={purchasing}
            variant="secondary"
            style={styles.restoreButton}
          />
          
          <Caption align="center" color="textSecondary" style={styles.disclaimer}>
            • Cancela cuando quieras desde la App Store{'\n'}
            • No se realizan cargos durante el período de prueba{'\n'}
            • Términos y condiciones aplicables
          </Caption>
        </View>
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
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  trialCard: {
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  trialText: {
    color: COLORS.surface,
    textAlign: 'center',
    fontWeight: '600',
  },
  comparisonCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
  },
  comparisonTitle: {
    color: COLORS.surface,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  comparisonText: {
    color: COLORS.surface,
    marginBottom: SPACING.xs,
  },
  bold: {
    fontWeight: '600',
  },
  plansContainer: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  planCard: {
    padding: SPACING.lg,
    position: 'relative',
  },
  popularPlan: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },
  popularText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 12,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  planName: {
    marginBottom: SPACING.xs,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  featuresContainer: {
    marginBottom: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureIcon: {
    marginRight: SPACING.sm,
  },
  featureText: {
    flex: 1,
  },
  trialInfo: {
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  planButton: {
    marginTop: 'auto',
  },
  popularButton: {
    backgroundColor: COLORS.primary,
  },
  featuresGrid: {
    marginBottom: SPACING.xl,
  },
  featuresTitle: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  featureCardTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  footer: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  restoreButton: {
    paddingHorizontal: SPACING.xl,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: SPACING.md,
  },
});

export default SubscriptionScreen;