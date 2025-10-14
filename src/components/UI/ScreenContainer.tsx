/**
 * CalorIA - Screen Container
 * Wrapper component for screens with edge-to-edge layout and translucent status bar
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

interface ScreenContainerProps {
  children: ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  edges = ['bottom']
}) => {
  const { colors } = useTheme();
  const statusBarHeight = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={[styles.content, { paddingTop: statusBarHeight }]}>
        {children}
      </View>
      <SafeAreaView edges={edges} style={{ backgroundColor: colors.background }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
