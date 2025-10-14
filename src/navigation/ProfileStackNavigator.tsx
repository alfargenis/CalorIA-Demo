/**
 * CalorIA - Profile Stack Navigator
 * Navigation stack for profile-related screens
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../types';

import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { EditGoalsScreen } from '../screens/Profile/EditGoalsScreen';
import { NotificationsScreen } from '../screens/Profile/NotificationsScreen';
import { SubscriptionScreen } from '../screens/Profile/SubscriptionScreen';
import { SupportScreen } from '../screens/Profile/SupportScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="EditGoals"
        component={EditGoalsScreen}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
      />
    </Stack.Navigator>
  );
};
