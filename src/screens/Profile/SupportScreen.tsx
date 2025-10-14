/**
 * CalorIA - Support Screen
 * Help center and customer support
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Heading2, Heading3, BodyText, Caption } from '../../components/UI/Typography';
import { COLORS, SPACING } from '../../utils/constants';

export const SupportScreen = () => {
  const navigation = useNavigation();

  const handleEmail = () => {
    Linking.openURL('mailto:soporte@caloria.app?subject=Soporte CalorIA');
  };

  const handleFAQ = () => {
    Alert.alert('Próximamente', 'El centro de ayuda estará disponible pronto');
  };

  const handleChat = () => {
    Alert.alert('Próximamente', 'El chat en vivo estará disponible pronto');
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
          <MaterialIcons
            name="arrow-back"
            size={28}
            color={COLORS.text}
            onPress={() => navigation.goBack()}
          />
          <Heading2 style={styles.screenTitle}>Soporte</Heading2>
        </View>

        <Card style={styles.welcomeCard}>
          <MaterialIcons name="support-agent" size={48} color={COLORS.primary} style={styles.welcomeIcon} />
          <Heading3 style={styles.welcomeTitle}>¿Cómo podemos ayudarte?</Heading3>
          <BodyText color="textSecondary" style={styles.welcomeText}>
            Estamos aquí para resolver tus dudas y mejorar tu experiencia con CalorIA.
          </BodyText>
        </Card>

        {/* Contact Methods */}
        <Card style={styles.contactCard}>
          <Heading3 style={styles.sectionTitle}>Métodos de Contacto</Heading3>

          <Button
            title="Enviar Email"
            onPress={handleEmail}
            variant="outline"
            fullWidth
            style={styles.contactButton}
            icon={<MaterialIcons name="email" size={20} color={COLORS.primary} />}
          />

          <Button
            title="Chat en Vivo"
            onPress={handleChat}
            variant="outline"
            fullWidth
            style={styles.contactButton}
            icon={<MaterialIcons name="chat" size={20} color={COLORS.primary} />}
          />

          <Button
            title="Centro de Ayuda"
            onPress={handleFAQ}
            variant="outline"
            fullWidth
            style={styles.contactButton}
            icon={<MaterialIcons name="help-outline" size={20} color={COLORS.primary} />}
          />
        </Card>

        {/* FAQ Preview */}
        <Card style={styles.faqCard}>
          <Heading3 style={styles.sectionTitle}>Preguntas Frecuentes</Heading3>

          <View style={styles.faqItem}>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.textSecondary} />
            <View style={styles.faqContent}>
              <BodyText style={styles.faqQuestion}>¿Cómo funciona el reconocimiento de alimentos?</BodyText>
              <Caption color="textSecondary">Usamos IA avanzada para identificar automáticamente...</Caption>
            </View>
          </View>

          <View style={styles.faqItem}>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.textSecondary} />
            <View style={styles.faqContent}>
              <BodyText style={styles.faqQuestion}>¿Puedo cancelar mi suscripción?</BodyText>
              <Caption color="textSecondary">Sí, puedes cancelar en cualquier momento desde...</Caption>
            </View>
          </View>

          <View style={styles.faqItem}>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.textSecondary} />
            <View style={styles.faqContent}>
              <BodyText style={styles.faqQuestion}>¿Cómo se calculan mis objetivos nutricionales?</BodyText>
              <Caption color="textSecondary">Basamos los cálculos en tu perfil, edad, peso...</Caption>
            </View>
          </View>

          <Button
            title="Ver Todas las Preguntas"
            onPress={handleFAQ}
            variant="ghost"
            style={styles.viewAllButton}
          />
        </Card>

        {/* Response Time */}
        <Card style={styles.responseCard}>
          <View style={styles.responseHeader}>
            <MaterialIcons name="schedule" size={24} color={COLORS.primary} />
            <Heading3 style={styles.responseTitle}>Tiempo de Respuesta</Heading3>
          </View>
          <View style={styles.responseDetails}>
            <View style={styles.responseItem}>
              <Caption color="textSecondary">Email</Caption>
              <BodyText style={styles.responseTime}>24-48 horas</BodyText>
            </View>
            <View style={styles.responseItem}>
              <Caption color="textSecondary">Chat</Caption>
              <BodyText style={styles.responseTime}>Inmediato</BodyText>
            </View>
          </View>
        </Card>

        {/* App Info */}
        <Card style={styles.infoCard}>
          <Heading3 style={styles.sectionTitle}>Información de la App</Heading3>
          <View style={styles.infoDetails}>
            <View style={styles.infoRow}>
              <Caption color="textSecondary">Versión</Caption>
              <Caption>1.0.0</Caption>
            </View>
            <View style={styles.infoRow}>
              <Caption color="textSecondary">Build</Caption>
              <Caption>2025.10.14</Caption>
            </View>
            <View style={styles.infoRow}>
              <Caption color="textSecondary">Email de soporte</Caption>
              <Caption>soporte@caloria.app</Caption>
            </View>
          </View>
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
  welcomeCard: {
    marginBottom: SPACING.md,
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  welcomeIcon: {
    marginBottom: SPACING.md,
  },
  welcomeTitle: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  welcomeText: {
    textAlign: 'center',
  },
  contactCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  contactButton: {
    marginBottom: SPACING.sm,
  },
  faqCard: {
    marginBottom: SPACING.md,
  },
  faqItem: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  viewAllButton: {
    marginTop: SPACING.sm,
  },
  responseCard: {
    marginBottom: SPACING.md,
    backgroundColor: '#F3E5F5',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  responseTitle: {},
  responseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  responseItem: {
    alignItems: 'center',
  },
  responseTime: {
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  infoCard: {
    marginBottom: SPACING.xl,
  },
  infoDetails: {
    gap: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
});
