// 🚀 DEMO VERSION - Mock data and limited persistence
/**
 * CalorIA - User Store (Zustand)
 * Manages user authentication and profile state
 */

import { create } from 'zustand';
import type { User, UserProfile } from '../types';

interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
      // Initial state (DEMO MODE - USER LOGGED IN)
      user: {
        id: 'demo-user-123',
        email: 'demo@caloria.com',
        displayName: 'Usuario Demo',
        createdAt: new Date(),
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
      },

      updateProfile: (profileUpdates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser: User = {
          ...currentUser,
          profile: {
            ...currentUser.profile,
            ...profileUpdates,
          } as UserProfile,
        };

        set({
          user: updatedUser,
        });
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

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
    }));