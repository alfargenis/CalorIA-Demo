/**
 * CalorIA - Supplement Warning Modal
 * Displays health warnings and recommendations for supplement usage
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from './Card';
import { Button } from './Button';
import { Heading2, Heading3, BodyText, Caption } from './Typography';
import type { SupplementType, SupplementWarning } from '../../types';
import {
  getSupplementWarnings,
  getSupplementLabel,
  getSupplementIcon,
  requiresMedicalSupervision,
  getWarningColor,
} from '../../utils/supplementWarnings';
import { COLORS, SPACING } from '../../utils/constants';

interface SupplementWarningModalProps {
  visible: boolean;
  supplementType: SupplementType;
  dosage?: { amount: number; unit: string };
  onClose: () => void;
  onConfirm?: () => void;
}

export const SupplementWarningModal: React.FC<SupplementWarningModalProps> = ({
  visible,
  supplementType,
  dosage,
  onClose,
  onConfirm,
}) => {
  const warnings = getSupplementWarnings(supplementType, dosage);
  const requiresSupervision = requiresMedicalSupervision(supplementType);
  const supplementLabel = getSupplementLabel(supplementType);
  const supplementIcon = getSupplementIcon(supplementType);

  const handleLearnMore = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderWarning = (warning: SupplementWarning, index: number) => {
    const warningColor = getWarningColor(warning.level);

    return (
      <Card
        key={index}
        style={[
          styles.warningCard,
          { borderLeftColor: warningColor, borderLeftWidth: 4 },
        ]}
      >
        <View style={styles.warningHeader}>
          <View style={[styles.warningBadge, { backgroundColor: warningColor }]}>
            <Caption style={styles.warningBadgeText}>
              {warning.level === 'info' ? 'INFO' :
               warning.level === 'caution' ? 'PRECAUCIÓN' :
               warning.level === 'danger' ? 'PELIGRO' :
               'CRÍTICO'}
            </Caption>
          </View>
        </View>

        <BodyText style={styles.warningMessage}>
          {warning.message}
        </BodyText>

        <View style={styles.recommendationSection}>
          <Caption color="textSecondary" style={styles.recommendationLabel}>
            Recomendación:
          </Caption>
          <BodyText style={styles.recommendationText}>
            {warning.recommendation}
          </BodyText>
        </View>

        {warning.learnMoreUrl && (
          <TouchableOpacity
            onPress={() => handleLearnMore(warning.learnMoreUrl)}
            style={styles.learnMoreButton}
          >
            <Caption style={styles.learnMoreText}>
              Más información →
            </Caption>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <BodyText style={styles.icon}>{supplementIcon}</BodyText>
            <Heading2 style={styles.title}>{supplementLabel}</Heading2>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <BodyText style={styles.closeButtonText}>✕</BodyText>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Medical Supervision Warning */}
          {requiresSupervision && (
            <Card style={styles.supervisionCard}>
              <View style={styles.supervisionHeader}>
                <BodyText style={styles.supervisionIcon}>⚕️</BodyText>
                <Heading3 style={styles.supervisionTitle}>
                  Supervisión Médica Obligatoria
                </Heading3>
              </View>
              <BodyText style={styles.supervisionText}>
                Este suplemento requiere prescripción y monitoreo médico continuo.
                El uso sin supervisión puede causar daños graves e irreversibles a la salud.
              </BodyText>
            </Card>
          )}

          {/* Dosage Info */}
          {dosage && (
            <Card style={styles.dosageCard}>
              <Caption color="textSecondary">Dosis ingresada:</Caption>
              <BodyText style={styles.dosageText}>
                {dosage.amount} {dosage.unit}
              </BodyText>
            </Card>
          )}

          {/* Warnings List */}
          <View style={styles.warningsSection}>
            <Heading3 style={styles.sectionTitle}>
              Información Importante
            </Heading3>
            {warnings.map((warning, index) => renderWarning(warning, index))}
          </View>

          {/* Disclaimer */}
          <Card style={styles.disclaimerCard}>
            <Caption color="textSecondary" style={styles.disclaimerText}>
              ⚠️ Esta información es educativa. CalorIA no provee consejos médicos.
              Consulta siempre con un profesional de salud antes de iniciar cualquier suplemento.
            </Caption>
          </Card>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          {onConfirm ? (
            <>
              <Button
                title="He Leído y Entiendo"
                onPress={onConfirm}
                variant="primary"
                style={styles.actionButton}
              />
              <Button
                title="Cancelar"
                onPress={onClose}
                variant="outline"
                style={styles.actionButton}
              />
            </>
          ) : (
            <Button
              title="Cerrar"
              onPress={onClose}
              variant="primary"
              fullWidth
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 32,
    lineHeight: 40,
    marginRight: SPACING.md,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  supervisionCard: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: COLORS.error,
    marginBottom: SPACING.lg,
  },
  supervisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  supervisionIcon: {
    fontSize: 24,
    lineHeight: 32,
    marginRight: SPACING.sm,
  },
  supervisionTitle: {
    color: COLORS.error,
    flex: 1,
  },
  supervisionText: {
    color: COLORS.error,
    lineHeight: 20,
  },
  dosageCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  dosageText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  warningsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  warningCard: {
    marginBottom: SPACING.md,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  warningBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  warningBadgeText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 10,
  },
  warningMessage: {
    fontWeight: '600',
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  recommendationSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  recommendationLabel: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  recommendationText: {
    lineHeight: 20,
  },
  learnMoreButton: {
    marginTop: SPACING.sm,
  },
  learnMoreText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  disclaimerCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  disclaimerText: {
    lineHeight: 18,
    textAlign: 'center',
  },
  actions: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  actionButton: {
    width: '100%',
  },
});
