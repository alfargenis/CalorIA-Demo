// 🚀 DEMO VERSION - Mock data and limited persistence
/**
 * CalorIA - User Store (Zustand)
 * Manages user authentication and profile state with persistence
 */

import { create } from 'zustand';
import { StorageService } from '../services/StorageServiceFallback';
import type { User, UserProfile } from '../types';

interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  isOnboardingCompleted: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
  loadUserFromStorage: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
      // Initial state (will load from storage)
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      isOnboardingCompleted: false,
      error: null,

      // Actions
      setUser: async (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
        
        // Persist user data
        if (user) {
          await StorageService.saveUser(user);
        } else {
          await StorageService.removeUser();
        }
      },

      updateUser: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser: User = {
          ...currentUser,
          ...updates,
        };

        set({ user: updatedUser });
        await StorageService.saveUser(updatedUser);
      },

      updateProfile: async (profileUpdates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser: User = {
          ...currentUser,
          profile: {
            ...currentUser.profile,
            ...profileUpdates,
          } as UserProfile,
        };

        set({ user: updatedUser });
        await StorageService.saveUser(updatedUser);
      },

      completeOnboarding: async () => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser: User = {
          ...currentUser,
          onboardingCompleted: true,
        };

        set({ 
          user: updatedUser,
          isOnboardingCompleted: true,
        });
        await StorageService.saveUser(updatedUser);
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      logout: async () => {
        await StorageService.removeUser();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      loadUserFromStorage: async () => {
        try {
          set({ isLoading: true });
          const user = await StorageService.loadUser();
          
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isOnboardingCompleted: !!user.onboardingCompleted,
              isLoading: false,
              error: null,
            });
            console.log('📱 User loaded from storage:', user.email);
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isOnboardingCompleted: false,
              isLoading: false,
              error: null,
            });
            console.log('📱 No user found in storage');
          }
        } catch (error) {
          console.error('❌ Error loading user from storage:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Error cargando datos del usuario',
          });
        }
      },

      initialize: async () => {
        try {
          await get().loadUserFromStorage();
          set({ isInitialized: true });
          console.log('🚀 User store initialized');
        } catch (error) {
          console.error('❌ Error initializing user store:', error);
          set({ isInitialized: true, error: 'Error inicializando la aplicación' });
        }
      },
    }));